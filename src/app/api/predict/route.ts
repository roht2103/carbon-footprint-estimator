import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { userHistory } from '@/lib/db/schema';

interface PredictionRequest {
  transportMode: string;
  kmPerDay: string;
  dietType: string;
  electricityKwhPerDay: string;
  wasteKgPerDay: string;
}

interface FastAPIResponse {
  carbon_footprint: number;
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body: PredictionRequest = await request.json();
    const { transportMode, kmPerDay, dietType, electricityKwhPerDay, wasteKgPerDay } = body;

    // Validate input
    if (!transportMode || !kmPerDay || !dietType || !electricityKwhPerDay || !wasteKgPerDay) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Prepare data for FastAPI
    const fastApiData = {
      transport_mode: transportMode,
      km_per_day: parseFloat(kmPerDay),
      diet_type: dietType,
      electricity_kWh_per_day: parseFloat(electricityKwhPerDay),
      waste_kg_per_day: parseFloat(wasteKgPerDay),
    };

    // Call FastAPI model endpoint
    const fastApiUrl = process.env.FASTAPI_MODEL_URL || 'https://carbon-model-api.onrender.com';
    const modelResponse = await fetch(`${fastApiUrl}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fastApiData),
    });

    if (!modelResponse.ok) {
      // If FastAPI is not available, return a mock prediction
      console.warn('FastAPI endpoint not available, using fallback calculation');
      const mockPrediction = calculateMockPrediction(fastApiData);
      
      // Save to database
      await db.insert(userHistory).values({
        userId,
        transportMode,
        kmPerDay: kmPerDay,
        dietType,
        electricityKwhPerDay: electricityKwhPerDay,
        wasteKgPerDay: wasteKgPerDay,
        predictedCarbonFootprint: mockPrediction.carbon_footprint.toString(),
      });

      return NextResponse.json(mockPrediction);
    }

    const prediction: FastAPIResponse = await modelResponse.json();

    // Save prediction to database
    await db.insert(userHistory).values({
      userId,
      transportMode,
      kmPerDay: kmPerDay,
      dietType,
      electricityKwhPerDay: electricityKwhPerDay,
      wasteKgPerDay: wasteKgPerDay,
      predictedCarbonFootprint: prediction.carbon_footprint.toString(),
    });

    return NextResponse.json(prediction);
  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Fallback calculation when FastAPI is not available
function calculateMockPrediction(data: {
  transport_mode: string;
  km_per_day: number;
  diet_type: string;
  electricity_kWh_per_day: number;
  waste_kg_per_day: number;
}): FastAPIResponse {
  // Simple mock calculation based on input values
  let carbonFootprint = 0;

  // Transport emissions (kg CO2 per km)
  const transportEmissions = {
    car: 0.21,
    bus: 0.089,
    train: 0.041,
    bike: 0.0
  };

  carbonFootprint += (transportEmissions[data.transport_mode as keyof typeof transportEmissions] || 0.15) * data.km_per_day;

  // Diet emissions (kg CO2 per day)
  const dietEmissions = {
    vegan: 2.9,
    vegetarian: 3.8,
    mixed: 7.19
  };

  carbonFootprint += dietEmissions[data.diet_type as keyof typeof dietEmissions] || 5.0;

  // Electricity emissions (kg CO2 per kWh) - average grid factor
  carbonFootprint += data.electricity_kWh_per_day * 0.5;

  // Waste emissions (kg CO2 per kg waste)
  carbonFootprint += data.waste_kg_per_day * 0.5;

  return {
    carbon_footprint: Math.round(carbonFootprint * 100) / 100
  };
}
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserButton, useUser } from '@clerk/nextjs';
import { Leaf, Calculator, Loader2, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FormData {
  transportMode: string;
  kmPerDay: string;
  dietType: string;
  electricityKwhPerDay: string;
  wasteKgPerDay: string;
}

interface PredictionResult {
  carbon_footprint: number;
  message?: string;
}

export default function Dashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    transportMode: '',
    kmPerDay: '',
    dietType: '',
    electricityKwhPerDay: '',
    wasteKgPerDay: '',
  });
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ensure user exists in database on first visit
  useEffect(() => {
    const ensureUserExists = async () => {
      try {
        const response = await fetch('/api/users');
        if (response.status === 404) {
          // User doesn't exist, create them
          await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
          });
        }
      } catch (error) {
        console.log('Note: User creation will happen on profile visit ', error);
      }
    };

    if (user) {
      ensureUserExists();
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Leaf className="w-8 h-8 text-green-600" />
            <span className="text-xl font-bold text-gray-800">EcoTracker</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/profile')}
              className="px-4 py-2 text-green-600 hover:text-green-700 transition-colors cursor-pointer"
            >
              Profile
            </button>
            <button
              onClick={() => router.push('/results')}
              className="px-4 py-2 text-green-600 hover:text-green-700 transition-colors cursor-pointer"
            >
              View History
            </button>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10"
                }
              }}
            />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-xl text-gray-600">
            Let&apos;s calculate your daily carbon footprint
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Calculator className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-semibold text-gray-800">
                Carbon Footprint Calculator
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Transport Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Transport Mode
                </label>
                <select
                  name="transportMode"
                  value={formData.transportMode}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select transport mode</option>
                  <option value="car">Car</option>
                  <option value="bus">Bus</option>
                  <option value="train">Train</option>
                  <option value="bike">Bike</option>
                </select>
              </div>

              {/* Kilometers per day */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distance Traveled per Day (km)
                </label>
                <input
                  type="number"
                  name="kmPerDay"
                  value={formData.kmPerDay}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.1"
                  placeholder="e.g., 25.5"
                  className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Diet Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diet Type
                </label>
                <select
                  name="dietType"
                  value={formData.dietType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select diet type</option>
                  <option value="vegan">Vegan</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="mixed">Mixed (Omnivore)</option>
                </select>
              </div>

              {/* Electricity Usage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Electricity Usage per Day (kWh)
                </label>
                <input
                  type="number"
                  name="electricityKwhPerDay"
                  value={formData.electricityKwhPerDay}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.1"
                  placeholder="e.g., 15.2"
                  className="w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Waste Generation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Waste Generation per Day (kg)
                </label>
                <input
                  type="number"
                  name="wasteKgPerDay"
                  value={formData.wasteKgPerDay}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.1"
                  placeholder="e.g., 2.5"
                  className="w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Calculating...</span>
                  </>
                ) : (
                  <>
                    <Calculator className="w-5 h-5" />
                    <span>Calculate My Footprint</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Result Card */}
            {result && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-8 text-white">
                <div className="flex items-center space-x-3 mb-4">
                  <TrendingUp className="w-8 h-8" />
                  <h3 className="text-2xl font-semibold">Your Carbon Footprint</h3>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">
                    {result.carbon_footprint.toFixed(2)}
                  </div>
                  <div className="text-xl opacity-90">kg CO₂ per day</div>
                  <div className="text-lg opacity-75 mt-4">
                    Annual estimate: {(result.carbon_footprint * 365).toFixed(0)} kg CO₂
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="text-red-800 font-medium mb-2">Calculation Error</div>
                <div className="text-red-600">{error}</div>
              </div>
            )}

            {/* Tips Card */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                💡 Eco-Friendly Tips
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Use public transport or bike instead of driving</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Switch to renewable energy sources</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Reduce, reuse, and recycle waste</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Consider plant-based meal options</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
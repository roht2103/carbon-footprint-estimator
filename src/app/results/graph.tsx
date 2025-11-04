'use client';

import { useState, useMemo } from 'react';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar
} from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Calendar, Target } from 'lucide-react';

interface HistoryEntry {
    id: string;
    transportMode: string;
    kmPerDay: string;
    dietType: string;
    electricityKwhPerDay: string;
    wasteKgPerDay: string;
    predictedCarbonFootprint: string;
    createdAt: string;
}

interface GraphProps {
    history: HistoryEntry[];
}

// Color schemes for different chart types
const COLORS = {
    primary: '#10b981', // green-500
    secondary: '#3b82f6', // blue-500
    accent: '#8b5cf6', // purple-500
    warning: '#f59e0b', // amber-500
    danger: '#ef4444', // red-500
    chart: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4']
};

export default function CarbonFootprintGraphs({ history }: GraphProps) {
    const [activeChart, setActiveChart] = useState('trend');

    // Process data for different chart types
    const processedData = useMemo(() => {
        if (!history || history.length === 0) return null;

        // Sort by date for trend analysis
        const sortedHistory = [...history].sort((a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        // 1. Trend data (line/area chart)
        const trendData = sortedHistory.map((entry, index) => ({
            date: new Date(entry.createdAt).toLocaleDateString(),
            footprint: parseFloat(entry.predictedCarbonFootprint),
            transport: parseFloat(entry.kmPerDay) * 0.21, // Approximate transport CO2
            electricity: parseFloat(entry.electricityKwhPerDay) * 0.5, // Approximate electricity CO2
            waste: parseFloat(entry.wasteKgPerDay) * 0.3, // Approximate waste CO2
            index: index + 1
        }));

        // 2. Category breakdown (pie chart)
        const categoryTotals = history.reduce((acc, entry) => {
            const transport = parseFloat(entry.kmPerDay) * 0.21;
            const electricity = parseFloat(entry.electricityKwhPerDay) * 0.5;
            const waste = parseFloat(entry.wasteKgPerDay) * 0.3;
            const diet = parseFloat(entry.predictedCarbonFootprint) - transport - electricity - waste;

            acc.transport += transport;
            acc.electricity += electricity;
            acc.waste += waste;
            acc.diet += Math.max(0, diet); // Ensure non-negative
            return acc;
        }, { transport: 0, electricity: 0, waste: 0, diet: 0 });

        const pieData = [
            { name: 'Transport', value: categoryTotals.transport, color: COLORS.chart[0] },
            { name: 'Diet', value: categoryTotals.diet, color: COLORS.chart[1] },
            { name: 'Electricity', value: categoryTotals.electricity, color: COLORS.chart[2] },
            { name: 'Waste', value: categoryTotals.waste, color: COLORS.chart[3] }
        ].filter(item => item.value > 0);

        // 3. Monthly comparison (bar chart)
        const monthlyData = sortedHistory.reduce((acc: { month: string; total: number; count: number; average: number }[], entry) => {
            const month = new Date(entry.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric'
            });

            const existing = acc.find(item => item.month === month);
            const footprint = parseFloat(entry.predictedCarbonFootprint);

            if (existing) {
                existing.total += footprint;
                existing.count += 1;
                existing.average = existing.total / existing.count;
            } else {
                acc.push({
                    month,
                    total: footprint,
                    count: 1,
                    average: footprint
                });
            }
            return acc;
        }, []);

        // 4. Transport mode comparison (bar chart)
        const transportData = history.reduce((acc: { mode: string; total: number; count: number; average: number }[], entry) => {
            const mode = entry.transportMode;
            const existing = acc.find(item => item.mode === mode);
            const footprint = parseFloat(entry.predictedCarbonFootprint);

            if (existing) {
                existing.total += footprint;
                existing.count += 1;
                existing.average = existing.total / existing.count;
            } else {
                acc.push({
                    mode: mode.charAt(0).toUpperCase() + mode.slice(1),
                    total: footprint,
                    count: 1,
                    average: footprint
                });
            }
            return acc;
        }, []);

        // 5. Progress tracking (goal vs actual)
        const target = 10; // Example target: 10kg CO2 per day
        const progressData = trendData.map(entry => ({
            ...entry,
            target,
            progress: Math.max(0, target - entry.footprint)
        }));

        // 6. Radar chart for lifestyle analysis
        const latestEntry = sortedHistory[sortedHistory.length - 1];
        const radarData = [
            {
                subject: 'Transport',
                current: Math.min(100, (parseFloat(latestEntry.kmPerDay) / 50) * 100),
                optimal: 20
            },
            {
                subject: 'Diet Impact',
                current: latestEntry.dietType === 'vegan' ? 20 :
                    latestEntry.dietType === 'vegetarian' ? 40 : 80,
                optimal: 20
            },
            {
                subject: 'Electricity',
                current: Math.min(100, (parseFloat(latestEntry.electricityKwhPerDay) / 30) * 100),
                optimal: 30
            },
            {
                subject: 'Waste',
                current: Math.min(100, (parseFloat(latestEntry.wasteKgPerDay) / 5) * 100),
                optimal: 20
            }
        ];

        return {
            trendData,
            pieData,
            monthlyData,
            transportData,
            progressData,
            radarData,
            stats: {
                total: history.length,
                average: history.reduce((sum, entry) => sum + parseFloat(entry.predictedCarbonFootprint), 0) / history.length,
                latest: parseFloat(sortedHistory[sortedHistory.length - 1].predictedCarbonFootprint),
                trend: trendData.length > 1 ?
                    (trendData[trendData.length - 1].footprint - trendData[0].footprint) / trendData.length : 0
            }
        };
    }, [history]);

    if (!processedData || !history.length) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Data for Visualization</h3>
                <p className="text-gray-500">
                    Start tracking your carbon footprint to see beautiful charts and insights.
                </p>
            </div>
        );
    }

    const chartTypes = [
        { id: 'trend', name: 'Trend Analysis', icon: TrendingUp },
        { id: 'breakdown', name: 'Category Breakdown', icon: PieChartIcon },
        { id: 'comparison', name: 'Monthly Comparison', icon: BarChart3 },
        { id: 'transport', name: 'Transport Analysis', icon: Calendar },
        { id: 'progress', name: 'Goal Progress', icon: Target }
    ];

    const renderChart = () => {
        switch (activeChart) {
            case 'trend':
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800">Carbon Footprint Trend Over Time</h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <AreaChart data={processedData.trendData}>
                                <defs>
                                    <linearGradient id="colorFootprint" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis label={{ value: 'CO₂ (kg/day)', angle: -90, position: 'insideLeft' }} />
                                <Tooltip
                                    formatter={(value: number) => [`${value.toFixed(2)} kg`, 'Carbon Footprint']}
                                    labelFormatter={(label) => `Date: ${label}`}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="footprint"
                                    stroke={COLORS.primary}
                                    fillOpacity={1}
                                    fill="url(#colorFootprint)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                );

            case 'breakdown':
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800">Carbon Footprint by Category</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={processedData.pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={120}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {processedData.pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => `${value.toFixed(2)} kg`} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>

                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-800">Category Breakdown</h4>
                                {processedData.pieData.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div
                                                className="w-4 h-4 rounded"
                                                style={{ backgroundColor: item.color }}
                                            />
                                            <span className="font-medium text-gray-800">{item.name}</span>
                                        </div>
                                        <span className="text-gray-600">{item.value.toFixed(2)} kg</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'comparison':
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800">Monthly Carbon Footprint Comparison</h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={processedData.monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis label={{ value: 'CO₂ (kg/day)', angle: -90, position: 'insideLeft' }} />
                                <Tooltip
                                    formatter={(value: number, name: string) => [
                                        `${value.toFixed(2)} kg`,
                                        name === 'average' ? 'Average' : 'Total'
                                    ]}
                                />
                                <Legend />
                                <Bar dataKey="average" fill={COLORS.primary} name="Average Daily" />
                                <Bar dataKey="total" fill={COLORS.secondary} name="Monthly Total" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                );

            case 'transport':
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800">Carbon Footprint by Transport Mode</h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={processedData.transportData} layout="horizontal">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" label={{ value: 'CO₂ (kg/day)', position: 'insideBottom', offset: -5 }} />
                                <YAxis dataKey="mode" type="category" width={80} />
                                <Tooltip
                                    formatter={(value: number) => [`${value.toFixed(2)} kg`, 'Average Daily']}
                                />
                                <Bar dataKey="average" fill={COLORS.accent} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                );

            case 'progress':
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800">Progress Towards Sustainability Goal</h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={processedData.progressData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis label={{ value: 'CO₂ (kg/day)', angle: -90, position: 'insideLeft' }} />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="footprint"
                                    stroke={COLORS.primary}
                                    strokeWidth={3}
                                    name="Actual Footprint"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="target"
                                    stroke={COLORS.danger}
                                    strokeDasharray="5 5"
                                    name="Sustainability Target"
                                />
                            </LineChart>
                        </ResponsiveContainer>

                        {/* Radar Chart for Current Lifestyle Analysis */}
                        <div className="mt-8">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4">Current Lifestyle Impact Analysis</h4>
                            <ResponsiveContainer width="100%" height={300}>
                                <RadarChart data={processedData.radarData}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="subject" />
                                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                                    <Radar
                                        name="Current Impact"
                                        dataKey="current"
                                        stroke={COLORS.primary}
                                        fill={COLORS.primary}
                                        fillOpacity={0.3}
                                    />
                                    <Radar
                                        name="Optimal Level"
                                        dataKey="optimal"
                                        stroke={COLORS.secondary}
                                        fill={COLORS.secondary}
                                        fillOpacity={0.1}
                                    />
                                    <Legend />
                                    <Tooltip formatter={(value: number) => `${value.toFixed(0)}%`} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden mb-6"
        >
            {/* Chart Type Selector */}
            <div className="border-b border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Data Visualization</h2>
                <div className="flex flex-wrap gap-2">
                    {chartTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                            <button
                                key={type.id}
                                onClick={() => setActiveChart(type.id)}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${activeChart === type.id
                                    ? 'bg-green-100 text-green-700 border border-green-200'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="text-sm font-medium">{type.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Chart Content */}
            <div className="p-6">
                {renderChart()}
            </div>

            {/* Quick Stats */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Insights</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {processedData.stats.total}
                        </div>
                        <div className="text-sm text-gray-600">Total Records</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                            {processedData.stats.average.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">Average (kg/day)</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                            {processedData.stats.latest.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">Latest (kg/day)</div>
                    </div>
                    <div className="text-center">
                        <div className={`text-2xl font-bold ${processedData.stats.trend > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {processedData.stats.trend > 0 ? '+' : ''}{processedData.stats.trend.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">Trend (kg/day)</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

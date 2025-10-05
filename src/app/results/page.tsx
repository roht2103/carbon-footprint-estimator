'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserButton, useUser } from '@clerk/nextjs';
import { Leaf, History, Trash2, TrendingUp, Calendar, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

export default function Results() {
  const { } = useUser();
  const router = useRouter();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/history');
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const response = await fetch(`/api/history/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete entry');
      }
      setHistory(prev => prev.filter(entry => entry.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete entry');
    }
  };

  const clearAllHistory = async () => {
    if (!confirm('Are you sure you want to clear all history?')) return;
    
    try {
      const response = await fetch('/api/history', {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to clear history');
      }
      setHistory([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear history');
    }
  };

  const getAverageFootprint = () => {
    if (history.length === 0) return 0;
    const total = history.reduce((sum, entry) => sum + parseFloat(entry.predictedCarbonFootprint), 0);
    return total / history.length;
  };

  const getMostRecentFootprint = () => {
    if (history.length === 0) return 0;
    return parseFloat(history[0].predictedCarbonFootprint);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            <div className="flex items-center space-x-2">
              <Leaf className="w-8 h-8 text-green-600" />
              <span className="text-xl font-bold text-gray-800">EcoTracker</span>
            </div>
          </div>
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-10 h-10"
              }
            }}
          />
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Your Carbon Footprint History 📊
          </h1>
          <p className="text-xl text-gray-600">
            Track your progress over time
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading your history...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="text-red-800 font-medium mb-2">Error</div>
            <div className="text-red-600">{error}</div>
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Average Footprint</h3>
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  {getAverageFootprint().toFixed(2)} kg
                </div>
                <div className="text-gray-600">CO₂ per day</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Calendar className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Most Recent</h3>
                </div>
                <div className="text-3xl font-bold text-green-600">
                  {getMostRecentFootprint().toFixed(2)} kg
                </div>
                <div className="text-gray-600">CO₂ per day</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <History className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Total Entries</h3>
                </div>
                <div className="text-3xl font-bold text-purple-600">
                  {history.length}
                </div>
                <div className="text-gray-600">calculations</div>
              </motion.div>
            </div>

            {/* History Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">History Details</h2>
                {history.length > 0 && (
                  <button
                    onClick={clearAllHistory}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="text-center py-12">
                  <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No History Yet</h3>
                  <p className="text-gray-500 mb-6">
                    Start calculating your carbon footprint to see your history here.
                  </p>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Calculate Now
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Transport
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Distance (km)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Diet
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Electricity (kWh)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Waste (kg)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          CO₂ Footprint
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {history.map((entry, index) => (
                        <motion.tr
                          key={entry.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(entry.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                            {entry.transportMode}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {entry.kmPerDay}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                            {entry.dietType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {entry.electricityKwhPerDay}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {entry.wasteKgPerDay}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                            {parseFloat(entry.predictedCarbonFootprint).toFixed(2)} kg
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={() => deleteEntry(entry.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
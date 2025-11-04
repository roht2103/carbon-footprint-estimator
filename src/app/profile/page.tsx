'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserButton, useUser } from '@clerk/nextjs';
import { Leaf, User, Save, ArrowLeft, Settings, Target, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UserProfile {
  id: string;
  clerkId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  preferredTransportMode: string | null;
  preferredDietType: string | null;
  carbonFootprintGoal: string | null;
  notificationsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function Profile() {
  const { user } = useUser();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    preferredTransportMode: '',
    preferredDietType: '',
    carbonFootprintGoal: '',
    notificationsEnabled: true,
  });

  useEffect(() => {
    fetchProfile();
  });

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.status === 404) {
        // User doesn't exist yet, create with Clerk data
        await createProfile();
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data);
      setFormData({
        preferredTransportMode: data.preferredTransportMode || '',
        preferredDietType: data.preferredDietType || '',
        carbonFootprintGoal: data.carbonFootprintGoal || '',
        notificationsEnabled: data.notificationsEnabled,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create profile');
      }

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create profile');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors cursor-pointer"
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
            Profile Settings ⚙️
          </h1>
          <p className="text-xl text-gray-600">
            Customize your carbon footprint tracking experience
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading your profile...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md mx-auto">
            <div className="text-red-800 font-medium mb-2">Error</div>
            <div className="text-red-600">{error}</div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {/* Profile Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-8 mb-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <User className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-semibold text-gray-800">
                  Profile Information
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
                    {user?.emailAddresses[0]?.emailAddress}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
                    {user?.firstName} {user?.lastName}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Member Since
                  </label>
                  <div className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
                    {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Updated
                  </label>
                  <div className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
                    {profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Preferences Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Settings className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-semibold text-gray-800">
                  Preferences & Goals
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Preferred Transport Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Transport Mode
                  </label>
                  <select
                    name="preferredTransportMode"
                    value={formData.preferredTransportMode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select preferred transport</option>
                    <option value="car">Car</option>
                    <option value="bus">Bus</option>
                    <option value="train">Train</option>
                    <option value="bike">Bike</option>
                  </select>
                </div>

                {/* Preferred Diet Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Diet Type
                  </label>
                  <select
                    name="preferredDietType"
                    value={formData.preferredDietType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select preferred diet</option>
                    <option value="vegan">Vegan</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="mixed">Mixed (Omnivore)</option>
                  </select>
                </div>

                {/* Carbon Footprint Goal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Target className="w-4 h-4 inline mr-2" />
                    Daily Carbon Footprint Goal (kg CO₂)
                  </label>
                  <input
                    type="number"
                    name="carbonFootprintGoal"
                    value={formData.carbonFootprintGoal}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    placeholder="e.g., 10.0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Set a daily goal to track your progress towards reducing your carbon footprint
                  </p>
                </div>

                {/* Notifications */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="notificationsEnabled"
                    name="notificationsEnabled"
                    checked={formData.notificationsEnabled}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="notificationsEnabled" className="flex items-center text-sm font-medium text-gray-700">
                    <Bell className="w-4 h-4 mr-2" />
                    Enable notifications for tracking reminders
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <Save className="w-5 h-5" />
                    <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
                  </button>
                </div>

                {/* Success Message */}
                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className="text-green-800 font-medium">
                      ✅ Preferences saved successfully!
                    </div>
                  </div>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
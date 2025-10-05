'use client';

import { motion } from 'framer-motion';
import { Leaf, Calculator, TrendingDown, Users } from 'lucide-react';
import { SignInButton, SignUpButton, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push('/dashboard');
    }
  }, [isSignedIn, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Leaf className="w-8 h-8 text-green-600" />
          <span className="text-xl font-bold text-gray-800">EcoTracker</span>
        </div>
        <div className="space-x-4">
          <SignInButton mode="modal">
            <button className="px-4 py-2 text-green-600 hover:text-green-700 transition-colors">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Get Started
            </button>
          </SignUpButton>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Carbon Footprint{' '}
            <span className="text-green-600">Estimator</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover your daily environmental impact and take meaningful steps towards a 
            sustainable future. Track, analyze, and reduce your carbon footprint with 
            our AI-powered estimation tool.
          </p>
          <SignUpButton mode="modal">
            <button className="px-8 py-4 bg-green-600 text-white text-lg rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg">
              Start Your Journey
            </button>
          </SignUpButton>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mt-20"
        >
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <Calculator className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              AI-Powered Calculations
            </h3>
            <p className="text-gray-600">
              Get accurate carbon footprint estimates using our advanced machine learning model 
              trained on comprehensive lifestyle data.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <TrendingDown className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Track Your Progress
            </h3>
            <p className="text-gray-600">
              Monitor your carbon footprint over time with detailed analytics and 
              visualizations to see your environmental impact trends.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Personal Insights
            </h3>
            <p className="text-gray-600">
              Receive personalized recommendations based on your lifestyle choices 
              to help reduce your environmental impact.
            </p>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 py-16 mt-20">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already tracking and reducing their carbon footprint. 
              Start your sustainable journey today.
            </p>
            <SignUpButton mode="modal">
              <button className="px-8 py-4 bg-white text-green-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
                Get Started Free
              </button>
            </SignUpButton>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Leaf className="w-6 h-6 text-green-500" />
            <span className="text-white font-semibold">EcoTracker</span>
          </div>
          <p className="text-gray-400">
            Making sustainable living accessible to everyone.
          </p>
        </div>
      </footer>
    </div>
  );
}

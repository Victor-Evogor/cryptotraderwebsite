"use client";

import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 via-purple-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <div className="flex justify-between items-center p-4 absolute top-0 left-0 right-0">
        <Link 
          href="/" 
          className="text-white hover:text-purple-200 flex items-center gap-2"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
              clipRule="evenodd" 
            />
          </svg>
          Back
        </Link>
        <ThemeToggle />
      </div>
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Guide to Crypto Portfolio Tracking</h1>
            <p className="text-purple-100">Learn how to make the most of our platform</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 space-y-6">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Getting Started</h2>
              <p className="text-purple-100">
                Welcome to our comprehensive guide on tracking your crypto portfolio. Here&apos;s everything you need to know to get started.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Key Features</h2>
              <ul className="list-disc list-inside text-purple-100 space-y-2">
                <li>Real-time portfolio tracking</li>
                <li>Multiple wallet management</li>
                <li>Performance analytics</li>
                <li>Customizable dashboard</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">How to Use</h2>
              <div className="space-y-4 text-purple-100">
                <p>1. Create an account or sign in</p>
                <p>2. Add your wallet addresses</p>
                <p>3. Track your portfolio in real-time</p>
                <p>4. Analyze your performance</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Tips & Best Practices</h2>
              <ul className="list-disc list-inside text-purple-100 space-y-2">
                <li>Regularly update your portfolio</li>
                <li>Use multiple wallets for better organization</li>
                <li>Monitor your performance metrics</li>
                <li>Keep your account secure</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

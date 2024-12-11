"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { AuthForm } from '@/components/AuthForm';
import { SocialAuth } from '@/components/SocialAuth';

export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [router]);
  const handleSignup = async (data: { email: string; password: string }) => {
    try {
      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      
      // Create user in database through API
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userCredential.user.uid,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user in database');
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Create Account</h1>
            <p className="text-purple-100">Join the meme coin trading revolution</p>
          </div>

          <AuthForm onSubmit={handleSignup} />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-purple-300/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 dark:from-gray-900 dark:via-gray-800 dark:to-black text-purple-100">Or continue with</span>
            </div>
          </div>

          <SocialAuth />

          <p className="text-center text-purple-100">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-300 hover:text-purple-200">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

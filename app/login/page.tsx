"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { AuthForm } from '@/components/AuthForm';
import { SocialAuth } from '@/components/SocialAuth';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [router]);
  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch (error: any) {
      if (error.message === "Firebase: Error (auth/invalid-credential).")
        toast.error("Incorrect email or password");
      else
      throw new Error(error.message);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 via-purple-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Welcome Back</h1>
            <p className="text-purple-100">Sign in to your account</p>
          </div>

          <AuthForm isLogin onSubmit={handleLogin} />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-purple-300/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-b from-purple-50 via-purple-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-black text-purple-900 dark:text-purple-100">Or continue with</span>
            </div>
          </div>

          <SocialAuth isLogin />

          <p className="text-center text-purple-100">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-purple-300 hover:text-purple-200">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

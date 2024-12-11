"use client";

import { Button } from './Button';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SocialAuthProps {
  isLogin?: boolean;
}

export function SocialAuth({ isLogin = false }: SocialAuthProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  const router = useRouter();

  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCred = await signInWithPopup(auth, provider);
      console.log("Authenticated with ", userCred)
      console.log("Sending POST http req to create a new user in the mondodb db")
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userCred.user.uid,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create user in database");
      }
      router.push('/dashboard');
    } catch (error) {
      console.error('Google auth error:', error);
    }
  };

  const handleWalletConnect = () => {
    // Implement wallet connection
    console.log('Wallet connect clicked');
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-4 w-full max-w-md">
      <Button 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2 transform active:scale-95 transition-transform duration-75"
        onClick={handleGoogleAuth}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2 transform active:scale-95 transition-transform duration-75"
        onClick={handleWalletConnect}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Connect Wallet
      </Button>
    </div>
  );
}

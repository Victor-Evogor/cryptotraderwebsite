"use client";

import { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { useRouter } from 'next/navigation';

interface AuthFormProps {
  isLogin?: boolean;
  onSubmit: (data: { email: string; password: string }) => Promise<void>;
}

export function AuthForm({ isLogin = false, onSubmit }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await onSubmit({ email, password });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" className="w-full transform active:scale-95 transition-transform duration-75">
        {isLogin ? 'Sign In' : 'Sign Up'}
      </Button>
    </form>
  );
}

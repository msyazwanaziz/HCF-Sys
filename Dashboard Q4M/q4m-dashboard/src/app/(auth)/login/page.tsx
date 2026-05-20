'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { mockUsers } from '@/lib/mockData';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Mock authentication
    const user = mockUsers.find(u => u.email === email);
    
    if (user && password === 'password') {
      // Store user in localStorage for demo purposes
      localStorage.setItem('user', JSON.stringify(user));
      
      // Role-based routing
      if (user.role === 'hq') {
        router.push('/hq');
      } else {
        router.push('/branch');
      }
    } else {
      setError('Invalid email or password (use "password" as password)');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-primary">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">QfM</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Qurban for Mualaf</CardTitle>
          <CardDescription>
            Hidayah Centre Foundation Operations Dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="hq@hcf.org or kl@hcf.org" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col text-sm text-center text-muted-foreground">
          <p>Demo accounts:</p>
          <p>HQ: hq@hcf.org | Branch: selangor@hcf.org</p>
          <p>Password: password</p>
        </CardFooter>
      </Card>
    </div>
  );
}

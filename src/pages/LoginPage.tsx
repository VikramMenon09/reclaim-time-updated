import { useState } from 'react'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: { id: string; name: string; email: string }) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Only use user input, do not set defaults
    const user = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
    };
    onLogin(user);
  };

  const handleGoogleLogin = async () => {
    alert('Google login is not available.');
  };

  const handleAppleLogin = () => {
    alert('Apple login coming soon!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Fora
            </h1>
          </div>
          <h2 className="text-xl font-semibold">
            {isLogin ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {isLogin ? 'Sign in to your account' : 'Start your balanced student life'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required={!isLogin}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div className="flex flex-col gap-2 mt-4">
          <Button type="button" variant="outline" className="w-full" onClick={handleGoogleLogin}>
            Sign in with Google
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={handleAppleLogin}>
            Sign in with Apple
          </Button>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </Card>
    </div>
  );
}

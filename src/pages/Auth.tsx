
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Simulate successful login
      toast({
        title: "Successfully signed in",
        description: `Welcome ${email}`,
      });
      navigate('/home');
    } else {
      // Simulate successful signup
      toast({
        title: "Account created successfully",
        description: "Please complete your profile setup.",
      });
      // Redirect to account setup page for signup
      navigate('/account-setup');
    }
  };

  const handleGithubAuth = () => {
    if (isLogin) {
      // Simulate GitHub login
      toast({
        title: "GitHub authentication successful",
        description: "Welcome back!",
      });
      navigate('/home');
    } else {
      // Simulate GitHub signup
      toast({
        title: "GitHub account connected",
        description: "Please complete your profile setup.",
      });
      navigate('/account-setup');
    }
  };

  const handleGoogleAuth = () => {
    if (isLogin) {
      // Simulate Google login
      toast({
        title: "Google authentication successful",
        description: "Welcome back!",
      });
      navigate('/home');
    } else {
      // Simulate Google signup
      toast({
        title: "Google account connected",
        description: "Please complete your profile setup.",
      });
      navigate('/account-setup');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-border bg-card p-8 shadow-sm animate-fadeIn">
        <div className="text-center">
          <h1 className="text-3xl font-bold">{isLogin ? 'Welcome back' : 'Create your account'}</h1>
          <p className="mt-2 text-muted-foreground">
            {isLogin 
              ? 'Sign in to your account to continue' 
              : 'Choose your preferred method to sign up'}
          </p>
        </div>

        <div className="space-y-4">
          <Button
            variant="outline"
            onClick={handleGithubAuth}
            className="w-full justify-start gap-3"
          >
            <Github className="h-5 w-5" />
            Continue with GitHub
          </Button>
          
          <Button
            variant="outline"
            onClick={handleGoogleAuth}
            className="w-full justify-start gap-3"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full group"
            >
              <Mail className="mr-2 h-4 w-4" />
              {isLogin ? 'Sign in with email' : 'Sign up with email'}
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </form>
        </div>

        <div className="text-center text-sm">
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-primary hover:underline"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;

import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  // If a referral code is in the URL, enable using it by default
  const [useUrlReferral, setUseUrlReferral] = useState<boolean>(true);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const from = location.state?.from?.pathname || '/';
  const referredBy = new URLSearchParams(location.search).get('ref') || undefined;
  const storedRef = (() => {
    try {
      return localStorage.getItem('pendingRef') || undefined;
    } catch {
      return undefined;
    }
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !displayName) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      // Use the manually entered referral code if provided. If user dismissed URL referral, don't send it.
      const effectiveUrlRef = referredBy || storedRef;
      const finalReferralCode = referralCode || (useUrlReferral ? effectiveUrlRef : undefined);
      await signup(email, password, displayName, finalReferralCode);
      toast({
        title: '🎉 Account Created!',
        description: 'Welcome to our platform! Redirecting you to your dashboard...',
        className: 'bg-green-100 border-green-400 text-green-700',
      });
      
      // Clear any stored pending referral after successful signup
      try { localStorage.removeItem('pendingRef'); } catch {}

      // Add a slight delay for better UX
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1500);
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create account',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex flex-col items-center mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              RizzChat
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Your AI Conversation Partner</p>
          </div>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription className="text-sm">
            Join our community of AI enthusiasts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(referredBy || storedRef) && useUrlReferral && (
            <div className="mb-4 rounded-md border border-primary/20 bg-primary/10 text-primary px-3 py-2 text-sm flex items-center justify-between">
              <div>
                Using referral code: <span className="font-mono font-semibold">{referredBy || storedRef}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="text-xs underline hover:no-underline"
                  onClick={() => setReferralCode((referredBy || storedRef) || '')}
                >
                  Use as input
                </button>
                <button
                  type="button"
                  className="text-xs text-muted-foreground underline hover:no-underline"
                  onClick={() => setUseUrlReferral(false)}
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  className="h-10"
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
                  minLength={8}
                  className="h-10"
                />
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="referralCode">Referral Code (optional)</Label>
                <Input
                  id="referralCode"
                  type="text"
                  placeholder="Enter referral code if any"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className="h-10"
                />
                {(referredBy || storedRef) && !referralCode && useUrlReferral && (
                  <p className="text-xs text-muted-foreground">Auto-applied from your invite link</p>
                )}
              </div>
            </div>
            <Button type="submit" className="w-full mt-6" disabled={loading}>
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : 'Create Account'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

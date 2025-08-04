import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Redirect authenticated users to home
        if (session?.user) {
          setTimeout(() => {
            navigate('/');
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !username) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username,
            display_name: displayName || username,
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast({
            title: "Account Exists",
            description: "This email is already registered. Try logging in instead.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Welcome to Rainbow Snake! 🌈",
          description: data.user?.email_confirmed_at 
            ? "Account created! You can now play the game." 
            : "Please check your email to confirm your account.",
        });
        
        if (data.user?.email_confirmed_at) {
          navigate('/');
        }
      }
    } catch (error: any) {
      toast({
        title: "Sign Up Failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Login Failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else if (data.user) {
        toast({
          title: "Welcome back! 🎮",
          description: "Successfully logged in. Let's play some Rainbow Snake!",
        });
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,background_100%)]"></div>
      
      <Card className="w-full max-w-md p-8 bg-card/80 backdrop-blur-sm border-rainbow">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-rainbow mb-2">🌈 Rainbow Snake 🌈</h1>
          <p className="text-muted-foreground text-lg">
            {isLogin ? 'Welcome back, player!' : 'Join the neon adventure!'}
          </p>
        </div>

        <form onSubmit={isLogin ? handleSignIn : handleSignUp} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/50 border-primary/30 focus:border-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Password
              </label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background/50 border-primary/30 focus:border-primary"
              />
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Username *
                  </label>
                  <Input
                    type="text"
                    placeholder="Choose a unique username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="bg-background/50 border-primary/30 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Display Name (Optional)
                  </label>
                  <Input
                    type="text"
                    placeholder="How others will see you"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="bg-background/50 border-primary/30 focus:border-primary"
                  />
                </div>
              </>
            )}
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            {loading ? '⏳ Loading...' : isLogin ? '🎮 Login & Play' : '🚀 Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            {isLogin 
              ? "Don't have an account? Sign up here" 
              : "Already have an account? Login here"
            }
          </button>
        </div>

        <div className="mt-8 p-4 bg-gradient-to-r from-purple/20 to-primary/20 rounded-lg border-rainbow">
          <h3 className="text-sm font-semibold text-rainbow mb-2">🎮 Game Features:</h3>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Rainbow-colored snake that grows as you play</li>
            <li>• Leaderboard to compete with other players</li>
            <li>• Responsive controls with arrow keys</li>
            <li>• Beautiful neon visual effects</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
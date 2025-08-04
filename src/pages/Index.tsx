import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GameHero } from '@/components/GameHero';
import { GameFeatures } from '@/components/GameFeatures';
import { SnakeGame } from '@/components/SnakeGame';
import { GameFooter } from '@/components/GameFooter';
import { BackgroundMusic } from '@/components/BackgroundMusic';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut({ scope: 'global' });
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl text-rainbow mb-4">🌈 Loading Rainbow Snake... 🌈</div>
          <div className="animate-pulse text-muted-foreground">Preparing your gaming experience</div>
        </div>
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <BackgroundMusic autoPlay={false} />
        
        {/* Attribution Banner */}
        <div className="bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 border-b border-primary/30 py-4">
          <div className="container mx-auto px-4">
            <p className="text-center text-xl font-bold text-glow animate-pulse">
              🎮 Made by <span className="text-primary">Baishe</span>, <span className="text-secondary">Alvin</span>, <span className="text-accent">Nizar</span> and <span className="text-purple-400">Said Aboud</span> 🎮
            </p>
          </div>
        </div>

        {/* Hero Section with Login */}
        <div className="py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-6xl font-bold mb-6 text-rainbow">🌈 Rainbow Snake 🌈</h1>
            <p className="text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Experience the most colorful Snake game ever created! Login to save your high scores and compete with players worldwide.
            </p>
            
            <div className="space-y-4">
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
              >
                🚀 Login to Play
              </Button>
              
              <div className="text-sm text-muted-foreground">
                New player? Create an account to get started!
              </div>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <GameFeatures />
        <GameFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <BackgroundMusic autoPlay={true} />
      
      {/* Attribution Banner with User Info */}
      <div className="bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 border-b border-primary/30 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <p className="text-center text-xl font-bold text-glow animate-pulse flex-1">
            🎮 Made by <span className="text-primary">Baishe</span>, <span className="text-secondary">Alvin</span>, <span className="text-accent">Nizar</span> and <span className="text-purple-400">Said Aboud</span> 🎮
          </p>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, <span className="text-primary font-semibold">{user.email}</span>!
            </span>
            <Button 
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="border-primary/30 hover:border-primary text-xs"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
      
      {/* Hero Section */}
      <GameHero />
      
      {/* Features Section */}
      <GameFeatures />
      
      {/* Game Section */}
      <section id="game-section" className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-glow">Play Neon Snake</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Challenge yourself in this addictive cyberpunk Snake game. How high can you score?
            </p>
          </div>
          
          <div className="flex justify-center">
            <SnakeGame />
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <GameFooter />
    </div>
  );
};

export default Index;

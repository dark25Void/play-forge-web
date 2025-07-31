import { GameHero } from '@/components/GameHero';
import { GameFeatures } from '@/components/GameFeatures';
import { SnakeGame } from '@/components/SnakeGame';
import { GameFooter } from '@/components/GameFooter';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Attribution Banner */}
      <div className="bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 border-b border-primary/30 py-4">
        <div className="container mx-auto px-4">
          <p className="text-center text-xl font-bold text-glow animate-pulse">
            🎮 Made by <span className="text-primary">Baishe</span>, <span className="text-secondary">Alvin</span>, <span className="text-accent">Nizar</span> and <span className="text-purple-400">Said Aboud</span> 🎮
          </p>
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

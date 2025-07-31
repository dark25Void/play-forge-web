import { GameHero } from '@/components/GameHero';
import { GameFeatures } from '@/components/GameFeatures';
import { SnakeGame } from '@/components/SnakeGame';
import { GameFooter } from '@/components/GameFooter';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Attribution Banner */}
      <div className="bg-primary/10 border-b border-primary/20 py-3">
        <div className="container mx-auto px-4">
          <p className="text-center text-primary font-medium text-glow">
            Made by sheikhkhalifa students
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

import { Button } from '@/components/ui/button';
import { Play, Github, Star } from 'lucide-react';

export const GameHero = () => {
  const scrollToGame = () => {
    document.getElementById('game-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-32 right-32 w-96 h-96 bg-purple/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold text-glow">
              NEON
              <span className="block bg-gradient-gaming bg-clip-text text-transparent">
                SNAKE
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Experience the classic Snake game reimagined with stunning cyberpunk visuals, 
              smooth animations, and addictive gameplay.
            </p>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={scrollToGame}
              size="xl" 
              variant="gaming" 
              className="group"
            >
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Play Now
            </Button>
            <Button size="xl" variant="neon">
              <Github className="w-5 h-5" />
              View Source
            </Button>
          </div>

          {/* Game Stats */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-center pt-8">
            <div className="space-y-1">
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">Games Played</div>
            </div>
            <div className="hidden sm:block w-px h-8 bg-border"></div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-accent">98%</div>
              <div className="text-sm text-muted-foreground">Fun Rating</div>
            </div>
            <div className="hidden sm:block w-px h-8 bg-border"></div>
            <div className="space-y-1 flex items-center gap-2">
              <div className="text-3xl font-bold text-purple">5.0</div>
              <div className="flex text-purple">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
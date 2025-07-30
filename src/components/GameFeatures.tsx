import { Card } from '@/components/ui/card';
import { Trophy, Zap, Target, Gamepad2 } from 'lucide-react';

const features = [
  {
    icon: Gamepad2,
    title: "Classic Gameplay",
    description: "Experience the timeless Snake game with modern visuals and smooth controls.",
  },
  {
    icon: Zap,
    title: "Neon Graphics",
    description: "Beautiful cyberpunk-inspired design with glowing effects and animations.",
  },
  {
    icon: Trophy,
    title: "High Score",
    description: "Compete with yourself and track your best scores across gaming sessions.",
  },
  {
    icon: Target,
    title: "Responsive Design",
    description: "Perfectly optimized for desktop and mobile devices with touch controls.",
  },
];

export const GameFeatures = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-glow">Game Features</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the classic Snake game reimagined with modern design and enhanced gameplay
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 group">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary shadow-glow group-hover:shadow-purple-glow transition-all duration-300">
                  <feature.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
import { Github, Heart, Code } from 'lucide-react';

export const GameFooter = () => {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-glow">Neon Snake</h3>
            <p className="text-muted-foreground">
              A modern twist on the classic Snake game
            </p>
          </div>
          
          <div className="flex justify-center space-x-6">
            <a 
              href="#" 
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="w-5 h-5" />
              <span>Source Code</span>
            </a>
            <a 
              href="#" 
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Code className="w-5 h-5" />
              <span>Built with React</span>
            </a>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>by Lovable AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
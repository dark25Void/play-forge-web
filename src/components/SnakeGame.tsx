import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 150;

interface Position {
  x: number;
  y: number;
}

interface GameState {
  snake: Position[];
  food: Position;
  direction: Position;
  gameOver: boolean;
  score: number;
  isPlaying: boolean;
}

export const SnakeGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    snake: INITIAL_SNAKE,
    food: INITIAL_FOOD,
    direction: INITIAL_DIRECTION,
    gameOver: false,
    score: 0,
    isPlaying: false,
  });

  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snakeHighScore');
    return saved ? parseInt(saved) : 0;
  });

  const { toast } = useToast();
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((snake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    setGameState(prevState => {
      if (prevState.gameOver || !prevState.isPlaying) return prevState;

      const newSnake = [...prevState.snake];
      const head = { ...newSnake[0] };
      head.x += prevState.direction.x;
      head.y += prevState.direction.y;

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        return { ...prevState, gameOver: true, isPlaying: false };
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        return { ...prevState, gameOver: true, isPlaying: false };
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === prevState.food.x && head.y === prevState.food.y) {
        const newScore = prevState.score + 10;
        return {
          ...prevState,
          snake: newSnake,
          food: generateFood(newSnake),
          score: newScore,
        };
      } else {
        newSnake.pop();
        return {
          ...prevState,
          snake: newSnake,
        };
      }
    });
  }, [generateFood]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    setGameState(prevState => {
      if (prevState.gameOver || !prevState.isPlaying) return prevState;

      let newDirection = { ...prevState.direction };
      
      switch (e.key) {
        case 'ArrowUp':
          if (prevState.direction.y === 0) newDirection = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (prevState.direction.y === 0) newDirection = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (prevState.direction.x === 0) newDirection = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (prevState.direction.x === 0) newDirection = { x: 1, y: 0 };
          break;
      }

      return { ...prevState, direction: newDirection };
    });
  }, []);

  const startGame = () => {
    setGameState({
      snake: INITIAL_SNAKE,
      food: INITIAL_FOOD,
      direction: INITIAL_DIRECTION,
      gameOver: false,
      score: 0,
      isPlaying: true,
    });
    toast({
      title: "Game Started!",
      description: "Use arrow keys to control the snake",
    });
  };

  const pauseGame = () => {
    setGameState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (gameState.isPlaying && !gameState.gameOver) {
      gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.gameOver, moveSnake]);

  useEffect(() => {
    if (gameState.gameOver && gameState.score > highScore) {
      setHighScore(gameState.score);
      localStorage.setItem('snakeHighScore', gameState.score.toString());
      toast({
        title: "New High Score!",
        description: `Amazing! You scored ${gameState.score} points!`,
      });
    } else if (gameState.gameOver) {
      toast({
        title: "Game Over",
        description: `Final score: ${gameState.score}`,
        variant: "destructive",
      });
    }
  }, [gameState.gameOver, gameState.score, highScore, toast]);

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
      <div className="space-y-6">
        {/* Game Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-glow">Neon Snake</h2>
            <p className="text-muted-foreground">Score: {gameState.score}</p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-sm text-muted-foreground">High Score</p>
            <p className="text-xl font-bold text-accent">{highScore}</p>
          </div>
        </div>

        {/* Game Board */}
        <div className="relative">
          <div 
            className="grid gap-px bg-border p-2 rounded-lg mx-auto border-glow"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              width: '400px',
              height: '400px',
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
              const x = index % GRID_SIZE;
              const y = Math.floor(index / GRID_SIZE);
              
              const isSnake = gameState.snake.some(segment => segment.x === x && segment.y === y);
              const isHead = gameState.snake[0]?.x === x && gameState.snake[0]?.y === y;
              const isFood = gameState.food.x === x && gameState.food.y === y;

              return (
                <div
                  key={index}
                  className={`
                    aspect-square rounded-sm transition-all duration-100
                    ${isSnake 
                      ? isHead 
                        ? 'bg-gradient-primary shadow-glow' 
                        : 'bg-primary/80'
                      : isFood 
                        ? 'bg-gradient-accent shadow-accent-glow animate-pulse-glow' 
                        : 'bg-secondary/30'
                    }
                  `}
                />
              );
            })}
          </div>

          {/* Game Over Overlay */}
          {gameState.gameOver && (
            <div className="absolute inset-0 bg-background/90 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <div className="text-center space-y-4">
                <h3 className="text-3xl font-bold text-destructive">Game Over!</h3>
                <p className="text-lg">Final Score: {gameState.score}</p>
                <Button onClick={startGame} variant="default" className="bg-gradient-primary">
                  Play Again
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Game Controls */}
        <div className="flex flex-wrap gap-3 justify-center">
          {!gameState.isPlaying && !gameState.gameOver ? (
            <Button onClick={startGame} variant="default" className="bg-gradient-primary">
              Start Game
            </Button>
          ) : !gameState.gameOver ? (
            <Button onClick={pauseGame} variant="secondary">
              {gameState.isPlaying ? 'Pause' : 'Resume'}
            </Button>
          ) : null}
          
          <Button onClick={startGame} variant="outline" className="border-accent text-accent">
            New Game
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-center space-y-2 text-sm text-muted-foreground">
          <p>Use arrow keys to control the snake</p>
          <p>Eat the glowing food to grow and score points</p>
          <p>Avoid hitting walls and yourself!</p>
        </div>
      </div>
    </Card>
  );
};
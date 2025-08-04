import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
  { x: 10, y: 13 },
  { x: 10, y: 14 }
];
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
          e.preventDefault();
          if (prevState.direction.y === 0) newDirection = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (prevState.direction.y === 0) newDirection = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (prevState.direction.x === 0) newDirection = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          e.preventDefault();
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
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-rainbow bounce-rainbow">
      <div className="space-y-6">
        {/* Game Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-rainbow">🌈 Rainbow Snake 🌈</h2>
            <p className="text-muted-foreground text-lg">🎯 Score: <span className="text-primary font-bold">{gameState.score}</span></p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-sm text-muted-foreground">🏆 High Score</p>
            <p className="text-2xl font-bold text-rainbow">{highScore}</p>
          </div>
        </div>

        {/* Game Board */}
        <div className="relative">
          <div 
            className="grid gap-px bg-gradient-to-br from-purple/20 to-primary/20 p-3 rounded-xl mx-auto border-rainbow shadow-lg"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              width: '420px',
              height: '420px',
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
              const x = index % GRID_SIZE;
              const y = Math.floor(index / GRID_SIZE);
              
              const isSnake = gameState.snake.some(segment => segment.x === x && segment.y === y);
              const isHead = gameState.snake[0]?.x === x && gameState.snake[0]?.y === y;
              const isFood = gameState.food.x === x && gameState.food.y === y;
              
              // Get snake segment index for rainbow coloring
              const snakeIndex = gameState.snake.findIndex(segment => segment.x === x && segment.y === y);
              const rainbowColors = [
                'from-red-500 to-orange-500',
                'from-orange-500 to-yellow-500', 
                'from-yellow-500 to-green-500',
                'from-green-500 to-cyan-500',
                'from-cyan-500 to-blue-500',
                'from-blue-500 to-purple-500',
                'from-purple-500 to-pink-500'
              ];

              return (
                <div
                  key={index}
                  className={`
                    aspect-square rounded-md transition-all duration-200 relative
                    ${isSnake 
                      ? isHead 
                        ? 'bg-gradient-to-br from-white to-yellow-300 shadow-[0_0_20px_#ffd700] animate-pulse scale-110 z-10' 
                        : `bg-gradient-to-br ${rainbowColors[snakeIndex % rainbowColors.length]} shadow-[0_0_10px_rgba(255,255,255,0.3)] scale-105`
                      : isFood 
                        ? 'bg-gradient-to-br from-pink-400 to-red-500 shadow-[0_0_25px_#ff1493] animate-bounce scale-125 z-10' 
                        : 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 hover:from-slate-700/50 hover:to-slate-800/50'
                    }
                  `}
                >
                  {isHead && (
                    <div className="absolute inset-0 flex items-center justify-center text-xs">
                      👑
                    </div>
                  )}
                  {isFood && (
                    <div className="absolute inset-0 flex items-center justify-center text-xs animate-spin">
                      🍎
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Game Over Overlay */}
          {gameState.gameOver && (
            <div className="absolute inset-0 bg-background/90 backdrop-blur-sm rounded-xl flex items-center justify-center border-rainbow">
              <div className="text-center space-y-4 p-6 bg-gradient-to-br from-purple/20 to-primary/20 rounded-lg border-rainbow">
                <h3 className="text-4xl font-bold text-rainbow animate-bounce">💀 Game Over! 💀</h3>
                <p className="text-xl text-rainbow">🎯 Final Score: <span className="font-bold">{gameState.score}</span></p>
                {gameState.score > highScore && (
                  <p className="text-lg text-rainbow animate-pulse">🎉 NEW HIGH SCORE! 🎉</p>
                )}
                <Button onClick={startGame} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  🚀 Play Again 🚀
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Game Controls */}
        <div className="flex flex-wrap gap-4 justify-center">
          {!gameState.isPlaying && !gameState.gameOver ? (
            <Button onClick={startGame} className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              🎮 Start Game 🎮
            </Button>
          ) : !gameState.gameOver ? (
            <Button onClick={pauseGame} className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              {gameState.isPlaying ? '⏸️ Pause' : '▶️ Resume'}
            </Button>
          ) : null}
          
          <Button onClick={startGame} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-rainbow">
            🆕 New Game
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-center space-y-3 text-base">
          <div className="bg-gradient-to-r from-purple/20 to-primary/20 p-4 rounded-lg border-rainbow">
            <p className="text-rainbow font-semibold">🎯 Use arrow keys to control your rainbow snake</p>
            <p className="text-rainbow font-semibold">🍎 Eat the spinning apples to grow and score points</p>
            <p className="text-rainbow font-semibold">⚠️ Avoid hitting walls and yourself!</p>
            <p className="text-primary font-bold text-lg mt-2">🌈 The longer you get, the more colorful you become! 🌈</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
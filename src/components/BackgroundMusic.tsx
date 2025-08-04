import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface BackgroundMusicProps {
  autoPlay?: boolean;
}

export const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ autoPlay = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Using a royalty-free cyberpunk/electronic music track
  const musicUrl = "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"; // Placeholder - you can replace with actual game music

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.loop = true;
    }
  }, [volume]);

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Auto-play was prevented by browser
            console.log("Auto-play was prevented by browser");
          });
      }
    }
  }, [autoPlay]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch((error) => {
              console.error("Error playing audio:", error);
            });
        }
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-card/80 backdrop-blur-sm border border-primary/30 rounded-lg p-3 shadow-lg">
      <audio
        ref={audioRef}
        preload="auto"
        onEnded={() => setIsPlaying(false)}
        onError={() => console.error("Audio loading error")}
      >
        {/* Using a simple tone generator for demo - replace with actual music file */}
        <source src="data:audio/wav;base64,UklGRigAAABXQVZFZm10IAAAAAEAAQARAAAAEAAAAAEACABkYXRhAgAAAAEA" type="audio/wav" />
      </audio>
      
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={togglePlay}
          className="h-8 w-8 p-0 bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/30 hover:from-primary/30 hover:to-secondary/30"
        >
          {isPlaying ? '⏸️' : '▶️'}
        </Button>
        
        <div className="flex items-center gap-1 text-xs">
          <span className="text-muted-foreground">🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-12 h-1 bg-muted rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${volume * 100}%, hsl(var(--muted)) ${volume * 100}%, hsl(var(--muted)) 100%)`
            }}
          />
        </div>
        
        <span className="text-xs text-muted-foreground">
          {isPlaying ? '🎵' : '🔇'}
        </span>
      </div>
    </div>
  );
};
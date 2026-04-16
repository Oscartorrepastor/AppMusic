"use client";

import { useState, useEffect } from "react";
import { Play, Pause, Heart } from "lucide-react";
import { Song } from "@/types";
import { usePlayer } from "@/lib/contexts/PlayerContext";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface SongCardProps {
  song: Song;
  showLikeButton?: boolean;
}

export function SongCard({ song, showLikeButton = true }: SongCardProps) {
  const { currentSong, isPlaying, play, pause } = usePlayer();
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCheckingFavorite, setIsCheckingFavorite] = useState(true);
  
  const isCurrentSong = currentSong?.id === song.id;
  const showPlayButton = isHovered || isCurrentSong;

  useEffect(() => {
    if (showLikeButton) {
      checkIfFavorite();
    } else {
      setIsCheckingFavorite(false);
    }
  }, [song.id, showLikeButton]);

  const checkIfFavorite = async () => {
    try {
      const response = await fetch(`/api/favorites/${song.id}`);
      if (response.ok) {
        const data = await response.json();
        setIsFavorite(data.isFavorite);
      }
    } catch (error) {
      console.error("Error checking favorite:", error);
    } finally {
      setIsCheckingFavorite(false);
    }
  };

  const handlePlayClick = () => {
    if (isCurrentSong && isPlaying) {
      pause();
    } else {
      play(song);
    }
  };

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      if (isFavorite) {
        const response = await fetch(`/api/favorites/${song.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setIsFavorite(false);
          toast({
            title: "Removed from favorites",
            description: `${song.title} removed from your favorites`,
          });
        }
      } else {
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ songId: song.id }),
        });

        if (response.ok) {
          setIsFavorite(true);
          toast({
            title: "Added to favorites",
            description: `${song.title} added to your favorites`,
          });
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className="group relative cursor-pointer rounded-lg bg-gray-900/40 p-4 transition hover:bg-gray-800/60"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handlePlayClick}
    >
      <div className="relative mb-4 aspect-square w-full">
        {song.coverUrl ? (
          <Image
            src={song.coverUrl}
            alt={song.title}
            fill
            className="rounded-md object-cover"
          />
        ) : (
          <div className="h-full w-full rounded-md bg-gray-800" />
        )}
        
        {showPlayButton && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-md">
            <button
              className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-black transition hover:scale-105 hover:bg-green-400"
              onClick={handlePlayClick}
            >
              {isCurrentSong && isPlaying ? (
                <Pause className="h-5 w-5 fill-current" />
              ) : (
                <Play className="h-5 w-5 fill-current ml-0.5" />
              )}
            </button>
          </div>
        )}

        {showLikeButton && !isCheckingFavorite && (
          <button
            onClick={handleLikeClick}
            className="absolute bottom-2 right-2 rounded-full bg-black/60 p-2 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/80"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isFavorite ? "fill-green-500 text-green-500" : "text-white"
              }`}
            />
          </button>
        )}
      </div>
      
      <h3 className="truncate font-semibold text-white">{song.title}</h3>
      <p className="truncate text-sm text-gray-400">{song.artist}</p>
    </div>
  );
}

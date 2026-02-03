"use client";

import { useState } from "react";
import { Play, Pause } from "lucide-react";
import { Song } from "@/types";
import { usePlayer } from "@/lib/contexts/PlayerContext";
import Image from "next/image";

interface SongCardProps {
  song: Song;
}

export function SongCard({ song }: SongCardProps) {
  const { currentSong, isPlaying, play, pause } = usePlayer();
  const [isHovered, setIsHovered] = useState(false);
  
  const isCurrentSong = currentSong?.id === song.id;
  const showPlayButton = isHovered || isCurrentSong;

  const handlePlayClick = () => {
    if (isCurrentSong && isPlaying) {
      pause();
    } else {
      play(song);
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
      </div>
      
      <h3 className="truncate font-semibold text-white">{song.title}</h3>
      <p className="truncate text-sm text-gray-400">{song.artist}</p>
    </div>
  );
}

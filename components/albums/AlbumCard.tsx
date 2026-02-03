"use client";

import { useState } from "react";
import { Play, Pause } from "lucide-react";
import { Album, Song } from "@/types";
import { usePlayer } from "@/lib/contexts/PlayerContext";
import Image from "next/image";
import Link from "next/link";

interface AlbumCardProps {
  album: Album & { songs?: Song[] };
}

export function AlbumCard({ album }: AlbumCardProps) {
  const { currentSong, isPlaying, playQueue, pause } = usePlayer();
  const [isHovered, setIsHovered] = useState(false);

  const songs = album.songs || [];
  const isCurrentAlbum = songs.some((s) => s.id === currentSong?.id) && isPlaying;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (songs.length === 0) return;

    if (isCurrentAlbum) {
      pause();
    } else {
      playQueue(songs, 0);
    }
  };

  return (
    <Link href={`/albums/${album.id}`}>
      <div
        className="group relative cursor-pointer rounded-lg bg-gray-900/40 p-4 transition hover:bg-gray-800/60"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative mb-4 aspect-square w-full">
          {album.coverUrl ? (
            <Image
              src={album.coverUrl}
              alt={album.title}
              fill
              className="rounded-md object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-md bg-gray-800">
              <svg
                className="h-16 w-16 text-gray-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
              </svg>
            </div>
          )}

          {isHovered && songs.length > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-md">
              <button
                className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-black transition hover:scale-105 hover:bg-green-400"
                onClick={handlePlayClick}
              >
                {isCurrentAlbum ? (
                  <Pause className="h-5 w-5 fill-current" />
                ) : (
                  <Play className="h-5 w-5 fill-current ml-0.5" />
                )}
              </button>
            </div>
          )}
        </div>

        <h3 className="truncate font-semibold text-white">{album.title}</h3>
        <p className="truncate text-sm text-gray-400">{album.artist}</p>
        {album.releaseYear && (
          <p className="truncate text-xs text-gray-500">{album.releaseYear}</p>
        )}
      </div>
    </Link>
  );
}

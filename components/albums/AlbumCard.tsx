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
        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_14px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-slate-900/70"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl">
          {album.coverUrl ? (
            <Image
              src={album.coverUrl}
              alt={album.title}
              fill
              className="rounded-xl object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-800">
              <svg
                className="h-16 w-16 text-slate-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
              </svg>
            </div>
          )}

          {isHovered && songs.length > 0 && (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-slate-950/45">
              <button
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-cyan-300 to-fuchsia-400 text-slate-950 transition hover:scale-105"
                onClick={handlePlayClick}
              >
                {isCurrentAlbum ? (
                  <Pause className="h-5 w-5 fill-current" />
                ) : (
                  <Play className="ml-0.5 h-5 w-5 fill-current" />
                )}
              </button>
            </div>
          )}
        </div>

        <h3 className="truncate font-semibold text-white">{album.title}</h3>
        <p className="truncate text-sm text-slate-300">{album.artist}</p>
        {album.releaseYear && (
          <p className="truncate text-xs text-slate-400">{album.releaseYear}</p>
        )}
      </div>
    </Link>
  );
}

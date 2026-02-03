"use client";

import { useState } from "react";
import { Play, Pause } from "lucide-react";
import { PlaylistWithSongs } from "@/types";
import { usePlayer } from "@/lib/contexts/PlayerContext";
import Image from "next/image";
import Link from "next/link";

interface PlaylistCardProps {
  playlist: PlaylistWithSongs;
  onDelete?: (id: string) => void;
}

export function PlaylistCard({ playlist, onDelete }: PlaylistCardProps) {
  const { currentSong, isPlaying, play, pause, playQueue } = usePlayer();
  const [isHovered, setIsHovered] = useState(false);

  const songs = playlist.songs?.map((ps) => ps.song) || [];
  const songCount = songs.length;

  const isCurrentPlaylist = songs.some((s) => s.id === currentSong?.id) && isPlaying;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (songs.length === 0) return;

    if (isCurrentPlaylist) {
      pause();
    } else {
      playQueue(songs, 0);
    }
  };

  return (
    <Link href={`/playlists/${playlist.id}`}>
      <div
        className="group relative cursor-pointer rounded-lg bg-gray-900/40 p-4 transition hover:bg-gray-800/60"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative mb-4 aspect-square w-full">
          {playlist.coverUrl ? (
            <Image
              src={playlist.coverUrl}
              alt={playlist.name}
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
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>
          )}

          {isHovered && songCount > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-md">
              <button
                className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-black transition hover:scale-105 hover:bg-green-400"
                onClick={handlePlayClick}
              >
                {isCurrentPlaylist ? (
                  <Pause className="h-5 w-5 fill-current" />
                ) : (
                  <Play className="h-5 w-5 fill-current ml-0.5" />
                )}
              </button>
            </div>
          )}
        </div>

        <h3 className="truncate font-semibold text-white">{playlist.name}</h3>
        <p className="truncate text-sm text-gray-400">
          {songCount} {songCount === 1 ? "song" : "songs"}
        </p>
      </div>
    </Link>
  );
}

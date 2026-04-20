"use client";

import { useState } from "react";
import { Play, Pause } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PlaylistWithSongs } from "@/types";
import { usePlayer } from "@/lib/contexts/PlayerContext";
import Image from "next/image";
import Link from "next/link";

interface PlaylistCardProps {
  playlist: PlaylistWithSongs;
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  const { currentSong, isPlaying, pause, playQueue } = usePlayer();
  const { t } = useTranslation();
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
        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_14px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-slate-900/70"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl">
          {playlist.coverUrl ? (
            <Image
              src={playlist.coverUrl}
              alt={playlist.name}
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
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>
          )}

          {isHovered && songCount > 0 && (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-slate-950/45">
              <button
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-cyan-300 to-fuchsia-400 text-slate-950 transition hover:scale-105"
                onClick={handlePlayClick}
              >
                {isCurrentPlaylist ? (
                  <Pause className="h-5 w-5 fill-current" />
                ) : (
                  <Play className="ml-0.5 h-5 w-5 fill-current" />
                )}
              </button>
            </div>
          )}
        </div>

        <h3 className="truncate font-semibold text-white">{playlist.name}</h3>
        <p className="truncate text-sm text-slate-300">
          {songCount} {songCount === 1 ? t("common.song") : t("common.songs")}
        </p>
      </div>
    </Link>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { Play, Pause, Heart, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Song } from "@/types";
import { usePlayer } from "@/lib/contexts/PlayerContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface SongCardProps {
  song: Song;
  showLikeButton?: boolean;
}

export function SongCard({ song, showLikeButton = true }: SongCardProps) {
  const { currentSong, isPlaying, playQueue, pause } = usePlayer();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCheckingFavorite, setIsCheckingFavorite] = useState(true);

  const isCurrentSong = currentSong?.id === song.id;
  const showPlayButton = isHovered || isCurrentSong;

  const checkIfFavorite = useCallback(async () => {
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
  }, [song.id]);

  useEffect(() => {
    if (showLikeButton) {
      checkIfFavorite();
    } else {
      setIsCheckingFavorite(false);
    }
  }, [checkIfFavorite, showLikeButton]);

  const isExternalSong = song.uploadedById === "external-api";

  const handlePlayClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();

    if (isCurrentSong && isPlaying) {
      pause();
    } else {
      playQueue([song], 0);
    }
  };

  const handleOpenYouTube = (e: React.MouseEvent) => {
    e.stopPropagation();
    const query = encodeURIComponent(`${song.artist} ${song.title} official audio`);
    window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank", "noopener,noreferrer");
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
            title: t("favorites.removedTitle"),
            description: t("favorites.removedDescription", { title: song.title }),
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
            title: t("favorites.addedTitle"),
            description: t("favorites.addedDescription", { title: song.title }),
          });
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: t("favorites.errorTitle"),
        description: t("favorites.errorDescription"),
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_14px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-slate-900/70"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handlePlayClick}
    >
      <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl">
        {song.coverUrl ? (
          <Image
            src={song.coverUrl}
            alt={song.title}
            fill
            className="rounded-xl object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full rounded-xl bg-slate-800" />
        )}

        {showPlayButton && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-slate-950/45">
            <button
              className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-cyan-300 to-fuchsia-400 text-slate-950 transition hover:scale-105"
              onClick={handlePlayClick}
            >
              {isCurrentSong && isPlaying ? (
                <Pause className="h-5 w-5 fill-current" />
              ) : (
                <Play className="ml-0.5 h-5 w-5 fill-current" />
              )}
            </button>
          </div>
        )}

        {isExternalSong && (
          <div className="absolute left-2 top-2 rounded-full border border-cyan-300/40 bg-slate-950/75 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-200">
            {t("player.previewBadge")}
          </div>
        )}

        {showLikeButton && !isCheckingFavorite && (
          <button
            onClick={handleLikeClick}
            className="absolute bottom-2 right-2 rounded-full bg-slate-950/70 p-2 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-slate-900"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isFavorite ? "fill-fuchsia-400 text-fuchsia-400" : "text-white"
              }`}
            />
          </button>
        )}
      </div>

      <h3 className="truncate font-semibold text-white">{song.title}</h3>
      <p className="truncate text-sm text-slate-300">{song.artist}</p>

      <Button
        type="button"
        variant="ghost"
        className="mt-3 w-full justify-center rounded-xl border border-red-400/25 bg-red-500/10 text-red-100 hover:bg-red-500/20 hover:text-white"
        onClick={handleOpenYouTube}
      >
        <ExternalLink className="mr-2 h-4 w-4" />
        {t("player.openYoutube")}
      </Button>
    </div>
  );
}

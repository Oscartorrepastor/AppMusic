"use client";

import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Song } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface YouTubeResult {
  videoId: string | null;
  title: string;
  url: string;
  embedUrl: string | null;
}

interface YouTubeDialogProps {
  song: Song | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function YouTubeDialog({ song, open, onOpenChange }: YouTubeDialogProps) {
  const { t } = useTranslation();
  const [result, setResult] = useState<YouTubeResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const query = useMemo(() => {
    if (!song) {
      return "";
    }

    return `${song.artist} ${song.title} official audio`;
  }, [song]);

  useEffect(() => {
    if (!open || !query) {
      return;
    }

    let cancelled = false;

    const fetchVideo = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/music/youtube?q=${encodeURIComponent(query)}`);

        if (!response.ok) {
          throw new Error("Failed to fetch YouTube result");
        }

        const data: YouTubeResult = await response.json();

        if (!cancelled) {
          setResult(data);
        }
      } catch (fetchError) {
        console.error("Error loading YouTube result:", fetchError);

        if (!cancelled) {
          setResult(null);
          setError(t("player.youtubeError"));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchVideo();

    return () => {
      cancelled = true;
    };
  }, [open, query, t]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-hidden border-gray-800 bg-slate-950 sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-white">{t("player.youtubeTitle")}</DialogTitle>
          <DialogDescription className="text-slate-300">
            {song
              ? t("player.youtubeDescription", {
                  title: song.title,
                  artist: song.artist,
                })
              : t("player.noSong")}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80">
          <div className="aspect-video w-full bg-slate-950">
            {isLoading ? (
              <div className="flex h-full items-center justify-center gap-3 text-slate-200">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>{t("player.youtubeLoading")}</span>
              </div>
            ) : result?.embedUrl ? (
              <iframe
                key={result.videoId ?? result.url}
                src={result.embedUrl}
                title={result.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <div className="flex h-full items-center justify-center px-6 text-center text-slate-300">
                {error || t("player.youtubeEmpty")}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-white">{song?.title || t("player.noSong")}</p>
            <p className="text-xs text-slate-300">{song?.artist || t("player.unknownArtist")}</p>
          </div>

          {result?.url && (
            <Button asChild className="bg-gradient-to-r from-red-400 to-fuchsia-500 text-white hover:opacity-95">
              <a href={result.url} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                {t("player.openYoutube")}
              </a>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

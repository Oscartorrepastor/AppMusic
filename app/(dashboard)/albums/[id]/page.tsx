"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { usePlayer } from "@/lib/contexts/PlayerContext";
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, Clock, Disc3 } from "lucide-react";
import Image from "next/image";
import { Album, Song } from "@/types";

interface AlbumData extends Album {
  songs: Song[];
}

export default function AlbumDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { currentSong, isPlaying, playQueue, pause } = usePlayer();
  const [album, setAlbum] = useState<AlbumData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAlbum = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/albums/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setAlbum(data);
        } else if (response.status === 404) {
          toast({
            title: "Error",
            description: "Album not found",
            variant: "destructive",
          });
          router.push("/library");
        }
      } catch (error) {
        console.error("Error fetching album:", error);
        toast({
          title: "Error",
          description: "Failed to load album",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbum();
  }, [params.id, router, toast]);

  const handlePlayAll = () => {
    if (!album || album.songs.length === 0) return;

    const isCurrentAlbum =
      album.songs.some((s) => s.id === currentSong?.id) && isPlaying;

    if (isCurrentAlbum) {
      pause();
    } else {
      playQueue(album.songs, 0);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return <div className="text-center text-slate-300">{t("common.loading")}</div>;
  }

  if (!album) {
    return null;
  }

  const totalDuration = album.songs.reduce((acc, song) => acc + song.duration, 0);
  const isCurrentAlbum =
    album.songs.some((s) => s.id === currentSong?.id) && isPlaying;

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.22),transparent_30%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(88,28,135,0.30),rgba(2,6,23,0.96))] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end">
          <div className="relative h-56 w-56 flex-shrink-0 overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
            {album.coverUrl ? (
              <Image
                src={album.coverUrl}
                alt={album.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-900">
                <Disc3 className="h-16 w-16 text-slate-500" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-200">
              {t("library.albums")}
            </p>
            <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">{album.title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-300 md:text-base">
              <span className="font-semibold text-white">{album.artist}</span>
              {album.releaseYear && <span>• {album.releaseYear}</span>}
              <span>• {album.songs.length} {album.songs.length === 1 ? t("common.song") : t("common.songs")}</span>
              {totalDuration > 0 && <span>• {Math.floor(totalDuration / 60)} min</span>}
            </div>

            <div className="mt-6 flex items-center gap-4">
              <Button
                onClick={handlePlayAll}
                disabled={album.songs.length === 0}
                className="h-12 rounded-full bg-gradient-to-r from-cyan-300 to-fuchsia-400 px-5 text-slate-950 hover:opacity-95"
              >
                {isCurrentAlbum ? (
                  <Pause className="mr-2 h-5 w-5 fill-current" />
                ) : (
                  <Play className="mr-2 h-5 w-5 fill-current" />
                )}
                {t("home.playAll")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-3 shadow-[0_18px_45px_rgba(0,0,0,0.20)]">
        <div className="grid grid-cols-[24px_1fr_60px] gap-4 border-b border-white/10 px-3 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          <div>#</div>
          <div>{t("playlistDetail.titleColumn")}</div>
          <div className="flex justify-end">
            <Clock className="h-4 w-4" />
          </div>
        </div>

        {album.songs.length === 0 ? (
          <div className="p-8 text-center text-slate-300">{t("library.noSongs")}</div>
        ) : (
          <div className="space-y-1 pt-2">
            {album.songs.map((song, index) => (
              <button
                key={song.id}
                className="group grid w-full grid-cols-[24px_1fr_60px] gap-4 rounded-2xl px-3 py-3 text-left transition hover:bg-white/5"
                onClick={() => playQueue(album.songs, index)}
              >
                <div className="flex items-center text-slate-400">
                  {currentSong?.id === song.id && isPlaying ? (
                    <span className="text-cyan-300">▶</span>
                  ) : (
                    <span className="group-hover:hidden">{index + 1}</span>
                  )}
                  <Play className="hidden h-4 w-4 group-hover:block" />
                </div>
                <div>
                  <div className="font-medium text-white">{song.title}</div>
                  <div className="text-sm text-slate-300">{song.artist}</div>
                </div>
                <div className="flex items-center justify-end text-slate-400">
                  {formatDuration(song.duration)}
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

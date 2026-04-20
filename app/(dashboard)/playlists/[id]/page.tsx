"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { usePlayer } from "@/lib/contexts/PlayerContext";
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, Edit, Trash2, Clock } from "lucide-react";
import Image from "next/image";

interface PlaylistData {
  id: string;
  name: string;
  description?: string | null;
  coverUrl?: string | null;
  isPublic: boolean;
  createdAt: string;
  userId: string;
  user: {
    id: string;
    name: string;
    avatar?: string | null;
  };
  songs: Array<{
    id: string;
    songId: string;
    addedAt: string;
    song: {
      id: string;
      title: string;
      artist: string;
      album?: string | null;
      duration: number;
      audioUrl: string;
      coverUrl?: string | null;
      genre?: string | null;
      uploadedById: string;
      createdAt: string;
      albumId?: string | null;
    };
  }>;
}

export default function PlaylistDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { currentSong, isPlaying, playQueue, pause } = usePlayer();
  const [playlist, setPlaylist] = useState<PlaylistData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylist = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/playlists/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setPlaylist(data);
        } else if (response.status === 404) {
          toast({
            title: t("playlistDialog.errorTitle"),
            description: t("playlistDetail.notFound"),
            variant: "destructive",
          });
          router.push("/library");
        }
      } catch (error) {
        console.error("Error fetching playlist:", error);
        toast({
          title: t("playlistDialog.errorTitle"),
          description: t("playlistDetail.loadError"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylist();
  }, [params.id, router, t, toast]);

  const handlePlayAll = () => {
    if (!playlist || playlist.songs.length === 0) return;

    const songs = playlist.songs.map((ps) => ({
      ...ps.song,
      createdAt: new Date(ps.song.createdAt),
    }));
    const isCurrentPlaylist = songs.some((s) => s.id === currentSong?.id) && isPlaying;

    if (isCurrentPlaylist) {
      pause();
    } else {
      playQueue(songs, 0);
    }
  };

  const handleDelete = async () => {
    if (!playlist) return;

    if (!confirm(t("playlistDetail.deleteConfirm"))) return;

    try {
      const response = await fetch(`/api/playlists/${playlist.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: t("playlistDialog.successTitle"),
          description: t("playlistDetail.deleted"),
        });
        router.push("/library");
      } else {
        throw new Error(t("playlistDetail.deleteError"));
      }
    } catch (error) {
      console.error("Error deleting playlist:", error);
      toast({
        title: t("playlistDialog.errorTitle"),
        description: t("playlistDetail.deleteError"),
        variant: "destructive",
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return <div className="text-center text-slate-300">{t("playlistDetail.loading")}</div>;
  }

  if (!playlist) {
    return null;
  }

  const songs = playlist.songs.map((ps) => ({
    ...ps.song,
    createdAt: new Date(ps.song.createdAt),
  }));
  const totalDuration = songs.reduce((acc, song) => acc + song.duration, 0);
  const isCurrentPlaylist = songs.some((s) => s.id === currentSong?.id) && isPlaying;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 rounded-3xl border border-white/5 bg-[linear-gradient(135deg,rgba(34,211,238,0.14),rgba(217,70,239,0.12),rgba(255,255,255,0.02))] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] lg:flex-row">
        <div className="relative h-64 w-64 flex-shrink-0 overflow-hidden rounded-2xl">
          {playlist.coverUrl ? (
            <Image
              src={playlist.coverUrl}
              alt={playlist.name}
              fill
              className="rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-2xl bg-slate-800">
              <svg
                className="h-24 w-24 text-slate-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-end">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">{t("playlistDetail.playlist")}</p>
          <h1 className="mt-2 text-5xl font-bold text-white">{playlist.name}</h1>
          {playlist.description && (
            <p className="mt-4 text-slate-300">{playlist.description}</p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-300">
            <span>{playlist.user.name}</span>
            <span>•</span>
            <span>
              {songs.length} {songs.length === 1 ? t("common.song") : t("common.songs")}
            </span>
            {totalDuration > 0 && (
              <>
                <span>•</span>
                <span>{t("playlistDetail.minutes", { count: Math.floor(totalDuration / 60) })}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          onClick={handlePlayAll}
          disabled={songs.length === 0}
          className="h-12 w-12 rounded-full bg-gradient-to-r from-cyan-300 to-fuchsia-400 text-slate-950 transition-all hover:scale-105 hover:opacity-95"
        >
          {isCurrentPlaylist ? (
            <Pause className="h-6 w-6 fill-current" />
          ) : (
            <Play className="ml-0.5 h-6 w-6 fill-current" />
          )}
        </Button>
        <Button variant="ghost" className="text-slate-300 hover:text-white">
          <Edit className="mr-2 h-4 w-4" />
          {t("playlistDetail.edit")}
        </Button>
        <Button
          variant="ghost"
          onClick={handleDelete}
          className="text-slate-300 hover:text-red-400"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {t("playlistDetail.delete")}
        </Button>
      </div>

      <div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
        <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 border-b border-white/10 px-4 py-2 text-sm text-slate-300">
          <div>#</div>
          <div>{t("playlistDetail.titleColumn")}</div>
          <div>{t("playlistDetail.albumColumn")}</div>
          <div className="text-right">
            <Clock className="inline h-4 w-4" />
          </div>
        </div>

        {songs.length === 0 ? (
          <div className="rounded-xl p-8 text-center">
            <p className="text-slate-300">{t("playlistDetail.noSongs")}</p>
          </div>
        ) : (
          songs.map((song, index) => (
            <div
              key={song.id}
              className="group grid cursor-pointer grid-cols-[16px_4fr_2fr_1fr] gap-4 rounded-xl px-4 py-3 transition hover:bg-white/5"
              onClick={() => playQueue(songs, index)}
            >
              <div className="flex items-center text-slate-300">
                {currentSong?.id === song.id && isPlaying ? (
                  <span className="text-cyan-300">▶</span>
                ) : (
                  <span className="group-hover:hidden">{index + 1}</span>
                )}
                <Play className="hidden h-4 w-4 group-hover:block" />
              </div>
              <div className="flex items-center gap-3">
                {song.coverUrl && (
                  <div className="relative h-10 w-10 overflow-hidden rounded-lg">
                    <Image
                      src={song.coverUrl}
                      alt={song.title}
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
                <div>
                  <div className="font-medium text-white">{song.title}</div>
                  <div className="text-sm text-slate-300">{song.artist}</div>
                </div>
              </div>
              <div className="flex items-center text-slate-300">
                {song.album || "-"}
              </div>
              <div className="flex items-center justify-end text-slate-300">
                {formatDuration(song.duration)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

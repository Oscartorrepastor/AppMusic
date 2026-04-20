"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Music, Clock, TrendingUp, Disc } from "lucide-react";
import Image from "next/image";
import { usePlayer } from "@/lib/contexts/PlayerContext";
import { Song as SongType } from "@/types";

interface Genre {
  genre: string;
  count: number;
}

interface HistoryEntry {
  id: string;
  playedAt: string;
  song: SongType;
}

interface Stats {
  topSongs: SongType[];
  totalListeningTime: number;
  favoriteGenres: Genre[];
  totalPlays: number;
  totalSongs: number;
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { play } = usePlayer();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    fetchStats();
    fetchHistory();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/history?limit=20");
      if (response.ok) {
        const data = await response.json();
        setHistory(data.history);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <h1 className="text-4xl font-bold text-white">{t("stats.title")}</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-gray-800 bg-gray-900/50 p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-green-500/20 p-3">
                <Music className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">{t("stats.totalSongs")}</p>
                <p className="text-2xl font-bold text-white">{stats?.totalSongs || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="border-gray-800 bg-gray-900/50 p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-blue-500/20 p-3">
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">{t("stats.totalPlays")}</p>
                <p className="text-2xl font-bold text-white">{stats?.totalPlays || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="border-gray-800 bg-gray-900/50 p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-purple-500/20 p-3">
                <Clock className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">{t("stats.listeningTime")}</p>
                <p className="text-2xl font-bold text-white">
                  {formatDuration(stats?.totalListeningTime || 0)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="border-gray-800 bg-gray-900/50 p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-orange-500/20 p-3">
                <Disc className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">{t("stats.topGenre")}</p>
                <p className="text-2xl font-bold text-white">
                  {stats?.favoriteGenres[0]?.genre || t("stats.notAvailable")}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="border-gray-800 bg-gray-900/50 p-6">
          <h2 className="mb-6 text-2xl font-bold text-white">{t("stats.topSongs")}</h2>
          {stats?.topSongs && stats.topSongs.length > 0 ? (
            <div className="space-y-3">
              {stats.topSongs.map((song, index) => (
                <div
                  key={song.id}
                  className="cursor-pointer flex items-center gap-4 rounded-lg p-3 transition hover:bg-gray-800/50"
                  onClick={() => play(song)}
                >
                  <span className="w-6 text-lg font-bold text-gray-500">
                    {index + 1}
                  </span>
                  <div className="relative h-12 w-12 flex-shrink-0">
                    {song.coverUrl ? (
                      <Image
                        src={song.coverUrl}
                        alt={song.title}
                        fill
                        className="rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded bg-gray-800">
                        <Music className="h-6 w-6 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-white">{song.title}</p>
                    <p className="truncate text-sm text-gray-400">{song.artist}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">
                      {t("stats.plays", { count: song.playCount })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-gray-400">{t("stats.noSongsPlayed")}</p>
          )}
        </Card>

        <Card className="border-gray-800 bg-gray-900/50 p-6">
          <h2 className="mb-6 text-2xl font-bold text-white">{t("stats.favoriteGenres")}</h2>
          {stats?.favoriteGenres && stats.favoriteGenres.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {stats.favoriteGenres.map((genre) => (
                <div
                  key={genre.genre}
                  className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-800/30 p-4"
                >
                  <span className="font-medium text-white">{genre.genre}</span>
                  <span className="text-sm text-gray-400">
                    {t("stats.plays", { count: genre.count })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-gray-400">{t("stats.noGenreData")}</p>
          )}
        </Card>

        <Card className="border-gray-800 bg-gray-900/50 p-6">
          <h2 className="mb-6 text-2xl font-bold text-white">{t("stats.recentHistory")}</h2>
          {history.length > 0 ? (
            <div className="space-y-3">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="cursor-pointer flex items-center gap-4 rounded-lg p-3 transition hover:bg-gray-800/50"
                  onClick={() => play(entry.song)}
                >
                  <div className="relative h-12 w-12 flex-shrink-0">
                    {entry.song.coverUrl ? (
                      <Image
                        src={entry.song.coverUrl}
                        alt={entry.song.title}
                        fill
                        className="rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded bg-gray-800">
                        <Music className="h-6 w-6 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-white">{entry.song.title}</p>
                    <p className="truncate text-sm text-gray-400">{entry.song.artist}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">
                      {new Date(entry.playedAt).toLocaleDateString(i18n.language)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(entry.playedAt).toLocaleTimeString(i18n.language)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-gray-400">{t("stats.noHistory")}</p>
          )}
        </Card>
      </div>
    </div>
  );
}

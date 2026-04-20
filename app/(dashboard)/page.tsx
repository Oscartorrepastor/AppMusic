"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Song } from "@/types";
import { SongCard } from "@/components/player/SongCard";
import { usePlayer } from "@/lib/contexts/PlayerContext";

export default function HomePage() {
  const { data: session, status } = useSession();
  const { playQueue } = usePlayer();
  const { t } = useTranslation();
  const [recentSongs, setRecentSongs] = useState<Song[]>([]);
  const [recommendedSongs, setRecommendedSongs] = useState<Song[]>([]);
  const [onlineSongs, setOnlineSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
  }, [status]);

  useEffect(() => {
    async function fetchSongs() {
      try {
        const [songsResponse, chartsResponse] = await Promise.all([
          fetch("/api/songs?limit=10"),
          fetch("/api/music/charts?limit=6"),
        ]);

        if (songsResponse.ok) {
          const data = await songsResponse.json();
          setRecentSongs(data.songs.slice(0, 5));
          setRecommendedSongs(data.songs.slice(5, 10));
        }

        if (chartsResponse.ok) {
          const chartsData = await chartsResponse.json();
          setOnlineSongs(chartsData.tracks || []);
        }
      } catch (error) {
        console.error("Error fetching songs:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchSongs();
    }
  }, [status]);

  if (status === "loading" || !session?.user) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-emerald-400"></div>
      </div>
    );
  }

  const handlePlayAll = (songs: Song[]) => {
    if (songs.length > 0) {
      playQueue(songs, 0);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-white/5 bg-[linear-gradient(135deg,rgba(34,211,238,0.18),rgba(217,70,239,0.12),rgba(255,255,255,0.02))] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <h1 className="text-4xl font-bold text-white">
          {t("home.welcome", {
            name: session.user.name || t("topbar.userFallback"),
          })}
        </h1>
        <p className="mt-2 text-gray-300">{t("home.collection")}</p>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">{t("home.recentlyPlayed")}</h2>
          {recentSongs.length > 0 && (
            <button
              onClick={() => handlePlayAll(recentSongs)}
              className="text-sm text-cyan-300 transition hover:text-fuchsia-300"
            >
              {t("home.playAll")}
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl border border-white/5 bg-gray-900/40 p-4"
              >
                <div className="mb-4 aspect-square w-full rounded-md bg-gray-800"></div>
                <div className="mb-2 h-4 rounded bg-gray-800"></div>
                <div className="h-3 w-2/3 rounded bg-gray-800"></div>
              </div>
            ))}
          </div>
        ) : recentSongs.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {recentSongs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-gray-400">
            <p>{t("home.noSongs")}</p>
          </div>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">{t("home.recommended")}</h2>
          {recommendedSongs.length > 0 && (
            <button
              onClick={() => handlePlayAll(recommendedSongs)}
              className="text-sm text-cyan-300 transition hover:text-fuchsia-300"
            >
              {t("home.playAll")}
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl border border-white/5 bg-gray-900/40 p-4"
              >
                <div className="mb-4 aspect-square w-full rounded-md bg-gray-800"></div>
                <div className="mb-2 h-4 rounded bg-gray-800"></div>
                <div className="h-3 w-2/3 rounded bg-gray-800"></div>
              </div>
            ))}
          </div>
        ) : recommendedSongs.length > 0 || onlineSongs.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {(recommendedSongs.length > 0 ? recommendedSongs : onlineSongs).map((song) => (
              <SongCard
                key={song.id}
                song={song}
                showLikeButton={song.uploadedById !== "external-api"}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-gray-400">
            <p>{t("home.noRecommendations")}</p>
          </div>
        )}
      </section>
    </div>
  );
}

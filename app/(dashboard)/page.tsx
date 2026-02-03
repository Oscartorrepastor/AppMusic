"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Song } from "@/types";
import { SongCard } from "@/components/player/SongCard";
import { usePlayer } from "@/lib/contexts/PlayerContext";

export default function HomePage() {
  const { data: session, status } = useSession();
  const { playQueue } = usePlayer();
  const [recentSongs, setRecentSongs] = useState<Song[]>([]);
  const [recommendedSongs, setRecommendedSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
  }, [status]);

  useEffect(() => {
    async function fetchSongs() {
      try {
        const response = await fetch("/api/songs?limit=10");
        if (response.ok) {
          const data = await response.json();
          setRecentSongs(data.songs.slice(0, 5));
          setRecommendedSongs(data.songs.slice(5, 10));
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
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
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
      <div>
        <h1 className="text-4xl font-bold text-white">
          Welcome back, {session.user.name}
        </h1>
        <p className="mt-2 text-gray-400">
          Your personal music collection awaits
        </p>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Recently Played</h2>
          {recentSongs.length > 0 && (
            <button
              onClick={() => handlePlayAll(recentSongs)}
              className="text-sm text-gray-400 hover:text-white transition"
            >
              Play all
            </button>
          )}
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="rounded-lg bg-gray-900/40 p-4 animate-pulse"
              >
                <div className="mb-4 aspect-square w-full rounded-md bg-gray-800"></div>
                <div className="h-4 bg-gray-800 rounded mb-2"></div>
                <div className="h-3 bg-gray-800 rounded w-2/3"></div>
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
          <div className="text-center py-12 text-gray-400">
            <p>No songs available. Upload some music to get started!</p>
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Recommended</h2>
          {recommendedSongs.length > 0 && (
            <button
              onClick={() => handlePlayAll(recommendedSongs)}
              className="text-sm text-gray-400 hover:text-white transition"
            >
              Play all
            </button>
          )}
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="rounded-lg bg-gray-900/40 p-4 animate-pulse"
              >
                <div className="mb-4 aspect-square w-full rounded-md bg-gray-800"></div>
                <div className="h-4 bg-gray-800 rounded mb-2"></div>
                <div className="h-3 bg-gray-800 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : recommendedSongs.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {recommendedSongs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>No recommendations available yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}

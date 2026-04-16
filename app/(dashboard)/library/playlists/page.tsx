"use client";

import { useState, useEffect } from "react";
import { PlaylistCard } from "@/components/playlist/PlaylistCard";
import { PlaylistWithSongs } from "@/types";

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<PlaylistWithSongs[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylists = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/playlists");
        if (response.ok) {
          const data = await response.json();
          setPlaylists(data || []);
        }
      } catch (error) {
        console.error("Error fetching playlists:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">Playlists</h1>
        <p className="mt-2 text-gray-400">Your playlists</p>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : playlists.length === 0 ? (
        <div className="rounded-lg bg-gray-900/40 p-8 text-center">
          <p className="text-gray-400">No playlists yet. Create your first playlist!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      )}
    </div>
  );
}

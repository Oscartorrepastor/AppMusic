"use client";

import { useState, useEffect } from "react";
import { AlbumCard } from "@/components/albums/AlbumCard";
import { Album } from "@/types";

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/albums");
        if (response.ok) {
          const data = await response.json();
          setAlbums(data || []);
        }
      } catch (error) {
        console.error("Error fetching albums:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">Albums</h1>
        <p className="mt-2 text-gray-400">Your album collection</p>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : albums.length === 0 ? (
        <div className="rounded-lg bg-gray-900/40 p-8 text-center">
          <p className="text-gray-400">No albums yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      )}
    </div>
  );
}

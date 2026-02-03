"use client";

import { useState, useEffect } from "react";
import { SongCard } from "@/components/player/SongCard";
import { Song } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SongsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [sortBy, setSortBy] = useState("dateAdded");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/songs");
        if (response.ok) {
          const data = await response.json();
          setSongs(data.songs || []);
        }
      } catch (error) {
        console.error("Error fetching songs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongs();
  }, []);

  const sortSongs = (songsToSort: Song[]) => {
    const sorted = [...songsToSort];
    switch (sortBy) {
      case "name":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "artist":
        return sorted.sort((a, b) => a.artist.localeCompare(b.artist));
      case "dateAdded":
      default:
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  };

  const sortedSongs = sortSongs(songs);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Songs</h1>
          <p className="mt-2 text-gray-400">All your songs</p>
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="dateAdded">Date Added</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="artist">Artist</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : sortedSongs.length === 0 ? (
        <div className="rounded-lg bg-gray-900/40 p-8 text-center">
          <p className="text-gray-400">No songs yet. Start uploading music!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {sortedSongs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      )}
    </div>
  );
}

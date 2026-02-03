"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SongCard } from "@/components/player/SongCard";
import { AlbumCard } from "@/components/albums/AlbumCard";
import { PlaylistCard } from "@/components/playlist/PlaylistCard";
import { Song, Album, PlaylistWithSongs } from "@/types";
import { Grid3x3, List } from "lucide-react";

export default function LibraryPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [playlists, setPlaylists] = useState<PlaylistWithSongs[]>([]);
  const [artists, setArtists] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("dateAdded");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [songsRes, albumsRes, playlistsRes] = await Promise.all([
          fetch("/api/songs"),
          fetch("/api/albums"),
          fetch("/api/playlists"),
        ]);

        if (songsRes.ok) {
          const data = await songsRes.json();
          setSongs(data.songs || []);

          // Extract unique artists
          const uniqueArtists = Array.from(
            new Set((data.songs || []).map((s: Song) => s.artist))
          ).sort() as string[];
          setArtists(uniqueArtists);
        }

        if (albumsRes.ok) {
          const data = await albumsRes.json();
          setAlbums(data || []);
        }

        if (playlistsRes.ok) {
          const data = await playlistsRes.json();
          setPlaylists(data || []);
        }
      } catch (error) {
        console.error("Error fetching library data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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
          <h1 className="text-4xl font-bold text-white">Your Library</h1>
          <p className="mt-2 text-gray-400">All your music in one place</p>
        </div>
        <div className="flex items-center gap-4">
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
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className={
                viewMode === "grid"
                  ? "bg-gray-800"
                  : "text-gray-400 hover:text-white"
              }
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className={
                viewMode === "list"
                  ? "bg-gray-800"
                  : "text-gray-400 hover:text-white"
              }
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="songs" className="w-full">
        <TabsList className="bg-gray-900">
          <TabsTrigger value="songs">Songs</TabsTrigger>
          <TabsTrigger value="albums">Albums</TabsTrigger>
          <TabsTrigger value="artists">Artists</TabsTrigger>
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
        </TabsList>

        <TabsContent value="songs" className="mt-6">
          {isLoading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : sortedSongs.length === 0 ? (
            <div className="rounded-lg bg-gray-900/40 p-8 text-center">
              <p className="text-gray-400">
                No songs yet. Start uploading music!
              </p>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                  : "space-y-2"
              }
            >
              {sortedSongs.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="albums" className="mt-6">
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
        </TabsContent>

        <TabsContent value="artists" className="mt-6">
          {isLoading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : artists.length === 0 ? (
            <div className="rounded-lg bg-gray-900/40 p-8 text-center">
              <p className="text-gray-400">No artists yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {artists.map((artist) => {
                const artistSong = songs.find((s) => s.artist === artist);
                return (
                  <div
                    key={artist}
                    className="group relative cursor-pointer rounded-lg bg-gray-900/40 p-4 transition hover:bg-gray-800/60"
                  >
                    <div className="relative mb-4 aspect-square w-full">
                      {artistSong?.coverUrl ? (
                        <img
                          src={artistSong.coverUrl}
                          alt={artist}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-800">
                          <User className="h-16 w-16 text-gray-600" />
                        </div>
                      )}
                    </div>
                    <h3 className="truncate font-semibold text-white">
                      {artist}
                    </h3>
                    <p className="truncate text-sm text-gray-400">Artist</p>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="playlists" className="mt-6">
          {isLoading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : playlists.length === 0 ? (
            <div className="rounded-lg bg-gray-900/40 p-8 text-center">
              <p className="text-gray-400">No playlists yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {playlists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function User({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

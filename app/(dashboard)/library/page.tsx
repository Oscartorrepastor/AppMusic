"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

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
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div className="rounded-3xl border border-white/5 bg-[linear-gradient(135deg,rgba(34,211,238,0.16),rgba(217,70,239,0.12),rgba(255,255,255,0.02))] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <h1 className="text-4xl font-bold text-white">{t("library.title")}</h1>
          <p className="mt-2 text-slate-300">{t("library.subtitle")}</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] border-white/10 bg-white/5 text-white">
              <SelectValue placeholder={t("library.sortBy")} />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-slate-950 text-white">
              <SelectItem value="dateAdded">{t("library.dateAdded")}</SelectItem>
              <SelectItem value="name">{t("library.name")}</SelectItem>
              <SelectItem value="artist">{t("common.artist")}</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2 rounded-full border border-white/10 bg-white/5 p-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("grid")}
              className={
                viewMode === "grid"
                  ? "bg-gradient-to-r from-cyan-300 to-fuchsia-400 text-slate-950"
                  : "text-slate-300 hover:text-white"
              }
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("list")}
              className={
                viewMode === "list"
                  ? "bg-gradient-to-r from-cyan-300 to-fuchsia-400 text-slate-950"
                  : "text-slate-300 hover:text-white"
              }
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="songs" className="w-full">
        <TabsList className="border border-white/10 bg-slate-950/80">
          <TabsTrigger value="songs">{t("library.songs")}</TabsTrigger>
          <TabsTrigger value="albums">{t("library.albums")}</TabsTrigger>
          <TabsTrigger value="artists">{t("library.artists")}</TabsTrigger>
          <TabsTrigger value="playlists">{t("library.playlists")}</TabsTrigger>
        </TabsList>

        <TabsContent value="songs" className="mt-6">
          {isLoading ? (
            <div className="text-center text-slate-300">{t("common.loading")}</div>
          ) : sortedSongs.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
              <p className="text-slate-300">{t("library.noSongs")}</p>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                  : "grid grid-cols-1 gap-3"
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
            <div className="text-center text-slate-300">{t("common.loading")}</div>
          ) : albums.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
              <p className="text-slate-300">{t("library.noAlbums")}</p>
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
            <div className="text-center text-slate-300">{t("common.loading")}</div>
          ) : artists.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
              <p className="text-slate-300">{t("library.noArtists")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {artists.map((artist) => {
                const artistSong = songs.find((s) => s.artist === artist);
                return (
                  <div
                    key={artist}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_14px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-slate-900/70"
                  >
                    <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-full">
                      {artistSong?.coverUrl ? (
                        <Image
                          src={artistSong.coverUrl}
                          alt={artist}
                          fill
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-800">
                          <User className="h-16 w-16 text-slate-500" />
                        </div>
                      )}
                    </div>
                    <h3 className="truncate font-semibold text-white">{artist}</h3>
                    <p className="truncate text-sm text-slate-300">{t("common.artist")}</p>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="playlists" className="mt-6">
          {isLoading ? (
            <div className="text-center text-slate-300">{t("common.loading")}</div>
          ) : playlists.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
              <p className="text-slate-300">{t("library.noPlaylists")}</p>
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

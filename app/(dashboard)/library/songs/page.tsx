"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

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
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div className="rounded-3xl border border-white/5 bg-[linear-gradient(135deg,rgba(34,211,238,0.16),rgba(217,70,239,0.12),rgba(255,255,255,0.02))] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <h1 className="text-4xl font-bold text-white">{t("library.songs")}</h1>
          <p className="mt-2 text-slate-300">{t("library.songsSubtitle")}</p>
        </div>
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
      </div>

      {isLoading ? (
        <div className="text-center text-slate-300">{t("common.loading")}</div>
      ) : sortedSongs.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <p className="text-slate-300">{t("library.noSongs")}</p>
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

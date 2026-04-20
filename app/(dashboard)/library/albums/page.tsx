"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AlbumCard } from "@/components/albums/AlbumCard";
import { Album } from "@/types";

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

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
      <div className="rounded-3xl border border-white/5 bg-[linear-gradient(135deg,rgba(34,211,238,0.16),rgba(217,70,239,0.12),rgba(255,255,255,0.02))] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <h1 className="text-4xl font-bold text-white">{t("library.albums")}</h1>
        <p className="mt-2 text-slate-300">{t("library.albumsSubtitle")}</p>
      </div>

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
    </div>
  );
}

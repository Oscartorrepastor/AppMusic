"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { usePlayer } from "@/lib/contexts/PlayerContext";
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, Clock } from "lucide-react";
import Image from "next/image";
import { Album, Song } from "@/types";

interface AlbumData extends Album {
  songs: Song[];
}

export default function AlbumDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { currentSong, isPlaying, playQueue, pause } = usePlayer();
  const [album, setAlbum] = useState<AlbumData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAlbum = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/albums/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setAlbum(data);
        } else if (response.status === 404) {
          toast({
            title: "Error",
            description: "Album not found",
            variant: "destructive",
          });
          router.push("/library");
        }
      } catch (error) {
        console.error("Error fetching album:", error);
        toast({
          title: "Error",
          description: "Failed to load album",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbum();
  }, [params.id, router, toast]);

  const handlePlayAll = () => {
    if (!album || album.songs.length === 0) return;

    const isCurrentAlbum =
      album.songs.some((s) => s.id === currentSong?.id) && isPlaying;

    if (isCurrentAlbum) {
      pause();
    } else {
      playQueue(album.songs, 0);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  if (!album) {
    return null;
  }

  const totalDuration = album.songs.reduce((acc, song) => acc + song.duration, 0);
  const isCurrentAlbum =
    album.songs.some((s) => s.id === currentSong?.id) && isPlaying;

  return (
    <div className="space-y-8">
      <div className="flex gap-6">
        <div className="relative h-64 w-64 flex-shrink-0">
          {album.coverUrl ? (
            <Image
              src={album.coverUrl}
              alt={album.title}
              fill
              className="rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-800">
              <svg
                className="h-24 w-24 text-gray-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
              </svg>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-end">
          <p className="text-sm font-medium text-white">Album</p>
          <h1 className="mt-2 text-5xl font-bold text-white">{album.title}</h1>
          <div className="mt-4 flex items-center gap-2 text-lg text-gray-400">
            <span className="font-medium text-white">{album.artist}</span>
            {album.releaseYear && (
              <>
                <span>•</span>
                <span>{album.releaseYear}</span>
              </>
            )}
            <span>•</span>
            <span>
              {album.songs.length} {album.songs.length === 1 ? "song" : "songs"}
            </span>
            {totalDuration > 0 && (
              <>
                <span>•</span>
                <span>{Math.floor(totalDuration / 60)} min</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          onClick={handlePlayAll}
          disabled={album.songs.length === 0}
          className="h-12 w-12 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all"
        >
          {isCurrentAlbum ? (
            <Pause className="h-6 w-6 fill-current" />
          ) : (
            <Play className="h-6 w-6 fill-current ml-0.5" />
          )}
        </Button>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-[16px_4fr_1fr] gap-4 border-b border-gray-800 px-4 py-2 text-sm text-gray-400">
          <div>#</div>
          <div>Title</div>
          <div className="text-right">
            <Clock className="inline h-4 w-4" />
          </div>
        </div>

        {album.songs.length === 0 ? (
          <div className="rounded-lg bg-gray-900/40 p-8 text-center">
            <p className="text-gray-400">No songs in this album</p>
          </div>
        ) : (
          album.songs.map((song, index) => (
            <div
              key={song.id}
              className="group grid grid-cols-[16px_4fr_1fr] gap-4 rounded-md px-4 py-2 hover:bg-gray-800/40 cursor-pointer"
              onClick={() => playQueue(album.songs, index)}
            >
              <div className="flex items-center text-gray-400">
                {currentSong?.id === song.id && isPlaying ? (
                  <span className="text-green-500">▶</span>
                ) : (
                  <span className="group-hover:hidden">{index + 1}</span>
                )}
                <Play className="hidden h-4 w-4 group-hover:block" />
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <div className="font-medium text-white">{song.title}</div>
                  <div className="text-sm text-gray-400">{song.artist}</div>
                </div>
              </div>
              <div className="flex items-center justify-end text-gray-400">
                {formatDuration(song.duration)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

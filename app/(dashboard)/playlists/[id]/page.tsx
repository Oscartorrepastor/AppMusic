"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { usePlayer } from "@/lib/contexts/PlayerContext";
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, Edit, Trash2, Clock } from "lucide-react";
import Image from "next/image";

interface PlaylistData {
  id: string;
  name: string;
  description?: string | null;
  coverUrl?: string | null;
  isPublic: boolean;
  createdAt: string;
  userId: string;
  user: {
    id: string;
    name: string;
    avatar?: string | null;
  };
  songs: Array<{
    id: string;
    songId: string;
    addedAt: string;
    song: {
      id: string;
      title: string;
      artist: string;
      album?: string | null;
      duration: number;
      audioUrl: string;
      coverUrl?: string | null;
      genre?: string | null;
      uploadedById: string;
      createdAt: string;
      albumId?: string | null;
    };
  }>;
}

export default function PlaylistDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { currentSong, isPlaying, playQueue, pause } = usePlayer();
  const [playlist, setPlaylist] = useState<PlaylistData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylist = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/playlists/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setPlaylist(data);
        } else if (response.status === 404) {
          toast({
            title: "Error",
            description: "Playlist not found",
            variant: "destructive",
          });
          router.push("/library");
        }
      } catch (error) {
        console.error("Error fetching playlist:", error);
        toast({
          title: "Error",
          description: "Failed to load playlist",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylist();
  }, [params.id, router, toast]);

  const handlePlayAll = () => {
    if (!playlist || playlist.songs.length === 0) return;

    const songs = playlist.songs.map((ps) => ({
      ...ps.song,
      createdAt: new Date(ps.song.createdAt),
    }));
    const isCurrentPlaylist = songs.some((s) => s.id === currentSong?.id) && isPlaying;

    if (isCurrentPlaylist) {
      pause();
    } else {
      playQueue(songs, 0);
    }
  };

  const handleDelete = async () => {
    if (!playlist) return;

    if (!confirm("Are you sure you want to delete this playlist?")) return;

    try {
      const response = await fetch(`/api/playlists/${playlist.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Playlist deleted successfully",
        });
        router.push("/library");
      } else {
        throw new Error("Failed to delete playlist");
      }
    } catch (error) {
      console.error("Error deleting playlist:", error);
      toast({
        title: "Error",
        description: "Failed to delete playlist",
        variant: "destructive",
      });
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

  if (!playlist) {
    return null;
  }

  const songs = playlist.songs.map((ps) => ({
    ...ps.song,
    createdAt: new Date(ps.song.createdAt),
  }));
  const totalDuration = songs.reduce((acc, song) => acc + song.duration, 0);
  const isCurrentPlaylist = songs.some((s) => s.id === currentSong?.id) && isPlaying;

  return (
    <div className="space-y-8">
      <div className="flex gap-6">
        <div className="relative h-64 w-64 flex-shrink-0">
          {playlist.coverUrl ? (
            <Image
              src={playlist.coverUrl}
              alt={playlist.name}
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
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-end">
          <p className="text-sm font-medium text-white">Playlist</p>
          <h1 className="mt-2 text-5xl font-bold text-white">{playlist.name}</h1>
          {playlist.description && (
            <p className="mt-4 text-gray-400">{playlist.description}</p>
          )}
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
            <span>{playlist.user.name}</span>
            <span>•</span>
            <span>
              {songs.length} {songs.length === 1 ? "song" : "songs"}
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
          disabled={songs.length === 0}
          className="h-12 w-12 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all"
        >
          {isCurrentPlaylist ? (
            <Pause className="h-6 w-6 fill-current" />
          ) : (
            <Play className="h-6 w-6 fill-current ml-0.5" />
          )}
        </Button>
        <Button variant="ghost" className="text-gray-400 hover:text-white">
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button
          variant="ghost"
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-500"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 border-b border-gray-800 px-4 py-2 text-sm text-gray-400">
          <div>#</div>
          <div>Title</div>
          <div>Album</div>
          <div className="text-right">
            <Clock className="inline h-4 w-4" />
          </div>
        </div>

        {songs.length === 0 ? (
          <div className="rounded-lg bg-gray-900/40 p-8 text-center">
            <p className="text-gray-400">No songs in this playlist yet</p>
          </div>
        ) : (
          songs.map((song, index) => (
            <div
              key={song.id}
              className="group grid grid-cols-[16px_4fr_2fr_1fr] gap-4 rounded-md px-4 py-2 hover:bg-gray-800/40 cursor-pointer"
              onClick={() => playQueue(songs, index)}
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
                {song.coverUrl && (
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="h-10 w-10 rounded"
                  />
                )}
                <div>
                  <div className="font-medium text-white">{song.title}</div>
                  <div className="text-sm text-gray-400">{song.artist}</div>
                </div>
              </div>
              <div className="flex items-center text-gray-400">
                {song.album || "-"}
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

"use client";

import { X, Music } from "lucide-react";
import { usePlayer } from "@/lib/contexts/PlayerContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

interface QueuePanelProps {
  onClose: () => void;
}

export function QueuePanel({ onClose }: QueuePanelProps) {
  const { queue, currentSong, play, removeFromQueue, clearQueue } = usePlayer();

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed right-0 top-0 bottom-24 w-80 border-l border-gray-800 bg-black z-50">
      <div className="flex items-center justify-between border-b border-gray-800 p-4">
        <h2 className="text-lg font-semibold text-white">Queue</h2>
        <div className="flex items-center space-x-2">
          {queue.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearQueue}
              className="text-xs text-gray-400 hover:text-white"
            >
              Clear
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100%-4rem)]">
        {queue.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Music className="h-12 w-12 mb-4" />
            <p className="text-sm">No songs in queue</p>
          </div>
        ) : (
          <div className="p-2">
            {queue.map((song, index) => {
              const isCurrentSong = currentSong?.id === song.id;
              return (
                <div
                  key={`${song.id}-${index}`}
                  className={`group flex items-center space-x-3 rounded p-2 transition cursor-pointer ${
                    isCurrentSong
                      ? "bg-gray-800/60"
                      : "hover:bg-gray-800/40"
                  }`}
                  onClick={() => play(song)}
                >
                  <div className="relative h-10 w-10 flex-shrink-0">
                    {song.coverUrl ? (
                      <Image
                        src={song.coverUrl}
                        alt={song.title}
                        fill
                        className="rounded object-cover"
                      />
                    ) : (
                      <div className="h-full w-full rounded bg-gray-800" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`truncate text-sm ${isCurrentSong ? "text-green-500" : "text-white"}`}>
                      {song.title}
                    </p>
                    <p className="truncate text-xs text-gray-400">{song.artist}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">
                      {formatDuration(song.duration)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromQueue(index);
                      }}
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

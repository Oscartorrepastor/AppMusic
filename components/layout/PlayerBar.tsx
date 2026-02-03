"use client";

import { useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, Loader2, ListMusic, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlayer } from "@/lib/contexts/PlayerContext";
import { ProgressBar } from "@/components/player/ProgressBar";
import { VolumeControl } from "@/components/player/VolumeControl";
import { QueuePanel } from "@/components/player/QueuePanel";
import Image from "next/image";

export function PlayerBar() {
  const {
    currentSong,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    volume,
    shuffle,
    repeat,
    togglePlayPause,
    playNext,
    playPrevious,
    seekTo,
    setVolume,
    toggleShuffle,
    toggleRepeat,
  } = usePlayer();

  const [showQueue, setShowQueue] = useState(false);

  return (
    <>
      <footer className="fixed bottom-0 left-0 right-0 border-t border-gray-800 bg-black px-4 py-3 z-40">
        <div className="flex items-center justify-between gap-4">
          {/* Song Info */}
          <div className="flex w-1/4 min-w-[180px] items-center space-x-4">
            <div className="relative h-14 w-14 flex-shrink-0">
              {currentSong?.coverUrl ? (
                <Image
                  src={currentSong.coverUrl}
                  alt={currentSong.title}
                  fill
                  className="rounded object-cover"
                />
              ) : (
                <div className="h-full w-full rounded bg-gray-800" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {currentSong?.title || "No song playing"}
              </p>
              <p className="truncate text-xs text-gray-400">
                {currentSong?.artist || "Artist"}
              </p>
            </div>
            {currentSong && (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 flex-shrink-0 p-0 text-gray-400 hover:text-white"
              >
                <Heart className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Player Controls */}
          <div className="flex w-2/4 max-w-[722px] flex-col items-center space-y-2">
            <div className="flex items-center space-x-4">
              <Button
                size="sm"
                variant="ghost"
                className={`h-8 w-8 p-0 transition ${
                  shuffle ? "text-green-500" : "text-gray-400 hover:text-white"
                }`}
                onClick={toggleShuffle}
                disabled={!currentSong}
              >
                <Shuffle className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                onClick={playPrevious}
                disabled={!currentSong}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                className="h-10 w-10 rounded-full bg-white p-0 text-black hover:scale-105 hover:bg-gray-200 disabled:opacity-50"
                onClick={togglePlayPause}
                disabled={!currentSong}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="h-5 w-5 fill-current" />
                ) : (
                  <Play className="h-5 w-5 fill-current ml-0.5" />
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                onClick={playNext}
                disabled={!currentSong}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className={`h-8 w-8 p-0 transition ${
                  repeat !== "off" ? "text-green-500" : "text-gray-400 hover:text-white"
                }`}
                onClick={toggleRepeat}
                disabled={!currentSong}
              >
                {repeat === "one" ? (
                  <Repeat1 className="h-4 w-4" />
                ) : (
                  <Repeat className="h-4 w-4" />
                )}
              </Button>
            </div>
            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              onSeek={seekTo}
            />
          </div>

          {/* Volume & Queue Controls */}
          <div className="flex w-1/4 min-w-[180px] items-center justify-end space-x-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-gray-400 hover:text-white"
              onClick={() => setShowQueue(!showQueue)}
            >
              <ListMusic className="h-4 w-4" />
            </Button>
            <VolumeControl volume={volume} onVolumeChange={setVolume} />
          </div>
        </div>
      </footer>

      {showQueue && <QueuePanel onClose={() => setShowQueue(false)} />}
    </>
  );
}

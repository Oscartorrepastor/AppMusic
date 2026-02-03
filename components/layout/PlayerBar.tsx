"use client";

import { Play, SkipBack, SkipForward, Volume2, Shuffle, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export function PlayerBar() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 border-t border-gray-800 bg-black px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Song Info */}
        <div className="flex w-1/4 items-center space-x-4">
          <div className="h-14 w-14 rounded bg-gray-800"></div>
          <div>
            <p className="text-sm font-medium text-white">No song playing</p>
            <p className="text-xs text-gray-400">Artist</p>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex w-2/4 flex-col items-center space-y-2">
          <div className="flex items-center space-x-4">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-gray-400 hover:text-white"
            >
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-gray-400 hover:text-white"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              className="h-8 w-8 rounded-full bg-white p-0 text-black hover:bg-gray-200"
            >
              <Play className="h-4 w-4 fill-current" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-gray-400 hover:text-white"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-gray-400 hover:text-white"
            >
              <Repeat className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex w-full items-center space-x-2">
            <span className="text-xs text-gray-400">0:00</span>
            <Slider
              defaultValue={[0]}
              max={100}
              step={1}
              className="w-full"
            />
            <span className="text-xs text-gray-400">0:00</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex w-1/4 items-center justify-end space-x-2">
          <Volume2 className="h-4 w-4 text-gray-400" />
          <Slider
            defaultValue={[70]}
            max={100}
            step={1}
            className="w-24"
          />
        </div>
      </div>
    </footer>
  );
}

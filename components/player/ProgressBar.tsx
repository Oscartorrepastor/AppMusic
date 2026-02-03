"use client";

import { useCallback, useRef } from "react";
import { Slider } from "@/components/ui/slider";

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export function ProgressBar({ currentTime, duration, onSeek }: ProgressBarProps) {
  const isDragging = useRef(false);

  const handleValueChange = useCallback((value: number[]) => {
    isDragging.current = true;
    onSeek(value[0]);
  }, [onSeek]);

  const handleValueCommit = useCallback(() => {
    isDragging.current = false;
  }, []);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex w-full items-center space-x-2">
      <span className="text-xs text-gray-400 min-w-[40px] text-right">
        {formatTime(currentTime)}
      </span>
      <Slider
        value={[isDragging.current ? currentTime : currentTime]}
        max={duration || 100}
        step={0.1}
        onValueChange={handleValueChange}
        onValueCommit={handleValueCommit}
        className="w-full cursor-pointer"
      />
      <span className="text-xs text-gray-400 min-w-[40px]">
        {formatTime(duration)}
      </span>
    </div>
  );
}

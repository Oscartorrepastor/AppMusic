"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Music } from "lucide-react";

interface LyricsPanelProps {
  lyrics?: string | null;
  currentTime?: number;
  songTitle?: string;
}

export function LyricsPanel({ lyrics, currentTime = 0, songTitle }: LyricsPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    if (lyrics) {
      setLines(lyrics.split('\n').filter(line => line.trim()));
    } else {
      setLines([]);
    }
  }, [lyrics]);

  // Auto-scroll functionality (basic implementation)
  // For synced lyrics, you would need timestamped lyrics in LRC format
  useEffect(() => {
    if (scrollRef.current && lines.length > 0) {
      // Simple auto-scroll based on time
      const progressRatio = currentTime / 180; // Assume average 3-minute song
      const scrollHeight = scrollRef.current.scrollHeight;
      const targetScroll = scrollHeight * Math.min(progressRatio, 1);
      
      scrollRef.current.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
    }
  }, [currentTime, lines.length]);

  if (!lyrics || lines.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center p-8">
        <Music className="h-16 w-16 text-gray-600 mb-4" />
        <p className="text-lg font-medium text-gray-400">No lyrics available</p>
        <p className="text-sm text-gray-500 mt-2">
          Lyrics haven't been added for this song yet
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-800 p-4">
        <h3 className="text-lg font-semibold text-white">Lyrics</h3>
        {songTitle && (
          <p className="text-sm text-gray-400 mt-1">{songTitle}</p>
        )}
      </div>
      
      <ScrollArea className="flex-1 p-6">
        <div ref={scrollRef} className="space-y-4">
          {lines.map((line, index) => (
            <p
              key={index}
              className="text-base leading-relaxed text-gray-300 transition-colors hover:text-white"
            >
              {line}
            </p>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

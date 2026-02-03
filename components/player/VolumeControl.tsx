"use client";

import { Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export function VolumeControl({ volume, onVolumeChange }: VolumeControlProps) {
  const handleMuteToggle = () => {
    onVolumeChange(volume > 0 ? 0 : 70);
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 text-gray-400 hover:text-white"
        onClick={handleMuteToggle}
      >
        {volume === 0 ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>
      <Slider
        value={[volume]}
        max={100}
        step={1}
        onValueChange={(value) => onVolumeChange(value[0])}
        className="w-24 cursor-pointer"
      />
    </div>
  );
}

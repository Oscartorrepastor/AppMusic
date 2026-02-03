"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface EqualizerProps {
  audioElement: HTMLAudioElement | null;
}

interface EqualizerBand {
  frequency: number;
  gain: number;
  label: string;
}

const BANDS: Omit<EqualizerBand, "gain">[] = [
  { frequency: 60, label: "60Hz" },
  { frequency: 230, label: "230Hz" },
  { frequency: 910, label: "910Hz" },
  { frequency: 4000, label: "4kHz" },
  { frequency: 14000, label: "14kHz" },
];

type PresetName = "normal" | "bass" | "treble" | "vocal";

const PRESETS: Record<PresetName, number[]> = {
  normal: [0, 0, 0, 0, 0],
  bass: [8, 6, 0, -2, -4],
  treble: [-4, -2, 0, 6, 8],
  vocal: [-2, 4, 6, 4, -2],
};

export function Equalizer({ audioElement }: EqualizerProps) {
  const [gains, setGains] = useState<number[]>([0, 0, 0, 0, 0]);
  const [activePreset, setActivePreset] = useState<PresetName>("normal");
  const filtersRef = useRef<BiquadFilterNode[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!audioElement) return;

    // Create audio context and filters
    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaElementSource(audioElement);
      
      // Create filter chain
      let previousNode: AudioNode = source;
      BANDS.forEach((band, index) => {
        const filter = audioContextRef.current!.createBiquadFilter();
        filter.type = index === 0 ? "lowshelf" : index === BANDS.length - 1 ? "highshelf" : "peaking";
        filter.frequency.value = band.frequency;
        filter.Q.value = 1;
        filter.gain.value = 0;
        
        previousNode.connect(filter);
        previousNode = filter;
        filtersRef.current.push(filter);
      });
      
      previousNode.connect(audioContextRef.current.destination);
    }

    return () => {
      // Cleanup handled by audio element lifecycle
    };
  }, [audioElement]);

  useEffect(() => {
    // Update filter gains
    filtersRef.current.forEach((filter, index) => {
      if (filter) {
        filter.gain.value = gains[index];
      }
    });
  }, [gains]);

  const handleGainChange = (index: number, value: number[]) => {
    const newGains = [...gains];
    newGains[index] = value[0];
    setGains(newGains);
    setActivePreset("normal");
  };

  const applyPreset = (preset: PresetName) => {
    setGains(PRESETS[preset]);
    setActivePreset(preset);
  };

  const resetEqualizer = () => {
    setGains([0, 0, 0, 0, 0]);
    setActivePreset("normal");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-white mb-3">Presets</h3>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(PRESETS) as PresetName[]).map((preset) => (
            <Button
              key={preset}
              size="sm"
              variant={activePreset === preset ? "default" : "outline"}
              onClick={() => applyPreset(preset)}
              className={activePreset === preset ? "bg-green-500 hover:bg-green-600" : "border-gray-700"}
            >
              {preset.charAt(0).toUpperCase() + preset.slice(1)}
            </Button>
          ))}
          <Button
            size="sm"
            variant="outline"
            onClick={resetEqualizer}
            className="border-gray-700"
          >
            Reset
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-white mb-4">Frequency Bands</h3>
        <div className="grid grid-cols-5 gap-4">
          {BANDS.map((band, index) => (
            <div key={band.frequency} className="flex flex-col items-center">
              <div className="h-40 flex items-center">
                <Slider
                  orientation="vertical"
                  min={-12}
                  max={12}
                  step={1}
                  value={[gains[index]]}
                  onValueChange={(value) => handleGainChange(index, value)}
                  className="h-full"
                />
              </div>
              <div className="mt-2 text-center">
                <Label className="text-xs text-gray-400">{band.label}</Label>
                <p className="text-xs text-white font-medium">
                  {gains[index] > 0 ? "+" : ""}{gains[index]}dB
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

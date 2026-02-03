"use client";

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";
import { Song } from "@/types";

export type RepeatMode = "off" | "one" | "all";

interface PlayerState {
  currentSong: Song | null;
  queue: Song[];
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  shuffle: boolean;
  repeat: RepeatMode;
  isLoading: boolean;
}

interface PlayerContextType extends PlayerState {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  play: (song?: Song) => void;
  pause: () => void;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrevious: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  addToQueue: (songs: Song | Song[]) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  playQueue: (songs: Song[], startIndex?: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState<PlayerState>({
    currentSong: null,
    queue: [],
    isPlaying: false,
    volume: 70,
    currentTime: 0,
    duration: 0,
    shuffle: false,
    repeat: "off",
    isLoading: false,
  });

  const [originalQueue, setOriginalQueue] = useState<Song[]>([]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.volume / 100;
    }
  }, [state.volume]);

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setState((prev) => ({
        ...prev,
        currentTime: audio.currentTime,
      }));
    };

    const handleDurationChange = () => {
      setState((prev) => ({
        ...prev,
        duration: audio.duration || 0,
      }));
    };

    const handleEnded = () => {
      playNext();
    };

    const handleCanPlay = () => {
      setState((prev) => ({ ...prev, isLoading: false }));
    };

    const handleWaiting = () => {
      setState((prev) => ({ ...prev, isLoading: true }));
    };

    const handleError = () => {
      setState((prev) => ({ ...prev, isLoading: false, isPlaying: false }));
      console.error("Audio playback error");
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const play = useCallback((song?: Song) => {
    if (song) {
      setState((prev) => ({
        ...prev,
        currentSong: song,
        isPlaying: true,
        isLoading: true,
        currentTime: 0,
      }));

      if (audioRef.current) {
        audioRef.current.src = song.audioUrl;
        audioRef.current.load();
        audioRef.current.play().catch((error) => {
          console.error("Playback failed:", error);
          setState((prev) => ({ ...prev, isPlaying: false, isLoading: false }));
        });
      }
    } else {
      // Resume current song
      if (audioRef.current) {
        audioRef.current.play().catch((error) => {
          console.error("Playback failed:", error);
          setState((prev) => ({ ...prev, isPlaying: false }));
        });
        setState((prev) => ({ ...prev, isPlaying: true }));
      }
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const togglePlayPause = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, play, pause]);

  const playNext = useCallback(() => {
    if (!state.currentSong) return;

    const currentIndex = state.queue.findIndex((s) => s.id === state.currentSong?.id);
    
    if (state.repeat === "one") {
      // Replay current song
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      return;
    }

    if (currentIndex < state.queue.length - 1) {
      play(state.queue[currentIndex + 1]);
    } else if (state.repeat === "all" && state.queue.length > 0) {
      play(state.queue[0]);
    } else {
      pause();
    }
  }, [state.currentSong, state.queue, state.repeat, play, pause]);

  const playPrevious = useCallback(() => {
    if (!state.currentSong) return;

    // If more than 3 seconds into the song, restart it
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    const currentIndex = state.queue.findIndex((s) => s.id === state.currentSong?.id);
    
    if (currentIndex > 0) {
      play(state.queue[currentIndex - 1]);
    } else if (state.repeat === "all" && state.queue.length > 0) {
      play(state.queue[state.queue.length - 1]);
    }
  }, [state.currentSong, state.queue, state.repeat, play]);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setState((prev) => ({ ...prev, currentTime: time }));
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(100, volume));
    setState((prev) => ({ ...prev, volume: clampedVolume }));
  }, []);

  const toggleShuffle = useCallback(() => {
    setState((prev) => {
      const newShuffle = !prev.shuffle;
      let newQueue = [...prev.queue];

      if (newShuffle) {
        // Save original queue order
        setOriginalQueue([...prev.queue]);
        
        // Shuffle queue but keep current song at the front
        if (prev.currentSong) {
          const currentIndex = newQueue.findIndex((s) => s.id === prev.currentSong?.id);
          if (currentIndex !== -1) {
            newQueue.splice(currentIndex, 1);
          }
          newQueue = shuffleArray(newQueue);
          if (currentIndex !== -1 && prev.currentSong) {
            newQueue.unshift(prev.currentSong);
          }
        } else {
          newQueue = shuffleArray(newQueue);
        }
      } else {
        // Restore original queue order
        newQueue = [...originalQueue];
      }

      return {
        ...prev,
        shuffle: newShuffle,
        queue: newQueue,
      };
    });
  }, [originalQueue]);

  const toggleRepeat = useCallback(() => {
    setState((prev) => {
      const modes: RepeatMode[] = ["off", "all", "one"];
      const currentIndex = modes.indexOf(prev.repeat);
      const nextMode = modes[(currentIndex + 1) % modes.length];
      return { ...prev, repeat: nextMode };
    });
  }, []);

  const addToQueue = useCallback((songs: Song | Song[]) => {
    const songsArray = Array.isArray(songs) ? songs : [songs];
    setState((prev) => ({
      ...prev,
      queue: [...prev.queue, ...songsArray],
    }));
    if (!state.shuffle) {
      setOriginalQueue((prev) => [...prev, ...songsArray]);
    }
  }, [state.shuffle]);

  const removeFromQueue = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      queue: prev.queue.filter((_, i) => i !== index),
    }));
  }, []);

  const clearQueue = useCallback(() => {
    setState((prev) => ({
      ...prev,
      queue: [],
    }));
    setOriginalQueue([]);
  }, []);

  const playQueue = useCallback((songs: Song[], startIndex = 0) => {
    const newQueue = [...songs];
    setOriginalQueue([...songs]);
    
    setState((prev) => ({
      ...prev,
      queue: state.shuffle ? shuffleArray(newQueue) : newQueue,
    }));

    if (songs[startIndex]) {
      play(songs[startIndex]);
    }
  }, [state.shuffle, play]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Prevent shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case " ":
          e.preventDefault();
          togglePlayPause();
          break;
        case "ArrowLeft":
          e.preventDefault();
          seekTo(Math.max(0, state.currentTime - 5));
          break;
        case "ArrowRight":
          e.preventDefault();
          seekTo(Math.min(state.duration, state.currentTime + 5));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [state.currentTime, state.duration, togglePlayPause, seekTo]);

  return (
    <PlayerContext.Provider
      value={{
        ...state,
        audioRef,
        play,
        pause,
        togglePlayPause,
        playNext,
        playPrevious,
        seekTo,
        setVolume,
        toggleShuffle,
        toggleRepeat,
        addToQueue,
        removeFromQueue,
        clearQueue,
        playQueue,
      }}
    >
      {children}
      <audio ref={audioRef} />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}

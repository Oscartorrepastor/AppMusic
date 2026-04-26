"use client";

import { useState, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, Loader2, ListMusic, Heart, Activity, Sliders, FileText, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePlayer } from "@/lib/contexts/PlayerContext";
import { ProgressBar } from "@/components/player/ProgressBar";
import { VolumeControl } from "@/components/player/VolumeControl";
import { QueuePanel } from "@/components/player/QueuePanel";
import { AudioVisualizer } from "@/components/player/AudioVisualizer";
import { Equalizer } from "@/components/player/Equalizer";
import { LyricsPanel } from "@/components/player/LyricsPanel";
import { YouTubeDialog } from "@/components/player/YouTubeDialog";
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
    audioRef,
  } = usePlayer();
  const isExternalSong = currentSong?.uploadedById === "external-api";
  const { t } = useTranslation();

  const [showQueue, setShowQueue] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [showEqualizer, setShowEqualizer] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showYouTube, setShowYouTube] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && audioRef.current) {
      setAudioElement(audioRef.current);
    }
  }, [audioRef]);

  return (
    <>
      <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-slate-950/85 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.03] px-3 py-2 shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
          <div className="flex w-1/4 min-w-[180px] items-center space-x-4">
            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl">
              {currentSong?.coverUrl ? (
                <Image
                  src={currentSong.coverUrl}
                  alt={currentSong.title}
                  fill
                  className="rounded-xl object-cover"
                />
              ) : (
                <div className="h-full w-full rounded-xl bg-slate-800" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {currentSong?.title || t("player.noSong")}
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                <span className="truncate">{currentSong?.artist || t("player.unknownArtist")}</span>
                {isExternalSong && currentSong && (
                  <span className="rounded-full border border-cyan-300/35 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
                    {t("player.previewBadge")}
                  </span>
                )}
              </div>
            </div>
            {currentSong && !isExternalSong && (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 flex-shrink-0 p-0 text-slate-400 hover:text-fuchsia-300"
              >
                <Heart className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="flex w-2/4 max-w-[722px] flex-col items-center space-y-2">
            <div className="flex items-center space-x-4">
              <Button
                size="sm"
                variant="ghost"
                className={`h-8 w-8 p-0 transition ${
                  shuffle ? "text-cyan-300" : "text-slate-400 hover:text-white"
                }`}
                onClick={toggleShuffle}
                disabled={!currentSong}
              >
                <Shuffle className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                onClick={playPrevious}
                disabled={!currentSong}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-300 to-fuchsia-400 p-0 text-slate-950 hover:scale-105 hover:opacity-95 disabled:opacity-50"
                onClick={togglePlayPause}
                disabled={!currentSong}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="h-5 w-5 fill-current" />
                ) : (
                  <Play className="ml-0.5 h-5 w-5 fill-current" />
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                onClick={playNext}
                disabled={!currentSong}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className={`h-8 w-8 p-0 transition ${
                  repeat !== "off" ? "text-fuchsia-300" : "text-slate-400 hover:text-white"
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

          <div className="flex w-1/4 min-w-[180px] items-center justify-end space-x-2">
            <Button
              size="sm"
              variant="ghost"
              className={`h-8 w-8 p-0 ${showVisualizer ? "text-cyan-300" : "text-slate-400 hover:text-white"}`}
              onClick={() => setShowVisualizer(!showVisualizer)}
              title={t("player.visualizer")}
            >
              <Activity className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className={`h-8 w-8 p-0 ${showEqualizer ? "text-cyan-300" : "text-slate-400 hover:text-white"}`}
              onClick={() => setShowEqualizer(!showEqualizer)}
              title={t("player.equalizer")}
            >
              <Sliders className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className={`h-8 w-8 p-0 ${showLyrics ? "text-fuchsia-300" : "text-slate-400 hover:text-white"}`}
              onClick={() => setShowLyrics(!showLyrics)}
              title={t("player.lyrics")}
            >
              <FileText className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-9 rounded-full border border-red-400/30 bg-gradient-to-r from-red-500/20 to-fuchsia-500/20 px-4 text-red-100 hover:scale-[1.02] hover:bg-red-500/25 hover:text-white disabled:opacity-50"
              onClick={() => setShowYouTube(true)}
              disabled={!currentSong}
              title={t("player.youtubeTitle")}
            >
              <ExternalLink className="h-4 w-4" />
              <span className="ml-2 font-medium">YouTube</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-slate-400 hover:text-white"
              onClick={() => setShowQueue(!showQueue)}
              title={t("player.queue")}
            >
              <ListMusic className="h-4 w-4" />
            </Button>
            <VolumeControl volume={volume} onVolumeChange={setVolume} />
          </div>
        </div>
      </footer>

      {showQueue && <QueuePanel onClose={() => setShowQueue(false)} />}

      <Dialog open={showVisualizer} onOpenChange={setShowVisualizer}>
        <DialogContent className="sm:max-w-2xl border-gray-800 bg-slate-950">
          <DialogHeader>
            <DialogTitle className="text-white">{t("player.audioVisualizer")}</DialogTitle>
          </DialogHeader>
          <AudioVisualizer
            audioElement={audioElement}
            isPlaying={isPlaying}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showEqualizer} onOpenChange={setShowEqualizer}>
        <DialogContent className="sm:max-w-2xl border-gray-800 bg-slate-950">
          <DialogHeader>
            <DialogTitle className="text-white">{t("player.equalizer")}</DialogTitle>
          </DialogHeader>
          <Equalizer audioElement={audioElement} />
        </DialogContent>
      </Dialog>

      <Dialog open={showLyrics} onOpenChange={setShowLyrics}>
        <DialogContent className="max-h-[80vh] border-gray-800 bg-slate-950 sm:max-w-2xl">
          <LyricsPanel
            lyrics={currentSong && "lyrics" in currentSong ? String(currentSong.lyrics ?? "") : undefined}
            currentTime={currentTime}
            songTitle={currentSong?.title}
          />
        </DialogContent>
      </Dialog>

      <YouTubeDialog
        song={currentSong}
        open={showYouTube}
        onOpenChange={setShowYouTube}
      />
    </>
  );
}

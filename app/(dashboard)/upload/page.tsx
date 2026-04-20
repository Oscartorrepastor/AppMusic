"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Upload, Music, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface UploadFormData {
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  lyrics?: string;
}

const GENRES = [
  "Pop", "Rock", "Hip Hop", "Jazz", "Classical", "Electronic",
  "R&B", "Country", "Blues", "Reggae", "Metal", "Folk", "Other"
];

export default function UploadPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<UploadFormData>();
  const selectedGenre = watch("genre");

  const extractAudioMetadata = useCallback((file: File) => {
    const audio = new Audio();
    const objectUrl = URL.createObjectURL(file);

    audio.addEventListener("loadedmetadata", () => {
      setAudioDuration(Math.floor(audio.duration));
      URL.revokeObjectURL(objectUrl);
    });

    audio.src = objectUrl;

    const fileName = file.name.replace(/\.(mp3|wav|flac|m4a)$/i, "");
    const parts = fileName.split("-").map((s) => s.trim());

    if (parts.length === 2) {
      setValue("artist", parts[0]);
      setValue("title", parts[1]);
    } else {
      setValue("title", fileName);
    }
  }, [setValue]);

  const handleAudioDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file && /\.(mp3|wav|flac|m4a)$/i.test(file.name)) {
      setAudioFile(file);
      extractAudioMetadata(file);
    } else {
      toast({
        title: t("upload.invalidFile"),
        description: t("upload.invalidAudioDescription"),
        variant: "destructive",
      });
    }
  }, [extractAudioMetadata, t, toast]);

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      extractAudioMetadata(file);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && /\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
      setCoverFile(file);
    } else {
      toast({
        title: t("upload.invalidFile"),
        description: t("upload.invalidImageDescription"),
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: UploadFormData) => {
    if (!audioFile) {
      toast({
        title: t("upload.noAudioTitle"),
        description: t("upload.noAudioDescription"),
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("audio", audioFile);
      if (coverFile) {
        formData.append("cover", coverFile);
      }

      setUploadProgress(30);
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload files");
      }

      const { audioUrl, coverUrl } = await uploadResponse.json();
      setUploadProgress(60);

      const songData = {
        title: data.title,
        artist: data.artist,
        album: data.album || null,
        genre: data.genre || null,
        lyrics: data.lyrics || null,
        duration: audioDuration,
        audioUrl,
        coverUrl,
      };

      const songResponse = await fetch("/api/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(songData),
      });

      if (!songResponse.ok) {
        throw new Error("Failed to create song");
      }

      setUploadProgress(100);

      toast({
        title: t("upload.uploadSuccess"),
        description: t("upload.uploadSuccessDescription"),
      });

      setTimeout(() => {
        router.push("/library");
      }, 1000);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: t("upload.uploadFailed"),
        description: error instanceof Error ? error.message : t("auth.unexpectedError"),
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-3xl border border-white/5 bg-[linear-gradient(135deg,rgba(34,211,238,0.16),rgba(217,70,239,0.12),rgba(255,255,255,0.02))] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <h1 className="text-4xl font-bold text-white">{t("upload.title")}</h1>
          <p className="mt-2 text-slate-300">{t("upload.subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card className="border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
            <div
              className={`relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-colors ${
                dragActive
                  ? "border-cyan-300 bg-cyan-300/10"
                  : audioFile
                  ? "border-fuchsia-400 bg-fuchsia-400/5"
                  : "border-white/10 hover:border-cyan-300/40"
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleAudioDrop}
              onClick={() => document.getElementById("audio-input")?.click()}
            >
              <input
                id="audio-input"
                type="file"
                accept=".mp3,.wav,.flac,.m4a"
                className="hidden"
                onChange={handleAudioChange}
              />

              {audioFile ? (
                <div className="text-center">
                  <Music className="mx-auto mb-4 h-16 w-16 text-cyan-300" />
                  <p className="text-lg font-medium text-white">{audioFile.name}</p>
                  <p className="text-sm text-slate-300">
                    {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                    {audioDuration > 0 && ` • ${Math.floor(audioDuration / 60)}:${String(audioDuration % 60).padStart(2, "0")}`}
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-slate-200"
                    onClick={(e) => { e.stopPropagation(); setAudioFile(null); }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    {t("common.remove")}
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto mb-4 h-16 w-16 text-slate-300" />
                  <p className="mb-2 text-lg font-medium text-white">
                    {t("upload.dropTitle")}
                  </p>
                  <p className="text-sm text-slate-300">{t("upload.dropHint")}</p>
                  <p className="mt-2 text-xs text-slate-400">{t("upload.supports")}</p>
                </div>
              )}
            </div>
          </Card>

          <Card className="border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">{t("upload.titleLabel")} *</Label>
                <Input
                  id="title"
                  {...register("title", { required: true })}
                  className="border-white/10 bg-white/5"
                  placeholder={t("upload.songTitlePlaceholder")}
                />
                {errors.title && <p className="mt-1 text-sm text-red-400">{t("upload.titleRequired")}</p>}
              </div>

              <div>
                <Label htmlFor="artist">{t("upload.artistLabel")} *</Label>
                <Input
                  id="artist"
                  {...register("artist", { required: true })}
                  className="border-white/10 bg-white/5"
                  placeholder={t("upload.artistPlaceholder")}
                />
                {errors.artist && <p className="mt-1 text-sm text-red-400">{t("upload.artistRequired")}</p>}
              </div>

              <div>
                <Label htmlFor="album">{t("upload.albumLabel")}</Label>
                <Input
                  id="album"
                  {...register("album")}
                  className="border-white/10 bg-white/5"
                  placeholder={t("upload.albumPlaceholder")}
                />
              </div>

              <div>
                <Label htmlFor="genre">{t("upload.genreLabel")}</Label>
                <Select value={selectedGenre} onValueChange={(value) => setValue("genre", value)}>
                  <SelectTrigger className="border-white/10 bg-white/5">
                    <SelectValue placeholder={t("upload.genrePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-slate-950 text-white">
                    {GENRES.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="lyrics">{t("upload.lyricsLabel")}</Label>
                <Textarea
                  id="lyrics"
                  {...register("lyrics")}
                  className="min-h-[120px] border-white/10 bg-white/5"
                  placeholder={t("upload.lyricsPlaceholder")}
                />
              </div>

              <div>
                <Label>{t("upload.coverImage")}</Label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl">
                    {coverFile ? (
                      <img
                        src={URL.createObjectURL(coverFile)}
                        alt="Cover preview"
                        className="h-full w-full rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-xl border-2 border-dashed border-white/10 bg-white/5">
                        <ImageIcon className="h-8 w-8 text-slate-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      id="cover-input"
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      className="hidden"
                      onChange={handleCoverChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("cover-input")?.click()}
                      className="border-white/10 bg-white/5"
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      {coverFile ? t("upload.changeImage") : t("upload.uploadImage")}
                    </Button>
                    {coverFile && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-2 text-slate-200"
                        onClick={() => setCoverFile(null)}
                      >
                        <X className="mr-2 h-4 w-4" />
                        {t("common.remove")}
                      </Button>
                    )}
                    <p className="mt-1 text-xs text-slate-400">{t("upload.imageHelp")}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {isUploading && (
            <Card className="border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-cyan-300" />
                <div className="flex-1">
                  <p className="mb-1 text-sm text-white">{t("upload.uploading")}</p>
                  <div className="h-2 rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-fuchsia-400 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm text-slate-300">{uploadProgress}%</span>
              </div>
            </Card>
          )}

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isUploading}
              className="border-white/10 bg-white/5"
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={!audioFile || isUploading}
              className="bg-gradient-to-r from-cyan-300 to-fuchsia-400 text-slate-950 hover:opacity-95"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("upload.uploading")}
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {t("upload.uploadSong")}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

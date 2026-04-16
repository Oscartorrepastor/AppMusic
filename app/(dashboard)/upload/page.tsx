"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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
    
    audio.addEventListener('loadedmetadata', () => {
      setAudioDuration(Math.floor(audio.duration));
      URL.revokeObjectURL(objectUrl);
    });
    
    audio.src = objectUrl;

    // Try to extract metadata from filename
    const fileName = file.name.replace(/\.(mp3|wav|flac|m4a)$/i, '');
    const parts = fileName.split('-').map(s => s.trim());
    
    if (parts.length === 2) {
      setValue('artist', parts[0]);
      setValue('title', parts[1]);
    } else {
      setValue('title', fileName);
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
        title: "Invalid file type",
        description: "Please upload an MP3, WAV, FLAC, or M4A file",
        variant: "destructive",
      });
    }
  }, [extractAudioMetadata, toast]);

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
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, or WebP image",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: UploadFormData) => {
    if (!audioFile) {
      toast({
        title: "No audio file",
        description: "Please select an audio file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload files first
      const formData = new FormData();
      formData.append('audio', audioFile);
      if (coverFile) {
        formData.append('cover', coverFile);
      }

      setUploadProgress(30);
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload files');
      }

      const { audioUrl, coverUrl } = await uploadResponse.json();
      setUploadProgress(60);

      // Create song record
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

      const songResponse = await fetch('/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(songData),
      });

      if (!songResponse.ok) {
        throw new Error('Failed to create song');
      }

      setUploadProgress(100);
      
      toast({
        title: "Upload successful",
        description: "Your song has been uploaded successfully",
      });

      setTimeout(() => {
        router.push('/library');
      }, 1000);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An error occurred during upload",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-4xl font-bold text-white">Upload Music</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Audio Upload Zone */}
          <Card className="border-gray-800 bg-gray-900/50 p-6">
            <div
              className={`relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                dragActive 
                  ? 'border-green-500 bg-green-500/10' 
                  : audioFile 
                  ? 'border-green-500 bg-green-500/5' 
                  : 'border-gray-700 hover:border-gray-600'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleAudioDrop}
              onClick={() => document.getElementById('audio-input')?.click()}
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
                  <Music className="mx-auto mb-4 h-16 w-16 text-green-500" />
                  <p className="text-lg font-medium text-white">{audioFile.name}</p>
                  <p className="text-sm text-gray-400">
                    {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                    {audioDuration > 0 && ` • ${Math.floor(audioDuration / 60)}:${String(audioDuration % 60).padStart(2, '0')}`}
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={(e) => { e.stopPropagation(); setAudioFile(null); }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                  <p className="mb-2 text-lg font-medium text-white">
                    Drop your audio file here
                  </p>
                  <p className="text-sm text-gray-400">
                    or click to browse
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    Supports MP3, WAV, FLAC, M4A
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Form Fields */}
          <Card className="border-gray-800 bg-gray-900/50 p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  {...register("title", { required: true })}
                  className="bg-gray-800 border-gray-700"
                  placeholder="Song title"
                />
                {errors.title && <p className="text-sm text-red-500 mt-1">Title is required</p>}
              </div>

              <div>
                <Label htmlFor="artist">Artist *</Label>
                <Input
                  id="artist"
                  {...register("artist", { required: true })}
                  className="bg-gray-800 border-gray-700"
                  placeholder="Artist name"
                />
                {errors.artist && <p className="text-sm text-red-500 mt-1">Artist is required</p>}
              </div>

              <div>
                <Label htmlFor="album">Album</Label>
                <Input
                  id="album"
                  {...register("album")}
                  className="bg-gray-800 border-gray-700"
                  placeholder="Album name (optional)"
                />
              </div>

              <div>
                <Label htmlFor="genre">Genre</Label>
                <Select value={selectedGenre} onValueChange={(value) => setValue("genre", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select genre (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENRES.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="lyrics">Lyrics</Label>
                <Textarea
                  id="lyrics"
                  {...register("lyrics")}
                  className="bg-gray-800 border-gray-700 min-h-[120px]"
                  placeholder="Enter song lyrics (optional)"
                />
              </div>

              {/* Cover Image Upload */}
              <div>
                <Label>Cover Image</Label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="relative h-24 w-24 flex-shrink-0">
                    {coverFile ? (
                      <img
                        src={URL.createObjectURL(coverFile)}
                        alt="Cover preview"
                        className="h-full w-full rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded border-2 border-dashed border-gray-700 bg-gray-800">
                        <ImageIcon className="h-8 w-8 text-gray-600" />
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
                      onClick={() => document.getElementById('cover-input')?.click()}
                      className="border-gray-700"
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      {coverFile ? 'Change Image' : 'Upload Image'}
                    </Button>
                    {coverFile && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-2"
                        onClick={() => setCoverFile(null)}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      JPG, PNG, or WebP (recommended: 500x500)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Upload Progress */}
          {isUploading && (
            <Card className="border-gray-800 bg-gray-900/50 p-4">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-green-500" />
                <div className="flex-1">
                  <p className="text-sm text-white mb-1">Uploading...</p>
                  <div className="h-2 rounded-full bg-gray-800">
                    <div
                      className="h-full rounded-full bg-green-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm text-gray-400">{uploadProgress}%</span>
              </div>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isUploading}
              className="border-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!audioFile || isUploading}
              className="bg-green-500 hover:bg-green-600"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Song
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

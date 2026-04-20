import { DeezerAPI, type DeezerTrack } from "@/lib/deezer";
import type { Song } from "@/types";

interface ITunesTrack {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName?: string;
  previewUrl?: string;
  artworkUrl100?: string;
  primaryGenreName?: string;
  trackTimeMillis?: number;
}

interface ITunesSearchResponse {
  resultCount: number;
  results: ITunesTrack[];
}

const ITUNES_API_BASE = "https://itunes.apple.com";
export const EXTERNAL_UPLOADER_ID = "external-api";

function upscaleArtwork(url?: string) {
  if (!url) return null;
  return url.replace(/100x100|60x60/g, "600x600");
}

function normalizeDeezerTrack(track: DeezerTrack): Song {
  return {
    id: `deezer_${track.id}`,
    title: track.title,
    artist: track.artist.name,
    album: track.album?.title || null,
    duration: track.duration || 30,
    audioUrl: track.preview,
    coverUrl: track.album?.cover_xl || track.album?.cover_big || track.album?.cover_medium || null,
    genre: null,
    lyrics: null,
    playCount: 0,
    uploadedById: EXTERNAL_UPLOADER_ID,
    createdAt: new Date(),
    albumId: track.album ? `deezer_album_${track.album.id}` : null,
  };
}

function normalizeITunesTrack(track: ITunesTrack): Song | null {
  if (!track.previewUrl) return null;

  return {
    id: `itunes_${track.trackId}`,
    title: track.trackName,
    artist: track.artistName,
    album: track.collectionName || null,
    duration: Math.max(1, Math.round((track.trackTimeMillis || 30000) / 1000)),
    audioUrl: track.previewUrl,
    coverUrl: upscaleArtwork(track.artworkUrl100),
    genre: track.primaryGenreName || null,
    lyrics: null,
    playCount: 0,
    uploadedById: EXTERNAL_UPLOADER_ID,
    createdAt: new Date(),
    albumId: null,
  };
}

export class ITunesAPI {
  static async searchTracks(query: string, limit = 25): Promise<ITunesTrack[]> {
    const response = await fetch(
      `${ITUNES_API_BASE}/search?term=${encodeURIComponent(query)}&entity=song&limit=${limit}`,
      {
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Error searching iTunes tracks");
    }

    const data: ITunesSearchResponse = await response.json();
    return data.results || [];
  }

  static async getTrack(trackId: number): Promise<ITunesTrack | null> {
    const response = await fetch(
      `${ITUNES_API_BASE}/lookup?id=${trackId}`,
      {
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Error fetching iTunes track");
    }

    const data: ITunesSearchResponse = await response.json();
    return data.results?.[0] || null;
  }
}

function dedupeSongs(songs: Song[]) {
  const seen = new Set<string>();
  return songs.filter((song) => {
    const key = `${song.title.toLowerCase()}::${song.artist.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function searchFreeTracks(query: string, limit = 20): Promise<Song[]> {
  const [deezerResult, iTunesResult] = await Promise.allSettled([
    DeezerAPI.searchTracks(query, limit),
    ITunesAPI.searchTracks(query, limit),
  ]);

  const deezerSongs = deezerResult.status === "fulfilled"
    ? deezerResult.value.data.map(normalizeDeezerTrack).filter((song) => Boolean(song.audioUrl))
    : [];

  const iTunesSongs = iTunesResult.status === "fulfilled"
    ? iTunesResult.value.map(normalizeITunesTrack).filter((song): song is Song => Boolean(song?.audioUrl))
    : [];

  return dedupeSongs([...deezerSongs, ...iTunesSongs]).slice(0, limit);
}

export async function getFreeCharts(limit = 10): Promise<Song[]> {
  try {
    const chart = await DeezerAPI.getChart(limit);
    const deezerSongs = chart.data.map(normalizeDeezerTrack).filter((song) => Boolean(song.audioUrl));
    if (deezerSongs.length > 0) {
      return deezerSongs.slice(0, limit);
    }
  } catch (error) {
    console.error("Deezer chart fallback triggered:", error);
  }

  const iTunesSongs = await ITunesAPI.searchTracks("top hits", limit);
  return iTunesSongs
    .map(normalizeITunesTrack)
    .filter((song): song is Song => Boolean(song?.audioUrl))
    .slice(0, limit);
}

export async function getFreeTrack(id: string): Promise<Song | null> {
  if (id.startsWith("deezer_")) {
    const deezerId = Number(id.replace("deezer_", ""));
    if (Number.isNaN(deezerId)) return null;
    const track = await DeezerAPI.getTrack(deezerId);
    return normalizeDeezerTrack(track);
  }

  if (id.startsWith("itunes_")) {
    const iTunesId = Number(id.replace("itunes_", ""));
    if (Number.isNaN(iTunesId)) return null;
    const track = await ITunesAPI.getTrack(iTunesId);
    return track ? normalizeITunesTrack(track) : null;
  }

  const numericId = Number(id);
  if (!Number.isNaN(numericId)) {
    try {
      const deezerTrack = await DeezerAPI.getTrack(numericId);
      return normalizeDeezerTrack(deezerTrack);
    } catch {
      const iTunesTrack = await ITunesAPI.getTrack(numericId);
      return iTunesTrack ? normalizeITunesTrack(iTunesTrack) : null;
    }
  }

  return null;
}

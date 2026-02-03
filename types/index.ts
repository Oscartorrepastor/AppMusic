export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  createdAt: Date;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string | null;
  duration: number;
  audioUrl: string;
  coverUrl?: string | null;
  genre?: string | null;
  uploadedById: string;
  createdAt: Date;
  albumId?: string | null;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl?: string | null;
  releaseYear?: number | null;
  songs?: Song[];
}

export interface Playlist {
  id: string;
  name: string;
  description?: string | null;
  userId: string;
  coverUrl?: string | null;
  isPublic: boolean;
  createdAt: Date;
  songs?: PlaylistSong[];
}

export interface PlaylistWithSongs extends Playlist {
  songs: Array<{
    id: string;
    playlistId: string;
    songId: string;
    addedAt: Date;
    song: Song;
  }>;
}

export interface PlaylistSong {
  id: string;
  playlistId: string;
  songId: string;
  addedAt: Date;
  song?: Song;
}

export interface Favorite {
  id: string;
  userId: string;
  songId: string;
  createdAt: Date;
  song?: Song;
}

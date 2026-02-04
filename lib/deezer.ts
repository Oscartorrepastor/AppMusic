export interface DeezerTrack {
  id: number;
  title: string;
  duration: number;
  preview: string; // URL del preview de 30 segundos
  artist: {
    id: number;
    name: string;
    picture: string;
    picture_medium: string;
    picture_big: string;
  };
  album: {
    id: number;
    title: string;
    cover: string;
    cover_medium: string;
    cover_big: string;
    cover_xl: string;
  };
}

export interface DeezerSearchResponse {
  data: DeezerTrack[];
  total: number;
}

export interface DeezerAlbum {
  id: number;
  title: string;
  cover: string;
  cover_medium: string;
  cover_big: string;
  cover_xl: string;
  release_date: string;
  artist: {
    id: number;
    name: string;
    picture_medium: string;
  };
  tracks: {
    data: DeezerTrack[];
  };
}

const DEEZER_API_BASE = "https://api.deezer.com";

export class DeezerAPI {
  // Buscar canciones
  static async searchTracks(query: string, limit = 25): Promise<DeezerSearchResponse> {
    const response = await fetch(
      `${DEEZER_API_BASE}/search?q=${encodeURIComponent(query)}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error("Error searching tracks");
    }
    
    return response.json();
  }

  // Obtener detalles de una canción
  static async getTrack(trackId: number): Promise<DeezerTrack> {
    const response = await fetch(`${DEEZER_API_BASE}/track/${trackId}`);
    
    if (!response.ok) {
      throw new Error("Error fetching track");
    }
    
    return response.json();
  }

  // Obtener álbum completo
  static async getAlbum(albumId: number): Promise<DeezerAlbum> {
    const response = await fetch(`${DEEZER_API_BASE}/album/${albumId}`);
    
    if (!response.ok) {
      throw new Error("Error fetching album");
    }
    
    return response.json();
  }

  // Buscar artistas
  static async searchArtists(query: string, limit = 25) {
    const response = await fetch(
      `${DEEZER_API_BASE}/search/artist?q=${encodeURIComponent(query)}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error("Error searching artists");
    }
    
    return response.json();
  }

  // Obtener top tracks de un artista
  static async getArtistTopTracks(artistId: number, limit = 25): Promise<DeezerSearchResponse> {
    const response = await fetch(
      `${DEEZER_API_BASE}/artist/${artistId}/top?limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error("Error fetching artist top tracks");
    }
    
    return response.json();
  }

  // Obtener chart (canciones populares)
  static async getChart(limit = 25): Promise<DeezerSearchResponse> {
    const response = await fetch(`${DEEZER_API_BASE}/chart/0/tracks?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error("Error fetching charts");
    }
    
    const data = await response.json();
    return {
      data: data.data,
      total: data.total,
    };
  }

  // Obtener géneros
  static async getGenres() {
    const response = await fetch(`${DEEZER_API_BASE}/genre`);
    
    if (!response.ok) {
      throw new Error("Error fetching genres");
    }
    
    return response.json();
  }

  // Obtener canciones por género
  static async getGenreArtists(genreId: number) {
    const response = await fetch(`${DEEZER_API_BASE}/genre/${genreId}/artists`);
    
    if (!response.ok) {
      throw new Error("Error fetching genre artists");
    }
    
    return response.json();
  }
}
"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { SongCard } from "@/components/player/SongCard";
import { AlbumCard } from "@/components/albums/AlbumCard";
import { PlaylistCard } from "@/components/playlist/PlaylistCard";
import { Song, Album, PlaylistWithSongs } from "@/types";
import { Search as SearchIcon, TrendingUp } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<{
    songs: Song[];
    albums: Album[];
    playlists: PlaylistWithSongs[];
    artists: string[];
  }>({
    songs: [],
    albums: [],
    playlists: [],
    artists: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setResults({ songs: [], albums: [], playlists: [], artists: [] });
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(debouncedQuery)}&type=${activeTab === "all" ? "all" : activeTab}`
        );

        if (response.ok) {
          const data = await response.json();
          setResults(data);
        }
      } catch (error) {
        console.error("Error searching:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery, activeTab]);

  const hasResults =
    results.songs.length > 0 ||
    results.albums.length > 0 ||
    results.playlists.length > 0 ||
    results.artists.length > 0;

  const trendingSearches = ["Pop", "Rock", "Jazz", "Classical", "Hip Hop"];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">Search</h1>
        <p className="mt-2 text-gray-400">Find your favorite music</p>
      </div>

      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search songs, albums, artists, playlists..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-gray-800 border-gray-700 pl-12 text-white placeholder:text-gray-400 h-12 text-lg"
        />
      </div>

      {!query && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trending Searches
          </h2>
          <div className="flex flex-wrap gap-3">
            {trendingSearches.map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="rounded-full bg-gray-800 px-4 py-2 text-sm text-white transition hover:bg-gray-700"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {query && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-gray-900">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="songs">Songs</TabsTrigger>
            <TabsTrigger value="albums">Albums</TabsTrigger>
            <TabsTrigger value="artists">Artists</TabsTrigger>
            <TabsTrigger value="playlists">Playlists</TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="mt-8 text-center text-gray-400">Searching...</div>
          ) : !hasResults ? (
            <div className="mt-8 rounded-lg bg-gray-900/40 p-8 text-center">
              <p className="text-gray-400">
                No results found for &quot;{query}&quot;
              </p>
            </div>
          ) : (
            <>
              <TabsContent value="all" className="mt-6 space-y-8">
                {results.songs.length > 0 && (
                  <div>
                    <h2 className="mb-4 text-2xl font-bold text-white">Songs</h2>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                      {results.songs.slice(0, 5).map((song) => (
                        <SongCard key={song.id} song={song} />
                      ))}
                    </div>
                  </div>
                )}

                {results.albums.length > 0 && (
                  <div>
                    <h2 className="mb-4 text-2xl font-bold text-white">Albums</h2>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                      {results.albums.slice(0, 5).map((album) => (
                        <AlbumCard key={album.id} album={album} />
                      ))}
                    </div>
                  </div>
                )}

                {results.artists.length > 0 && (
                  <div>
                    <h2 className="mb-4 text-2xl font-bold text-white">Artists</h2>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                      {results.artists.slice(0, 5).map((artist) => (
                        <div
                          key={artist}
                          className="group relative cursor-pointer rounded-lg bg-gray-900/40 p-4 transition hover:bg-gray-800/60"
                        >
                          <div className="relative mb-4 aspect-square w-full">
                            <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-800">
                              <UserIcon className="h-16 w-16 text-gray-600" />
                            </div>
                          </div>
                          <h3 className="truncate font-semibold text-white">
                            {artist}
                          </h3>
                          <p className="truncate text-sm text-gray-400">Artist</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {results.playlists.length > 0 && (
                  <div>
                    <h2 className="mb-4 text-2xl font-bold text-white">Playlists</h2>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                      {results.playlists.slice(0, 5).map((playlist) => (
                        <PlaylistCard key={playlist.id} playlist={playlist} />
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="songs" className="mt-6">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {results.songs.map((song) => (
                    <SongCard key={song.id} song={song} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="albums" className="mt-6">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {results.albums.map((album) => (
                    <AlbumCard key={album.id} album={album} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="artists" className="mt-6">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {results.artists.map((artist) => (
                    <div
                      key={artist}
                      className="group relative cursor-pointer rounded-lg bg-gray-900/40 p-4 transition hover:bg-gray-800/60"
                    >
                      <div className="relative mb-4 aspect-square w-full">
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-800">
                          <UserIcon className="h-16 w-16 text-gray-600" />
                        </div>
                      </div>
                      <h3 className="truncate font-semibold text-white">{artist}</h3>
                      <p className="truncate text-sm text-gray-400">Artist</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="playlists" className="mt-6">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {results.playlists.map((playlist) => (
                    <PlaylistCard key={playlist.id} playlist={playlist} />
                  ))}
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center text-gray-400">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

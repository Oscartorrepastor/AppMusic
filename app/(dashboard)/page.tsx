import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">Welcome back, {user.name}</h1>
        <p className="mt-2 text-gray-400">
          Your personal music collection awaits
        </p>
      </div>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-white">Recently Played</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="group cursor-pointer rounded-lg bg-gray-900/40 p-4 transition hover:bg-gray-800/60"
            >
              <div className="mb-4 aspect-square w-full rounded-md bg-gray-800"></div>
              <h3 className="truncate font-semibold text-white">Song Title</h3>
              <p className="truncate text-sm text-gray-400">Artist Name</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-white">Your Playlists</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="group cursor-pointer rounded-lg bg-gray-900/40 p-4 transition hover:bg-gray-800/60"
            >
              <div className="mb-4 aspect-square w-full rounded-md bg-gray-800"></div>
              <h3 className="truncate font-semibold text-white">Playlist Name</h3>
              <p className="truncate text-sm text-gray-400">0 songs</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

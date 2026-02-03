import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LibraryPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">Your Library</h1>
        <p className="mt-2 text-gray-400">
          All your music in one place
        </p>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="mb-4 text-2xl font-bold text-white">Songs</h2>
          <div className="rounded-lg bg-gray-900/40 p-8 text-center">
            <p className="text-gray-400">No songs yet. Start uploading music!</p>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-white">Albums</h2>
          <div className="rounded-lg bg-gray-900/40 p-8 text-center">
            <p className="text-gray-400">No albums yet.</p>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-white">Artists</h2>
          <div className="rounded-lg bg-gray-900/40 p-8 text-center">
            <p className="text-gray-400">No artists yet.</p>
          </div>
        </section>
      </div>
    </div>
  );
}

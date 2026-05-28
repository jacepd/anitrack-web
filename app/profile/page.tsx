import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { STATUS_LABELS, STATUS_COLORS } from "@/types";
import Link from "next/link";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [profileRes, entriesRes, followersRes, followingRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("anime_list").select("*").eq("user_id", user.id),
    supabase.from("follows").select("*", { count: "exact" }).eq("following_id", user.id),
    supabase.from("follows").select("*", { count: "exact" }).eq("follower_id", user.id),
  ]);

  const profile = profileRes.data;
  const entries = entriesRes.data ?? [];

  const stats = {
    total: entries.length,
    watching: entries.filter((e) => e.status === "watching").length,
    completed: entries.filter((e) => e.status === "completed").length,
    planned: entries.filter((e) => e.status === "plan_to_watch").length,
    dropped: entries.filter((e) => e.status === "dropped").length,
    avgScore: entries.filter((e) => e.score).length > 0
      ? (entries.reduce((a, e) => a + (e.score ?? 0), 0) /
          entries.filter((e) => e.score).length).toFixed(1)
      : "—",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="card flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
          <span className="text-primary text-4xl font-bold">
            {profile?.display_name?.[0]?.toUpperCase() ?? "?"}
          </span>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-3xl font-bold">{profile?.display_name}</h1>
          <p className="text-subtle">@{profile?.username}</p>
          {profile?.bio && <p className="text-subtle mt-2">{profile.bio}</p>}
          <div className="flex gap-6 mt-3 justify-center sm:justify-start">
            <div className="text-center">
              <div className="font-bold">{followersRes.count ?? 0}</div>
              <div className="text-subtle text-xs">Followers</div>
            </div>
            <div className="text-center">
              <div className="font-bold">{followingRes.count ?? 0}</div>
              <div className="text-subtle text-xs">Following</div>
            </div>
          </div>
        </div>
        <Link href="/profile/edit" className="btn-secondary text-sm self-start">
          Edit Profile
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
        {[
          { label: "Total", value: stats.total, color: "text-text-main" },
          { label: "Watching", value: stats.watching, color: "text-blue-400" },
          { label: "Completed", value: stats.completed, color: "text-green-400" },
          { label: "Planned", value: stats.planned, color: "text-purple-400" },
          { label: "Dropped", value: stats.dropped, color: "text-red-400" },
          { label: "Avg Score", value: stats.avgScore, color: "text-accent" },
        ].map((s) => (
          <div key={s.label} className="card text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-subtle text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Recent Anime</h2>
          <Link href="/mylist" className="text-accent text-sm hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {entries.slice(0, 8).map((entry) => (
            <Link key={entry.id} href={`/anime/${entry.mal_id}`}>
              <div className="group relative rounded-lg overflow-hidden bg-muted aspect-[2/3]">
                <img
                  src={entry.image_url}
                  alt={entry.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-2">
                  <p className="text-white text-xs font-bold truncate">{entry.title}</p>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${STATUS_COLORS[entry.status as keyof typeof STATUS_COLORS]}`}>
                    {STATUS_LABELS[entry.status as keyof typeof STATUS_LABELS]}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

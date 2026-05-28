import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";

export default async function SocialPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Get following list
  const { data: follows } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", user.id);

  const followingIds = follows?.map((f) => f.following_id) ?? [];

  // Get activity feed
  const { data: feed } = followingIds.length > 0
    ? await supabase
        .from("activity_feed")
        .select("*, profiles(username, display_name, avatar_url)")
        .in("user_id", followingIds)
        .order("created_at", { ascending: false })
        .limit(50)
    : { data: [] };

  const ACTIVITY_LABELS: Record<string, string> = {
    started_watching: "started watching",
    completed_anime: "completed",
    added_anime: "added",
    dropped_anime: "dropped",
    rated_anime: "rated",
    wrote_review: "reviewed",
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Friend Activity</h1>
        <Link href="/social/find-friends" className="btn-secondary text-sm">
          Find Friends
        </Link>
      </div>

      {feed && feed.length > 0 ? (
        <div className="space-y-3">
          {feed.map((activity: any) => (
            <div key={activity.id} className="card flex items-center gap-4">
              {/* Avatar */}
              <Link href={`/profile/${activity.user_id}`}>
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {activity.profiles?.avatar_url ? (
                    <Image
                      src={activity.profiles.avatar_url}
                      alt={activity.profiles.display_name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-primary font-bold">
                      {activity.profiles?.display_name?.[0]?.toUpperCase()}
                    </span>
                  )}
                </div>
              </Link>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <Link
                    href={`/profile/${activity.user_id}`}
                    className="font-bold hover:text-primary transition-colors"
                  >
                    {activity.profiles?.display_name}
                  </Link>{" "}
                  {ACTIVITY_LABELS[activity.activity_type] ?? activity.activity_type}{" "}
                  {activity.mal_id ? (
                    <Link
                      href={`/anime/${activity.mal_id}`}
                      className="text-accent font-bold hover:underline"
                    >
                      {activity.anime_title}
                    </Link>
                  ) : (
                    <span className="text-accent font-bold">{activity.anime_title}</span>
                  )}
                </p>
                <p className="text-subtle text-xs mt-0.5">
                  {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                </p>
              </div>

              {/* Thumbnail */}
              {activity.anime_image && (
                <Link href={`/anime/${activity.mal_id}`} className="flex-shrink-0">
                  <Image
                    src={activity.anime_image}
                    alt={activity.anime_title ?? ""}
                    width={40}
                    height={56}
                    className="rounded object-cover"
                  />
                </Link>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">👥</p>
          <p className="text-subtle text-lg">No activity yet.</p>
          <p className="text-subtle text-sm mt-1">
            Follow friends to see what they're watching!
          </p>
          <Link href="/social/find-friends" className="btn-primary inline-block mt-4">
            Find Friends
          </Link>
        </div>
      )}
    </div>
  );
}

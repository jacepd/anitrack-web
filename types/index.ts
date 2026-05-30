export type WatchStatus = "watching" | "completed" | "plan_to_watch" | "dropped" | "on_hold";

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
}

export interface AnimeListEntry {
  id: string;
  user_id: string;
  mal_id: number;
  title: string;
  image_url: string;
  status: WatchStatus;
  score?: number;
  review?: string;
  episodes_watched?: number;
  total_episodes?: number;
  episodes_aired?: number;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  user_id: string;
  activity_type: string;
  mal_id?: number;
  anime_title?: string;
  anime_image?: string;
  metadata: Record<string, unknown>;
  created_at: string;
  profiles: {
    username: string;
    display_name: string;
    avatar_url?: string;
  };
}

export const STATUS_LABELS: Record<WatchStatus, string> = {
  watching: "Watching",
  completed: "Completed",
  plan_to_watch: "Plan to Watch",
  on_hold: "On Hold",
  dropped: "Dropped",
};

export const STATUS_COLORS: Record<WatchStatus, string> = {
  watching: "bg-blue-500/20 text-blue-400",
  completed: "bg-green-500/20 text-green-400",
  plan_to_watch: "bg-purple-500/20 text-purple-400",
  on_hold: "bg-yellow-500/20 text-yellow-400",
  dropped: "bg-red-500/20 text-red-400",
};

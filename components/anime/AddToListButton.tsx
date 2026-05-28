"use client";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useAnimeListStore } from "@/stores/animeListStore";
import { WatchStatus, STATUS_LABELS } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const STATUS_OPTIONS: { value: WatchStatus; emoji: string }[] = [
  { value: "watching", emoji: "▶️" },
  { value: "completed", emoji: "✅" },
  { value: "plan_to_watch", emoji: "📋" },
  { value: "on_hold", emoji: "⏸️" },
  { value: "dropped", emoji: "🗑️" },
];

interface Props {
  malId: number;
  title: string;
  imageUrl: string;
  totalEpisodes?: number;
}

export function AddToListButton({ malId, title, imageUrl, totalEpisodes }: Props) {
  const { user } = useAuthStore();
  const { entries, addEntry, updateEntry, removeEntry, fetchEntries } = useAnimeListStore();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const entry = entries.find((e) => e.mal_id === malId);

  if (!user) {
    return (
      <a href="/auth/login" className="btn-primary inline-block">
        Sign in to Track
      </a>
    );
  }

  const handleSelect = async (status: WatchStatus) => {
    setSaving(true);
    const supabase = createClient();

    if (entry) {
      await updateEntry(entry.id, { status });
    } else {
      await addEntry({
        user_id: user.id,
        mal_id: malId,
        title,
        image_url: imageUrl,
        status,
        total_episodes: totalEpisodes,
      });
      await supabase.from("activity_feed").insert({
        user_id: user.id,
        activity_type: status === "watching" ? "started_watching" : "added_anime",
        mal_id: malId,
        anime_title: title,
        anime_image: imageUrl,
        metadata: { status },
      });
    }

    setSaving(false);
    setOpen(false);
  };

  const handleRemove = async () => {
    if (!entry) return;
    await removeEntry(entry.id);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 ${
          entry
            ? "bg-surface border-2 border-primary text-primary hover:bg-primary/10"
            : "bg-primary hover:bg-orange-600 text-white"
        }`}
      >
        <span>{entry ? "✓" : "+"}</span>
        <span>{entry ? STATUS_LABELS[entry.status] : "Add to List"}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-2 left-0 bg-surface border border-muted rounded-xl shadow-2xl z-50 min-w-[220px] overflow-hidden">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                disabled={saving}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left ${
                  entry?.status === opt.value ? "text-primary font-bold" : "text-text-main"
                }`}
              >
                <span>{opt.emoji}</span>
                <span className="text-sm">{STATUS_LABELS[opt.value]}</span>
                {entry?.status === opt.value && <span className="ml-auto">✓</span>}
              </button>
            ))}
            {entry && (
              <button
                onClick={handleRemove}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-red-400 border-t border-muted"
              >
                <span>🗑️</span>
                <span className="text-sm">Remove from List</span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

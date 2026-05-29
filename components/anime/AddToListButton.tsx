"use client";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useAnimeListStore } from "@/stores/animeListStore";
import { WatchStatus, STATUS_LABELS } from "@/types";
import { createClient } from "@/lib/supabase/client";

const STATUS_OPTIONS: { value: WatchStatus; emoji: string }[] = [
  { value: "watching",      emoji: "▶️" },
  { value: "completed",     emoji: "✅" },
  { value: "plan_to_watch", emoji: "📋" },
  { value: "on_hold",       emoji: "⏸️" },
  { value: "dropped",       emoji: "🗑️" },
];

interface Props {
  malId: number;
  title: string;
  imageUrl: string;
  totalEpisodes?: number;
}

export function AddToListButton({ malId, title, imageUrl, totalEpisodes }: Props) {
  const { user } = useAuthStore();
  const { entries, loading, addEntry, updateEntry, removeEntry } = useAnimeListStore();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const entry = entries.find((e) => e.mal_id === malId);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = () => setOpen(false);
    if (open) document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [open]);

  if (!user) {
    return (
      <a href="/auth/login" className="btn-primary inline-block">
        Sign in to Track
      </a>
    );
  }

  if (loading) {
    return (
      <div className="btn-secondary inline-block opacity-50 cursor-wait px-6 py-3">
        Loading...
      </div>
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
      // Log to activity feed
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
    setSaving(true);
    await removeEntry(entry.id);
    setSaving(false);
    setOpen(false);
  };

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen(!open)}
        disabled={saving}
        className={`font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 ${
          entry
            ? "bg-surface border-2 border-primary text-primary hover:bg-primary/10"
            : "btn-primary"
        } ${saving ? "opacity-50 cursor-wait" : ""}`}
      >
        <span>{saving ? "⏳" : entry ? "✓" : "+"}</span>
        <span>{saving ? "Saving..." : entry ? STATUS_LABELS[entry.status] : "Add to List"}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-2 left-0 bg-surface z-50 min-w-[220px] overflow-hidden rounded-xl shadow-2xl"
            style={{ border: "0.5px solid #1E2A3A" }}>
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
                {entry?.status === opt.value && <span className="ml-auto text-primary">✓</span>}
              </button>
            ))}
            {entry && (
              <button
                onClick={handleRemove}
                disabled={saving}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-red-400"
                style={{ borderTop: "0.5px solid #1E2A3A" }}
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

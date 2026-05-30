"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimeListEntry, WatchStatus, STATUS_LABELS, STATUS_COLORS } from "@/types";
import { useAnimeListStore } from "@/stores/animeListStore";
import { useAuthStore } from "@/stores/authStore";

const TABS: WatchStatus[] = ["watching", "completed", "plan_to_watch", "on_hold", "dropped"];



export function MyListClient({ initialEntries }: { initialEntries: AnimeListEntry[] }) {
  const { user } = useAuthStore();
  const { entries, fetchEntries } = useAnimeListStore();
  const [activeTab, setActiveTab] = useState<WatchStatus>("watching");

  useEffect(() => {
    if (user) fetchEntries(user.id);
  }, [user]);

  const allEntries = entries.length > 0 ? entries : initialEntries;
  const filtered = allEntries.filter((e) => e.status === activeTab);

  const counts = TABS.reduce((acc, s) => {
    acc[s] = allEntries.filter((e) => e.status === s).length;
    return acc;
  }, {} as Record<WatchStatus, number>);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {TABS.map((s) => (
          <div
            key={s}
            className={`card text-center cursor-pointer transition-colors hover:border-primary/50 ${
              activeTab === s ? "border-primary/50 bg-primary/5" : ""
            }`}
            onClick={() => setActiveTab(s)}
          >
            <div className="text-2xl font-bold text-text-main">{counts[s]}</div>
            <div className="text-subtle text-xs mt-1">{STATUS_LABELS[s]}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map((s) => (
          <button
            key={s}
            onClick={() => setActiveTab(s)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
              activeTab === s
                ? "bg-primary text-white"
                : "bg-surface text-subtle hover:text-text-main"
            }`}
          >
            {STATUS_LABELS[s]} ({counts[s]})
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((entry) => (
            <div key={entry.id} className="card flex items-start gap-4 hover:border-primary/30 transition-colors">
              {/* Poster — clickable */}
              <Link href={`/anime/${entry.mal_id}`} className="flex-shrink-0">
                <img
                  src={entry.image_url}
                  alt={entry.title}
                  className="w-14 h-20 object-cover rounded-lg hover:opacity-80 transition-opacity"
                />
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/anime/${entry.mal_id}`}>
                    <p className="font-bold hover:text-primary transition-colors line-clamp-1">
                      {entry.title}
                    </p>
                  </Link>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_COLORS[entry.status]}`}>
                    {STATUS_LABELS[entry.status]}
                  </span>
                </div>

                {/* Episode progress */}
                {entry.total_episodes && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-subtle mb-1">
                      <span>{entry.episodes_watched ?? 0} / {entry.total_episodes} eps</span>
                      {entry.score && <span>★ {entry.score}/10</span>}
                    </div>
                    <div className="bg-muted rounded-full h-1.5">
                      <div
                        className="bg-primary rounded-full h-1.5 transition-all"
                        style={{
                          width: `${Math.min(
                            ((entry.episodes_watched ?? 0) / entry.total_episodes) * 100, 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-subtle">No anime in this list yet.</p>
          <Link href="/search" className="btn-primary inline-block mt-4">
            Browse Anime
          </Link>
        </div>
      )}
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useAnimeListStore } from "@/stores/animeListStore";

interface Props {
  malId: number;
  totalEpisodes?: number;
  episodesAired?: number;
  isAiring?: boolean;
}

export function EpisodeTracker({ malId, totalEpisodes, episodesAired, isAiring }: Props) {
  const { user } = useAuthStore();
  const { entries, updateEntry } = useAnimeListStore();
  const [saving, setSaving] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const entry = entries.find((e) => e.mal_id === malId);

  // Only show if user has this anime in their list and it's watching/on_hold
  if (!user || !entry) return null;
  if (entry.status !== "watching" && entry.status !== "on_hold") return null;

  const watched = entry.episodes_watched ?? 0;
  const total = totalEpisodes;
  const aired = episodesAired;
  const available = aired ?? total ?? null;
  const isCaughtUp = available !== null && watched >= available;
  const behindBy = available !== null ? available - watched : null;
  const percent = total ? Math.min((watched / total) * 100, 100) : 0;

  const update = async (newCount: number) => {
    if (saving) return;
    if (newCount < 0) return;
    if (total && newCount > total) return;
    setSaving(true);
    const newStatus = total && newCount === total ? "completed" : entry.status;
    await updateEntry(entry.id, {
      episodes_watched: newCount,
      status: newStatus,
    });
    setSaving(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const parsed = parseInt(inputValue);
    if (!isNaN(parsed) && parsed !== watched) update(parsed);
  };

  const handleInputFocus = () => {
    setInputValue(watched.toString());
  };

  return (
    <div className="card space-y-3 mt-1">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-text-main">Episode Progress</h3>
        {saving && <span className="text-xs text-subtle animate-pulse">Saving...</span>}
      </div>

      {/* Caught up indicator for airing anime */}
      {isAiring && aired && (
        <div className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg ${
          isCaughtUp
            ? "bg-green-500/15 text-green-400 border border-green-500/20"
            : "bg-primary/15 text-primary border border-primary/20"
        }`}>
          {isCaughtUp
            ? `✓ Caught up — episode ${aired} has aired`
            : `${behindBy} episode${behindBy !== 1 ? "s" : ""} behind — episode ${aired} has aired`}
        </div>
      )}

      {/* Progress bar */}
      {total && (
        <div>
          <div className="flex justify-between text-xs text-subtle mb-1.5">
            <span>{watched} / {total} episodes</span>
            <span>{Math.round(percent)}%</span>
          </div>
          <div className="bg-muted rounded-full h-2">
            <div
              className="bg-primary rounded-full h-2 transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Decrease */}
        <button
          onClick={() => update(watched - 1)}
          disabled={saving || watched === 0}
          className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/30 text-text-main font-bold text-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
        >
          −
        </button>

        {/* Custom episode input */}
        <div className="flex items-center gap-2 flex-1 justify-center">
          <input
            type="number"
            value={inputValue !== "" ? inputValue : watched}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              if (e.key === "Escape") setInputValue("");
            }}
            min={0}
            max={total ?? undefined}
            disabled={saving}
            className="w-16 text-center text-base font-bold bg-muted text-text-main rounded-lg px-2 py-1.5 focus:outline-none transition-colors disabled:opacity-50"
            style={{ border: "0.5px solid #1E2A3A" }}
            onMouseEnter={(e) => (e.target as HTMLInputElement).style.borderColor = "#3B82F6"}
            onMouseLeave={(e) => (e.target as HTMLInputElement).style.borderColor = "#1E2A3A"}
          />
          {total && (
            <span className="text-subtle text-sm font-medium">/ {total} eps</span>
          )}
        </div>

        {/* Increase */}
        <button
          onClick={() => update(watched + 1)}
          disabled={saving || (!!total && watched >= total)}
          className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/30 text-text-main font-bold text-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
        >
          +
        </button>
      </div>

      {/* Quick set to latest aired */}
      {isAiring && aired && !isCaughtUp && (
        <button
          onClick={() => update(aired)}
          disabled={saving}
          className="w-full text-xs font-bold py-2 rounded-lg transition-colors text-primary hover:bg-primary/10"
          style={{ border: "0.5px solid #3B82F6" }}
        >
          Mark caught up to episode {aired}
        </button>
      )}
    </div>
  );
}

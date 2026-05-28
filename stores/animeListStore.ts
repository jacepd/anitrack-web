"use client";
import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import { AnimeListEntry, WatchStatus } from "@/types";

interface AnimeListState {
  entries: AnimeListEntry[];
  loading: boolean;
  fetchEntries: (userId: string) => Promise<void>;
  addEntry: (entry: Omit<AnimeListEntry, "id" | "created_at" | "updated_at">) => Promise<void>;
  updateEntry: (id: string, updates: Partial<AnimeListEntry>) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  getEntryByMalId: (malId: number) => AnimeListEntry | undefined;
}

export const useAnimeListStore = create<AnimeListState>((set, get) => ({
  entries: [],
  loading: false,

  fetchEntries: async (userId) => {
    set({ loading: true });
    const supabase = createClient();
    const { data } = await supabase
      .from("anime_list")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });
    if (data) set({ entries: data });
    set({ loading: false });
  },

  addEntry: async (entry) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("anime_list")
      .insert(entry)
      .select()
      .single();
    if (data) set((state) => ({ entries: [data, ...state.entries] }));
  },

  updateEntry: async (id, updates) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("anime_list")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (data) {
      set((state) => ({
        entries: state.entries.map((e) => (e.id === id ? data : e)),
      }));
    }
  },

  removeEntry: async (id) => {
    const supabase = createClient();
    await supabase.from("anime_list").delete().eq("id", id);
    set((state) => ({ entries: state.entries.filter((e) => e.id !== id) }));
  },

  getEntryByMalId: (malId) => get().entries.find((e) => e.mal_id === malId),
}));

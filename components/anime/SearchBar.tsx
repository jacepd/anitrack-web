"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search 20,000+ anime titles..."
        className="input flex-1"
        autoFocus
      />
      <button type="submit" className="btn-primary px-6">
        Search
      </button>
    </form>
  );
}

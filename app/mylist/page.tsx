import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MyListClient } from "@/components/anime/MyListClient";

export default async function MyListPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: entries } = await supabase
    .from("anime_list")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Anime List</h1>
      <MyListClient initialEntries={entries ?? []} />
    </div>
  );
}

import type { SupabaseClient } from "@supabase/supabase-js";
import type { ActivityRow } from "@/types/activity";

const ACTIVITY_SELECT = "id,title,location_name,city,country,category,image_url";

export async function listPublishedActivities(
  supabase: SupabaseClient,
  limit = 20,
): Promise<{ data: ActivityRow[] | null; error: string | null }> {
  const { data, error } = await supabase
    .from("activities")
    .select(ACTIVITY_SELECT)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: (data ?? []) as ActivityRow[], error: null };
}


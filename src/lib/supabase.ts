import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseConfigured = Boolean(url && anonKey && !url.includes("YOUR-PROJECT"));

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_client) return _client;
  if (!url || !anonKey) {
    throw new Error(
      "Supabase no configurado. Definí VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env",
    );
  }
  _client = createClient(url, anonKey, {
    db: { schema: "nahui" },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: "nahui-admin-auth",
    },
  });
  return _client;
}

// Schema row types ----------------------------------------------------------

export type StoryRow = {
  id: string;
  title: string;
  date: string | null;
  description: string;
  has_before_after: boolean;
  images: string[];
  before_images: string[];
  after_images: string[];
  sort_order: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
};

export type ActionRow = {
  id: string;
  icon: string;
  title: string;
  description: string;
  image: string;
  sort_order: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
};

export type GalleryImageRow = {
  id: string;
  url: string;
  alt: string | null;
  sort_order: number;
  visible: boolean;
  created_at: string;
};

export type ProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  updated_at: string;
};

export const MEDIA_BUCKET = "nahui-media";

export async function uploadMedia(file: File, folder: "gallery" | "stories" | "actions" = "gallery") {
  const supabase = getSupabase();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

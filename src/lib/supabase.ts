import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder";

// Public client (browser-safe, limited permissions)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-only admin client (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

export const BUCKETS = {
  IMAGES: "images",
  PRODUCTS: "products",
} as const;

export async function uploadFile(
  file: File,
  bucket: string,
  path: string
): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, file, { upsert: true });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrl;
}

export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresInSeconds = 60
): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUrl(path, expiresInSeconds);

  if (error) throw new Error(`Signed URL failed: ${error.message}`);
  return data.signedUrl;
}

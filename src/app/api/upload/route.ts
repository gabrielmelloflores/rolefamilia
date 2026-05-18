import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabaseAdmin, BUCKETS } from "@/lib/supabase";
import { randomBytes } from "crypto";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const bucket = (formData.get("bucket") as string) ?? BUCKETS.IMAGES;

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const ext = file.name.split(".").pop();
  const filename = `${randomBytes(16).toString("hex")}.${ext}`;
  const path = `uploads/${filename}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return NextResponse.json({ url: publicUrl, path: data.path });
}

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { fileName, fileType } = await request.json();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Define a unique path for the file in Supabase Storage.
  const filePath = `${user.id}/${Date.now()}-${fileName}`;

  try {
    const { data, error } = await supabase.storage
      .from("documents") // This must match your bucket name in Supabase
      .createSignedUploadUrl(filePath);

    if (error) {
      console.error("Error creating signed URL:", error);
      return NextResponse.json(
        { error: "Could not create upload URL." },
        { status: 500 }
      );
    }

    // Return the signed URL to the frontend
    return NextResponse.json({ ...data, filePath }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
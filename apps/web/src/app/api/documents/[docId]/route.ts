import { createClient } from "@repo/supabase-clients/server";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { docId: string } }
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const docId = params.docId;

  try {
    // First, find the document record to get its storage path
    // and ensure the user owns it.
    const { data: document, error: docError } = await supabase
      .from("application_documents")
      .select("storage_path, loan_application_id")
      .eq("id", docId)
      .single();

    if (docError || !document) {
      return NextResponse.json({ error: "Document not found." }, { status: 404 });
    }

    // You would add further checks here to ensure user owns the loan application.

    // Step 1: Delete the file from Supabase Storage
    const { error: storageError } = await supabase.storage
      .from("documents")
      .remove([document.storage_path]);

    if (storageError) {
      console.error("Storage deletion error:", storageError);
      return NextResponse.json({ error: "Could not delete file from storage." }, { status: 500 });
    }

    // Step 2: Delete the record from the database
    const { error: dbError } = await supabase
      .from("application_documents")
      .delete()
      .eq("id", docId);
      
    if (dbError) {
      console.error("Database deletion error:", dbError);
      return NextResponse.json({ error: "Could not delete database record." }, { status: 500 });
    }
    
    return NextResponse.json({ message: "Document deleted successfully." }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
import { createClient } from "@repo/supabase-clients/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // Use the shared, server-side client utility
  const supabase = await createClient();

  // Call the Supabase signUp function with the user's credentials
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  // Handle any potential errors from Supabase
  if (error) {
    console.error('Supabase signup error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Handle the case where a user is created but needs to confirm their email
  // (if email confirmation is enabled in your Supabase project)
  if (data.user && !data.session) {
    return NextResponse.json({
        message: 'Registration successful. Please check your email to confirm your account.',
        user: data.user
    }, { status: 201 });
  }

  // On full success (user created and session started), return the user and session data
  return NextResponse.json({ user: data.user, session: data.session }, { status: 201 });
}
import { createClient } from "@repo/supabase-clients/server";
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required.' },
      { status: 400 }
    );
  }

  // THE FIX: We must 'await' the createClient() function now.
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Supabase sign-in error:', error);
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 400 });
  }

  return NextResponse.json({ user: data.user, session: data.session }, { status: 200 });
}
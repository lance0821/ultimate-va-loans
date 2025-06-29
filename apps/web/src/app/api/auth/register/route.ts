import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // CHANGE 1: Await the cookies() call in Next.js 15
  const cookieStore = await cookies();

  // Create a Supabase client for server-side operations
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // CHANGE 2: Use the new getAll/setAll pattern
        getAll() {
          // Returns all cookies at once - more efficient
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // Batch-set all cookies that Supabase needs to update
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  // Call the Supabase signUp function
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  // Handle potential errors, like a duplicate email
  if (error) {
    console.error('Supabase signup error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Handle the case where a user is created but needs to confirm their email
  // The session will be null in this case until they verify.
  if (data.user && !data.session) {
    return NextResponse.json({
        message: 'Registration successful. Please check your email to confirm your account.',
        user: data.user
    }, { status: 201 });
  }

  return NextResponse.json({ user: data.user, session: data.session }, { status: 201 });
}
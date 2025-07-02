import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // CORRECTED: Use the secret SERVICE_ROLE_KEY for all server-side operations
    process.env.SUPABASE_SERVICE_ROLE_KEY!, 
    {
      cookies: {
        async get(name: string) {
          return cookieStore.get(name)?.value;
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            await cookieStore.set({ name, value, ...options });
          } catch (error) {
            // This can be ignored if you have middleware refreshing user sessions
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            await cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // This can be ignored if you have middleware refreshing user sessions
          }
        },
      },
    }
  );
};
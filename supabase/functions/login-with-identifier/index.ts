import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Cache-Control': 'no-store',
};

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const genericError = () =>
  json({ error: 'Invalid login credentials or the account has not completed verification.' }, 401);

const getKey = (variable: string, legacyVariable: string) => {
  const value = Deno.env.get(variable);
  if (value) {
    try {
      const parsed = JSON.parse(value);
      return parsed.default as string;
    } catch {
      // Fall through to the legacy variable for older Supabase runtimes.
    }
  }
  return Deno.env.get(legacyVariable) ?? '';
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return genericError();

  try {
    const body = await request.json();
    const identifier = typeof body?.identifier === 'string' ? body.identifier.trim().toLowerCase() : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    if (!/^[a-z0-9_]{4,20}$/.test(identifier) || password.length < 8 || password.length > 72) {
      return genericError();
    }

    const url = Deno.env.get('SUPABASE_URL');
    const publishableKey = getKey('SUPABASE_PUBLISHABLE_KEYS', 'SUPABASE_ANON_KEY');
    const secretKey = getKey('SUPABASE_SECRET_KEYS', 'SUPABASE_SERVICE_ROLE_KEY');

    if (!url || !publishableKey || !secretKey) {
      return json({ error: 'Authentication service is temporarily unavailable.' }, 503);
    }

    const admin = createClient(url, secretKey, {
      auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    });

    const publicClient = createClient(url, publishableKey, {
      auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    });

    const { data: profile, error: profileError } = await admin
      .from('profiles')
      .select('id')
      .eq('username', identifier)
      .maybeSingle();

    if (profileError || !profile?.id) return genericError();

    const { data: userData, error: userError } = await admin.auth.admin.getUserById(profile.id);
    if (userError || !userData.user?.email) return genericError();

    const { data: authData, error: authError } = await publicClient.auth.signInWithPassword({
      email: userData.user.email,
      password,
    });

    if (authError || !authData.session) return genericError();

    return json({
      session: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
      },
    });
  } catch {
    return genericError();
  }
});

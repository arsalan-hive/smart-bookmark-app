
'use client';

import { supabase } from '../lib/supabaseClient';

export default function GoogleSignIn() {
  async function handleGoogleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // optional: where to redirect after sign in; must be in your Supabase "Redirect URLs" list
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/`
      }
    });

    if (error) {
      console.error('Sign in error:', error.message);
      alert('Sign in failed: ' + error.message);
    }
    // note: signInWithOAuth will redirect the browser to Google; no further client logic here
  }

  return (
    <button
      onClick={handleGoogleSignIn}
      className="px-4 py-2 rounded bg-slate-800 text-white"
    >
      Sign in with Google
    </button>
  );
}

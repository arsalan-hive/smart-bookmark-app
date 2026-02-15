
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AuthStatus() {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    // get current user
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));

    // listen to changes (sign in / sign out)
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription?.subscription?.unsubscribe?.();
  }, []);

  if (!user) return <div>Not signed in</div>;

  return (
    <div>
      <div>Signed in as {user.email}</div>
      <button onClick={() => supabase.auth.signOut()}>Sign out</button>
    </div>
  );
}
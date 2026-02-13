'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AddBookmark() {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const addBookmark = async () => {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      alert('Not logged in');
      return;
    }

    const { error } = await supabase.from('bookmarks').insert({
      title,
      url,
      user_id: userData.user.id
    });

    if (error) {
      alert(error.message);
    } else {
      setTitle('');
      setUrl('');
      alert('Bookmark added!');
    }
  };

  return (
    <div className="mt-6">
      <input
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="border p-2 block mb-2"
      />

      <input
        placeholder="URL"
        value={url}
        onChange={e => setUrl(e.target.value)}
        className="border p-2 block mb-2"
      />

      <button onClick={addBookmark} className="bg-black text-white px-4 py-2">
        Add Bookmark
      </button>
    </div>
  );
}

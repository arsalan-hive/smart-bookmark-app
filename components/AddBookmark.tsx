'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AddBookmark() {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const addBookmark = async () => {
  // Trim inputs
  const cleanTitle = title.trim();
  const cleanUrl = url.trim();

  // Basic validation
  if (!cleanTitle || !cleanUrl) {
    alert("Title and URL cannot be empty");
    return;
  }

  if (!cleanUrl.startsWith("http")) {
    alert("URL must start with http:// or https://");
    return;
  }

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    alert("Not logged in");
    return;
  }

  const { error } = await supabase.from("bookmarks").insert({
    title: cleanTitle,
    url: cleanUrl,
    user_id: userData.user.id,
  });

  if (error) {
    alert(error.message);
  } else {
    setTitle("");
    setUrl("");
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

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  useEffect(() => {
    fetchBookmarks();

    const channel = supabase
      .channel('bookmarks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
        },
        () => fetchBookmarks()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setBookmarks(data);
  };

  const deleteBookmark = async (id: string) => {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id);

    if (error) alert(error.message);
  };

  return (
    <div className="mt-6">
      <h2>Your Bookmarks</h2>

      {bookmarks.map(b => (
        <div key={b.id} className="border p-2 mb-2 flex justify-between">
          <div>
            <div>{b.title}</div>
            <a href={b.url} target="_blank">{b.url}</a>
          </div>

          <button
            onClick={() => deleteBookmark(b.id)}
            className="text-red-500"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function BookmarkList() {
  console.log("BookmarkList mounted");

  const [bookmarks, setBookmarks] = useState<any[]>([]);

  
    async function fetchBookmarks() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return;

    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setBookmarks(data || []);
  }

  useEffect(() => {
    let channel: any;

    const setup = async () => {
      await fetchBookmarks();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      channel = supabase
        .channel("bookmark-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookmarks",
          },
          () => fetchBookmarks()
        )
        .subscribe();
    };

    setup();
     // Listen for login / logout
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        // User logged out
        setBookmarks([]);
        if (channel) supabase.removeChannel(channel);
      } else {
        // User logged in
        fetchBookmarks();
      }
    });
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
  };

  return (
    <div className="mt-6">
      <h2>Your Bookmarks</h2>

      {bookmarks.length === 0 && <p>No bookmarks found</p>}

      {bookmarks.map((b) => (
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

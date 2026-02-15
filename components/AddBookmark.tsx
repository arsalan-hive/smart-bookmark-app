'use client';

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AddBookmark() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const addBookmark = async () => {
  setErrorMsg("");

  let cleanTitle = title.trim();
  let cleanUrl = url.trim();

  if (!cleanTitle || !cleanUrl) {
    setErrorMsg("Title and URL are required");
    return;
  }

  // Auto add https if missing
  if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
    cleanUrl = "https://" + cleanUrl;
  }

  // Final URL validation
  try {
    new URL(cleanUrl);
  } catch {
    setErrorMsg("Invalid URL format");
    return;
  }

  setLoading(true);

  try {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) throw new Error("Not logged in");

    const { error } = await supabase.from("bookmarks").insert({
      title: cleanTitle,
      url: cleanUrl,
      user_id: userData.user.id,
    });

    if (error) throw error;

    setTitle("");
    setUrl("");
  } catch (err: any) {
    console.error(err);
    setErrorMsg(err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="mt-6">
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 block mb-2"
      />

      <input
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="border p-2 block mb-2"
      />

      {errorMsg && <p className="text-red-500">{errorMsg}</p>}

      <button
        disabled={loading}
        onClick={addBookmark}
        className="bg-black text-white px-4 py-2 mt-2 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Add Bookmark"}
      </button>
    </div>
  );
}
'use client';

// import { useState } from 'react';
// import { supabase } from '@/lib/supabaseClient';

// export default function AddBookmark() {
//   const [title, setTitle] = useState('');
//   const [url, setUrl] = useState('');

//   const addBookmark = async () => {
//   // Trim inputs
//   const cleanTitle = title.trim();
//   const cleanUrl = url.trim();

//   // Basic validation
//   if (!cleanTitle || !cleanUrl) {
//     alert("Title and URL cannot be empty");
//     return;
//   }

//   if (!cleanUrl.startsWith("http")) {
//     alert("URL must start with http:// or https://");
//     return;
//   }

//   const { data: userData } = await supabase.auth.getUser();

//   if (!userData.user) {
//     alert("Not logged in");
//     return;
//   }

//   const { error } = await supabase.from("bookmarks").insert({
//     title: cleanTitle,
//     url: cleanUrl,
//     user_id: userData.user.id,
//   });

//   if (error) {
//     alert(error.message);
//   } else {
//     setTitle("");
//     setUrl("");
//   }
// };


//   return (
//     <div className="mt-6">
//       <input
//         placeholder="Title"
//         value={title}
//         onChange={e => setTitle(e.target.value)}
//         className="border p-2 block mb-2"
//       />

//       <input
//         placeholder="URL"
//         value={url}
//         onChange={e => setUrl(e.target.value)}
//         className="border p-2 block mb-2"
//       />

//       <button onClick={addBookmark} className="bg-black text-white px-4 py-2">
//         Add Bookmark
//       </button>
//     </div>
//   );
// }

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AddBookmark() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const addBookmark = async () => {
    setErrorMsg("");

    const cleanTitle = title.trim();
    const cleanUrl = url.trim();

    if (!cleanTitle || !cleanUrl) {
      setErrorMsg("Title and URL required");
      return;
    }

    try {
      const parsed = new URL(cleanUrl);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        setErrorMsg("Invalid URL");
        return;
      }
    } catch {
      setErrorMsg("Invalid URL");
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

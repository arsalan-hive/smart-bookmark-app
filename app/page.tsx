
import GoogleSignIn from '@/components/GoogleSignIn';
import AuthStatus from '@/components/AuthStatus';
import AddBookmark from '@/components/AddBookmark';
import BookmarkList from '@/components/BookmarkList';


export default function Home() {
  return (
    <main className="p-6">
      <h1>Smart Bookmark</h1>

      <GoogleSignIn />
      <AuthStatus />

      <AddBookmark />
      <BookmarkList />

    </main>
  );
}


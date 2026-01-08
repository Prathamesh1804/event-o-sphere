import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📅</span>
          <h1 className="text-xl font-bold">Event-o-Sphere</h1>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm text-gray-600 hidden md:block">
              {user.email}
            </span>
          )}

          {user ? (
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800"
            >
              Logout
            </button>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

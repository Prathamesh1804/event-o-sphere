import { auth } from "../firebase/firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function Login() {
  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100">
      <div className="bg-white p-10 rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">Event-o-Sphere</h1>
        <p className="text-gray-600 mb-6">
          Your campus event hub
        </p>

        <button
          onClick={login}
          className="px-6 py-3 rounded-lg bg-black text-white hover:bg-gray-800"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Events from "./pages/Events";
import AdminPanel from "./pages/Admin"; // Correct path based on your folder image
import { useAuth } from "./context/AuthContext";
import { initGoogleCalendar } from "./services/googleCalendar"; 

const ADMIN_EMAIL = "prathameshjawale1804@gmail.com";

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const [calendarLoading, setCalendarLoading] = useState(true);

  useEffect(() => {
    const setup = async () => {
      try {
        await initGoogleCalendar();
      } catch (err) {
        console.error("Calendar Setup Failed:", err);
      } finally {
        setCalendarLoading(false);
      }
    };
    setup();
  }, []);


  if (authLoading || calendarLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="font-black uppercase tracking-[0.3em] text-gray-400 text-xs animate-pulse">
          Initializing Sphere...
        </div>
        <span className="mt-4 text-[10px] text-gray-300 font-medium uppercase tracking-widest">
           Connecting Services
        </span>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Events /> : <Login />} />
        <Route 
          path="/admin" 
          element={
            user && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? (
              <AdminPanel />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
import { useEffect, useState, useMemo } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";
import EventCard from "../components/EventCard";
import CategoryFilter from "../components/CategoryFilter";
import { initGoogleCalendar, addEventToCalendar } from "../services/googleCalendar";

export default function Events() {
  const { logout } = useAuth();
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("date", "asc"));
    getDocs(q).then(snapshot => {
      setEvents(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "All" || e.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [events, search, activeCategory]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* RESPONSIVE HEADER: Text sizes change based on screen width */}
      <header className="max-w-7xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-12 md:pb-16 flex flex-col md:flex-row justify-between items-start gap-8">
        <div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase mb-4 md:mb-6">
            Campus <br /> <span className="text-indigo-600">Sphere.</span>
          </h1>
          <p className="max-w-md text-gray-400 font-medium text-base md:text-lg italic">
            Your centralized hub for university life. Discover, plan, and sync your schedule.
          </p>
        </div>
        <button onClick={logout} className="font-bold text-[10px] tracking-widest uppercase text-gray-400 hover:text-indigo-600 transition-colors border border-gray-100 px-4 py-2 rounded-full">
          [ Logout ]
        </button>
      </header>

      {/* RESPONSIVE FILTER BAR: Becomes a column on mobile, row on desktop */}
      <section className="sticky top-4 md:top-6 z-50 max-w-7xl mx-auto px-6 md:px-10 mb-12 md:mb-20">
        <div className="bg-white/90 backdrop-blur-2xl border border-gray-100 p-2 md:p-3 rounded-2xl md:rounded-[3rem] shadow-xl flex flex-col md:flex-row items-center gap-2">
          <div className="flex items-center w-full px-4 md:px-6">
            <span className="text-lg mr-3 opacity-30">🔍</span>
            <input
              className="w-full bg-transparent py-3 md:py-4 outline-none font-bold text-lg md:text-xl placeholder:text-gray-200"
              placeholder="Filter events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="hidden md:block h-10 w-[1px] bg-gray-100 mx-2"></div>
          <div className="w-full md:w-auto px-2 pb-2 md:pb-0">
            <CategoryFilter active={activeCategory} setActive={setActiveCategory} />
          </div>
        </div>
      </section>

      {/* RESPONSIVE GRID: 1 column on Mobile, 2 on Tablet, 3 on Desktop */}
      <main className="max-w-7xl mx-auto px-6 md:px-10 pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {filteredEvents.map(e => (
            <EventCard 
              key={e.id} 
              event={e} 
              onAdd={() => {
                initGoogleCalendar();
                addEventToCalendar({
                  title: e.title,
                  venue: e.venue,
                  category: e.category,
                  startDate: e.date.toDate(),
                });
              }}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
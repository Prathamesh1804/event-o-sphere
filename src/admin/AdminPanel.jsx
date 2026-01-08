import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";

export default function AdminPanel() {
  const { user } = useAuth();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [category, setCategory] = useState("Technical");
  const [date, setDate] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const snapshot = await getDocs(collection(db, "events"));
    setEvents(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  const formatDate = (timestamp) =>
    timestamp?.toDate().toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  const openAddForm = () => {
    setEditingEvent(null);
    setTitle("");
    setVenue("");
    setCategory("Technical");
    setDate("");
    setShowForm(true);
  };

  const openEditForm = (event) => {
    setEditingEvent(event);
    setTitle(event.title);
    setVenue(event.venue);
    setCategory(event.category);
    setDate(event.date.toDate().toISOString().slice(0, 16));
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      venue,
      category,
      date: Timestamp.fromDate(new Date(date)),
    };

    if (editingEvent) {
      await updateDoc(doc(db, "events", editingEvent.id), payload);
      alert("✅ Event updated");
    } else {
      await addDoc(collection(db, "events"), {
        ...payload,
        createdAt: Timestamp.now(),
      });
      alert("✅ Event added");
    }

    setShowForm(false);
    setEditingEvent(null);
    fetchEvents();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    await deleteDoc(doc(db, "events", id));
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-indigo-400">Admin Panel</h1>
          <p className="text-sm text-gray-400">Logged in as {user?.email}</p>
        </div>

        <button
          onClick={openAddForm}
          className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition"
        >
          ➕ Add Event
        </button>
      </div>

      {/* EVENTS */}
      {loading ? (
        <p>Loading events...</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map(event => (
            <div
              key={event.id}
              className="bg-gray-900 rounded-2xl p-5 shadow hover:shadow-xl transition"
            >
              <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300">
                {event.category}
              </span>

              <h3 className="text-xl font-semibold mt-3">{event.title}</h3>

              <p className="text-gray-400 mt-2">📅 {formatDate(event.date)}</p>
              <p className="text-gray-400">📍 {event.venue}</p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => openEditForm(event)}
                  className="flex-1 py-2 rounded-lg bg-yellow-500 text-black hover:bg-yellow-600"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 w-full max-w-lg rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingEvent ? "Edit Event" : "Add New Event"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <input
                className="w-full p-3 rounded-lg bg-gray-800 outline-none"
                placeholder="Event Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <input
                className="w-full p-3 rounded-lg bg-gray-800 outline-none"
                placeholder="Venue"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                required
              />

              <select
                className="w-full p-3 rounded-lg bg-gray-800 outline-none"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Technical</option>
                <option>Cultural</option>
                <option>Sports</option>
                <option>Seminar</option>
              </select>

              <input
                type="datetime-local"
                className="w-full p-3 rounded-lg bg-gray-800 outline-none"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700"
                >
                  💾 Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

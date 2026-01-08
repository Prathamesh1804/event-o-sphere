import { useEffect, useState } from "react";
import { CalendarDays, PlusCircle, ListChecks } from "lucide-react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { addEventToCalendar } from "../services/googleCalendar";

function Admin() {
  /* ---------------- STATE ---------------- */
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [category, setCategory] = useState("Technical");
  const [date, setDate] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH EVENTS ---------------- */
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const snapshot = await getDocs(collection(db, "events"));
    setEvents(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  /* ---------------- ADD / UPDATE EVENT ---------------- */
  const handleAddEvent = async () => {
    if (!title || !venue || !date) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const eventDate = new Date(date);

      const payload = {
        title,
        venue,
        category,
        date: Timestamp.fromDate(eventDate),
        createdAt: Timestamp.now(),
      };

      // 🔹 Firestore save
      if (editingId) {
        await updateDoc(doc(db, "events", editingId), payload);
      } else {
        await addDoc(collection(db, "events"), payload);
      }

      // 🔹 Auto Google Calendar sync
      await addEventToCalendar({
        title,
        venue,
        category,
        startDate: eventDate,
      });

      // Reset form
      setTitle("");
      setVenue("");
      setCategory("Technical");
      setDate("");
      setEditingId(null);

      fetchEvents();
      alert("✅ Event saved & synced to Google Calendar");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add event");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- EDIT EVENT ---------------- */
  const handleEdit = (event) => {
    setEditingId(event.id);
    setTitle(event.title);
    setVenue(event.venue);
    setCategory(event.category);
    setDate(event.date.toDate().toISOString().slice(0, 16));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ---------------- DELETE EVENT ---------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    await deleteDoc(doc(db, "events", id));
    fetchEvents();
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Create, edit and sync events
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
          <CalendarDays className="text-blue-600" />
          <div>
            <p className="text-sm text-gray-500">Total Events</p>
            <h2 className="text-xl font-bold">{events.length}</h2>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
          <PlusCircle className="text-green-600" />
          <p className="font-semibold">Firestore Connected</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
          <ListChecks className="text-purple-600" />
          <p className="font-semibold">Calendar Auto-Sync</p>
        </div>
      </div>

      {/* Create / Edit Form */}
      <div className="bg-white rounded-xl shadow p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Event" : "Add New Event"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event Title"
            className="border rounded-lg p-3"
          />

          <input
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            placeholder="Venue"
            className="border rounded-lg p-3"
          />

          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded-lg p-3"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-lg p-3"
          >
            <option>Technical</option>
            <option>Cultural</option>
            <option>Sports</option>
            <option>Workshop</option>
          </select>

          <button
            onClick={handleAddEvent}
            disabled={loading}
            className="md:col-span-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            {loading
              ? "Saving..."
              : editingId
              ? "Update Event"
              : "Add Event"}
          </button>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Manage Events</h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Title</th>
                <th className="p-3">Date</th>
                <th className="p-3">Venue</th>
                <th className="p-3">Category</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-t">
                  <td className="p-3">{event.title}</td>
                  <td className="p-3">
                    {event.date.toDate().toLocaleString()}
                  </td>
                  <td className="p-3">{event.venue}</td>
                  <td className="p-3">{event.category}</td>
                  <td className="p-3 space-x-3">
                    <button
                      onClick={() => handleEdit(event)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No events found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Admin;

const categories = [
  "All",
  "Technical",
  "Cultural",
  "Sports",
  "Workshop",
  "Academic",
];

export default function CategoryFilter({ active, setActive }) {
  return (
    <div className="flex flex-wrap gap-2 my-6">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setActive(cat)}
          className={`px-4 py-1 rounded-full text-sm transition
            ${active === cat
              ? "bg-black text-white"
              : "bg-gray-100 hover:bg-gray-200"}
          `}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

import { useState } from "react";
import { Search, MapPin, Star, Filter, List, Map, Phone, Calendar, CheckCircle, X } from "lucide-react";

const filterChips = [
  { label: "Budget: ₹-₹₹₹", active: false },
  { label: "Corporate", active: true },
  { label: "Civil", active: false },
  { label: "Family", active: false },
  { label: "< 5 km", active: true },
];

const lawyers = [
  {
    id: 1,
    name: "Adv. Anjali Desai",
    specialty: "Corporate Law",
    rating: 4.8,
    reviews: 124,
    distance: "2.3 km",
    fee: "₹1,500/hr",
    location: "Koramangala, Bengaluru",
    experience: "12 yrs exp.",
    available: true,
    verified: true,
    img: "https://images.unsplash.com/photo-1659355894391-a86ee16e10c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    tags: ["NDA", "Incorporation", "IP"],
  },
  {
    id: 2,
    name: "Adv. Rohan Mehta",
    specialty: "Civil & Property Law",
    rating: 4.6,
    reviews: 89,
    distance: "4.1 km",
    fee: "₹1,200/hr",
    location: "Indiranagar, Bengaluru",
    experience: "8 yrs exp.",
    available: false,
    verified: true,
    img: "https://images.unsplash.com/photo-1616851273103-5f0ec44e546f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    tags: ["Property", "Disputes", "Contracts"],
  },
];

const mapDots = [
  { id: 1, x: 35, y: 45, name: "Adv. Anjali", fee: "₹1,500" },
  { id: 2, x: 62, y: 30, name: "Adv. Rohan", fee: "₹1,200" },
  { id: 3, x: 75, y: 62, name: "Adv. Sharma", fee: "₹2,000" },
  { id: 4, x: 20, y: 68, name: "Adv. Patel", fee: "₹800" },
];

export function FindLawyerScreen() {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [activeChips, setActiveChips] = useState<string[]>(["Corporate", "< 5 km"]);
  const [bookingId, setBookingId] = useState<number | null>(null);

  const toggleChip = (label: string) => {
    setActiveChips((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label]
    );
  };

  return (
    <div className="h-full overflow-y-auto" style={{ backgroundColor: "#F5F7FB" }}>
      {/* Header */}
      <div
        className="px-5 pt-4 pb-5"
        style={{
          background: "linear-gradient(135deg, #0F2248 0%, #1B3A6B 100%)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/60 text-xs">Connect with</p>
            <h1 className="text-white text-lg" style={{ fontWeight: 700 }}>
              Legal Experts ⚖️
            </h1>
          </div>
          <div
            className="bg-white/10 rounded-full px-3 py-1.5 flex items-center gap-1.5"
          >
            <Filter size={12} className="text-white/80" />
            <span className="text-white text-xs" style={{ fontWeight: 600 }}>
              Filters
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "#9CA3AF" }}
          />
          <input
            type="text"
            placeholder="Search by name or specialty..."
            className="w-full bg-white rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none"
            style={{ color: "#374151" }}
          />
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {filterChips.map(({ label }) => {
            const isActive = activeChips.includes(label);
            return (
              <button
                key={label}
                onClick={() => toggleChip(label)}
                className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] transition-all"
                style={{
                  backgroundColor: isActive ? "#D4AF37" : "rgba(255,255,255,0.12)",
                  color: isActive ? "#1B3A6B" : "rgba(255,255,255,0.9)",
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                {isActive && <X size={9} />}
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* View Toggle */}
      <div className="px-4 mt-4 mb-3">
        <div
          className="flex p-1 rounded-xl"
          style={{ backgroundColor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
        >
          <button
            onClick={() => setViewMode("list")}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs transition-all"
            style={{
              backgroundColor: viewMode === "list" ? "#1B3A6B" : "transparent",
              color: viewMode === "list" ? "white" : "#9CA3AF",
              fontWeight: 600,
            }}
          >
            <List size={13} />
            List View
          </button>
          <button
            onClick={() => setViewMode("map")}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs transition-all"
            style={{
              backgroundColor: viewMode === "map" ? "#1B3A6B" : "transparent",
              color: viewMode === "map" ? "white" : "#9CA3AF",
              fontWeight: 600,
            }}
          >
            <Map size={13} />
            Map View
          </button>
        </div>
      </div>

      {viewMode === "list" ? (
        /* Lawyer Cards */
        <div className="px-4 pb-4 flex flex-col gap-3">
          <p className="text-xs" style={{ color: "#9CA3AF" }}>
            <span style={{ color: "#1B3A6B", fontWeight: 700 }}>{lawyers.length} lawyers</span> found near you
          </p>
          {lawyers.map((lawyer) => (
            <div
              key={lawyer.id}
              className="bg-white rounded-2xl overflow-hidden"
              style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}
            >
              {/* Top Section */}
              <div className="p-4">
                <div className="flex gap-3">
                  {/* Photo */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={lawyer.img}
                      alt={lawyer.name}
                      className="w-16 h-16 rounded-2xl object-cover"
                    />
                    {lawyer.verified && (
                      <div
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "#10B981" }}
                      >
                        <CheckCircle size={11} className="text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3
                          className="text-sm"
                          style={{ color: "#1F2937", fontWeight: 700 }}
                        >
                          {lawyer.name}
                        </h3>
                        <p
                          className="text-[11px]"
                          style={{ color: "#1B3A6B", fontWeight: 600 }}
                        >
                          {lawyer.specialty}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-0.5">
                          <Star
                            size={11}
                            style={{ color: "#D4AF37", fill: "#D4AF37" }}
                          />
                          <span
                            className="text-xs"
                            style={{ color: "#1F2937", fontWeight: 700 }}
                          >
                            {lawyer.rating}
                          </span>
                        </div>
                        <span
                          className="text-[10px]"
                          style={{ color: "#9CA3AF" }}
                        >
                          ({lawyer.reviews})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex items-center gap-0.5">
                        <MapPin size={10} style={{ color: "#9CA3AF" }} />
                        <span className="text-[10px]" style={{ color: "#9CA3AF" }}>
                          {lawyer.distance} · {lawyer.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details Row */}
                <div className="flex items-center gap-2 mt-3">
                  <div
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl"
                    style={{ backgroundColor: "rgba(27,58,107,0.06)" }}
                  >
                    <span className="text-[11px]" style={{ color: "#1B3A6B", fontWeight: 600 }}>
                      💼 {lawyer.experience}
                    </span>
                  </div>
                  <div
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl"
                    style={{ backgroundColor: "rgba(212,175,55,0.1)" }}
                  >
                    <span className="text-[11px]" style={{ color: "#B8940A", fontWeight: 700 }}>
                      {lawyer.fee}
                    </span>
                  </div>
                  <div
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl"
                    style={{
                      backgroundColor: lawyer.available
                        ? "rgba(16,185,129,0.1)"
                        : "rgba(239,68,68,0.08)",
                    }}
                  >
                    <span
                      className="text-[11px]"
                      style={{
                        color: lawyer.available ? "#10B981" : "#EF4444",
                        fontWeight: 600,
                      }}
                    >
                      {lawyer.available ? "✓ Available" : "⏳ Busy"}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex gap-1.5 mt-2.5">
                  {lawyer.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: "rgba(27,58,107,0.06)",
                        color: "#1B3A6B",
                        fontWeight: 600,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div
                className="flex gap-2 px-4 pb-4"
              >
                <button
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all active:scale-95"
                  style={{
                    backgroundColor: "rgba(27,58,107,0.08)",
                  }}
                >
                  <Phone size={15} style={{ color: "#1B3A6B" }} />
                </button>
                <button
                  onClick={() => setBookingId(bookingId === lawyer.id ? null : lawyer.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs transition-all active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #1B3A6B 0%, #0F2248 100%)",
                    color: "white",
                    fontWeight: 700,
                  }}
                >
                  <Calendar size={13} />
                  {bookingId === lawyer.id ? "✓ Requested!" : "Book Consult"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Map View */
        <div className="px-4 pb-4">
          <div
            className="rounded-2xl overflow-hidden relative"
            style={{
              height: 340,
              backgroundColor: "#E8EEF4",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            {/* Fake Map Grid */}
            <svg width="100%" height="100%" className="absolute inset-0">
              {/* Road grid */}
              <line x1="0" y1="33%" x2="100%" y2="33%" stroke="#CBD5E1" strokeWidth="2" />
              <line x1="0" y1="66%" x2="100%" y2="66%" stroke="#CBD5E1" strokeWidth="2" />
              <line x1="33%" y1="0" x2="33%" y2="100%" stroke="#CBD5E1" strokeWidth="2" />
              <line x1="66%" y1="0" x2="66%" y2="100%" stroke="#CBD5E1" strokeWidth="2" />
              {/* Main roads */}
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#B0BEC5" strokeWidth="4" />
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#B0BEC5" strokeWidth="4" />
              {/* Blocks */}
              <rect x="5%" y="5%" width="25%" height="20%" rx="4" fill="#D1E0EE" opacity="0.5" />
              <rect x="38%" y="5%" width="22%" height="15%" rx="4" fill="#D1E0EE" opacity="0.5" />
              <rect x="68%" y="5%" width="27%" height="22%" rx="4" fill="#D1E0EE" opacity="0.5" />
              <rect x="5%" y="35%" width="20%" height="25%" rx="4" fill="#D1E0EE" opacity="0.5" />
              <rect x="68%" y="35%" width="27%" height="25%" rx="4" fill="#D1E0EE" opacity="0.5" />
              <rect x="5%" y="72%" width="25%" height="22%" rx="4" fill="#D1E0EE" opacity="0.5" />
              <rect x="38%" y="72%" width="55%" height="22%" rx="4" fill="#D1E0EE" opacity="0.5" />
            </svg>

            {/* User Location */}
            <div
              className="absolute flex flex-col items-center"
              style={{ left: "48%", top: "47%", transform: "translate(-50%,-50%)" }}
            >
              <div
                className="w-4 h-4 rounded-full border-2 border-white"
                style={{ backgroundColor: "#3B82F6" }}
              />
              <div
                className="w-8 h-8 rounded-full absolute opacity-20"
                style={{ backgroundColor: "#3B82F6" }}
              />
            </div>

            {/* Lawyer Pins */}
            {mapDots.map((dot) => (
              <div
                key={dot.id}
                className="absolute flex flex-col items-center cursor-pointer"
                style={{
                  left: `${dot.x}%`,
                  top: `${dot.y}%`,
                  transform: "translate(-50%,-100%)",
                }}
              >
                <div
                  className="rounded-xl px-2 py-1 shadow-lg mb-0.5 text-[9px] whitespace-nowrap"
                  style={{
                    backgroundColor: "#1B3A6B",
                    color: "white",
                    fontWeight: 700,
                  }}
                >
                  {dot.fee}
                </div>
                <div
                  className="w-3 h-3 rounded-full border-2 border-white"
                  style={{ backgroundColor: "#D4AF37" }}
                />
              </div>
            ))}

            {/* Map Label */}
            <div
              className="absolute bottom-3 right-3 bg-white rounded-lg px-2 py-1"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}
            >
              <p className="text-[9px]" style={{ color: "#9CA3AF" }}>
                📍 Bengaluru, Karnataka
              </p>
            </div>
          </div>

          {/* Mini Cards below map */}
          <div className="mt-3 flex gap-2">
            {lawyers.map((l) => (
              <div
                key={l.id}
                className="flex-1 bg-white rounded-xl p-3"
                style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={l.img}
                    alt={l.name}
                    className="w-8 h-8 rounded-xl object-cover"
                  />
                  <div>
                    <p className="text-[10px]" style={{ color: "#1F2937", fontWeight: 700 }}>
                      {l.name.split(" ")[1]}
                    </p>
                    <div className="flex items-center gap-0.5">
                      <Star size={8} style={{ color: "#D4AF37", fill: "#D4AF37" }} />
                      <span className="text-[9px]" style={{ color: "#6B7280" }}>{l.rating}</span>
                    </div>
                  </div>
                </div>
                <button
                  className="w-full py-1.5 rounded-lg text-[9px]"
                  style={{
                    background: "linear-gradient(135deg, #1B3A6B 0%, #0F2248 100%)",
                    color: "white",
                    fontWeight: 700,
                  }}
                >
                  Book
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { Search, BookOpen, Shield, Users, Briefcase, TrendingUp, Clock, Star, ChevronRight } from "lucide-react";

const categories = [
  { label: "Startups", icon: TrendingUp, color: "#7C3AED" },
  { label: "Tenant Rights", icon: Shield, color: "#1B3A6B" },
  { label: "Freelance Contracts", icon: Users, color: "#D4AF37" },
  { label: "Consumer Court", icon: Briefcase, color: "#10B981" },
  { label: "Family Law", icon: Users, color: "#EF4444" },
  { label: "Criminal Law", icon: BookOpen, color: "#F59E0B" },
];

const guides = [
  {
    id: 1,
    icon: "📜",
    iconBg: "rgba(27,58,107,0.08)",
    title: "Understanding NDAs",
    titleHindi: "NDAs को समझना",
    bilingual: false,
    category: "Freelance Contracts",
    time: "8 min read",
    progress: 65,
    rating: 4.8,
    description: "Learn what Non-Disclosure Agreements mean for you and how to spot unfair clauses.",
  },
  {
    id: 2,
    icon: "🏠",
    iconBg: "rgba(16,185,129,0.1)",
    title: "Tenant Rights in India",
    titleHindi: "भारत में किरायेदार के अधिकार",
    bilingual: true,
    category: "Tenant Rights",
    time: "12 min read",
    progress: 30,
    rating: 4.9,
    description: "Know your rights under the Rent Control Act and model tenancy laws.",
  },
  {
    id: 3,
    icon: "🚀",
    iconBg: "rgba(124,58,237,0.1)",
    title: "Startup Legal Checklist",
    titleHindi: null,
    bilingual: false,
    category: "Startups",
    time: "15 min read",
    progress: 0,
    rating: 4.7,
    description: "Essential legal steps to register, protect IP, and incorporate your startup.",
  },
  {
    id: 4,
    icon: "⚖️",
    iconBg: "rgba(212,175,55,0.1)",
    title: "Filing a Consumer Complaint",
    titleHindi: null,
    bilingual: false,
    category: "Consumer Court",
    time: "6 min read",
    progress: 100,
    rating: 4.6,
    description: "Step-by-step guide to filing at the District Consumer Forum.",
  },
];

export function LearnScreen() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGuides = guides.filter((g) => {
    const matchesCategory =
      activeCategory === "All" || g.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      g.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
            <p className="text-white/60 text-xs">Expand your</p>
            <h1 className="text-white text-lg" style={{ fontWeight: 700 }}>
              Legal Knowledge 📚
            </h1>
          </div>
          <div
            className="bg-white/10 rounded-full px-3 py-1.5 flex items-center gap-1.5"
          >
            <Star size={12} style={{ color: "#D4AF37" }} />
            <span className="text-white text-xs" style={{ fontWeight: 600 }}>
              12 guides
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "#9CA3AF" }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search legal guides..."
            className="w-full bg-white rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none"
            style={{ color: "#374151" }}
          />
        </div>
      </div>

      {/* Category Chips */}
      <div className="pt-4 pb-2">
        <div className="flex gap-2 overflow-x-auto px-4 pb-1" style={{ scrollbarWidth: "none" }}>
          {["All", ...categories.map((c) => c.label)].map((cat) => {
            const isActive = activeCategory === cat;
            const catData = categories.find((c) => c.label === cat);
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs transition-all"
                style={{
                  backgroundColor: isActive
                    ? catData?.color || "#1B3A6B"
                    : "white",
                  color: isActive ? "white" : "#6B7280",
                  fontWeight: isActive ? 700 : 500,
                  boxShadow: isActive
                    ? "none"
                    : "0 1px 4px rgba(0,0,0,0.08)",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Guide Cards */}
      <div className="px-4 pb-4 flex flex-col gap-3 mt-1">
        {filteredGuides.map((guide) => (
          <div
            key={guide.id}
            className="bg-white rounded-2xl p-4 transition-all active:scale-98"
            style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ backgroundColor: guide.iconBg }}
              >
                {guide.icon}
              </div>

              <div className="flex-1 min-w-0">
                {/* Title */}
                <div className="mb-0.5">
                  <h3
                    className="text-xs leading-tight"
                    style={{ color: "#1F2937", fontWeight: 700 }}
                  >
                    {guide.title}
                  </h3>
                  {guide.bilingual && guide.titleHindi && (
                    <p
                      className="text-[10px] mt-0.5"
                      style={{ color: "#D4AF37", fontWeight: 600 }}
                    >
                      {guide.titleHindi}
                    </p>
                  )}
                </div>

                <p
                  className="text-[10px] leading-relaxed mb-2"
                  style={{ color: "#9CA3AF" }}
                >
                  {guide.description}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Clock size={10} style={{ color: "#9CA3AF" }} />
                      <span
                        className="text-[10px]"
                        style={{ color: "#9CA3AF" }}
                      >
                        {guide.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <Star size={10} style={{ color: "#D4AF37" }} />
                      <span
                        className="text-[10px]"
                        style={{ color: "#6B7280", fontWeight: 600 }}
                      >
                        {guide.rating}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={14} style={{ color: "#D4AF37" }} />
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-2">
                  <div
                    className="flex-1 h-1.5 rounded-full overflow-hidden"
                    style={{ backgroundColor: "#F3F4F6" }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${guide.progress}%`,
                        backgroundColor:
                          guide.progress === 100
                            ? "#10B981"
                            : guide.progress > 0
                            ? "#1B3A6B"
                            : "#E5E7EB",
                      }}
                    />
                  </div>
                  <span
                    className="text-[10px] flex-shrink-0"
                    style={{
                      color:
                        guide.progress === 100
                          ? "#10B981"
                          : guide.progress > 0
                          ? "#1B3A6B"
                          : "#9CA3AF",
                      fontWeight: 600,
                    }}
                  >
                    {guide.progress === 100
                      ? "✓ Done"
                      : guide.progress > 0
                      ? `${guide.progress}%`
                      : "New"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

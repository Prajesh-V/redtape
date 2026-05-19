import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ScanText,
  Scale,
  BookOpen,
  Clock,
  ChevronDown,
  Bell,
  FileText,
  CheckCircle,
  Lightbulb,
  ArrowRight,
} from "lucide-react";

const languages = ["English", "हिंदी", "ಕನ್ನಡ", "தமிழ்", "తెలుగు"];

const quickActions = [
  {
    label: "Scan Document",
    icon: ScanText,
    path: "/ai-scanner",
    color: "#1B3A6B",
    bg: "rgba(27,58,107,0.08)",
  },
  {
    label: "Find a Lawyer",
    icon: Scale,
    path: "/find-lawyer",
    color: "#D4AF37",
    bg: "rgba(212,175,55,0.1)",
  },
  {
    label: "Know Your Rights",
    icon: BookOpen,
    path: "/learn",
    color: "#10B981",
    bg: "rgba(16,185,129,0.1)",
  },
  {
    label: "Recent Summaries",
    icon: Clock,
    path: "/ai-scanner",
    color: "#7C3AED",
    bg: "rgba(124,58,237,0.1)",
  },
];

const recentActivity = [
  {
    id: 1,
    name: "Rental Agreement.pdf",
    date: "Today, 2:45 PM",
    status: "Summarized",
    pages: 8,
  },
  {
    id: 2,
    name: "Employment Contract.pdf",
    date: "Yesterday, 11:20 AM",
    status: "Analyzed",
    pages: 12,
  },
];

export function HomeScreen() {
  const navigate = useNavigate();
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");

  return (
    <div
      className="h-full overflow-y-auto"
      style={{ backgroundColor: "#F5F7FB" }}
    >
      {/* Header */}
      <div
        className="px-5 pt-4 pb-5"
        style={{
          background: "linear-gradient(135deg, #0F2248 0%, #1B3A6B 100%)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5"
            >
              <span
                className="text-white text-xs"
                style={{ fontWeight: 600 }}
              >
                🌐 {selectedLang}
              </span>
              <ChevronDown size={12} className="text-white/80" />
            </button>
            {langOpen && (
              <div
                className="absolute top-9 left-0 bg-white rounded-xl shadow-xl overflow-hidden z-50"
                style={{ minWidth: 130 }}
              >
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setSelectedLang(lang);
                      setLangOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 transition-colors"
                    style={{
                      color: lang === selectedLang ? "#1B3A6B" : "#374151",
                      fontWeight: lang === selectedLang ? 700 : 400,
                    }}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Notification */}
            <div className="relative">
              <Bell size={20} className="text-white/80" />
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-400" />
            </div>
            {/* Avatar */}
            <img
              src="https://images.unsplash.com/photo-1669829528850-959d7b08278b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100"
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover border-2"
              style={{ borderColor: "#D4AF37" }}
            />
          </div>
        </div>

        <p className="text-white/70 text-xs mb-0.5">Good morning,</p>
        <h1
          className="text-white text-lg mb-1"
          style={{ fontWeight: 700 }}
        >
          Priya Sharma 👋
        </h1>
        <p className="text-white/60 text-xs">
          2 documents pending review
        </p>
      </div>

      {/* Daily Legal Tip Card */}
      <div className="px-4 -mt-3">
        <div
          className="rounded-2xl p-4 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #D4AF37 0%, #B8940A 100%)",
          }}
        >
          <div
            className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20"
            style={{ backgroundColor: "white" }}
          />
          <div
            className="absolute -right-2 top-8 w-12 h-12 rounded-full opacity-10"
            style={{ backgroundColor: "white" }}
          />
          <div className="flex items-start gap-3">
            <div className="bg-white/20 rounded-xl p-2 flex-shrink-0">
              <Lightbulb size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="bg-white/20 text-white text-[9px] px-2 py-0.5 rounded-full"
                  style={{ fontWeight: 700, letterSpacing: "0.05em" }}
                >
                  DAILY LEGAL TIP
                </span>
              </div>
              <p className="text-white text-xs mb-1" style={{ fontWeight: 700 }}>
                Consumer Protection Right 🛡️
              </p>
              <p className="text-white/90 text-[11px] leading-relaxed">
                As a consumer, you have the right to seek redressal against
                unfair trade practices. File a complaint at your District
                Consumer Forum for free if purchase value is under ₹1 Lakh.
              </p>
              <button className="mt-2 flex items-center gap-1 text-white text-[11px]" style={{ fontWeight: 600 }}>
                Learn more <ArrowRight size={11} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-5">
        <h2
          className="text-sm mb-3"
          style={{ color: "#1B3A6B", fontWeight: 700 }}
        >
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map(({ label, icon: Icon, path, color, bg }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="flex flex-col items-start gap-3 p-4 rounded-2xl transition-all active:scale-95"
              style={{ backgroundColor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: bg }}
              >
                <Icon size={20} style={{ color }} />
              </div>
              <span
                className="text-xs text-left leading-tight"
                style={{ color: "#1F2937", fontWeight: 600 }}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-4 mt-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm" style={{ color: "#1B3A6B", fontWeight: 700 }}>
            Recent Activity
          </h2>
          <button className="text-[11px]" style={{ color: "#D4AF37", fontWeight: 600 }}>
            View All
          </button>
        </div>
        <div className="flex flex-col gap-2.5">
          {recentActivity.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3.5 rounded-2xl"
              style={{
                backgroundColor: "white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(27,58,107,0.08)" }}
              >
                <FileText size={18} style={{ color: "#1B3A6B" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs truncate"
                  style={{ color: "#1F2937", fontWeight: 600 }}
                >
                  {item.name}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: "#9CA3AF" }}>
                  {item.date} · {item.pages} pages
                </p>
              </div>
              <div
                className="flex items-center gap-1 px-2 py-1 rounded-full flex-shrink-0"
                style={{ backgroundColor: "rgba(16,185,129,0.1)" }}
              >
                <CheckCircle size={10} style={{ color: "#10B981" }} />
                <span className="text-[10px]" style={{ color: "#10B981", fontWeight: 600 }}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

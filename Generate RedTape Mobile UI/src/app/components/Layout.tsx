import { Outlet, useLocation, useNavigate } from "react-router";
import { Home, BookOpen, Scale, ScanText } from "lucide-react";

const navItems = [
  { label: "Home", icon: Home, path: "/" },
  { label: "Learn", icon: BookOpen, path: "/learn" },
  { label: "Find Lawyer", icon: Scale, path: "/find-lawyer" },
  { label: "AI Scanner", icon: ScanText, path: "/ai-scanner" },
];

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #0a1628 0%, #1B3A6B 50%, #0a1628 100%)",
      }}
    >
      {/* Decorative circles */}
      <div
        className="fixed top-10 left-10 w-48 h-48 rounded-full opacity-5 pointer-events-none"
        style={{ backgroundColor: "#D4AF37" }}
      />
      <div
        className="fixed bottom-10 right-10 w-64 h-64 rounded-full opacity-5 pointer-events-none"
        style={{ backgroundColor: "#10B981" }}
      />

      {/* App Title */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        <span className="text-lg">⚖️</span>
        <span
          className="text-white text-sm tracking-wider"
          style={{ fontWeight: 800, letterSpacing: "0.1em" }}
        >
          RED<span style={{ color: "#D4AF37" }}>TAPE</span>
        </span>
      </div>

      {/* Phone Frame */}
      <div
        className="relative bg-white overflow-hidden flex flex-col"
        style={{
          width: "390px",
          height: "844px",
          borderRadius: "44px",
          boxShadow:
            "0 0 0 10px #1B2338, 0 0 0 13px #2D3654, 0 30px 80px rgba(0,0,0,0.45)",
        }}
      >
        {/* Status Bar */}
        <div
          className="flex items-center justify-between px-6 pt-3 pb-1 flex-shrink-0"
          style={{ backgroundColor: "#0F2248" }}
        >
          <span className="text-white text-xs" style={{ fontWeight: 600 }}>
            9:41
          </span>
          <div
            className="absolute left-1/2 -translate-x-1/2 top-2 bg-[#1B2338] rounded-full"
            style={{ width: 120, height: 34 }}
          />
          <div className="flex items-center gap-1">
            <svg width="16" height="12" viewBox="0 0 16 12" fill="white">
              <rect x="0" y="4" width="3" height="8" rx="0.5" />
              <rect x="4" y="2.5" width="3" height="9.5" rx="0.5" />
              <rect x="8" y="1" width="3" height="11" rx="0.5" />
              <rect x="12" y="0" width="3" height="12" rx="0.5" opacity="0.4" />
            </svg>
            <svg width="16" height="12" viewBox="0 0 20 14" fill="white">
              <path d="M10 3.5C12.8 3.5 15.3 4.7 17 6.7L18.5 5.2C16.4 2.8 13.4 1.2 10 1.2S3.6 2.8 1.5 5.2L3 6.7C4.7 4.7 7.2 3.5 10 3.5Z" />
              <path d="M10 7C11.9 7 13.6 7.8 14.8 9.1L16.3 7.6C14.7 5.9 12.5 4.8 10 4.8S5.3 5.9 3.7 7.6L5.2 9.1C6.4 7.8 8.1 7 10 7Z" />
              <circle cx="10" cy="12" r="1.5" />
            </svg>
            <svg width="25" height="12" viewBox="0 0 25 12" fill="white">
              <rect x="0" y="1" width="22" height="10" rx="2" stroke="white" strokeWidth="1" fill="none" />
              <rect x="1.5" y="2.5" width="17" height="7" rx="1" fill="white" />
              <rect x="22.5" y="3.5" width="2" height="5" rx="1" fill="white" opacity="0.4" />
            </svg>
          </div>
        </div>

        {/* Screen Content */}
        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>

        {/* Bottom Navigation */}
        <div
          className="flex-shrink-0 border-t border-gray-100"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <div className="flex items-center justify-around px-2 pt-2 pb-5">
            {navItems.map(({ label, icon: Icon, path }) => {
              const isActive =
                path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(path);
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all"
                  style={{
                    backgroundColor: isActive
                      ? "rgba(27, 58, 107, 0.08)"
                      : "transparent",
                  }}
                >
                  <Icon
                    size={22}
                    style={{
                      color: isActive ? "#1B3A6B" : "#9CA3AF",
                      strokeWidth: isActive ? 2.5 : 1.8,
                    }}
                  />
                  <span
                    className="text-[10px]"
                    style={{
                      color: isActive ? "#1B3A6B" : "#9CA3AF",
                      fontWeight: isActive ? 700 : 500,
                    }}
                  >
                    {label}
                  </span>
                  {isActive && (
                    <div
                      className="w-1 h-1 rounded-full"
                      style={{ backgroundColor: "#D4AF37" }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
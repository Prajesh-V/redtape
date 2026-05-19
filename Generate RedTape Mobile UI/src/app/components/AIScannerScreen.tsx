import { useState, useRef, useEffect } from "react";
import { Send, Mic, Paperclip, Download, FileText, AlertTriangle, CheckCircle, Loader, ChevronRight, X } from "lucide-react";

type Message = {
  id: number;
  role: "user" | "ai";
  type: "text" | "file" | "analysis";
  content?: string;
  fileName?: string;
  fileSize?: string;
  filePages?: number;
};

const initialMessages: Message[] = [
  {
    id: 1,
    role: "user",
    type: "file",
    fileName: "Vendor_Contract_Draft.pdf",
    fileSize: "312 KB",
    filePages: 5,
  },
  {
    id: 2,
    role: "ai",
    type: "analysis",
    content:
      "I analyzed this 5-page contract. Here is the summary.",
  },
];

const suggestedQuestions = [
  "What are the termination clauses?",
  "Is the payment schedule fair?",
  "Explain the indemnity section",
];

export function AIScannerScreen() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [exportToast, setExportToast] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (text?: string) => {
    const msg = text || inputText.trim();
    if (!msg) return;
    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      type: "text",
      content: msg,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsAnalyzing(true);

    setTimeout(() => {
      const aiResponses: Record<string, string> = {
        "What are the termination clauses?":
          "The contract allows termination with 30 days notice by either party. However, Clause 8.2 states the vendor can terminate immediately if payment is delayed by more than 7 days — this is unusually strict.",
        "Is the payment schedule fair?":
          "The payment terms (Net-30) are standard for vendor contracts in India. The milestone-based payment structure appears reasonable and industry-standard.",
        "Explain the indemnity section":
          "Clause 11 requires you to indemnify the vendor against all third-party claims. This is a broad indemnity — I recommend narrowing it to only claims arising from your direct actions.",
      };

      const aiMsg: Message = {
        id: Date.now() + 1,
        role: "ai",
        type: "text",
        content:
          aiResponses[msg] ||
          "Based on my analysis of the Vendor Contract, I can address that. The contract has several standard clauses but also a few that warrant attention. Would you like me to highlight any specific section?",
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleExport = () => {
    setExportToast(true);
    setTimeout(() => setExportToast(false), 2500);
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: "#F5F7FB" }}>
      {/* Header */}
      <div
        className="px-4 pt-4 pb-4 flex-shrink-0"
        style={{
          background: "linear-gradient(135deg, #0F2248 0%, #1B3A6B 100%)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(212,175,55,0.2)" }}
            >
              <span className="text-base">🤖</span>
            </div>
            <div>
              <h1 className="text-white text-sm" style={{ fontWeight: 700 }}>
                RedTape AI Scanner
              </h1>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white/60 text-[10px]">AI Active · GPT-4 Legal</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all active:scale-95"
            style={{ backgroundColor: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.3)" }}
          >
            <Download size={13} style={{ color: "#D4AF37" }} />
            <span className="text-[11px]" style={{ color: "#D4AF37", fontWeight: 600 }}>
              Export PDF
            </span>
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
        style={{ scrollbarWidth: "none" }}
      >
        {/* Date separator */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-[9px] px-2" style={{ color: "#9CA3AF" }}>
            Today, 3:15 PM
          </span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {messages.map((msg) => {
          if (msg.role === "user" && msg.type === "file") {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[75%]">
                  {/* File Upload Card */}
                  <div
                    className="rounded-2xl rounded-tr-sm p-3"
                    style={{ backgroundColor: "#1B3A6B" }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                      >
                        <FileText size={18} className="text-white" />
                      </div>
                      <div>
                        <p
                          className="text-white text-[11px] leading-tight"
                          style={{ fontWeight: 600 }}
                        >
                          {msg.fileName}
                        </p>
                        <p className="text-white/60 text-[9px] mt-0.5">
                          {msg.filePages} pages · {msg.fileSize}
                        </p>
                      </div>
                    </div>
                    <div
                      className="mt-2 flex items-center gap-1 text-[10px] text-white/80"
                    >
                      <span>📤</span>
                      <span>Uploaded for analysis</span>
                    </div>
                  </div>
                  <p className="text-right mt-1 text-[9px]" style={{ color: "#9CA3AF" }}>
                    You · 3:15 PM
                  </p>
                </div>
              </div>
            );
          }

          if (msg.role === "ai" && msg.type === "analysis") {
            return (
              <div key={msg.id} className="flex justify-start">
                <div className="max-w-[90%]">
                  <div className="flex items-start gap-2 mb-1">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: "#D4AF37" }}
                    >
                      <span className="text-xs">🤖</span>
                    </div>
                    <div>
                      <span className="text-[10px]" style={{ color: "#9CA3AF" }}>
                        RedTape AI · 3:16 PM
                      </span>
                    </div>
                  </div>

                  <div
                    className="ml-9 rounded-2xl rounded-tl-sm overflow-hidden"
                    style={{ backgroundColor: "white", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}
                  >
                    {/* AI Header */}
                    <div
                      className="px-4 py-3 flex items-center gap-2"
                      style={{ backgroundColor: "rgba(27,58,107,0.04)" }}
                    >
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: "#1B3A6B" }}
                      >
                        <FileText size={12} className="text-white" />
                      </div>
                      <div>
                        <p
                          className="text-xs"
                          style={{ color: "#1F2937", fontWeight: 700 }}
                        >
                          {msg.content}
                        </p>
                        <p className="text-[9px]" style={{ color: "#9CA3AF" }}>
                          Vendor_Contract_Draft.pdf · 5 pages analyzed
                        </p>
                      </div>
                    </div>

                    {/* Overall Score */}
                    <div className="px-4 pt-3 pb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px]" style={{ color: "#6B7280", fontWeight: 600 }}>
                          Contract Risk Score
                        </span>
                        <span className="text-[11px]" style={{ color: "#EF4444", fontWeight: 700 }}>
                          ⚠️ Medium Risk
                        </span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#F3F4F6" }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: "58%",
                            background: "linear-gradient(90deg, #10B981 0%, #F59E0B 60%, #EF4444 100%)",
                          }}
                        />
                      </div>
                      <div className="flex justify-between mt-0.5">
                        <span className="text-[9px]" style={{ color: "#10B981" }}>Safe</span>
                        <span className="text-[9px]" style={{ color: "#EF4444" }}>Risky</span>
                      </div>
                    </div>

                    {/* Risk Alert */}
                    <div className="px-4 pb-2">
                      <div
                        className="rounded-xl p-3"
                        style={{
                          backgroundColor: "rgba(239,68,68,0.06)",
                          border: "1px solid rgba(239,68,68,0.2)",
                        }}
                      >
                        <div className="flex items-start gap-2">
                          <div
                            className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ backgroundColor: "rgba(239,68,68,0.12)" }}
                          >
                            <AlertTriangle size={11} style={{ color: "#EF4444" }} />
                          </div>
                          <div>
                            <p
                              className="text-[10px]"
                              style={{ color: "#EF4444", fontWeight: 700 }}
                            >
                              🚨 Risk Alert — Clause 6.3
                            </p>
                            <p className="text-[10px] mt-0.5" style={{ color: "#6B7280" }}>
                              Non-compete clause is highly restrictive for{" "}
                              <span style={{ color: "#EF4444", fontWeight: 700 }}>
                                5 years
                              </span>{" "}
                              across all of India. Industry standard is 1–2 years.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Safe Box */}
                    <div className="px-4 pb-3">
                      <div
                        className="rounded-xl p-3"
                        style={{
                          backgroundColor: "rgba(16,185,129,0.06)",
                          border: "1px solid rgba(16,185,129,0.2)",
                        }}
                      >
                        <div className="flex items-start gap-2">
                          <div
                            className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ backgroundColor: "rgba(16,185,129,0.12)" }}
                          >
                            <CheckCircle size={11} style={{ color: "#10B981" }} />
                          </div>
                          <div>
                            <p
                              className="text-[10px]"
                              style={{ color: "#10B981", fontWeight: 700 }}
                            >
                              ✅ Safe — Clause 4.1 &amp; 4.2
                            </p>
                            <p className="text-[10px] mt-0.5" style={{ color: "#6B7280" }}>
                              Payment terms are standard (Net-30). Milestone-based
                              schedule is fair and aligned with market practices.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* View Full Report */}
                    <button
                      className="w-full flex items-center justify-center gap-1 py-2.5 border-t"
                      style={{ borderColor: "#F3F4F6" }}
                    >
                      <span className="text-[11px]" style={{ color: "#1B3A6B", fontWeight: 700 }}>
                        View Full Report
                      </span>
                      <ChevronRight size={12} style={{ color: "#1B3A6B" }} />
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          // Regular text message
          if (msg.role === "user") {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[75%]">
                  <div
                    className="rounded-2xl rounded-tr-sm px-4 py-2.5"
                    style={{ backgroundColor: "#1B3A6B" }}
                  >
                    <p className="text-white text-xs">{msg.content}</p>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} className="flex justify-start gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: "#D4AF37" }}
              >
                <span className="text-xs">🤖</span>
              </div>
              <div className="max-w-[80%]">
                <div
                  className="rounded-2xl rounded-tl-sm px-4 py-2.5"
                  style={{
                    backgroundColor: "white",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                  }}
                >
                  <p className="text-xs" style={{ color: "#374151" }}>
                    {msg.content}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Analyzing indicator */}
        {isAnalyzing && (
          <div className="flex justify-start gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#D4AF37" }}
            >
              <span className="text-xs">🤖</span>
            </div>
            <div
              className="rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2"
              style={{ backgroundColor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}
            >
              <Loader size={13} className="animate-spin" style={{ color: "#1B3A6B" }} />
              <span className="text-[11px]" style={{ color: "#9CA3AF" }}>
                Analyzing...
              </span>
            </div>
          </div>
        )}

        {/* Suggested Questions */}
        {!isAnalyzing && messages.length <= 2 && (
          <div className="mt-1">
            <p className="text-[10px] mb-2 text-center" style={{ color: "#9CA3AF" }}>
              Suggested questions
            </p>
            <div className="flex flex-col gap-1.5">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="text-left px-3 py-2 rounded-xl text-[11px] transition-all active:scale-98"
                  style={{
                    backgroundColor: "rgba(27,58,107,0.06)",
                    color: "#1B3A6B",
                    fontWeight: 500,
                    border: "1px solid rgba(27,58,107,0.1)",
                  }}
                >
                  💬 {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div
        className="flex-shrink-0 px-4 pb-3 pt-2"
        style={{
          backgroundColor: "white",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.06)",
        }}
      >
        <div className="flex items-center gap-2">
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all active:scale-95"
            style={{ backgroundColor: "rgba(27,58,107,0.08)" }}
          >
            <Paperclip size={16} style={{ color: "#1B3A6B" }} />
          </button>
          <div
            className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ backgroundColor: "#F5F7FB", border: "1.5px solid #E5E7EB" }}
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask a question about this document..."
              className="flex-1 bg-transparent text-xs outline-none"
              style={{ color: "#374151" }}
            />
            <button className="flex-shrink-0">
              <Mic size={15} style={{ color: "#9CA3AF" }} />
            </button>
          </div>
          <button
            onClick={() => handleSend()}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all active:scale-95"
            style={{
              background: inputText.trim()
                ? "linear-gradient(135deg, #1B3A6B 0%, #0F2248 100%)"
                : "#E5E7EB",
            }}
          >
            <Send
              size={15}
              style={{ color: inputText.trim() ? "white" : "#9CA3AF" }}
            />
          </button>
        </div>
      </div>

      {/* Export Toast */}
      {exportToast && (
        <div
          className="absolute top-24 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-xl z-50"
          style={{ backgroundColor: "#1B3A6B" }}
        >
          <CheckCircle size={14} style={{ color: "#10B981" }} />
          <span className="text-white text-xs" style={{ fontWeight: 600 }}>
            Report exported to PDF!
          </span>
        </div>
      )}
    </div>
  );
}

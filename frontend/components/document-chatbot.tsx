// FILE: frontend/components/document-chatbot.tsx
"use client"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

import { useState, useRef, useEffect } from "react"

interface Message {
  role: "user" | "bot"
  content: string
}

interface DocumentChatbotProps {
  documentContext: string
  documentName?: string
}

export function DocumentChatbot({ documentContext, documentName = "your document" }: DocumentChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: `I have reviewed "${documentName}". What would you like to know about it?` },
  ])
  const [input, setInput]       = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef               = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const handleSend = async () => {
    if (!input.trim()) return
    const q = input.trim()
    setMessages(prev => [...prev, { role: "user", content: q }])
    setInput(""); setIsTyping(true)
    try {
      const res  = await fetch(`${API_BASE}/chat/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, document_context: documentContext }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      if (json.status === "error") throw new Error(json.error || "Failed")
      setMessages(prev => [...prev, { role: "bot", content: json.data.answer }])
    } catch {
      setMessages(prev => [...prev, { role: "bot", content: "I encountered an error. Please try again." }])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <div className="border-2 border-black">
      {/* Header */}
      <div className="border-b-2 border-black px-5 py-3 swiss-grid-pattern flex items-center gap-3">
        {/* Bot icon — geometric */}
        <div className="flex h-7 w-7 items-center justify-center border-2 border-black bg-black flex-shrink-0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/>
          </svg>
        </div>
        <div>
          <p className="swiss-label text-[#FF3000]">AI Assistant</p>
          <p className="text-[10px] font-medium text-black/50 truncate max-w-[200px]">{documentName}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-4 p-5 h-72 overflow-y-auto bg-[#F2F2F2]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            {/* Avatar */}
            <div
              className={`flex h-6 w-6 flex-shrink-0 items-center justify-center border-2 ${
                msg.role === "user" ? "border-black bg-black text-white" : "border-black bg-white text-black"
              }`}
            >
              {msg.role === "user" ? (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/>
                </svg>
              ) : (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
              )}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[78%] p-3 text-xs font-medium leading-relaxed border-2 ${
                msg.role === "user"
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-black"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-end gap-2">
            <div className="flex h-6 w-6 items-center justify-center border-2 border-black bg-white">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <div className="border-2 border-black bg-white px-4 py-3 flex items-center gap-1.5">
              {[0, 150, 300].map(delay => (
                <div
                  key={delay}
                  className="h-1.5 w-1.5 bg-black animate-bounce"
                  style={{ animationDelay: `${delay}ms`, animationDuration: "0.8s" }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t-2 border-black flex items-center">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about this document…"
          disabled={isTyping}
          className="flex-1 bg-white px-5 py-4 text-xs font-medium text-black placeholder-black/40 focus:outline-none disabled:opacity-50"
          aria-label="Chat input"
        />
        <button
          onClick={handleSend}
          disabled={isTyping || !input.trim()}
          className="flex h-[3.25rem] w-14 flex-shrink-0 items-center justify-center border-l-2 border-black bg-black text-white transition-colors duration-150 hover:bg-[#FF3000] disabled:opacity-40"
          aria-label="Send message"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
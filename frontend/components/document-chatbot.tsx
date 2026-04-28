// FILE: frontend/components/document-chatbot.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Loader2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

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
    {
      role: "bot",
      content: `I have reviewed ${documentName}. What would you like to know about it?`,
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = async () => {
    if (!input.trim()) return

    const userQuestion = input.trim()
    
    // Add user message to UI immediately
    setMessages((prev) => [...prev, { role: "user", content: userQuestion }])
    setInput("")
    setIsTyping(true)

    try {
      const res = await fetch("http://127.0.0.1:8000/chat/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userQuestion,
          document_context: documentContext,
        }),
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const responseJson = await res.json()

      if (responseJson.status === "error") {
        throw new Error(responseJson.error || "Failed to get an answer")
      }

      // Add bot response to UI
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: responseJson.data.answer },
      ])
    } catch (error) {
      console.error("Chat error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: "I encountered an error trying to process your request. Please try again.",
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Card className="flex flex-col h-[500px] shadow-md border-gray-200">
      <CardHeader className="py-3 px-4 border-b bg-gray-50/50">
        <CardTitle className="text-sm font-medium flex items-center text-gray-700">
          <FileText className="w-4 h-4 mr-2 text-primary" />
          Chatting with: {documentName}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-gray-200 text-gray-700"
              }`}
            >
              {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
            </div>
            
            <div
              className={`max-w-[80%] rounded-lg p-3 text-sm whitespace-pre-wrap leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
              <Bot size={16} className="text-gray-700" />
            </div>
            <div className="bg-gray-100 rounded-lg p-3 flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
              <span className="text-xs text-gray-500">Analyzing document...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      <div className="p-3 border-t bg-white">
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about this document..."
            className="flex-1 focus-visible:ring-primary"
            disabled={isTyping}
          />
          <Button
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            size="icon"
            className="shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
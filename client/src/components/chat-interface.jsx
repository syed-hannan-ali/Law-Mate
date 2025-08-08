"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@components/ui/button"
import { Textarea } from "@components/ui/textarea"
import { ScrollArea } from "@components/ui/scroll-area"
import { Bot, User, Send, ShieldCheck, Sparkles, Loader2 } from 'lucide-react'
import { Toaster, toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

// Merged: ChatInterface is now in the same file
function ChatInterface() {
  // --------------------
  // DO NOT CHANGE LOGIC
  // --------------------
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your legal assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      console.log("🔍 From sendMessage:", inputMessage)
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: inputMessage,
        }),
      })
      console.log("🔍 From sendMessage:", response)

      if (!response.ok) {
        throw new Error("Failed to get response from chatbot")
      }

      const data = await response.text()

      let botResponse = data
      try {
        const jsonData = JSON.parse(data)
        botResponse = jsonData.response || jsonData.message || data
      } catch (error) {
        botResponse = data
      }

      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Failed to send message. Please try again.")

      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }
  // --------------------
  // END: DO NOT CHANGE LOGIC
  // --------------------

  return (
    // EXPANDED: Changed from h-[calc(100vh-3rem)] sm:h-[80vh] to h-[90vh] for larger size
    <div className="relative flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-950/60 shadow-2xl backdrop-blur-xl">
      <Toaster theme="dark" position="top-right" richColors />

      {/* HEADER - Slightly larger padding */}
      <motion.header
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
        className="sticky top-0 z-10 border-b border-neutral-800/80 bg-neutral-950/70 px-6 py-5 backdrop-blur-md"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-neutral-900 ring-1 ring-inset ring-neutral-700">
              <div className="absolute inset-0 opacity-30 [background:conic-gradient(from_180deg_at_50%_50%,#ffffff0a_0deg,#ffffff20_180deg,#ffffff0a_360deg)]" />
              <Bot className="relative z-10 h-7 w-7 text-neutral-200" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-neutral-100">Legal Assistant</h1>
              <p className="flex items-center gap-1 text-sm text-neutral-400">
                <ShieldCheck className="h-4 w-4" />
                AI-powered legal support
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-neutral-800/80 bg-neutral-900/70 px-3 py-1.5 text-sm text-neutral-300">
              <Sparkles className="h-4 w-4 text-neutral-300" />
              Beta
            </span>
          </div>
        </div>
      </motion.header>

      {/* MESSAGES - Enhanced scrolling area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea
          className="h-full w-full overscroll-contain"
          type="always"
          aria-label="Chat message history"
          style={{ height: "100%" }}
        >
          <div className="px-6 py-6">
            {/* EXPANDED: Increased max-width for larger chat area */}
            <div className="mx-auto flex max-w-4xl flex-col gap-5">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ y: 10, opacity: 0, scale: 0.98 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 160, damping: 18 }}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`group flex max-w-[85%] items-start gap-4 ${
                        message.sender === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      {/* Avatar - Slightly larger */}
                      <div
                        className={`mt-1 grid h-10 w-10 place-items-center rounded-full ring-1 ring-inset ${
                          message.sender === "user"
                            ? "bg-neutral-100 text-neutral-900 ring-neutral-300/40"
                            : "bg-neutral-800 text-neutral-200 ring-neutral-700/60"
                        }`}
                      >
                        {message.sender === "user" ? (
                          <User className="h-5 w-5" />
                        ) : (
                          <Bot className="h-5 w-5" />
                        )}
                      </div>

                      {/* Bubble - More padding and better sizing */}
                      <div
                        className={`relative rounded-2xl border px-5 py-4 shadow-sm transition-colors ${
                          message.sender === "user"
                            ? "border-neutral-300/30 bg-gradient-to-b from-neutral-100 to-neutral-200 text-neutral-900"
                            : "border-neutral-800/80 bg-neutral-900/80 text-neutral-100"
                        }`}
                      >
                        {/* Shine on hover */}
                        <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <div className="absolute inset-x-0 -top-1 h-8 rounded-t-2xl bg-gradient-to-b from-white/10 to-transparent" />
                        </div>

                        <p className="whitespace-pre-wrap text-base leading-relaxed">{message.text}</p>
                        <p
                          className={`mt-3 text-xs tracking-wide ${
                            message.sender === "user" ? "text-neutral-600" : "text-neutral-400"
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator - Enhanced size */}
              {isLoading && (
                <motion.div
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="group flex max-w-[85%] items-start gap-4">
                    <div className="mt-1 grid h-10 w-10 place-items-center rounded-full bg-neutral-800 text-neutral-200 ring-1 ring-inset ring-neutral-700/60">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div className="relative rounded-2xl border border-neutral-800/80 bg-neutral-900/80 px-5 py-4 text-neutral-100 shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="sr-only">Assistant is typing</span>
                        <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:0ms]" />
                        <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-neutral-400" style={{ animationDelay: "120ms" }} />
                        <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-neutral-400" style={{ animationDelay: "240ms" }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* This div ensures proper scrolling to bottom */}
              <div ref={messagesEndRef} className="h-1" />
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* INPUT - Enhanced sizing and spacing */}
      <div className="border-t border-neutral-800/80 bg-neutral-950/70 px-6 py-5 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-end gap-4">
          <div className="flex-1">
            {/* Enhanced textarea with better sizing */}
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your legal question here..."
              disabled={isLoading}
              className="min-h-[60px] max-h-48 w-full resize-y rounded-xl border-neutral-800/80 bg-neutral-900/60 px-4 py-3 text-base text-neutral-100 placeholder:text-neutral-500 focus-visible:ring-neutral-300/20"
            />
            <p className="mt-2 text-center text-xs text-neutral-400">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>

          {/* Enhanced send button */}
          <Button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="group h-[60px] w-[60px] rounded-xl border border-neutral-800/80 bg-neutral-100 text-neutral-900 transition-all hover:scale-[1.02] hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <main className="min-h-screen">
      {/* App wrapper background in dark monochrome */}
      <div className="relative min-h-screen bg-neutral-950 text-neutral-100">
        {/* Subtle grid/texture background layers */}
        <div className="pointer-events-none absolute inset-0 [background:radial-gradient(1200px_600px_at_120%_-10%,rgba(255,255,255,0.06),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(#d4d4d4_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Center the chatbox with enhanced sizing */}
        <div className="relative mx-auto grid min-h-screen place-items-center px-4 py-8">
          <ChatInterface />
        </div>
      </div>
    </main>
  )
}
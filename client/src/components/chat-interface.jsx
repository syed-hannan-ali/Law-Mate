"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@components/ui/button";
import { Textarea } from "@components/ui/textarea";
import { ScrollArea } from "@components/ui/scroll-area";
import { Bot, User, Send, ShieldCheck, Sparkles, Loader2 } from "lucide-react";
import { Toaster, toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import axios from "@config/axios";

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
    ]);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!inputMessage.trim()) return;

        const messageToSend = inputMessage;

        const userMessage = {
            id: `${Date.now()}-${Math.random()}`,
            text: inputMessage,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputMessage("");
        setIsLoading(true);

        try {
            const { data } = await axios.post("/chat", {
                query: messageToSend,
            });

            const botMessage = {
                id: `${Date.now()}-${Math.random()}`,
                text: data.response || "No response",
                sender: "bot",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            toast.error(
                error.response?.data?.error ||
                    "Failed to get response from chatbot",
            );
            const errorMessage = {
                id: `${Date.now()}-${Math.random()}`,
                text: "Sorry, I'm having trouble connecting right now. Please try again later.",
                sender: "bot",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatTime = (timestamp) => {
        return timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    // --------------------
    // END: DO NOT CHANGE LOGIC
    // --------------------

    return (
        <div className="relative flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-slate-200/20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl shadow-slate-900/50 backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
                <div className="absolute -inset-10 opacity-30">
                    <div className="absolute top-0 -left-4 h-72 w-72 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl animate-pulse" />
                    <div
                        className="absolute bottom-0 -right-4 h-72 w-72 rounded-full bg-gradient-to-r from-emerald-400/20 to-blue-400/20 blur-3xl animate-pulse"
                        style={{ animationDelay: "2s" }}
                    />
                </div>
            </div>

            <motion.header
                initial={{ y: -12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 16 }}
                className="relative z-10 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/80 via-slate-700/80 to-slate-800/80 px-8 py-6 backdrop-blur-md"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 opacity-75 blur-sm animate-pulse" />
                            <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 ring-1 ring-slate-600/50">
                                <Bot className="h-8 w-8 text-blue-400" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                                Legal Assistant
                            </h1>
                            <p className="flex items-center gap-2 text-sm text-slate-400">
                                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                                AI-powered legal support
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-2 rounded-full border border-slate-600/50 bg-gradient-to-r from-slate-700/80 to-slate-600/80 px-4 py-2 text-sm font-medium text-slate-200 shadow-lg">
                            <Sparkles className="h-4 w-4 text-yellow-400" />
                            Beta
                        </span>
                    </div>
                </div>
            </motion.header>

            {/* MESSAGES - Enhanced scrolling area */}
            <div className="relative flex-1 overflow-hidden">
                <ScrollArea
                    className="h-full w-full overscroll-contain"
                    type="always"
                    aria-label="Chat message history"
                    style={{ height: "100%" }}
                >
                    <div className="px-8 py-8">
                        <div className="mx-auto flex max-w-4xl flex-col gap-6">
                            <AnimatePresence initial={false}>
                                {messages.map((message) => (
                                    <motion.div
                                        key={message.id}
                                        initial={{
                                            y: 20,
                                            opacity: 0,
                                            scale: 0.95,
                                        }}
                                        animate={{ y: 0, opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 200,
                                            damping: 20,
                                        }}
                                        className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`group flex max-w-[80%] items-start gap-4 ${
                                                message.sender === "user"
                                                    ? "flex-row-reverse"
                                                    : ""
                                            }`}
                                        >
                                            <div
                                                className={`mt-1 grid h-11 w-11 place-items-center rounded-full ring-2 ring-offset-2 ring-offset-transparent transition-all duration-300 ${
                                                    message.sender === "user"
                                                        ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white ring-blue-400/50 shadow-lg shadow-blue-500/25"
                                                        : "bg-gradient-to-br from-slate-700 to-slate-800 text-slate-200 ring-slate-600/50 shadow-lg shadow-slate-700/25"
                                                }`}
                                            >
                                                {message.sender === "user" ? (
                                                    <User className="h-5 w-5" />
                                                ) : (
                                                    <Bot className="h-5 w-5" />
                                                )}
                                            </div>

                                            <div
                                                className={`relative rounded-2xl border px-6 py-4 shadow-lg transition-all duration-300 group-hover:shadow-xl ${
                                                    message.sender === "user"
                                                        ? "border-blue-400/30 bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-blue-500/25"
                                                        : "border-slate-600/50 bg-gradient-to-br from-slate-700/90 to-slate-800/90 text-slate-100 shadow-slate-700/25"
                                                }`}
                                            >
                                                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                                                    <div className="absolute inset-x-0 -top-1 h-12 rounded-t-2xl bg-gradient-to-b from-white/20 to-transparent" />
                                                </div>

                                                <p className="whitespace-pre-wrap text-base leading-relaxed font-medium">
                                                    {message.text}
                                                </p>
                                                <p
                                                    className={`mt-3 text-xs font-medium tracking-wide ${
                                                        message.sender ===
                                                        "user"
                                                            ? "text-blue-100/80"
                                                            : "text-slate-400"
                                                    }`}
                                                >
                                                    {formatTime(
                                                        message.timestamp,
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {isLoading && (
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="group flex max-w-[80%] items-start gap-4">
                                        <div className="mt-1 grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-slate-700 to-slate-800 text-slate-200 ring-2 ring-slate-600/50 ring-offset-2 ring-offset-transparent shadow-lg shadow-slate-700/25">
                                            <Bot className="h-5 w-5" />
                                        </div>
                                        <div className="relative rounded-2xl border border-slate-600/50 bg-gradient-to-br from-slate-700/90 to-slate-800/90 px-6 py-4 text-slate-100 shadow-lg shadow-slate-700/25">
                                            <div className="flex items-center gap-2">
                                                <span className="sr-only">
                                                    Assistant is typing
                                                </span>
                                                <div className="h-3 w-3 animate-bounce rounded-full bg-gradient-to-r from-blue-400 to-purple-400 [animation-delay:0ms] shadow-sm" />
                                                <div
                                                    className="h-3 w-3 animate-bounce rounded-full bg-gradient-to-r from-purple-400 to-emerald-400 shadow-sm"
                                                    style={{
                                                        animationDelay: "150ms",
                                                    }}
                                                />
                                                <div
                                                    className="h-3 w-3 animate-bounce rounded-full bg-gradient-to-r from-emerald-400 to-blue-400 shadow-sm"
                                                    style={{
                                                        animationDelay: "300ms",
                                                    }}
                                                />
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

            <div className="relative z-10 border-t border-slate-700/50 bg-gradient-to-r from-slate-800/90 via-slate-700/90 to-slate-800/90 px-8 py-6 backdrop-blur-md">
                <div className="mx-auto flex max-w-4xl items-end gap-4">
                    <div className="flex-1">
                        <div className="relative">
                          
                            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20 opacity-0 transition-opacity duration-300 focus-within:opacity-100" />
                            
                            <Textarea
                                value={inputMessage}
                                onChange={(e) =>
                                    setInputMessage(e.target.value)
                                }
                                onKeyPress={handleKeyPress}
                                placeholder="Type your legal question here..."
                                disabled={isLoading}
                                className="relative min-h-[64px] max-h-48 w-full resize-y rounded-2xl border-slate-600/50 bg-gradient-to-br from-slate-700/80 to-slate-800/80 px-5 py-4 text-base font-medium text-slate-100 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent transition-all duration-300"
                            />
                            
                        </div>
                        <p className="mt-3 text-center text-xs font-medium text-slate-400">
                            Press Enter to send, Shift+Enter for new line
                        </p>
                    </div>
                    <Button
                        onClick={sendMessage}
                        disabled={!inputMessage.trim() || isLoading}
                        className="group relative h-[64px] w-[64px] overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <div className="relative z-10">
                            {isLoading ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                <Send className="h-6 w-6 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                            )}
                        </div>
                    </Button>

                    
                </div>
            </div>
        </div>
    );
}

export default function Page() {
    return (
        <main className="min-h-screen">
            <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900 to-slate-950" />
                    <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px]" />
                    <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl animate-pulse" />
                    <div
                        className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-emerald-500/10 to-blue-500/10 blur-3xl animate-pulse"
                        style={{ animationDelay: "3s" }}
                    />
                </div>

                {/* Center the chatbox with enhanced sizing */}
                <div className="relative mx-auto grid min-h-screen place-items-center px-6 py-10">
                    <ChatInterface />
                </div>
            </div>
        </main>
    );
}

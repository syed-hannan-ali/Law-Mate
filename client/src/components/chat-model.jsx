import { useState, useRef, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { ScrollArea } from "@components/ui/scroll-area";
import { Badge } from "@components/ui/badge";
import { Send, X } from "lucide-react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { useAuth } from "@hooks/useAuth";

const roleColors = {
    lawyer: "blue",
    paralegal: "purple",
    client: "green",
    admin: "red",
};

import axios from "@config/axios";
    
export function ChatModal({ isOpen, onClose, caseId, assignedStaff }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const scrollAreaRef = useRef(null);

    const { user } = useAuth();

    // const socket = io("http://localhost:3000");

    // Auto-scroll to bottom when new messages arrive

    const socket = useRef(null);

    useEffect(() => {
        if (isOpen) {
            getPreviousChatMessages();
        }
    }, [isOpen, caseId]);

    const getPreviousChatMessages = async () => {
        try {
            const response = await axios.get(`/messages/${caseId}`);
            setMessages(response.data);
            scrollToBottom();
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    useEffect(() => {
        if (socket.current) return;

        socket.current = io("http://localhost:3000");

        socket.current.on("connect", () => {
            console.log("Connected with ID:", socket.current.id);
            socket.current.emit("joinCase", { caseId }, (response) => {
                if (response.ok) {
                    console.log("Joined successfully");
                } else {
                    toast.error("Failed to join Chat");
                }
            });
        });

        socket.current.on("newMessage", (data) => {
            console.log("Received:", data);
            setMessages((prev) => [...prev, data.message]); // add it to chat state
        });

        return () => {
            socket.current.disconnect();
        };
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        scrollAreaRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        // Simulate sending a message (replace with actual Socket.IO implementation)

        const message = {
            sender: {
                _id: user.id,
                username: user.name,
                role: user.role,
            },
            body: newMessage,
            createdAt: new Date().toISOString(),
        };

        socket.current.emit("sendMessage", {
            caseId: caseId, // <-- the room ID
            message: message,
        });

        // setMessages((prev) => [...prev, message]);
        setNewMessage("");
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl h-[600px] flex flex-col">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <DialogTitle>
                        Case Chat - {assignedStaff.length} participants
                    </DialogTitle>
                </DialogHeader>

                {/* Participants */}
                <div className="flex flex-wrap gap-2 p-2 bg-muted/50 rounded-lg">
                    {assignedStaff.map((staff) => (
                        <Badge
                            key={staff._id}
                            variant={roleColors[staff.role] || "outline"}
                        >
                            {staff.username}
                        </Badge>
                    ))}
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message._id}
                                className={`flex ${message.isSystem ? "justify-center" : "justify-start"}`}
                            >
                                {message.isSystem ? (
                                    <div className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                                        {message.body}
                                    </div>
                                ) : (
                                    <div className="max-w-[70%]">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge
                                                variant={
                                                    roleColors[
                                                        message.sender.role
                                                    ] || "outline"
                                                }
                                                className="text-xs"
                                            >
                                                {message.sender.username}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">
                                                {formatTime(message.createdAt)}
                                            </span>
                                        </div>
                                        <div className="bg-primary/10 p-3 rounded-lg">
                                            <p className="text-sm">
                                                {message.body}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={scrollAreaRef} className="h-1" />
                    </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="flex gap-2 p-4 border-t">
                    <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                    />
                    <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

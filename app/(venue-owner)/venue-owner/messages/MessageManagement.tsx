"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, User } from "lucide-react";

export default function MessageManagement() {
  const [message, setMessage] = useState("");

  // Mock messages data - replace with actual API call
  const messages = [
    {
      id: "1",
      sender: "John Doe",
      content: "Hi, I'd like to book a court for tomorrow.",
      timestamp: "2024-03-15T10:30:00",
      isRead: true,
    },
    {
      id: "2",
      sender: "Jane Smith",
      content: "What are your weekend rates?",
      timestamp: "2024-03-15T11:45:00",
      isRead: false,
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement message sending logic
    setMessage("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Messages</h2>
          <p className="text-muted-foreground">
            Communicate with your customers
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Inbox</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 rounded-lg border ${
                  !msg.isRead ? "bg-muted" : ""
                }`}>
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{msg.sender}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(msg.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm">{msg.content}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>New Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">To</label>
                <Input placeholder="Select recipient" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                />
              </div>
              <Button type="submit" className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

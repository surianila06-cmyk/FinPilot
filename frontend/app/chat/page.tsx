"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { chatWithAI } from "@/lib/api";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I'm FinPilot AI. Ask me anything about your finances.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const profile = JSON.parse(
      localStorage.getItem("financialProfile") || "{}"
    );

    const userMessage = {
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    try {
      const response = await chatWithAI(input, profile);

      const aiMessage = {
        sender: "ai",
        text:
          response.message ||
          JSON.stringify(response, null, 2),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Unable to connect to the AI backend.",
        },
      ]);
    }

    setInput("");
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="max-w-5xl mx-auto p-8">

        <h1 className="text-4xl font-bold text-blue-600 mb-8">
          FinPilot AI Assistant
        </h1>

        <div className="bg-white rounded-2xl shadow-lg h-[500px] flex flex-col">

          <div className="flex-1 overflow-y-auto p-6 space-y-4">

  {messages.map((message, index) => (

    <div
      key={index}
      className={`flex ${
        message.sender === "user"
          ? "justify-end"
          : "justify-start"
      }`}
    >

      <div className="flex items-start gap-3">

        {message.sender === "ai" && (
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            AI
          </div>
        )}

        {message.sender === "user" && (
          <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
            You
          </div>
        )}

        <div
          className={`max-w-xl rounded-2xl px-5 py-4 whitespace-pre-line ${
            message.sender === "user"
              ? "bg-blue-600 text-white"
              : "bg-white shadow text-gray-800"
          }`}
        >
          {message.text}
        </div>

      </div>

    </div>

  ))}

  {/* 👇 Add this right here */}
  {loading && (
    <div className="flex justify-start">
      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
          AI
        </div>

        <div className="bg-white shadow rounded-2xl px-5 py-4">
          🤖 FinPilot is thinking...
        </div>

      </div>
    </div>
  )}

</div>
            <div className="px-5 pt-5">

  <p className="text-gray-600 font-semibold mb-3">
    Try asking:
  </p>

  <div className="flex flex-wrap gap-3">

    <button
      onClick={() => setInput("Can I buy a bike?")}
      className="bg-gray-100 hover:bg-blue-100 px-4 py-2 rounded-full"
    >
      🚲 Can I buy a bike?
    </button>

    <button
      onClick={() => setInput("Should I invest in gold?")}
      className="bg-gray-100 hover:bg-blue-100 px-4 py-2 rounded-full"
    >
      🪙 Should I invest in gold?
    </button>

    <button
      onClick={() => setInput("Can I take a home loan?")}
      className="bg-gray-100 hover:bg-blue-100 px-4 py-2 rounded-full"
    >
      🏠 Can I take a home loan?
    </button>

    <button
      onClick={() => setInput("How can I increase my savings?")}
      className="bg-gray-100 hover:bg-blue-100 px-4 py-2 rounded-full"
    >
      💰 How can I increase my savings?
    </button>

  </div>

</div>
          <div className="border-t p-5 flex gap-4">

            <input
  className="flex-1 border rounded-xl px-4 py-3"
  placeholder="Ask about loans, gold, savings..."
  value={input}
  onChange={(e) => setInput(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  }}
/>

            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl"
            >
              {loading ? "Thinking..." : "Send"}
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}
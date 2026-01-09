import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

export default function ExpenseChatbotButton({ userId }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! I am your TrackAI... Ask me anything about your expenses 💬" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => setOpen(!open);

  const sendMessage = async () => {
    if (!input.trim()) return;


    const userMsg = { role: "user", text: input };
    setMessages([...messages, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chatbot/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, userId: userId || "unknown" }),
      });


      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      
      const botMsg = { role: "bot", text: data.reply || "No response from bot" };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg = { role: "bot", text: "Sorry, I encountered an error. Please try again." };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4">
      {/* Button to open/close */}
      {!open && (
        <button
          onClick={toggleChat}
          className="bg-green-500 cursor-pointer text-white px-4 py-3 rounded-full shadow-lg hover:bg-green-600 transition"
        >
          <i className="fa-solid fa-robot"></i>
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="w-100 h-120 bg-gray-900 text-white rounded-2xl shadow-lg flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center bg-gray-800 px-4 py-2 rounded-t-2xl">
            <span>Expense Chatbot</span>
            <button onClick={toggleChat} className="text-white text-xl font-bold cursor-pointer"><i className="fa-solid fa-xmark"></i></button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2 chatbot-scrollbar">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg ${
                  msg.role === "user" ? "bg-blue-600 text-right" : "bg-gray-700"
                }`}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            ))}
            {loading && (
              <div className="p-2 rounded-lg bg-gray-700 text-gray-300">
                <span className="animate-pulse">...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex p-2 gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your expenses..."
              className="flex-1 rounded-lg px-2 text-black bg-white"
              onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-green-500 cursor-pointer px-3 py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

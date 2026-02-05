import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { FiSend, FiMessageSquare } from "react-icons/fi";
import { useUser } from "../context/UserContext";

type ChatMessage = {
  id: string;
  text: string;
  username: string;
  color: string;
};

export default function ChatPanel({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const { username, color } = useUser();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const messagesArrayRef = useRef<Y.Array<ChatMessage> | null>(null);

  useEffect(() => {
    if (!roomId) return;

    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    const provider = new WebsocketProvider(
      import.meta.env.VITE_WS_URL,
      roomId,
      ydoc
    );
    providerRef.current = provider;

    const messagesArray = ydoc.getArray<ChatMessage>("chat");
    messagesArrayRef.current = messagesArray;

    setMessages(messagesArray.toArray());

    const observer = () => {
      setMessages(messagesArray.toArray());
    };

    messagesArray.observe(observer);

    return () => {
      messagesArray.unobserve(observer);
      provider.destroy();
      ydoc.destroy();
    };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage() {
    if (!input.trim() || !messagesArrayRef.current) return;

    messagesArrayRef.current.push([
      {
        id: Date.now().toString(),
        text: input,
        username,
        color,
      },
    ]);

    setInput("");
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="h-full flex flex-col bg-slate-900/30">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-700/50 bg-slate-800/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <FiMessageSquare className="text-purple-400" size={16} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Chat</h3>
            <p className="text-xs text-slate-500">
              {messages.length} {messages.length === 1 ? 'message' : 'messages'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 bg-slate-800/50 rounded-full flex items-center justify-center mb-3">
              <FiMessageSquare className="text-slate-600" size={20} />
            </div>
            <p className="text-slate-500 text-sm">No messages yet</p>
            <p className="text-slate-600 text-xs mt-1">Start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: msg.color }}
                  />
                  <span className="font-semibold text-slate-300 text-xs">
                    {msg.username}
                  </span>
                </div>
                <div className="bg-slate-800 text-slate-100 text-sm px-3 py-2 rounded ml-4 break-words">
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-700/50 bg-slate-800/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-slate-900 text-slate-100 text-sm px-3 py-2 rounded-lg border border-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="w-20 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 disabled:cursor-not-allowed text-white text-sm px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <FiSend size={14} />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
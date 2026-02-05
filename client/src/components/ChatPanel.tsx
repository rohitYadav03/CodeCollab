import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { useUser } from "../context/UserContext";

type ChatMessage = {
  id: string;
  text: string;
  username : string;
  color : string;
};

export default function ChatPanel({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
const { username , color} = useUser();
  // Yjs refs
  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const messagesArrayRef = useRef<Y.Array<ChatMessage> | null>(null);

  useEffect(() => {
    if (!roomId) return;

    // 1️⃣ Create Yjs document
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    // 2️⃣ Connect to websocket (same room!)
    const provider = new WebsocketProvider(
      "ws://localhost:3000",
      roomId,
      ydoc
    );
    providerRef.current = provider;

    // 3️⃣ Get shared Yjs Array
    const messagesArray = ydoc.getArray<ChatMessage>("chat");
    messagesArrayRef.current = messagesArray;

    // 4️⃣ Initial load
    setMessages(messagesArray.toArray());

    // 5️⃣ Observe changes
    const observer = () => {
      setMessages(messagesArray.toArray());
    };

    messagesArray.observe(observer);

    // Cleanup
    return () => {
      messagesArray.unobserve(observer);
      provider.destroy();
      ydoc.destroy();
    };
  }, [roomId]);

  function sendMessage() {
    if (!input.trim() || !messagesArrayRef.current) return;

    messagesArrayRef.current.push([
      {
        id: Date.now().toString(),
        text: input,
        username,
        color
      },
    ]);

    setInput("");
  }

  return (
    <div className="w-80 h-full flex flex-col border-l border-slate-700 bg-slate-900">
      {/* Messages */}
     {messages.map((msg) => (
  <div key={msg.id} className="space-y-1">
    <div className="flex items-center gap-2 text-xs">
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: msg.color }}
      />
      <span className="font-semibold text-slate-300">
        {msg.username}
      </span>
    </div>

    <div className="bg-slate-800 text-white text-sm px-3 py-2 rounded ml-4">
      {msg.text}
    </div>
  </div>
))}

      {/* Input */}
      <div className="p-3 border-t border-slate-700 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-slate-950 text-white text-sm px-3 py-2 rounded border border-slate-700 focus:outline-none"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}

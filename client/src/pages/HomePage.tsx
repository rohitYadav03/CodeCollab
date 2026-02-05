import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { FiPlus, FiLogIn, FiCode } from "react-icons/fi";
import { getRandomColor, useUser } from "../context/UserContext";

export default function HomePage() {
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();
  const { setUsername, setColor } = useUser();

  function createRoom() {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setUsername(name);
    setColor(getRandomColor());

    const roomId = uuidv4().slice(0, 8);
    navigate(`/room/${roomId}`);
  }

  function joinRoom() {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!roomCode.trim()) {
      toast.error("Please enter a room code");
      return;
    }

    setUsername(name);
    setColor(getRandomColor());
    navigate(`/room/${roomCode}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FiCode className="text-purple-400 text-4xl" />
            <h1 className="text-5xl font-bold text-white">CodeCollab</h1>
          </div>
          <p className="text-slate-300 text-lg">
            Real-time collaborative code editor
          </p>
        </div>

        {/* Name Input (shared) */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Your Name
          </label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Create Room Card */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-purple-500 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <FiPlus className="text-white text-xl" />
              </div>
              <h2 className="text-xl font-semibold text-white">Create Room</h2>
            </div>
            <p className="text-slate-400 text-sm mb-6">
              Start a new collaborative session and invite others
            </p>
            <button
              onClick={createRoom}
              className="w-full px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors"
            >
              Create New Room
            </button>
          </div>

          {/* Join Room Card */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-purple-500 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <FiLogIn className="text-white text-xl" />
              </div>
              <h2 className="text-xl font-semibold text-white">Join Room</h2>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Enter a room code to join an existing session
            </p>
            <input
              type="text"
              placeholder="Enter room code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
            />
            <button
              onClick={joinRoom}
              className="w-full px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors"
            >
              Join Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
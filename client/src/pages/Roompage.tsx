import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import { toast } from "sonner";
import { FiCopy, FiDownload, FiLink, FiCode } from "react-icons/fi";
import { useUser } from "../context/UserContext";
import ChatPanel from "../components/ChatPanel";
import UserList from "../components/UserList";

export default function RoomPage() {
  const { id } = useParams();
  const { username, color } = useUser();
const navigate = useNavigate()

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const ydocRef = useRef<Y.Doc | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);

  const [users, setUsers] = useState<any[]>([]);

  function handleEditorMount(editorInstance: editor.IStandaloneCodeEditor) {
    editorRef.current = editorInstance;

    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    const provider = new WebsocketProvider(import.meta.env.VITE_WS_URL, id!, ydoc);
    providerRef.current = provider;

    const awareness = provider.awareness;

    awareness.setLocalState({
      user: {
        name: username,
        color: color,
      },
    });

    const updateUser = () => {
      const states = provider.awareness.getStates();
      const onlineUsers: any[] = [];

      states.forEach((state, clientId) => {
        if (state.user) {
          onlineUsers.push({
            id: clientId,
            name: state.user.name,
            color: state.user.color,
          });
        }
      });
      setUsers(onlineUsers);
    };

    updateUser();

    awareness.on("change", () => {
      updateUser();
    });

    editorInstance.onDidChangeCursorPosition((e) => {
      awareness.setLocalStateField("cursor", {
        line: e.position.lineNumber,
        column: e.position.column,
      });
    });

    const ytext = ydoc.getText("monaco");

    const binding = new MonacoBinding(
      ytext,
      editorInstance.getModel()!,
      new Set([editorInstance]),
      awareness
    );
    bindingRef.current = binding;

    console.log("✅ collaborative editor ready");
  }

  useEffect(() => {
    if (!username) {
      toast.error("Please enter your name first");
      navigate("/");
    }
  }, [username, navigate]);


  useEffect(() => {
    const style = document.createElement("style");
    style.id = "remote-cursors";

    style.innerHTML = `
      .yRemoteSelection {
        background-color: rgba(255, 0, 0, 0.25);
      }

      .yRemoteSelectionHead {
        border-left: 2px solid red;
        margin-left: -1px;
      }
    `;

    document.head.appendChild(style);

    return () => {
      document.getElementById("remote-cursors")?.remove();
    };
  }, []);

  useEffect(() => {
    const provider = providerRef.current;
    if (!provider) return;

    const awareness = provider.awareness;
    const style = document.createElement("style");
    style.id = "cursor-label-styles";

    const updateStyles = () => {
      let css = "";

      awareness.getStates().forEach((state: any, clientId: number) => {
        if (!state.user) return;

        css += `
          .yRemoteSelection-${clientId} {
            background-color: ${state.user.color}40;
          }

          .yRemoteSelectionHead-${clientId} {
            border-left: 2px solid ${state.user.color};
            position: relative;
          }

          .yRemoteSelectionHead-${clientId}::after {
            content: "${state.user.name}";
            position: absolute;
            top: -18px;
            left: 0;
            background-color: ${state.user.color};
            color: white;
            font-size: 11px;
            font-weight: 600;
            padding: 2px 6px;
            border-radius: 4px;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          }
        `;
      });

      style.innerHTML = css;
    };

    updateStyles();
    awareness.on("change", updateStyles);
    document.head.appendChild(style);

    return () => {
      awareness.off("change", updateStyles);
      document.getElementById("cursor-label-styles")?.remove();
    };
  }, []);

  useEffect(() => {
    return () => {
      const provider = providerRef.current;
      provider?.awareness.setLocalState(null);
      bindingRef.current?.destroy();
      providerRef.current?.destroy();
      ydocRef.current?.destroy();
    };
  }, []);

  function copyRoomLink() {
    const link = `${window.location.origin}/room/${id}`;
    navigator.clipboard.writeText(link);
    toast.success("Room link copied to clipboard");
  }

  function copyCode() {
    const code = editorRef.current?.getValue();

    if (!code) {
      toast.error("No code to copy");
      return;
    }

    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard");
  }

  function downloadCode() {
    const code = editorRef.current?.getValue();

    if (!code) {
      toast.error("No code to download");
      return;
    }

    const blob = new Blob([code], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "code.js";
    a.click();

    URL.revokeObjectURL(url);
    toast.success("Code downloaded");
  }

  return (
    <div className="h-screen flex flex-col bg-slate-950">
      {/* Toolbar */}
      <div className="h-14 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 flex items-center justify-between px-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
            <FiCode className="text-white" size={16} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-200">
              CodeCollab
            </h2>
            <p className="text-xs text-slate-500">
              Room: <span className="text-purple-400 font-mono">{id}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyRoomLink}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white text-sm rounded-lg transition-all duration-200 border border-slate-700/50 hover:border-slate-600"
          >
            <FiLink size={14} />
            <span className="hidden sm:inline">Share</span>
          </button>
          <button
            onClick={copyCode}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white text-sm rounded-lg transition-all duration-200 border border-slate-700/50 hover:border-slate-600"
          >
            <FiCopy size={14} />
            <span className="hidden sm:inline">Copy</span>
          </button>
          <button
            onClick={downloadCode}
            className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white text-sm rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
          >
            <FiDownload size={14} />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className="flex-1 relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
          
          <Editor
            height="100%"
            defaultLanguage="javascript"
            defaultValue="// Start typing…"
            theme="vs-dark"
            onMount={handleEditorMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              lineNumbers: "on",
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 16, bottom: 16 },
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
              smoothScrolling: true,
            }}
          />
        </div>

        {/* Right Sidebar: Users + Chat */}
        <div className="w-80 flex flex-col bg-slate-900 border-l border-slate-700/50">
          <UserList users={users} currentUsername={username} />
          <div className="flex-1 overflow-hidden">
            <ChatPanel roomId={id!} />
          </div>
        </div>
      </div>
    </div>
  );
}
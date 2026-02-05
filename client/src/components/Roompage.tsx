import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import { useUser } from "../context/UserContext";

export default function Roompage() {
  const { id } = useParams();
const { username, color} = useUser();
  
const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  // we are storing ref of these 3 to destory when the user will leave
  const providerRef = useRef<WebsocketProvider | null>(null);
  const ydocRef = useRef<Y.Doc | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);

const [ users , setUsers] = useState<any[]>([]);

  function handleEditorMount(editorInstance: editor.IStandaloneCodeEditor) {
    editorRef.current = editorInstance;

    // 1️⃣ Create Yjs document
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    // 2️⃣ Connect to WebSocket server (room = URL id) -> to brodcast and accept the changes from everyone
  const provider = new WebsocketProvider(
      "ws://localhost:3000",
      id!,
      ydoc
    );
    providerRef.current = provider;

const awareness = provider.awareness;

awareness.setLocalState({
  user : {
    name : username,
    color : color
  }
})

const updateUser  = () => {
  const states = provider.awareness.getStates();
  console.log('states is : ', states);
  
  const onlineUsers : any[] = [];

  states.forEach((state, clientId) => {
    console.log("state is ", state);
    console.log("client id is : ", clientId);
    if(state.user){
        onlineUsers.push({
            id: clientId,
            name: state.user.name,
            color: state.user.color,
          });
    }
  });
  setUsers(onlineUsers);
}

updateUser();

awareness.on("change", () => {
  console.log("this function called");
  updateUser();
})

  // 3️⃣ Get shared text
    const ytext = ydoc.getText("monaco");

    // 4️⃣ Bind Monaco ↔ Yjs => for syncin editor text with yjs document
 const binding = new MonacoBinding(
      ytext,
      editorInstance.getModel()!,
      new Set([editorInstance])
    );
    bindingRef.current = binding;

console.log("✅ awareness local state set");
console.log(provider.awareness.getStates());

    console.log("✅ collaborative editor ready");
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      bindingRef.current?.destroy();
      providerRef.current?.destroy();
      ydocRef.current?.destroy();
    };
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* 🔥 BOX 4: Online users UI */}
      <div style={{ width: "200px", padding: "10px", background: "#111" }}>
        <h4 style={{ color: "#fff" }}>Online Users</h4>
        {users.map((user) => (
          <div key={user.id} style={{ color: user.color }}>
            ● {user.name}
          </div>
        ))}
      </div>

      <Editor
        height="100%"
        defaultLanguage="javascript"
        defaultValue="// Start typing…"
        theme="vs-dark"
        onMount={handleEditorMount}
      />
    </div>
  );
}

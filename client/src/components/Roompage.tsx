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

editorInstance.onDidChangeCursorPosition((e) => {
  
  // sirf awareness ka ek field update krhta hai setLocalState bura update krtha hai 
awareness.setLocalStateField("cursor", {
  line : e.position.lineNumber,
  column : e.position.column
})
  
})

  // 3️⃣ Get shared text
const ytext = ydoc.getText("monaco");

    // 4️⃣ Bind Monaco ↔ Yjs => for syncin editor text with yjs document
 const binding = new MonacoBinding(
      ytext,
      editorInstance.getModel()!,
      new Set([editorInstance]),
      awareness // Isse monoco css class add krtha hai 
    );
    bindingRef.current = binding;

console.log("✅ awareness local state set");
console.log(provider.awareness.getStates());

    console.log("✅ collaborative editor ready");
  };


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



  // Cleanup on unmount
  useEffect(() => {
    return () => {
    const provider = providerRef.current;

    // 🔥 BOX 5: remove cursor + user from awareness
    provider?.awareness.setLocalState(null);
    
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
        height="60%"
        defaultLanguage="javascript"
        defaultValue="// Start typing…"
        theme="vs-dark"
        onMount={handleEditorMount}
      />
    </div>
  );
}

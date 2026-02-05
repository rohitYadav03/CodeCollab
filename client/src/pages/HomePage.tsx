import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4} from "uuid"
import { getRandomColor, useUser } from "../context/UserContext";

export default function HomePage(){
const [name, setName] = useState("");
const [roomCode, setRoomCode] = useState("")
const navigate = useNavigate();
const { setUsername , setColor} = useUser();

function createRoom(){
    if (!name.trim()) return alert("Name is must enter it ");
setUsername(name);
setColor(getRandomColor());

const roomId = uuidv4().slice(0, 8);
    navigate(`/room/${roomId}`);
   }

function joinRoom (){
    if (!name.trim()) return alert("Name is must enter it ");
setUsername(name);
setColor(getRandomColor());
    navigate(`/room/${roomCode}`);
}
return (
        <div>
       
        <input
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
     />
<button className="m-4 p-6 border" onClick={createRoom}>Create Room</button>
<h3>Or</h3>
   <div>
        <input className="p-4 m-4 border-4" placeholder="Enter room Code" onChange={(e) => setRoomCode(e.target.value)}/>
        </div>
       <input
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
     />
<button className="m-6 p-8 border-2" onClick={joinRoom} >Join Room</button>
     
        </div>
    )
}
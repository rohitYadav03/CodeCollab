import React, { createContext, useContext, useState } from "react";

type UserContextType = {
    username : string,
    setUsername : (name : string) => void;
    color : string;
    setColor : (color : string) => void;
}

const UserContext = createContext<UserContextType | null>(null);


export const UserProvider = ({ children } : { children : React.ReactNode}) => {
const [username , setUsername] = useState("")
const [color, setColor] = useState("");

return (
    <UserContext.Provider value={{ username , setUsername, color ,setColor}}>
        { children}
    </UserContext.Provider>
)

}
const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
];

export const getRandomColor = () => {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
};

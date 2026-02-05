import React, { createContext, useContext, useState } from "react";

type UserContextType = {
  username: string;
  setUsername: (name: string) => void;
  color: string;
  setColor: (color: string) => void;
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [username, setUsername] = useState("");
  const [color, setColor] = useState("");

  return (
    <UserContext.Provider value={{ username, setUsername, color, setColor }}>
      {children}
    </UserContext.Provider>
  );
};

const COLORS = [
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#f59e0b", // Amber
  "#10b981", // Emerald
  "#3b82f6", // Blue
  "#6366f1", // Indigo
  "#14b8a6", // Teal
  "#f97316", // Orange
];

export const getRandomColor = () => {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
};
"use client";

import { AppUser } from "@/types/user";
import { createContext } from "react";
import { useContext } from "react";

type AuthContextType = {
  currentUser: AppUser;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children, currentUser }: { children: React.ReactNode; currentUser: AppUser }) => {
  return <AuthContext value={{ currentUser }}>{children}</AuthContext>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

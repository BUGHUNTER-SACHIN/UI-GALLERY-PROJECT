import React from 'react';
import { createContext, useContext, useEffect, useState } from "react";
const ThemeContext = createContext(void 0);
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored) {
      setTheme(stored);
    }
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    root.style.transition = "background-color 0.3s ease, color 0.3s ease";
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);
  const toggleTheme = () => {
    setTheme((prev) => prev === "dark" ? "light" : "dark");
  };
  return /* @__PURE__ */ React.createElement(ThemeContext.Provider, { value: { theme, toggleTheme } }, children);
};

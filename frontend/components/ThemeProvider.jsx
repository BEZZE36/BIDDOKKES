"use client";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeCtx = createContext({ dark: false, toggle: () => {} });

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false);

  // On mount, read from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("biddokkes-theme");
    if (saved === "dark") {
      // eslint-disable-next-line
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Global Zoom Blocker for Desktop (Ctrl+Scroll / Ctrl+/-)
  useEffect(() => {
    const handleWheel = (e) => {
      if (e.ctrlKey) e.preventDefault();
    };
    const handleKeyDown = (e) => {
      if (e.ctrlKey && (e.key === "=" || e.key === "-" || e.key === "0")) {
        e.preventDefault();
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function toggle() {
    setDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("biddokkes-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("biddokkes-theme", "light");
      }
      return next;
    });
  }

  return (
    <ThemeCtx.Provider value={{ dark, toggle }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeCtx);
}

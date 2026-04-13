"use client";

import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";

export function useNavbar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setOpen((current) => !current);

  const handleLogout = () => signOut({ callbackUrl: "/login" });

  return { open, menuRef, toggleMenu, handleLogout };
}

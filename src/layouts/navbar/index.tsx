"use client";

import { ChevronDown } from "@/components/icons";
import { useNavbar } from "./useNavbar";

export default function Navbar() {
  const { open, menuRef, toggleMenu, handleLogout } = useNavbar();

  return (
    <nav className="bg-[var(--color-surface)] border-b border-[var(--color-border)] h-[60px] flex items-center px-4 sm:px-8">
      <div className="flex items-center gap-4 sm:gap-8 flex-1 min-w-0">
        <span className="text-base sm:text-lg font-bold text-[var(--color-text-primary)] tracking-tight shrink-0">ticktock</span>
        <div className="flex items-center">
          <button className="relative px-3 sm:px-4 py-[18px] text-sm font-medium text-[var(--color-primary)]">
            Timesheets
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-primary)] rounded-t-full" />
          </button>
        </div>
      </div>

      <div className="relative shrink-0" ref={menuRef}>
        <button
          type="button"
          onClick={toggleMenu}
          className="flex items-center gap-2 rounded-full px-2 sm:px-3 py-2 hover:bg-[var(--color-background)] transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-[var(--color-surface)] text-xs font-semibold select-none shrink-0">
            J
          </div>
          <span className="hidden sm:inline text-sm font-medium text-[var(--color-text-secondary)]">John Doe</span>
          <ChevronDown />
        </button>

        {open && (
          <div className="absolute right-0 z-10 mt-2 w-40 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-background)] cursor-pointer"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

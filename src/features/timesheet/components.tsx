"use client";

import { useState, useRef, useEffect } from "react";

interface ThreeDotMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function ThreeDotMenu({ onEdit, onDelete }: ThreeDotMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center w-7 h-7 rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-background)] transition-colors"
        aria-label="Task actions"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="8" cy="3" r="1.2" />
          <circle cx="8" cy="8" r="1.2" />
          <circle cx="8" cy="13" r="1.2" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-50 min-w-[110px] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg py-1">
          <button
            type="button"
            onClick={() => { setOpen(false); onEdit(); }}
            className="w-full px-4 py-2 text-left text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-background)] transition-colors"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => { setOpen(false); onDelete(); }}
            className="w-full px-4 py-2 text-left text-sm text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)] transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

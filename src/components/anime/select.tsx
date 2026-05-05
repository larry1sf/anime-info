import { IconChevronDown } from "@tabler/icons-react";
import { useState, useEffect, useRef } from "react";
type L = { slug: string; label: string };
interface SelectProps {
  options: L[];
  label: string;
  selected: L;
  handleSelect: (newSelect: L) => void;
}

export default function Select({
  options,
  label,
  selected,
  handleSelect,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  // const [selected, setSelected] = useState(options?.[0]?.label || "");
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!ref.current) return;
      const target = e.target as Node;
      if (!ref.current.contains(target) && isOpen) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, selected]);

  if (options.length === 0) return null;

  return (
    <div
      ref={ref}
      className="relative flex flex-col gap-1.5 w-40 text-sm animate-fade-up"
    >
      <label className="text-[11px] font-medium text-text-muted uppercase tracking-wider">
        {label}
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-2.5 rounded-xl border text-text-primary text-xs font-medium transition-all duration-300 flex justify-between items-center cursor-pointer ${
          isOpen
            ? "bg-surface-elevated border-accent/30 shadow-[0_0_16px_-6px_rgba(167,139,250,0.2)]"
            : "bg-surface border-border hover:border-border-hover"
        }`}
      >
        {selected.label}
        <span
          className={`transition-transform duration-300 text-text-muted ${isOpen ? "rotate-180" : ""}`}
        >
          <IconChevronDown size={14} />
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1.5 w-full z-[100] animate-fade-in">
          <ul className="w-full bg-surface-elevated border border-border rounded-xl shadow-2xl overflow-auto max-h-44">
            {options.map(({ slug, label }) => (
              <li
                key={slug}
                onClick={() => {
                  handleSelect({ slug, label });
                  setIsOpen(false);
                }}
                className={`h-9 flex items-center px-3 text-xs cursor-pointer transition-all duration-200 first:rounded-t-xl last:rounded-b-xl ${
                  selected.slug === slug
                    ? "text-accent bg-accent/8 font-medium"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/4"
                }`}
              >
                {label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

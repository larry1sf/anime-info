import { useState, useEffect, useRef } from "react";
import {
  IconChevronDown,
  IconSearch,
  IconX,
  IconAdjustments,
} from "@tabler/icons-react";

export interface FilterOption {
  slug: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
}

interface FilterBarProps {
  filters: FilterConfig[];
  values: Record<string, FilterOption>;
  onChange: (key: string, option: FilterOption) => void;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  showSearch?: boolean;
}

interface DropdownFilterProps {
  config: FilterConfig;
  value: FilterOption;
  onChange: (option: FilterOption) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

function DropdownFilter({
  config,
  value,
  onChange,
  isOpen,
  onToggle,
  onClose,
}: DropdownFilterProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center justify-between gap-1.5 px-2.5 py-2 min-w-[90px] rounded-lg border text-sm font-medium transition-all duration-300 cursor-pointer ${
          isOpen || value.slug !== ""
            ? "bg-accent/10 border-accent/40 text-accent"
            : "bg-surface border-border text-text-secondary hover:text-text-primary hover:border-border-hover"
        }`}
      >
        <span className="truncate text-xs">{value.label}</span>
        <IconChevronDown
          size={12}
          className={`shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`absolute top-full left-0 mt-1 w-full min-w-[130px] z-[100] overflow-visible rounded-lg border border-border bg-surface-elevated shadow-xl transition-all duration-200 ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="py-1 max-h-44 overflow-auto">
          {config.options.map((option) => {
            const isActive = value.slug === option.slug;
            return (
              <button
                key={option.slug}
                onClick={() => {
                  onChange(option);
                  onClose();
                }}
                className={`w-full px-3 py-2 text-left text-sm font-medium transition-colors duration-150 cursor-pointer ${
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/4"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function FilterBar({
  filters,
  values,
  onChange,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  showSearch = false,
}: FilterBarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const primaryFilters = filters.slice(0, 3);
  const secondaryFilters = filters.slice(3);

  const handleDropdownToggle = (key: string) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  const handleDropdownClose = () => {
    setOpenDropdown(null);
  };

  const hasActiveFilters =Object.values(values).filter(
    (v) => v && v.slug && v.slug !== ""
  ).length;

  const hasSearch = showSearch && onSearchChange;

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3">
        {/* Row 1: Filters + More + Search inline */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Primary Dropdowns */}
          <div className="flex flex-wrap gap-1.5">
            {primaryFilters.map((filter) => (
              <DropdownFilter
                key={filter.key}
                config={filter}
                value={values[filter.key]}
                onChange={(option) => onChange(filter.key, option)}
                isOpen={openDropdown === filter.key}
                onToggle={() => handleDropdownToggle(filter.key)}
                onClose={handleDropdownClose}
              />
            ))}
          </div>

          {/* More/Less Button */}
          {secondaryFilters.length > 0 && (
            <button
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg border text-sm font-medium transition-all duration-300 cursor-pointer ${
                showMoreFilters || hasActiveFilters > 0
                  ? "bg-accent/10 border-accent/40 text-accent"
                  : "bg-surface border-border text-text-secondary hover:text-text-primary hover:border-border-hover"
              }`}
            >
              <IconAdjustments size={14} />
              <span className="text-xs">
                {showMoreFilters ? "Less" : "More"}
              </span>
              {hasActiveFilters > 0 && !showMoreFilters && (
                <span className="w-4 h-4 flex items-center justify-center text-[10px] font-bold bg-accent text-bg rounded-full">
                  {hasActiveFilters}
                </span>
              )}
            </button>
          )}

          <div className="flex-1" />

          {/* Search: Input + Button together */}
          {hasSearch && (
            <div className="flex items-center gap-2">
              {/* Search Input - appears next to search button */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isSearchOpen || searchValue
                    ? "w-44 sm:w-52 opacity-100"
                    : "w-0 opacity-0"
                }`}
              >
                <div className="relative">
                  <IconSearch
                    size={14}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted"
                  />
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={searchPlaceholder || "Search..."}
                    className="w-full pl-8 pr-3 py-2 text-sm bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:bg-surface-elevated focus:border-accent/30 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Search Toggle Button */}
              <button
                onClick={() => {
                  if (searchValue) {
                    onSearchChange("");
                    setIsSearchOpen(false);
                  } else {
                    setIsSearchOpen(!isSearchOpen);
                  }
                }}
                className={`flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-300 cursor-pointer ${
                  isSearchOpen || searchValue
                    ? "bg-accent border-accent/30 text-bg"
                    : "bg-surface border-border text-text-secondary hover:text-text-primary hover:border-border-hover"
                }`}
              >
                {isSearchOpen || searchValue ? (
                  <IconX size={16} />
                ) : (
                  <IconSearch size={16} />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Row 2: Secondary Filters (Expandable) */}
        {secondaryFilters.length > 0 && (
          <div
            className={`transition-all duration-300 ease-in-out ${
              showMoreFilters
                ? "max-h-40 opacity-100"
                : "max-h-0 opacity-0 pointer-events-none"
            }`}
          >
            <div className="flex flex-wrap gap-1.5 py-1">
              {secondaryFilters.map((filter) => (
                <DropdownFilter
                  key={filter.key}
                  config={filter}
                  value={values[filter.key]}
                  onChange={(option) => onChange(filter.key, option)}
                  isOpen={openDropdown === filter.key}
                  onToggle={() => handleDropdownToggle(filter.key)}
                  onClose={handleDropdownClose}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
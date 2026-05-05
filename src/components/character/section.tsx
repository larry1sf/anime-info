import { useCallback, useEffect, useRef, useState } from "react";
import Select from "@/components/character/select";
import CharacterCard from "@/components/character/card";
import ErrorBoundary from "@/components/ErrorBoundary";
import { IconUser, IconSearch, IconX } from "@tabler/icons-react";
import type { Character, PaginationParse, FilterOption } from "@/types/character";

const filtersInitial = {
  order_by: { slug: "mal_id", label: "MAL ID" },
  sort: { slug: "desc", label: "Descending" },
  letter: { slug: "", label: "All" },
};

const order_by_options: FilterOption[] = [
  { slug: "mal_id", label: "MAL ID" },
  { slug: "name", label: "Name" },
  { slug: "favorites", label: "Favorites" },
];

const sort_options: FilterOption[] = [
  { slug: "desc", label: "Descending" },
  { slug: "asc", label: "Ascending" },
];

const letter_options: FilterOption[] = [
  { slug: "", label: "All" },
  { slug: "a", label: "A" },
  { slug: "b", label: "B" },
  { slug: "c", label: "C" },
  { slug: "d", label: "D" },
  { slug: "e", label: "E" },
  { slug: "f", label: "F" },
  { slug: "g", label: "G" },
  { slug: "h", label: "H" },
  { slug: "i", label: "I" },
  { slug: "j", label: "J" },
  { slug: "k", label: "K" },
  { slug: "l", label: "L" },
  { slug: "m", label: "M" },
  { slug: "n", label: "N" },
  { slug: "o", label: "O" },
  { slug: "p", label: "P" },
  { slug: "q", label: "Q" },
  { slug: "r", label: "R" },
  { slug: "s", label: "S" },
  { slug: "t", label: "T" },
  { slug: "u", label: "U" },
  { slug: "v", label: "V" },
  { slug: "w", label: "W" },
  { slug: "x", label: "X" },
  { slug: "y", label: "Y" },
  { slug: "z", label: "Z" },
];

export default function CharacterSection() {
  const [dataCharacters, setDataCharacters] = useState<Character[]>([]);
  const [dataPagination, setDataPagination] = useState<PaginationParse | null>(
    null,
  );
  const [filters, setFilters] = useState(filtersInitial);

  // Search mode state
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounce search query (400ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchData = useCallback(
    async ({ page }: { page: number }) => {
      setIsLoading(true);

      try {
        const params: {
          page?: number;
          q?: string;
          order_by?: string;
          sort?: string;
          letter?: string;
          limit?: number;
        } = {
          page,
        };

        if (isSearchMode && debouncedQuery.trim()) {
          params.q = debouncedQuery.trim();
        } else {
          params.order_by = filters.order_by.slug;
          params.sort = filters.sort.slug;
          params.letter = filters.letter.slug;
        }

        const res = await fetch("/api/route", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...params, endpoint: "characters" }),
        });
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        const { data, pagination } = await res.json();

        if (data) {
          setDataCharacters(data);
          setDataPagination(pagination);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [
      filters.order_by.slug,
      filters.sort.slug,
      filters.letter.slug,
      debouncedQuery,
      isSearchMode,
    ],
  );

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData({
      page: 1,
    });
  }, [fetchData]);

  const handleNextPage = () => {
    if (dataPagination?.hasNextPage)
      fetchData({ page: dataPagination.currentPage + 1 });
  };

  const handlePrevPage = () => {
    if (dataPagination && dataPagination.currentPage > 1)
      fetchData({ page: dataPagination.currentPage - 1 });
  };

  const toggleSearchMode = () => {
    setIsSearchMode((prev) => {
      const next = !prev;
      if (next) {
        // Entering search mode: reset filters
        setFilters(filtersInitial);
        setTimeout(() => searchInputRef.current?.focus(), 350);
      } else {
        // Leaving search mode: clear query
        setSearchQuery("");
        setDebouncedQuery("");
      }
      return next;
    });
  };

  return (
    <ErrorBoundary>
      <section className="space-y-8 pt-14 min-h-dvh">
      {/* Header with title + controls */}
      <article className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        {/* Title only - no tabs */}
        <div className="flex flex-col gap-3">
          <h2 className="section-title">Characters</h2>
          <p className="text-text-muted text-sm">
            Explore characters from your favorite anime and manga
          </p>
        </div>

        {/* Filters / Search area */}
        <div className="flex items-end gap-3 z-100">
          {/* Search toggle button */}
          <button
            type="button"
            onClick={toggleSearchMode}
            className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-xl border cursor-pointer transition-all duration-300 ${
              isSearchMode
                ? "bg-accent border-accent/30 text-bg shadow-[0_0_16px_-4px_rgba(167,139,250,0.3)]"
                : "bg-surface border-border text-text-muted hover:text-text-primary hover:border-border-hover"
            }`}
            title={isSearchMode ? "Volver a filtros" : "Buscar por nombre"}
          >
            {isSearchMode ? <IconX size={16} /> : <IconSearch size={16} />}
          </button>

          {/* Crossfade container — both children are absolute so they swap in place */}
          <div className="relative min-w-[16rem] sm:min-w-md h-15">
            {/* --- Selects (filters mode) --- */}
            <nav
              className={`absolute inset-0 flex items-end gap-3 transition-all duration-300 ease-in-out ${
                isSearchMode
                  ? "opacity-0 scale-95 pointer-events-none"
                  : "opacity-100 scale-100"
              }`}
            >
              <Select
                selected={filters.order_by}
                handleSelect={(selected) =>
                  setFilters((prev) => ({ ...prev, order_by: selected }))
                }
                options={order_by_options}
                label="Order By"
              />
              <Select
                selected={filters.sort}
                handleSelect={(selected) =>
                  setFilters((prev) => ({ ...prev, sort: selected }))
                }
                options={sort_options}
                label="Sort"
              />
              <Select
                selected={filters.letter}
                handleSelect={(selected) =>
                  setFilters((prev) => ({ ...prev, letter: selected }))
                }
                options={letter_options}
                label="Letter"
              />
            </nav>

            {/* --- Search input (search mode) --- */}
            <div
              className={`absolute inset-0 flex flex-col justify-end gap-1.5 transition-all duration-300 ease-in-out ${
                isSearchMode
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <label className="text-[11px] font-medium text-text-muted uppercase tracking-wider">
                Search
              </label>
              <div className="relative">
                <IconSearch
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search characters...`}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border bg-surface border-border text-text-primary text-xs font-medium placeholder:text-text-muted/50 transition-all duration-300 focus:outline-none focus:bg-surface-elevated focus:border-accent/30 focus:shadow-[0_0_16px_-6px_rgba(167,139,250,0.2)]"
                />
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Cards grid */}
      <section className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-5">
        {isLoading
          ? Array(10)
              .fill({})
              .map((_, i) => (
                <CharacterCard
                  key={i}
                  id={i}
                  name={""}
                  favorites={0}
                  image={""}
                  index={i}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs h-4 bg-text-muted animate-pulse rounded w-2/4 uppercase tracking-wider font-medium"></span>
                  </div>
                </CharacterCard>
              ))
          : dataCharacters.length === 0
            ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                  <IconUser size={64} className="text-text-muted mb-4" />
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    No characters found
                  </h3>
                  <p className="text-text-muted text-sm">
                    Try adjusting your search or filters.
                  </p>
                </div>
              )
            : dataCharacters?.map((character, i) => (
                <CharacterCard
                  id={character.mal_id}
                  key={character.mal_id}
                  name={character.name}
                  nameKanji={character.name_kanji}
                  favorites={character.favorites}
                  image={character.images.webp.image_url}
                  index={i}
                />
              ))}
      </section>

      <div className="mt-4">
        {dataPagination && (
          <div className="flex items-center justify-center gap-5">
            <button
              disabled={dataPagination.currentPage === 1}
              onClick={handlePrevPage}
              className="cursor-pointer group flex items-center gap-2 bg-accent hover:bg-accent/90 text-bg px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-[0_0_24px_-4px_rgba(167,139,250,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-text-muted uppercase tracking-wider font-medium">
              Page {dataPagination.currentPage} of {dataPagination.totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={
                dataPagination.currentPage === dataPagination.totalPages
              }
              className="cursor-pointer group flex items-center gap-2 bg-accent hover:bg-accent/90 text-bg px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-[0_0_24px_-4px_rgba(167,139,250,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
    </ErrorBoundary>
  );
}
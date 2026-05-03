import { useCallback, useEffect, useRef, useState } from "react";
import Select from "@/components/anime/select";
import Card from "@/components/anime/card";
import {
  ratingsOptions,
  typesOptions,
  statusOptions,
  LIMIT_ANIME,
} from "@/const";
import { IconBook, IconDeviceTv, IconSearch, IconX } from "@tabler/icons-react";
import type { Anime, PaginationParse } from "@/types/anime";

const optionsViews = [
  { slug: "anime", name: "Anime", icon: <IconDeviceTv size={14} /> },
  { slug: "manga", name: "Manga", icon: <IconBook size={14} /> },
];
const filtersInitial = {
  rating: { slug: "", label: "All" },
  type: { slug: "", label: "All" },
  status: { slug: "", label: "All" },
};

export default function Section() {
  const [tab, setTab] = useState(optionsViews[0].slug);

  const [dataAnimes, setDataAnimes] = useState<Anime[]>([]);
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
      try {
        setIsLoading(true);
        const body: Record<string, unknown> = {
          page,
          section: tab,
        };

        if (isSearchMode && debouncedQuery.trim()) {
          body.query = debouncedQuery.trim();
        } else {
          body.status = filters.status.slug;
          body.rating = filters.rating.slug;
          body.type = filters.type.slug;
        }

        const res = await fetch("/api/route", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          console.log("error en la peticion al server local");
          return;
        }
        const { data, pagination } = await res.json();

        if (data) {
          setDataAnimes(data);
          setDataPagination(pagination);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [
      filters.status.slug,
      filters.rating.slug,
      filters.type.slug,
      tab,
      debouncedQuery,
    ],
  );

  const [isLoading, setIsLoading] = useState(false);

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

  const handleChangeTab = (slug: string) => {
    setTab(slug);
    setFilters(filtersInitial);
    setSearchQuery("");
    setDebouncedQuery("");
    setIsSearchMode(false);
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
    <section className="space-y-8 pt-14 min-h-dvh">
      {/* Header with title + controls */}
      <article className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        {/* Tab switcher */}
        <div className="flex flex-col gap-3">
          <h2 className="section-title">Browse</h2>
          <div className="flex items-center gap-1 bg-surface rounded-xl border border-border p-1">
            {optionsViews.map((option) => (
              <button
                key={option.slug}
                type="button"
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider cursor-pointer transition-all duration-300 ${
                  option.slug === tab
                    ? "bg-accent text-bg shadow-[0_0_16px_-4px_rgba(167,139,250,0.3)]"
                    : "text-text-muted hover:text-text-primary hover:bg-white/4"
                }`}
                onClick={() => handleChangeTab(option.slug)}
              >
                {option.icon}
                {option.name}
              </button>
            ))}
          </div>
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
                selected={filters.rating}
                handleSelect={(selected) =>
                  setFilters((prev) => ({ ...prev, rating: selected }))
                }
                options={ratingsOptions[tab as keyof typeof ratingsOptions]}
                label="Rating"
              />
              <Select
                selected={filters.type}
                handleSelect={(selected) =>
                  setFilters((prev) => ({ ...prev, type: selected }))
                }
                options={typesOptions[tab as keyof typeof typesOptions]}
                label="Type"
              />
              <Select
                selected={filters.status}
                handleSelect={(selected) =>
                  setFilters((prev) => ({ ...prev, status: selected }))
                }
                options={statusOptions[tab as keyof typeof statusOptions]}
                label="Status"
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
                  placeholder={`Buscar ${tab}...`}
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
          ? Array(LIMIT_ANIME)
              .fill({})
              .map((_, i) => (
                <Card
                  key={i}
                  id={i}
                  title={""}
                  rating={""}
                  image={""}
                  index={i}
                >
                  <div className="flex items-center gap-1.5">
                    {/*<IconLoader2 size={14} className="animate-spin" />*/}
                    <span className="text-xs h-4 bg-text-muted animate-pulse rounded w-2/4 uppercase tracking-wider font-medium">
                      {/*{anime.type}*/}
                    </span>
                  </div>
                </Card>
              ))
          : dataAnimes?.map((anime, i) => (
              <Card
                id={anime.mal_id}
                key={anime.mal_id}
                title={anime.title}
                rating={anime.rating}
                image={anime.images.webp.image_url}
                section={tab}
                index={i}
              >
                <div className="flex items-center gap-1.5">
                  {anime.type === "anime" ? (
                    <IconDeviceTv size={12} className="text-accent" />
                  ) : (
                    <IconBook size={12} className="text-accent-pink" />
                  )}
                  <span className="text-xs text-text-muted uppercase tracking-wider font-medium">
                    {anime.type}
                  </span>
                </div>
              </Card>
            ))}
      </section>

      <div className="mt-4">
        {dataPagination && (
          <div className="flex items-center justify-center gap-5">
            <button
              disabled={dataPagination.currentPage === 1}
              onClick={handlePrevPage}
              className="cursor-pointer group flex items-center gap-2 bg-accent hover:bg-accent/90 text-bg px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-[0_0_24px_-4px_rgba(167,139,250,0.4)]"
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
              className="cursor-pointer group flex items-center gap-2 bg-accent hover:bg-accent/90 text-bg px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-[0_0_24px_-4px_rgba(167,139,250,0.4)]"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

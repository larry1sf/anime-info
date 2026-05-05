import { useState, useEffect, useRef } from "react";
import { IconSearch, IconLoader2, IconChevronDown } from "@tabler/icons-react";
import { formatNumber } from "@/const";

interface SearchResult {
  mal_id: number;
  title: string;
  images: { jpg: { image_url: string; small_image_url: string } };
  type: string;
  year: number | null;
  _type?: string;
}

interface CharacterResult {
  mal_id: number;
  name: string;
  images: { jpg: { image_url: string } };
  favorites: number;
}

const ITEMS_PER_SECTION = 5;

interface SectionProps {
  title: string;
  results: SearchResult[];
  visibleCount: number;
  onShowMore: () => void;
  onSelect: (result: SearchResult & { _type: string }) => void;
}

function SearchSection({
  title,
  results,
  visibleCount,
  onShowMore,
  onSelect,
}: SectionProps) {
  const visibleResults = results.slice(0, visibleCount);
  const hasMore = visibleCount < results.length;
  const isCharacter = title.toLowerCase() === "characters";

  return (
    <div>
      <div className="sticky top-0 z-10 bg-surface-elevated border-b border-border/40 px-4 py-2 flex items-center justify-between">
        <span
          className={`text-xs font-semibold uppercase tracking-wider ${isCharacter ? "text-accent-rose" : "text-text-secondary"}`}
        >
          {title}{" "}
          <span className="text-text-muted font-normal">
            ({visibleResults.length}/{results.length})
          </span>
        </span>
        {hasMore && (
          <button
            onClick={onShowMore}
            className={`text-[10px] flex items-center gap-0.5 transition-colors ${isCharacter ? "text-accent-rose hover:text-accent-pink" : "text-accent hover:text-accent-pink"}`}
          >
            Ver más <IconChevronDown size={10} />
          </button>
        )}
      </div>
      <div className="p-1.5 space-y-0.5">
        {visibleResults.map((result) => (
          <button
            key={result.mal_id}
            onClick={() => onSelect(result as SearchResult & { _type: string })}
            className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent/8 hover:shadow-[0_0_12px_-4px_rgba(167,139,250,0.15)] transition-all duration-300 text-left group"
          >
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={result.images.jpg.small_image_url}
                alt={result.title}
                className="w-10 h-14 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 ring-1 ring-border/30 rounded-lg" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-primary truncate font-medium group-hover:text-accent transition-colors">
                {result.title}
              </p>
              <p className="text-xs text-text-muted flex items-center gap-1.5">
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                    result._type === "anime"
                      ? "bg-accent/15 text-accent"
                      : "bg-accent-pink/15 text-accent-pink"
                  }`}
                >
                  {result.type}
                </span>
                {result.year && <span>• {result.year}</span>}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

interface CharacterSectionProps {
  title: string;
  results: CharacterResult[];
  visibleCount: number;
  onShowMore: () => void;
  onSelect: (result: CharacterResult) => void;
}

function CharacterSection({
  title,
  results,
  visibleCount,
  onShowMore,
  onSelect,
}: CharacterSectionProps) {
  const visibleResults = results.slice(0, visibleCount);
  const hasMore = visibleCount < results.length;

  return (
    <div>
      <div className="sticky top-0 z-10 bg-surface-elevated border-b border-border/40 px-4 py-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-accent-rose">
          {title}{" "}
          <span className="text-text-muted font-normal">
            ({visibleResults.length}/{results.length})
          </span>
        </span>
        {hasMore && (
          <button
            onClick={onShowMore}
            className="text-[10px] text-accent-rose hover:text-accent-pink flex items-center gap-0.5 transition-colors"
          >
            Ver más <IconChevronDown size={10} />
          </button>
        )}
      </div>
      <div className="p-1.5 space-y-0.5">
        {visibleResults.map((result) => (
          <button
            key={result.mal_id}
            onClick={() => onSelect(result)}
            className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent-rose/8 hover:shadow-[0_0_12px_-4px_rgba(244,114,182,0.15)] transition-all duration-300 text-left group"
          >
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={result.images.jpg.image_url}
                alt={result.name}
                className="w-10 h-14 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 ring-1 ring-border/30 rounded-lg" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-primary truncate font-medium group-hover:text-accent-rose transition-colors">
                {result.name}
              </p>
              <p className="text-xs text-text-muted flex items-center gap-1">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-accent-rose/15 text-accent-rose">
                  Character
                </span>
                <span className="flex items-center gap-0.5">
                  ❤️ {formatNumber(result.favorites)}
                </span>
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function SearchInput() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [characterResults, setCharacterResults] = useState<CharacterResult[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [animeVisibleCount, setAnimeVisibleCount] = useState(ITEMS_PER_SECTION);
  const [mangaVisibleCount, setMangaVisibleCount] = useState(ITEMS_PER_SECTION);
  const [characterVisibleCount, setCharacterVisibleCount] =
    useState(ITEMS_PER_SECTION);
  const ref = useRef<HTMLDivElement>(null);

  const animeResults = results.filter((r) => r._type === "anime");
  const mangaResults = results.filter((r) => r._type === "manga");

  const hasAnime = animeResults.length > 0;
  const hasManga = mangaResults.length > 0;
  const hasCharacters = characterResults.length > 0;
  const hasResults = hasAnime || hasManga || hasCharacters;

  const sections = [
    { type: "anime", count: animeResults.length },
    { type: "manga", count: mangaResults.length },
    { type: "characters", count: characterResults.length },
  ]
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count);

  const primarySection = sections[0]?.type || "anime";
  const secondarySection = sections[1]?.type;
  const tertiarySection = sections[2]?.type;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setAnimeVisibleCount(ITEMS_PER_SECTION);
    setMangaVisibleCount(ITEMS_PER_SECTION);
    setCharacterVisibleCount(ITEMS_PER_SECTION);
  }, [query]);

  useEffect(() => {
    const search = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        setCharacterResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch("/api/route", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: "search", q: query, limit: 10 }),
        });
        const data = await res.json();

        if (data) {
          setIsOpen(true);
          setResults([...(data.anime || []), ...(data.manga || [])]);
          setCharacterResults(data.characters || []);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelectAnime = (result: SearchResult & { _type: string }) => {
    window.location.href = `/${result._type}/${result.mal_id}`;
    setIsOpen(false);
    setQuery("");
  };

  const handleSelectCharacter = (result: CharacterResult) => {
    window.location.href = `/character/${result.mal_id}`;
    setIsOpen(false);
    setQuery("");
  };

  const handleShowMoreAnime = () => {
    setAnimeVisibleCount((prev) =>
      Math.min(prev + ITEMS_PER_SECTION, animeResults.length),
    );
  };

  const handleShowMoreManga = () => {
    setMangaVisibleCount((prev) =>
      Math.min(prev + ITEMS_PER_SECTION, mangaResults.length),
    );
  };

  const handleShowMoreCharacters = () => {
    setCharacterVisibleCount((prev) =>
      Math.min(prev + ITEMS_PER_SECTION, characterResults.length),
    );
  };

  const renderSection = (sectionType: string) => {
    switch (sectionType) {
      case "anime":
        return (
          <SearchSection
            key="anime"
            title="Anime"
            results={animeResults}
            visibleCount={animeVisibleCount}
            onShowMore={handleShowMoreAnime}
            onSelect={handleSelectAnime}
          />
        );
      case "manga":
        return (
          <SearchSection
            key="manga"
            title="Manga"
            results={mangaResults}
            visibleCount={mangaVisibleCount}
            onShowMore={handleShowMoreManga}
            onSelect={handleSelectAnime}
          />
        );
      case "characters":
        return (
          <CharacterSection
            key="characters"
            title="Characters"
            results={characterResults}
            visibleCount={characterVisibleCount}
            onShowMore={handleShowMoreCharacters}
            onSelect={handleSelectCharacter}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div ref={ref} className="relative">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="hidden sm:flex items-center gap-2 glass rounded-xl overflow-hidden border border-border/50 hover:border-accent/30 hover:shadow-[0_0_20px_-6px_rgba(167,139,250,0.1)] transition-all duration-300 focus-within:border-accent/40 focus-within:shadow-[0_0_20px_-6px_rgba(167,139,250,0.15)]"
      >
        <input
          aria-label="Search"
          placeholder="Search anime, manga or characters..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          className="text-sm w-56 focus:outline-none px-4 py-2.5 bg-transparent text-text-primary placeholder:text-text-muted/60"
        />
        <button
          type="submit"
          className="px-3 py-2.5 text-text-muted hover:text-accent transition-colors cursor-pointer"
        >
          {loading ? (
            <IconLoader2 size={18} className="animate-spin" />
          ) : (
            <IconSearch size={18} />
          )}
        </button>
      </form>

      {isOpen && query.length >= 2 && (
        <div className="absolute top-full mt-2 right-0 w-md bg-surface-elevated rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in border border-border/50">
          {!loading && !hasResults && (
            <div className="p-6 text-center text-text-muted text-sm">
              No results found
            </div>
          )}

          {loading && (
            <div className="p-6 flex justify-center">
              <IconLoader2 size={24} className="animate-spin text-accent" />
            </div>
          )}

          {!loading && hasResults && (
            <div className="max-h-128 overflow-y-auto divide-y divide-border/30">
              {primarySection && renderSection(primarySection)}
              {secondarySection && renderSection(secondarySection)}
              {tertiarySection && renderSection(tertiarySection)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

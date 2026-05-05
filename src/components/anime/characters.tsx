import { useState } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function CharactersList({ characters }: { characters: any[] }) {
  const [currentPage, setCurrentPage] = useState(1);

  if (!characters || characters.length === 0) return null;

  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.ceil(characters.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleCharacters = characters.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  // Generar números de página con ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5; // Máximo de botones visibles (sin contar ellipsis)

    if (totalPages <= maxVisible) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Siempre mostrar primera página
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Páginas alrededor de la actual
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Siempre mostrar última página
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <ErrorBoundary>
      <section className="space-y-5 animate-fade-up min-h-200 md:min-h-160 glass p-6 rounded-2xl">
      <div className="flex items-center justify-between">
        <h3 className="section-title text-2xl font-bold">Characters</h3>
        <span className="text-xs text-text-muted">
          {startIndex + 1}-
          {Math.min(startIndex + ITEMS_PER_PAGE, characters.length)} of{" "}
          {characters.length}
        </span>
      </div>

      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {visibleCharacters.map((char: any, index: number) => (
          <a
            key={char.character.mal_id + "-" + index}
            href={`/character/${char.character.mal_id}`}
            className="glass rounded-2xl p-2 flex flex-col gap-3 group hover:-translate-y-1  border border-border/50 hover:border-accent/40 shadow-xl shadow-transparent hover:shadow-accent/10 transition-all duration-600 cursor-pointer"
          >
            <div className="relative w-full aspect-3/4 overflow-hidden rounded-xl">
              <img
                src={
                  char.character.images?.webp?.image_url ||
                  char.character.images?.jpg?.image_url
                }
                alt={char.character.name}
                className="w-full aspect-3/4 object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-t from-bg/90 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-60" />
            </div>
            <footer className="px-2 pb-2 text-center flex flex-col gap-0.5">
              <h4
                className="font-bold text-text-primary text-sm line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-white group-hover:to-accent transition-colors"
                title={char.character.name}
              >
                {char.character.name}
              </h4>
              <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold">
                {char.role}
              </span>
            </footer>
          </a>
        ))}
      </section>

      {totalPages > 1 && (
        <section className="pt-4 flex items-center justify-center gap-3 transition-200">
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={!hasPrevPage}
            className="group flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full bg-surface text-text-primary border border-border hover:border-border-hover hover:bg-surface-hover transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-surface disabled:hover:border-border disabled:hover:shadow-none shadow-lg hover:shadow-xl"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Previous
          </button>

          <div
            className="flex items-center justify-center gap-2 min-w-2xs"
            style={{ animationDelay: "0.5s" }}
          >
            {pageNumbers.map((page, index) =>
              typeof page === "number" ? (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 px-2 rounded-full text-xs font-bold transition-all shadow-sm ${
                    currentPage === page
                      ? "bg-accent text-bg shadow-accent/30"
                      : "bg-surface text-text-muted border border-border hover:border-border-hover hover:text-text-primary"
                  }`}
                >
                  {page}
                </button>
              ) : (
                <span
                  key={`ellipsis-${index}`}
                  className="w-8 h-8 flex items-center justify-center text-text-muted"
                >
                  {page}
                </span>
              ),
            )}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={!hasNextPage}
            className="group flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full bg-surface text-text-primary border border-border hover:border-border-hover hover:bg-surface-hover transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-surface disabled:hover:border-border disabled:hover:shadow-none shadow-lg hover:shadow-xl"
          >
            Next
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </section>
      )}
    </section>
    </ErrorBoundary>
  );
}

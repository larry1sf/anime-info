import { useState } from "react";
import type { ReactNode } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";

interface PaginatedGridProps {
  items: any[];
  renderItem: (item: any, index: number) => ReactNode;
  title?: string;
  itemsPerPage?: number;
  gridCols?: string;
}

export default function PaginatedGrid({
  items,
  renderItem,
  title,
  itemsPerPage = 8,
  gridCols = "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
}: PaginatedGridProps) {
  const [currentPage, setCurrentPage] = useState(1);

  if (!items || items.length === 0) return null;

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = items.slice(startIndex, startIndex + itemsPerPage);

  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  return (
    <ErrorBoundary>
      <section className="space-y-5 animate-fade-up min-h-200 md:min-h-160">
        {title && (
          <div className="flex items-center justify-between">
            <h3 className="section-title text-2xl font-bold">{title}</h3>
            <span className="text-xs text-text-muted">
              {startIndex + 1}-
              {Math.min(startIndex + itemsPerPage, items.length)} of{" "}
              {items.length}
            </span>
          </div>
        )}

        <section className={`grid ${gridCols} gap-4`}>
          {visibleItems.map((item, index) => renderItem(item, index))}
        </section>

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-5">
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={!hasPrevPage}
              className="cursor-pointer group flex items-center gap-2 bg-accent hover:bg-accent/90 text-bg px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-[0_0_24px_-4px_rgba(167,139,250,0.4)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-accent disabled:hover:shadow-none"
            >
              Previous
            </button>
            <span className="text-sm text-text-muted uppercase tracking-wider font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={!hasNextPage}
              className="cursor-pointer group flex items-center gap-2 bg-accent hover:bg-accent/90 text-bg px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-[0_0_24px_-4px_rgba(167,139,250,0.4)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-accent disabled:hover:shadow-none"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </ErrorBoundary>
  );
}

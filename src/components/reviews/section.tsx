import { useCallback, useEffect, useState } from "react";
import { IconMessage, IconStarFilled, IconEye, IconAlertTriangle } from "@tabler/icons-react";
import type { Review } from "@/service/getReviews";

interface FilterOption {
  slug: string;
  label: string;
}

const typeOptions: FilterOption[] = [
  { slug: "anime", label: "Anime" },
  { slug: "manga", label: "Manga" },
];

const preliminaryOptions: FilterOption[] = [
  { slug: "true", label: "All Reviews" },
  { slug: "false", label: "Completed Only" },
];

const spoilerOptions: FilterOption[] = [
  { slug: "false", label: "No Spoilers" },
  { slug: "true", label: "Include Spoilers" },
];

interface PaginationParse {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number | null;
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pagination, setPagination] = useState<PaginationParse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    type: { slug: "anime", label: "Anime" },
    preliminary: { slug: "true", label: "All Reviews" },
    spoilers: { slug: "false", label: "No Spoilers" },
  });

  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = useCallback(
    async ({ page }: { page: number }) => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          endpoint: "reviews",
          type: filters.type.slug,
          preliminary: filters.preliminary.slug,
          spoilers: filters.spoilers.slug,
          page: page.toString(),
        });

        const res = await fetch(`/api/route?${params.toString()}`);
        const data = await res.json();

        if (data.error && data.error.status !== 200) {
          setError(data.error.message);
          setReviews([]);
          setPagination(null);
        } else {
          setReviews(data.data || []);
          setPagination(data.pagination || null);
        }
      } catch (err) {
        setError("Failed to fetch reviews");
        setReviews([]);
        setPagination(null);
      } finally {
        setIsLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    fetchData({ page: 1 });
    setCurrentPage(1);
  }, [fetchData]);

  const handleFilterChange = (
    filterKey: "type" | "preliminary" | "spoilers",
    option: FilterOption
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: option,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchData({ page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-400";
    if (score >= 6) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <section className="space-y-6 pt-14">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 rounded-xl bg-surface border border-border">
        {/* Type Filter */}
        <div className="flex flex-col gap-2">
          <span className="text-xs text-text-muted font-medium uppercase tracking-wide">
            Type
          </span>
          <div className="flex gap-1 p-1 rounded-lg bg-bg">
            {typeOptions.map((option) => (
              <button
                key={option.slug}
                onClick={() => handleFilterChange("type", option)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                  filters.type.slug === option.slug
                    ? "bg-accent text-white"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/4"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Preliminary Filter */}
        <div className="flex flex-col gap-2">
          <span className="text-xs text-text-muted font-medium uppercase tracking-wide">
            Status
          </span>
          <div className="flex gap-1 p-1 rounded-lg bg-bg">
            {preliminaryOptions.map((option) => (
              <button
                key={option.slug}
                onClick={() => handleFilterChange("preliminary", option)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                  filters.preliminary.slug === option.slug
                    ? "bg-accent text-white"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/4"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Spoilers Filter */}
        <div className="flex flex-col gap-2">
          <span className="text-xs text-text-muted font-medium uppercase tracking-wide">
            Spoilers
          </span>
          <div className="flex gap-1 p-1 rounded-lg bg-bg">
            {spoilerOptions.map((option) => (
              <button
                key={option.slug}
                onClick={() => handleFilterChange("spoilers", option)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                  filters.spoilers.slug === option.slug
                    ? "bg-accent text-white"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/4"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="p-6 rounded-xl bg-surface border border-border animate-pulse"
            >
              <div className="flex gap-4">
                <div className="w-24 h-32 rounded-lg bg-bg" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 w-1/3 bg-bg rounded" />
                  <div className="h-4 w-1/4 bg-bg rounded" />
                  <div className="h-4 w-full bg-bg rounded" />
                  <div className="h-4 w-2/3 bg-bg rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="p-8 rounded-xl bg-red-500/10 border border-red-500/30 text-center">
          <p className="text-red-400 font-medium">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && reviews.length === 0 && (
        <div className="p-8 rounded-xl bg-surface border border-border text-center">
          <IconMessage size={48} className="mx-auto text-text-muted mb-4" />
          <p className="text-text-secondary font-medium">No reviews found</p>
        </div>
      )}

      {/* Reviews List */}
      {!isLoading && !error && reviews.length > 0 && (
        <div className="grid gap-6">
          {reviews.map((review, index) => (
            <article
              key={review.mal_id}
              style={{ animationDelay: `${index * 0.08}s` }}
              className="group relative overflow-hidden rounded-xl bg-surface border border-border hover:border-border-hover transition-all duration-500 animate-fade-up"
            >
              <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6">
                {/* Entry Image */}
                <a
                  href={review.entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0"
                >
                  <img
                    width={120}
                    height={160}
                    src={review.entry.images.jpg.large_image_url}
                    alt={review.entry.title}
                    className="w-24 sm:w-32 h-auto rounded-lg object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </a>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                      <a
                        href={review.entry.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-semibold text-text-primary hover:text-accent transition-colors line-clamp-2"
                      >
                        {review.entry.title}
                      </a>
                      <div className="flex items-center gap-3 mt-1 text-sm">
                        <span
                          className={`flex items-center gap-1 font-bold ${getScoreColor(
                            review.score
                          )}`}
                        >
                          <IconStarFilled size={14} />
                          {review.score}/10
                        </span>
                        <span className="text-text-muted">
                          {formatDate(review.date)}
                        </span>
                        <span className="px-2 py-0.5 text-xs rounded-full bg-accent/10 text-accent font-medium">
                          {review.type}
                        </span>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex gap-2">
                      {review.is_preliminary && (
                        <span className="flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-yellow-500/10 text-yellow-500 font-medium">
                          <IconAlertTriangle size={12} />
                          Preliminary
                        </span>
                      )}
                      {review.is_spoiler && (
                        <span className="flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-red-500/10 text-red-500 font-medium">
                          <IconEye size={12} />
                          Spoiler
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  {review.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {review.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs rounded-md bg-bg text-text-secondary font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Review Text */}
                  <p
                    className={`text-sm text-text-secondary leading-relaxed ${
                      review.is_spoiler && filters.spoilers.slug === "false"
                        ? "blur-sm select-none"
                        : ""
                    }`}
                  >
                    {review.is_spoiler && filters.spoilers.slug === "false"
                      ? "This review contains spoilers. Click to reveal."
                      : review.review.slice(0, 500)}
                    {review.review.length > 500 && "..."}
                  </p>

                  {/* Footer: User */}
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                    <a
                      href={review.user.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                      <img
                        width={32}
                        height={32}
                        src={review.user.images.jpg.image_url}
                        alt={review.user.username}
                        className="w-8 h-8 rounded-full object-cover"
                        loading="lazy"
                      />
                      <span className="text-sm font-medium text-text-primary">
                        {review.user.username}
                      </span>
                    </a>

                    {/* Reactions */}
                    <div className="flex items-center gap-3 ml-auto text-xs text-text-muted">
                      <span className="flex items-center gap-1">
                        <IconStarFilled size={12} className="text-yellow-400" />
                        {review.reactions.overall}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && pagination && pagination.last_visible_page > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-surface border border-border text-text-secondary hover:bg-white/4 hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            Previous
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, pagination.last_visible_page) }, (_, i) => {
              let pageNum: number;
              if (pagination.last_visible_page <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= pagination.last_visible_page - 2) {
                pageNum = pagination.last_visible_page - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 text-sm font-medium rounded-lg transition-all duration-300 ${
                    currentPage === pageNum
                      ? "bg-accent text-white"
                      : "bg-surface border border-border text-text-secondary hover:bg-white/4 hover:text-text-primary"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.has_next_page}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-surface border border-border text-text-secondary hover:bg-white/4 hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
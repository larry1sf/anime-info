import { IconStarFilled } from "@tabler/icons-react";

export default function Card({
  image,
  id,
  title,
  rating,
  badge,
  index: i,
  section = "anime",
  children,
}: {
  image: string;
  id: number;
  title: string;
  rating?: string;
  badge?: React.ReactNode;
  section?: string;
  index: number;
  children?: React.ReactNode;
}) {
  return (
    <article
      style={{ animationDelay: `${i * 0.06}s` }}
      className="group relative overflow-hidden rounded-xl bg-surface border border-border hover:border-border-hover transition-all duration-500 animate-fade-up glow-hover"
    >
      {/* Image Container */}
      <a
        href={`/${section}/${id}`}
        className={`relative block aspect-3/4 overflow-hidden ${image ? "" : "bg-text-muted animate-pulse"}`}
      >
        <img
          width={300}
          height={400}
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-surface via-transparent to-transparent opacity-60" />

        {/* Badge */}
        {(rating || badge) && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-bg/70 backdrop-blur-md text-text-primary px-2 py-1 rounded-lg text-xs font-medium border border-border">
            {rating && (
              <>
                <IconStarFilled size={10} className="text-amber-400" />
                <span>{rating}</span>
              </>
            )}
            {badge}
          </div>
        )}
      </a>

      {/* Content */}
      <div className="p-3.5 space-y-2">
        <h4
          className={`h-9 text-sm font-semibold text-text-primary line-clamp-2 group-hover:text-accent transition-colors duration-300 leading-snug ${title ? "" : "animate-pulse bg-text-muted  w-full rounded"} `}
        >
          {title}
        </h4>
        {children}
      </div>
    </article>
  );
}

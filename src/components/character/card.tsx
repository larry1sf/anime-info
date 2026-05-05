import { IconStarFilled } from "@tabler/icons-react";

export default function CharacterCard({
  image,
  id,
  name,
  favorites,
  nameKanji,
  index,
}: {
  image: string;
  id: number;
  name: string;
  favorites: number;
  nameKanji?: string;
  index: number;
}) {
  return (
    <article
      style={{ animationDelay: `${index * 0.06}s` }}
      className="group relative overflow-hidden rounded-xl bg-surface border border-border hover:border-border-hover transition-all duration-500 animate-fade-up glow-hover"
    >
      {/* Image Container */}
      <a
        href={`/character/${id}`}
        className={`relative block aspect-3/4 overflow-hidden ${image ? "" : "bg-text-muted animate-pulse"}`}
      >
        <img
          width={300}
          height={400}
          src={image}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-surface via-transparent to-transparent opacity-60" />

        {/* Favorites badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-bg/70 backdrop-blur-md text-text-primary px-2 py-1 rounded-lg text-xs font-medium border border-border">
          <IconStarFilled size={10} className="text-amber-400" />
          <span>{favorites.toLocaleString()}</span>
        </div>
      </a>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-surface via-surface/90 to-transparent">
        <a
          href={`/character/${id}`}
          className="block"
        >
          {/* Character Name */}
          <h3 className="font-semibold text-sm text-text-primary mb-1 line-clamp-2">
            {name}
          </h3>
          
          {/* Character Name (Kanji) */}
          {nameKanji && (
            <p className="text-xs text-text-muted/70 font-medium mb-1 line-clamp-1">
              {nameKanji}
            </p>
          )}
          
          {/* Character Type Badge */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-accent bg-accent/10 px-2 py-0.5 rounded-full font-medium uppercase tracking-wider">
              Character
            </span>
          </div>
        </a>
      </div>
    </article>
  );
}
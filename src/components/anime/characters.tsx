import { useState } from "react";

export default function CharactersList({ characters }: { characters: any[] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!characters || characters.length === 0) return null;

  const INITIAL_COUNT = 8;
  const hasMore = characters.length > INITIAL_COUNT;
  const visibleCharacters = isExpanded ? characters : characters.slice(0, INITIAL_COUNT);

  return (
    <section className="space-y-5 animate-fade-up" style={{ animationDelay: "0.6s" }}>
      <div className="flex items-center justify-between">
        <h3 className="section-title text-2xl font-bold">Characters</h3>
        {hasMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors"
          >
            {isExpanded ? "Show less" : `Show all (${characters.length})`}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {visibleCharacters.map((char: any, index: number) => (
          <div
            key={char.character.mal_id + "-" + index}
            className="glass rounded-2xl p-2 flex flex-col gap-3 group hover:-translate-y-1 transition-transform border border-border/50 hover:border-accent/40 shadow-xl shadow-transparent hover:shadow-accent/10"
          >
            <div className="relative w-full aspect-3/4 overflow-hidden rounded-xl">
              <img
                src={char.character.images?.webp?.image_url || char.character.images?.jpg?.image_url}
                alt={char.character.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-t from-bg/90 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-60"></div>
            </div>
            <div className="px-2 pb-2 text-center flex flex-col gap-0.5">
              <h4
                className="font-bold text-text-primary text-sm line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-white group-hover:to-accent transition-colors"
                title={char.character.name}
              >
                {char.character.name}
              </h4>
              <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold">
                {char.role}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {hasMore && isExpanded && (
        <div className="pt-2 flex justify-center">
            <button
              onClick={() => setIsExpanded(false)}
              className="text-sm font-semibold px-6 py-2 rounded-full bg-surface text-text-primary border border-border hover:border-border-hover hover:bg-surface-hover transition-colors shadow-lg"
            >
              Show less characters
            </button>
        </div>
      )}
    </section>
  );
}

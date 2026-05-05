import PaginatedGrid from "@/components/PaginatedGrid";

export default function CharactersList({ characters }: { characters: any[] }) {
  const renderCharacter = (char: any, index: number) => (
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
  );

  if (!characters || characters.length === 0) return null;

  return (
    <PaginatedGrid
      items={characters}
      renderItem={renderCharacter}
      title="Characters"
      itemsPerPage={8}
      gridCols="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
    />
  );
}
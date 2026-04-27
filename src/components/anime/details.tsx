import { IconChevronDown } from "@tabler/icons-react";
import { useState, useRef, useEffect } from "react";

function DetailItem({
  detail,
}: {
  detail: {
    relation: string;
    entry: { mal_id: number; type: string; name: string }[];
  };
}) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [detail.entry]);

  return (
    <div
      key={`${detail.relation}-${detail.entry[0].mal_id}`}
      className=""
      style={{ animationDelay: "0.15s" }}
    >
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="cursor-pointer w-full list-none flex items-center justify-between text-text-muted font-semibold text-[10px] uppercase hover:text-accent transition-colors duration-300"
      >
        <span>{detail.relation}</span>
        <span
          className="transition-transform duration-300 text-text-muted"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <IconChevronDown />
        </span>
      </button>

      {/* Animated panel */}
      <div
        style={{
          maxHeight: isOpen ? `${height}px` : "0px",
          overflow: "hidden",
          transition: "max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div
          ref={contentRef}
          className="text-text-primary font-medium flex flex-col gap-2 leading-relaxed pt-2 border-t border-border/50"
        >
          {detail.entry.map((entry) => (
            <a
              href={`/${entry.type}/${entry.mal_id}`}
              className="text-sm hover:text-accent hover:underline"
              key={entry.mal_id}
            >
              {entry.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Details({
  optionsDetails,
}: {
  optionsDetails?: {
    relation: string;
    entry: { mal_id: number; type: string; name: string }[];
  }[];
}) {
  return (
    <section className="glass rounded-2xl p-6 space-y-4 animate-fade-up group select-none">
      <h3 className="section-title text-xl">Related</h3>
      {optionsDetails?.map((detail) => (
        <DetailItem
          key={`${detail.relation}-${detail.entry[0].mal_id}`}
          detail={detail}
        />
      ))}
    </section>
  );
}

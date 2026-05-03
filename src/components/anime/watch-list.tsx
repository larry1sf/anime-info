import { useState } from "react";
import { IconBookmarkFilled } from "@tabler/icons-react";

const colorActive =
  "cursor-pointer group flex items-center gap-2 bg-accent hover:bg-accent/90 text-bg px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-[0_0_24px_-4px_rgba(167,139,250,0.4)] border border-accent/90";
const colorDefault =
  "cursor-pointer flex items-center gap-2 bg-transparent hover:bg-white/10 glass text-text-primary px-5 py-2.5 rounded-xl text-sm font-semibold border border-border hover:border-border-hover transition-all duration-300";

export default function WatchList({}: { id: string; seccion: string }) {
  const [isFollow, setIsFollow] = useState(false);
  const colorBtn = isFollow ? colorActive : colorDefault;

  const handleClick = () => {
    setIsFollow(!isFollow);
  };
  return (
    <button onClick={handleClick} className={`${colorBtn} w-full mb-6`}>
      <IconBookmarkFilled size={16} />

      {isFollow ? "Remove from Watch List" : "Add to Watch List"}
    </button>
  );
}

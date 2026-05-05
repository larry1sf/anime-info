import { getAnime, getAnimeById } from "@/service/getAnime";
import { searchAnimeAndManga } from "@/service/getSearch";
import { getCharacters, getCharacterFullById } from "@/service/getCharacters";
import {
  getReviews,
  getAnimeReviews,
  getMangaReviews,
} from "@/service/getReviews";

export async function GET({ url }: { url: URL }) {
  const endpoint = url.searchParams.get("endpoint");
  const ids = url.searchParams.get("ids");
  const section = url.searchParams.get("section") || "anime";

  // Character endpoints
  if (endpoint === "characters") {
    const page = url.searchParams.get("page");
    const q = url.searchParams.get("q");
    const order_by = url.searchParams.get("order_by");
    const sort = url.searchParams.get("sort");
    const letter = url.searchParams.get("letter");
    const limit = url.searchParams.get("limit");

    const data = await getCharacters({
      page: page ? parseInt(page, 10) : 1,
      q: q || "",
      order_by: order_by || "mal_id",
      sort: sort || "desc",
      letter: letter || "",
      limit: limit ? parseInt(limit, 10) : 10,
    });
    return Response.json(data);
  }

  if (endpoint === "character") {
    if (!ids)
      return Response.json(
        { error: "Character ID is required" },
        { status: 400 },
      );
    const id = parseInt(ids, 10);
    const data = await getCharacterFullById(id);
    return Response.json(data);
  }

  // Reviews endpoints
  if (endpoint === "reviews") {
    const type = url.searchParams.get("type") || "anime";
    const page = url.searchParams.get("page");
    const preliminary = url.searchParams.get("preliminary");
    const spoilers = url.searchParams.get("spoilers");

    const data = await getReviews({
      type: type as "anime" | "manga",
      page: page ? parseInt(page, 10) : 1,
      preliminary: preliminary !== "false",
      spoilers: spoilers === "true",
    });
    return Response.json(data);
  }

  if (endpoint === "anime-reviews") {
    if (!ids)
      return Response.json({ error: "Anime ID is required" }, { status: 400 });
    const page = url.searchParams.get("page");
    const preliminary = url.searchParams.get("preliminary");
    const spoilers = url.searchParams.get("spoilers");

    const data = await getAnimeReviews({
      id: parseInt(ids, 10),
      page: page ? parseInt(page, 10) : 1,
      preliminary: preliminary !== "false",
      spoilers: spoilers === "true",
    });
    return Response.json(data);
  }

  if (endpoint === "manga-reviews") {
    if (!ids)
      return Response.json({ error: "Manga ID is required" }, { status: 400 });
    const page = url.searchParams.get("page");
    const preliminary = url.searchParams.get("preliminary");
    const spoilers = url.searchParams.get("spoilers");

    const data = await getMangaReviews({
      id: parseInt(ids, 10),
      page: page ? parseInt(page, 10) : 1,
      preliminary: preliminary !== "false",
      spoilers: spoilers === "true",
    });
    return Response.json(data);
  }

  // Original anime endpoints
  if (ids) {
    const id = parseInt(ids, 10);
    const data = await getAnimeById(id, section);
    return Response.json(data);
  }

  const data = await getAnime();
  return Response.json(data);
}

export async function POST({ request }: { request: Request }) {
  const {
    endpoint,
    q,
    limit,
    ids,
    page,
    preliminary,
    spoilers,
    rating,
    type,
    status,
    section,
    order_by,
    sort,
    letter,
    query,
    year,
    source,
  } = await request.json();
  // Search endpoint
  if (endpoint === "search") {
    const searchQuery = q;
    if (!searchQuery) {
      return Response.json({ error: "Query is required" }, { status: 400 });
    }
    const data = await searchAnimeAndManga(searchQuery, limit || 6);

    const characterData = await getCharacters({
      q: searchQuery,
      limit: 5,
      order_by: "favorites",
      sort: "desc",
    });

    return Response.json({
      anime: data.anime || [],
      manga: data.manga || [],
      characters: characterData.data || [],
    });
  }

  // Character endpoints via POST
  if (endpoint === "characters") {
    const data = await getCharacters({
      page,
      q,
      order_by,
      sort,
      letter,
      limit,
    });
    console.log(data);
    return Response.json(data);
  }

  // Reviews endpoints via POST
  if (endpoint === "reviews") {
    const data = await getReviews({
      type: type || "anime",
      page: page || 1,
      preliminary: preliminary !== false,
      spoilers: spoilers === true,
    });
    return Response.json(data);
  }

  if (endpoint === "anime-reviews") {
    if (!ids)
      return Response.json({ error: "Anime ID is required" }, { status: 400 });
    const data = await getAnimeReviews({
      id: ids,
      page: page || 1,
      preliminary: preliminary !== false,
      spoilers: spoilers === true,
    });
    return Response.json(data);
  }

  if (endpoint === "manga-reviews") {
    if (!ids)
      return Response.json({ error: "Manga ID is required" }, { status: 400 });
    const data = await getMangaReviews({
      id: ids,
      page: page || 1,
      preliminary: preliminary !== false,
      spoilers: spoilers === true,
    });
    return Response.json(data);
  }

  // Original anime endpoints
  const data = await getAnime({
    page,
    rating,
    type,
    status: status,
    query,
    sectionSearch: section,
    year,
    source,
    order_by,
    sort,
  });
  return Response.json(data);
}

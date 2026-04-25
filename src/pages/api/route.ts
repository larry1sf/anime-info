import { getAnime } from "@/service/getAnime";
export const prerender = false;

export async function GET() {
  const data = await getAnime();
  return Response.json(data);
}

export async function POST({ request }: { request: Request }) {
  const { page, rating, type, status, section, query } = await request.json();
  const data = await getAnime({
    page,
    rating,
    type,
    status,
    query,
    sectionSearch: section,
  });
  return Response.json(data);
}

import {
    useCallback,
    useEffect,
    useRef,
    useState
} from "react"
import type { Anime, tResAnimeFull } from "@/types/api";
import { KEY_LOCAL_STORAGE, classBtn } from "@/const";
import { Heart } from "@/assets/Icons"
import { getLocalStorage } from "@/service/getLocalStorage";
import { fetchApi } from "@/service/fetchApi";

type tStages = "home" | "anime-type" | "favorites" | "ratings"
type tTypeAnime = "tv" | "movie" | "ova" | "special" | "ona" | "music" | "cm" | "pv" | "tv_special"
type tRatingsAnime = "g" | "pg" | "pg13" | "r17" | "r" | "rx" | ""
type tTags = { label?: string, stageKey: tStages | tTypeAnime | tRatingsAnime }[]


export default function Dashboard({ initialData }: { initialData: tResAnimeFull }) {
    const [stage, setStage] = useState<tStages | tTypeAnime>("home")
    const [rating, setRating] = useState<tRatingsAnime>("")

    const [page, setPage] = useState(1)

    const handleStage = (stage: tStages | tTypeAnime) => {
        setStage(stage)
    }
    const handlePage = (page: number) => {
        setPage(page)
    }
    const handleRating = (rating: tRatingsAnime) => {
        setRating(rating)
    }

    return (
        <>
            {
                rating
            }
            <Aside
                handlePage={handlePage}
                handleStage={handleStage}
                handleRating={handleRating}

            />
            <Board
                stage={stage}
                rating={rating}
                currentPage={page}
                handlePage={handlePage}
                initialData={initialData}
            />

        </>
    )
}

function Aside({ handleStage, handlePage, handleRating }: { handleRating: (rating: tRatingsAnime) => void, handleStage: (stage: tStages | tTypeAnime) => void, handlePage: (page: number) => void }) {

    const optionsButons: tTags =
        [
            { label: "home", stageKey: "home" },
            { label: "types", stageKey: "anime-type" },
            { label: "audience ratings", stageKey: "ratings" },
            { label: "favorites", stageKey: "favorites" }
        ]
    const animeTypes: tTags = [
        { stageKey: "tv" },
        { stageKey: "movie" },
        { stageKey: "ova" },
        { stageKey: "special" },
        { stageKey: "music" },
        { stageKey: "cm" },
        { stageKey: "pv" },
        { stageKey: "tv_special" },
    ]
    const animeRating: tTags = [
        { label: "All Ages", stageKey: "g" },
        { label: "Children", stageKey: "pg" },
        { label: "Teens 13 or older", stageKey: "pg13" },
        { label: "17+ (violence & profanity)", stageKey: "r17" },
        { label: "Mild Nudity", stageKey: "r" },
        { label: "Hentai", stageKey: "rx" },
    ]

    const handleClick = (stageKey: tStages | tTypeAnime) => {
        handleStage(stageKey)
        handleRating("")
        handlePage(1)
    }

    return (
        <aside className="max-w-lg mx-auto mt-4">
            <nav className="flex justify-evenly ">
                {
                    optionsButons.map(({ label, stageKey }) => {
                        if (stageKey === "ratings")
                            return <ButtonDropdown
                                key={label}
                                text={label ?? stageKey}
                                tags={animeRating}
                                handlePage={handlePage}
                                handle={handleRating}
                            />
                        if (stageKey === "anime-type")
                            return <ButtonDropdown
                                key={label}
                                text={label ?? stageKey}
                                tags={animeTypes}
                                handlePage={handlePage}
                                handle={handleStage}
                            />

                        return (
                            <button
                                key={label}
                                onClick={() => handleClick(stageKey as tStages)}
                                type="button"
                                className={`${classBtn}`}>{label}</button>
                        )
                    })
                }
            </nav>
        </aside>
    )
}

function Board({ currentPage, rating, stage, initialData, handlePage }: { rating: tRatingsAnime, stage: tStages | tTypeAnime, currentPage: number, initialData: tResAnimeFull, handlePage: (page: number) => void }) {
    const [homeData, setHomeData] = useState(initialData)
    const [favoriteData, setFavoriteData] = useState<Anime[]>([])
    const [disabledButton, setDisabledButton] = useState({ next: false, prev: false })

    const [loadingBoard, setLoadingBoard] = useState(false)

    const { items, has_next_page, } = homeData.pagination

    const hasNextPage = has_next_page
    const hasPrevPage = currentPage > 1
    const itemsPerPage = items.per_page

    const fetchFavorites = useCallback(async () => {
        const storage = getLocalStorage()
        if (storage.length) {

            const arrPromises = storage.map(id => (fetchApi({ stage, id })))
            const res = await Promise.all(arrPromises) as unknown as { data: Anime }[]
            const newFavs = (res).map(({ data }) => data)

            if (newFavs.length) setFavoriteData(newFavs)
        }
    }, [stage, itemsPerPage])

    const handleNextPage = useCallback(async (positionType: "next" | "prev") => {
        if (positionType === "next" && !hasNextPage || positionType === "prev" && !hasPrevPage) return

        const page = positionType === "next"
            ? currentPage + 1
            : currentPage - 1
        handlePage(page)

        const fetchChangePage = async () => {
            let res: tResAnimeFull | null | undefined
            setLoadingBoard(true)
            res = await fetchApi({ stage, rating, itemsPerPage, searchParams: `&page=${currentPage}` })
            if (res && res != null) setHomeData(res)
            setLoadingBoard(false)
        }
        fetchChangePage()

        if (stage !== "favorites") {
            setDisabledButton(prevDat => ({
                ...prevDat,
                [positionType]: true
            }))

            setTimeout(() => {
                setDisabledButton(prevDat => ({
                    ...prevDat,
                    [positionType]: false
                }))
            }, 400);
        }
    }, [currentPage, stage, rating, hasNextPage, hasPrevPage])

    useEffect(() => {
        const fetchChangeType = async () => {
            if (stage === "favorites") {
                fetchFavorites()
                return
            }

            if (stage === "home") {
                setHomeData(initialData)
                return
            }

            setLoadingBoard(true)
            const res = await fetchApi({ stage, rating, itemsPerPage }) as tResAnimeFull
            if (res) setHomeData(res)
            setLoadingBoard(false)
        }
        fetchChangeType()
    }, [stage])

    useEffect(() => {
        if (rating === "") {
            setHomeData(initialData)
            return
        }

        const fetchChangeRating = async () => {
            setLoadingBoard(true)
            const res = await fetchApi({ stage, rating, itemsPerPage })
            if (res) setHomeData(res)
            setLoadingBoard(false)
        }
        fetchChangeRating()
    }, [rating])

    const startIndexFav = (currentPage - 1) * itemsPerPage
    const endIndexFav = currentPage * itemsPerPage
    const displayData = stage === "favorites" ? favoriteData.slice(startIndexFav, endIndexFav) : homeData.data

    const totalPages = stage === "favorites"
        ? Math.ceil(favoriteData.length / itemsPerPage)
        : Math.ceil(items.total / itemsPerPage);

    return (
        <>
            <section className={`grid grid-cols-4 gap-6 mt-8 transition duration-200 ${loadingBoard ? "opacity-60" : "opacity-100"}`}>
                {
                    displayData?.map(anime => (
                        <CardAnime key={anime?.mal_id} {...anime} />
                    ))
                }
            </section>
            <nav className="flex justify-center items-center gap-4 mt-8">
                <button
                    onClick={() => handleNextPage("prev")}
                    disabled={!hasPrevPage || disabledButton.prev || loadingBoard}
                    className={classBtn}
                    type="button"
                >prev</button>
                <span className="min-w-24 text-center"> {currentPage} / {totalPages}</span>
                <button
                    onClick={() => handleNextPage("next")}
                    disabled={!hasNextPage || disabledButton.next || loadingBoard}
                    className={classBtn}
                    type="button"
                >next</button>
            </nav>
        </>
    )
}

function ButtonDropdown({ text, handle, handlePage, tags }: {
    text: string,
    tags?: tTags,
    handlePage: (page: number) => void,
    handle?: (state: any) => void
}) {

    const [open, setOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement | null>(null)
    const buttonRef = useRef<HTMLButtonElement | null>(null)

    useEffect(() => {
        function clickOut(e: MouseEvent) {
            const target = e.target as Node

            if (
                menuRef.current &&
                !menuRef.current.contains(target) &&
                buttonRef.current &&
                !buttonRef.current.contains(target)
            ) {
                setOpen(false)
            }
        }

        document.addEventListener("click", clickOut)
        return () => document.removeEventListener("click", clickOut)
    }, [])

    const handleClick = (typeKey: string) => {
        handle?.(typeKey)
        handlePage(1)
    }

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                className={`${classBtn}`}
                onClick={() => setOpen(prev => !prev)}
                type="button"
            >
                {text}
            </button>
            <article
                ref={menuRef}
                className={`absolute top-full mt-4 z-30 bg-primary left-0 rounded-2xl p-4 text-bg min-w-48 transition-all duration-300 ease-out ${open ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-2.5 invisible"}`}>
                <ul className="space-y-2">
                    {tags?.map((item) => (
                        <li key={item.stageKey}>
                            <button
                                onClick={() => handleClick(item.stageKey)}
                                className="w-full text-left capitalize py-2 px-4 text-bg bg-primary hover:contrast-90 rounded-lg transition-all duration-300 cursor-pointer "
                            >
                                {
                                    typeof item.label === "undefined"
                                        ? item.stageKey
                                        : item.label
                                }
                            </button>
                        </li>
                    ))}
                </ul>
            </article>
        </div>
    )
}


function CardAnime(anime: Anime) {
    const [isFavorite, setIsFavorite] = useState(false)

    const handleClickFavorite = () => {
        setIsFavorite(prev => !prev)
        const storage = getLocalStorage()
        let newStorage;

        if (storage.length) {
            const exist = storage.find(fav => fav === anime.mal_id)
            newStorage = exist
                ? storage.filter(fav => fav !== anime.mal_id)
                : [...storage, anime.mal_id]
        }
        else
            newStorage = [anime.mal_id]

        localStorage.setItem(KEY_LOCAL_STORAGE, JSON.stringify(newStorage))
    }

    useEffect(() => {
        const storage = getLocalStorage()
        if (storage.length) {
            const isFavorite = storage.find(fav => fav === anime.mal_id)
            if (isFavorite) setIsFavorite(true)
        }
    }, [])

    const isFavoriteColor = isFavorite ? "text-red-500" : "text-bg"
    const title = `Saber mas sobre ${anime.title}`
    return (
        <article key={anime.mal_id} className="group relative aspect-3/4 overflow-hidden rounded-2xl bg-linear-to-br from-primary/10 to-primary/5 border border-primary/20 transition-all duration-300 hover:shadow-xl hover:border-primary/40">
            {/* Imagen de fondo */}
            <div className="absolute inset-0 z-0">
                <img
                    loading="lazy"
                    height={300}
                    width={200}
                    className="h-full w-full object-cover contrast-105 transition-transform duration-500 group-hover:scale-110"
                    src={anime.images.webp.image_url ?? ""}
                    alt={anime.title ?? ""}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
            </div>

            {/* Contenido superpuesto */}
            <div className="absolute inset-0 z-10 p-4 flex flex-col justify-end text-white">
                <div
                    onClick={handleClickFavorite}
                    className="absolute top-3 left-3 rounded-2xl bg-primary hover:bg-primary/90 active:scale-95 p-2 transition-all duration-300 shadow-2xl">
                    <Heart className={`${isFavoriteColor} size-5 transition-all`} />
                </div>
                <div className="space-y-2">
                    {/* Título */}
                    <h3 className="text-lg font-bold line-clamp-2 leading-tight">
                        {anime.title}
                    </h3>

                    {/* Información adicional */}
                    <div className="flex flex-wrap gap-2 text-xs opacity-90">
                        {anime.type && (
                            <span className="px-2 py-1 bg-primary/30 rounded-full backdrop-blur-sm">
                                {anime.type}
                            </span>
                        )}
                        {anime.episodes && (
                            <span className="px-2 py-1 bg-primary/30 rounded-full backdrop-blur-sm">
                                {anime.episodes} eps
                            </span>
                        )}
                        {anime.score && (
                            <span className="px-2 py-1 bg-primary/30 rounded-full backdrop-blur-sm">
                                🎖️{anime.score.toFixed(1)}
                            </span>
                        )}
                    </div>

                    {/* Año y estado */}
                    <div className="flex items-center gap-2 text-xs opacity-80">
                        {anime.year && (
                            <span>{anime.year}</span>
                        )}
                        {anime.status && (
                            <span>• {anime.status}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Hover overlay */}
            {/* <div className="absolute inset-0 z-20 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button title={title} className="px-4 py-2 bg-primary hover:contrast-95 cursor-pointer text-white rounded-full text-sm font-medium  opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    Ver más
                </button>
            </div> */}
        </article>
    )
}
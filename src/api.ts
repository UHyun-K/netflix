import { Types } from "./utils";

const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
    id: number;
    backdrop_path: string;
    poster_path: string;
    original_title: string;
    overview: string;
}
export interface IGetMoviesResult {
    dates: {
        maximum: string;
        minimum: string;
    };
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
}

export async function getMovies(type: Types) {
    return await fetch(
        `${BASE_PATH}/movie/${type}?api_key=${process.env.API_KEY}&page=1&region=kr`
    ).then((response) => response.json());
}

export interface IResults {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    media_type: string;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}
export interface ISearchResults {
    page: number;
    results: IResults[];
}
export async function multiSearch(keyword: string, page: number) {
    return await fetch(
        `${BASE_PATH}/search/multi?api_key=${process.env.API_KEY}&query=${keyword}&page=${page}&include_adult=false`
    ).then((response) => response.json());
}

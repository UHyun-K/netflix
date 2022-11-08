const API_KEY = "19c4c90aceaf9b236688c52f5c12b74f";
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

export interface ISlider {
    data: IGetMoviesResult;
    subject: string;
}
export function getMovies() {
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
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
        `${BASE_PATH}/search/multi?api_key=${API_KEY}&query=${keyword}&page=${page}&include_adult=false`
    ).then((response) => response.json());
}

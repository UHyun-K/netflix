const API_KEY = "19c4c90aceaf9b236688c52f5c12b74f";
const BASE_PATH = "https://api.themoviedb.org/3";

export function getMovies() {
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
}

export default getMovies;

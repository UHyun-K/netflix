export function makeImagePath(id: string, format?: string) {
    return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
}
export enum Types {
    "popular" = "popular",
    "top_rated" = "top_rated",
    "upcoming" = "upcoming",
}

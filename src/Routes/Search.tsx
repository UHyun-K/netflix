import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import {
    useNavigate,
    useLocation,
    useMatch,
    PathMatch,
} from "react-router-dom";
import { useQuery } from "react-query";
import { multiSearch } from "../api";
import { ISearchResults } from "../api";
import { makeImagePath } from "../utils";
import MovieDetail from "../Components/MovieDetail";
import { useEffect } from "react";
const Wrapper = styled.div`
    position: relative;
    top: 100px;
    padding: 0 60px;
`;
const Loader = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const SearchedTitle = styled.h1`
    font-size: 28px;
    font-weight: bold;
    padding: 0 0 10px 0;
`;
const Row = styled(motion.div)`
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(4, 6fr);

    width: 100%;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
    background-image: url(${(props) => props.bgphoto});
    background-size: cover;
    background-position: center center;
    height: 200px;
    font-size: 60px;
    position: relative;
    cursor: pointer;
`;

function Search() {
    const location = useLocation();
    const navigate = useNavigate();
    const { scrollY } = useScroll();

    const keyword = new URLSearchParams(location.search).get("keyword");
    const { data, isLoading, refetch } = useQuery<ISearchResults>(
        ["search", "results"],
        () => multiSearch(keyword!, 1)
    );
    useEffect(() => {
        refetch();
    }, [keyword]);

    const newKeyword = keyword!.replace(/^[a-z]/, (char) => char.toUpperCase());

    const bigMovieMatch: PathMatch<string> | null =
        useMatch(`/search/:movieId`);

    const onBoxClicked = (movieId: number) => {
        navigate(`/search/${movieId}?keyword=${keyword}`);
    };

    const clickedMovie =
        bigMovieMatch?.params.movieId &&
        data?.results.find(
            (movie) => movie.id + "" === bigMovieMatch.params.movieId
        );

    return (
        <Wrapper>
            {isLoading ? (
                <Loader>Loading...</Loader>
            ) : (
                <div>
                    <SearchedTitle>
                        {" "}
                        {newKeyword}에 대한 검색결과{" "}
                    </SearchedTitle>
                    {data?.results.length === 0 ? (
                        <Loader>
                            검색 결과가 없습니다. 다른 검색어를 시도해보세요.
                        </Loader>
                    ) : (
                        <Row>
                            {data?.results.map((movie) => (
                                <Box
                                    key={movie.id}
                                    bgphoto={
                                        movie.backdrop_path ||
                                        movie.poster_path !==
                                            (null || undefined)
                                            ? makeImagePath(
                                                  movie.backdrop_path ||
                                                      movie.poster_path
                                              )
                                            : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                                    }
                                    onClick={() => onBoxClicked(movie.id)}
                                ></Box>
                            ))}
                        </Row>
                    )}

                    <AnimatePresence>
                        {clickedMovie ? (
                            <MovieDetail
                                layoutId={bigMovieMatch.params.movieId + ""}
                                clickedMovie={clickedMovie}
                                scrolly={scrollY.get()}
                                back={`/search?keyword=${keyword}`}
                            />
                        ) : null}
                    </AnimatePresence>
                </div>
            )}
        </Wrapper>
    );
}
export default Search;

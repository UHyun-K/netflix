import { useQuery } from "react-query";
import { getMovies, IGetMoviesResult } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMatch, PathMatch } from "react-router-dom";
const Wrapper = styled.div`
    background: black;
`;
const Loader = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const Banner = styled.div<{ bgphoto: string }>`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
        url(${(props) => props.bgphoto});
    background-size: cover;
`;
const Title = styled.h2`
    font-size: 68px;
    margin-bottom: 10px;
`;

const Overview = styled.p`
    font-size: 28px;
    width: 50%;
`;

const Slider = styled.div`
    position: relative;
    top: -100px;
`;

const Row = styled(motion.div)`
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(6, 1fr);

    position: absolute;
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
    &:first-child {
        transform-origin: center left;
    }
    &:last-child {
        transform-origin: center right;
    }
`;

const Info = styled(motion.div)`
    padding: 10px;
    background-color: ${(props) => props.theme.black.lighter};
    opacity: 0;
    position: absolute;
    width: 100%;
    bottom: 0;
    h4 {
        text-align: center;
        font-size: 18px;
    }
`;
const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    opacity: 0;
`;
const BigMovie = styled(motion.div)<{ scrolly: number }>`
    position: absolute;
    width: 50vw;
    top: ${(props) => props.scrolly + 100}px;
    height: 80vh;
    left: 0;
    right: 0;
    margin: 0 auto;
    border-radius: 15px;
    overflow: hidden;
    background-color: ${(props) => props.theme.black.lighter};
`;
const BigCover = styled.div`
    width: 100%;
    background-size: cover;
    background-position: center center;
    height: 400px;
`;
const BigTitle = styled.h3`
    color: ${(props) => props.theme.white.lighter};
    padding: 10px;
    font-size: 46px;
    position: relative;
    top: -80px;
`;
const BigOverview = styled.p`
    padding: 20px;
    position: relative;
    top: -80px;
    color: ${(props) => props.theme.white.lighter};
`;
const rowVariants = {
    hidden: {
        x: window.innerWidth,
    },
    visible: {
        x: 0,
    },
    exit: {
        x: -window.innerWidth,
    },
};

const boxVariants = {
    normal: {
        scale: 1,
    },
    hover: {
        scale: 1.3,
        zIndex: 99,
        y: -50,
        transition: {
            delay: 0.5,
            duration: 0.1,
            type: "tween",
        },
    },
};
const infoVariants = {
    hover: {
        opacity: 1,
    },
    transition: {
        delay: 0.5,
        duration: 0.1,
        type: "tween",
    },
};
const offset = 6;

function Home() {
    const navigate = useNavigate();
    const bigMovieMatch: PathMatch<string> | null =
        useMatch("/movies/:movieId");
    const { scrollY } = useScroll();
    const { data, isLoading } = useQuery<IGetMoviesResult>(
        ["movies", "nowPlaying"],
        getMovies
    );
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);

    const increaseInex = () => {
        if (data) {
            if (leaving) return;
            toggleLeaving();
            const totalMovies = data.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    const toggleLeaving = () => setLeaving((prev) => !prev);
    const onBoxClicked = (movieId: number) => {
        navigate(`/movies/${movieId}`);
    };
    const onOverlayClicked = () => navigate("/");
    const clickedMovie =
        bigMovieMatch?.params.movieId &&
        data?.results.find(
            (movie) => movie.id + "" === bigMovieMatch.params.movieId
        );

    return (
        <Wrapper>
            {isLoading ? (
                <Loader>Loading... </Loader>
            ) : (
                <>
                    <Banner
                        onClick={increaseInex}
                        bgphoto={makeImagePath(
                            data?.results[0].backdrop_path || ""
                        )}
                    >
                        <Title>{data?.results[0].title}</Title>
                        <Overview>{data?.results[0].overview}</Overview>
                    </Banner>
                    <Slider>
                        <AnimatePresence
                            initial={false}
                            onExitComplete={toggleLeaving}
                        >
                            <Row
                                variants={rowVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                key={index}
                                transition={{ type: "tween", duration: 1 }}
                            >
                                {data?.results
                                    .slice(1)
                                    .slice(
                                        offset * index,
                                        offset * index + offset
                                    )
                                    .map((movie) => (
                                        <Box
                                            layoutId={movie.id + ""}
                                            key={movie.id}
                                            whileHover="hover"
                                            initial="normal"
                                            variants={boxVariants}
                                            onClick={() =>
                                                onBoxClicked(movie.id)
                                            }
                                            transition={{ type: "tween" }}
                                            bgphoto={makeImagePath(
                                                movie.backdrop_path,
                                                "w500"
                                            )}
                                        >
                                            <Info variants={infoVariants}>
                                                <h4>{movie.title}</h4>
                                            </Info>
                                        </Box>
                                    ))}
                            </Row>
                        </AnimatePresence>
                    </Slider>
                    <AnimatePresence>
                        {bigMovieMatch ? (
                            <>
                                <Overlay
                                    onClick={onOverlayClicked}
                                    exit={{ opacity: "0" }}
                                    animate={{ opacity: "1" }}
                                />
                                <BigMovie
                                    layoutId={bigMovieMatch.params.movieId}
                                    scrolly={scrollY.get()}
                                >
                                    {clickedMovie && (
                                        <>
                                            <BigCover
                                                style={{
                                                    backgroundImage: `linear-gradient( to top , black, transparent ), 
                                                    url(
                                                      ${makeImagePath(
                                                          clickedMovie.backdrop_path
                                                      )}
                                                    )`,
                                                }}
                                            />
                                            <BigTitle>
                                                {clickedMovie.title}
                                            </BigTitle>
                                            <BigOverview>
                                                {clickedMovie.overview}
                                            </BigOverview>
                                        </>
                                    )}
                                </BigMovie>
                            </>
                        ) : null}
                    </AnimatePresence>
                </>
            )}
        </Wrapper>
    );
}
export default Home;

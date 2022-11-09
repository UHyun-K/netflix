import styled from "styled-components";
import { makeImagePath, Types } from "../utils";
import { getMovies, IGetMoviesResult } from "../api";
import { useQuery } from "react-query";
import { useState } from "react";
import { useNavigate, useMatch, PathMatch } from "react-router-dom";
import { motion, AnimatePresence, useScroll } from "framer-motion";

const SliderWrapper = styled.div`
    position: relative;
    top: -75px;
    height: 210px;
`;

const Category = styled(motion.div)`
    padding-left: 60px;
    padding-bottom: 10px;
    display: flex;
    align-items: center;
    text-transform: uppercase;
    cursor: pointer;
    font-size: 20px;
    font-weight: bold;
    &:hover {
        svg {
        }
    }
    svg {
        width: 15px;
        height: 15px;
        color: ${(props) => props.theme.white.darker};
    }
`;

const Row = styled(motion.div)`
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(5, 1fr);
    position: absolute;
    width: 100%;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
    background-image: url(${(props) => props.bgphoto});
    background-size: cover;
    background-position: center center;
    height: 160px;

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
const BtnSlider = styled.div<{ isNext: boolean }>`
    height: 100%;
    width: 40px;
    background-color: rgba(0, 0, 0, 0.4);
    position: absolute;
    right: ${(props) => (props.isNext ? 0 : null)};
    left: ${(props) => (props.isNext ? null : 0)};
    display: flex;
    place-items: center;
    svg {
        width: 50px;
        height: 50px;
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
    hidden: (clickPrev: boolean) => ({
        x: clickPrev ? -window.innerWidth : window.innerWidth,
    }),
    visible: {
        x: 0,
    },
    exit: (clickPrev: boolean) => ({
        x: clickPrev ? window.innerWidth : -window.innerWidth,
    }),
};
/* const boxVariants = {
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
}; */
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

const svgVariants = {
    hover: {
        x: 15,
        transition: {
            duration: 0.3,
        },
    },
};
const offset = 5;

function Slider({ type }: { type: Types }) {
    const navigate = useNavigate();
    const { data, isLoading } = useQuery<IGetMoviesResult>(
        ["movies", type],
        () => getMovies(type)
    );

    const bigMovieMatch: PathMatch<string> | null =
        useMatch("/movies/:movieId");

    const clickedMovie =
        bigMovieMatch?.params.movieId &&
        data?.results.find(
            (movie) => movie.id + "" === bigMovieMatch.params.movieId
        );

    const { scrollY } = useScroll();
    const onOverlayClicked = () => navigate("../");

    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const [clickPrev, setClickPrev] = useState(false);
    const onBoxClicked = (movieId: number) => {
        navigate(`/movies/${movieId}`);
    };
    const toggleLeaving = () => setLeaving((prev) => !prev);

    const decreaseInex = () => {
        if (data) {
            if (leaving) return;
            setClickPrev(true);

            toggleLeaving();
            const totalMovies = data.results.length;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
        }
    };
    const increaseInex = () => {
        if (data) {
            if (leaving) return;
            setClickPrev(false);

            toggleLeaving();
            const totalMovies = data.results.length;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };

    return (
        <div>
            {isLoading ? (
                <h2>Loading...</h2>
            ) : (
                <>
                    <SliderWrapper>
                        <Category whileHover="hover">
                            {type === Types.popular
                                ? "popular"
                                : type === Types.top_rated
                                ? "top rated"
                                : type === Types.upcoming
                                ? "upcoming"
                                : ""}
                            <motion.svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 384 512"
                                fill="#e5e5e5"
                                variants={svgVariants}
                            >
                                <path d="M342.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L274.7 256 105.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                            </motion.svg>
                        </Category>
                        <AnimatePresence
                            initial={false}
                            onExitComplete={toggleLeaving}
                            custom={clickPrev}
                        >
                            <Row
                                variants={rowVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                key={index}
                                transition={{ type: "tween", duration: 1 }}
                                custom={clickPrev}
                            >
                                {data?.results
                                    .slice(
                                        offset * index,
                                        offset * index + offset
                                    )
                                    .map((movie) => (
                                        <Box
                                            layoutId={movie.id + ""}
                                            key={movie.id}
                                            whileHover="hover"
                                            /*
                                            initial="normal"
                                            variants={boxVariants} */
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
                                                <h4>{movie.original_title}</h4>
                                            </Info>
                                        </Box>
                                    ))}
                            </Row>
                        </AnimatePresence>
                        <BtnSlider isNext={false} onClick={decreaseInex}>
                            <motion.svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 256 512"
                                fill="currentColor"
                            >
                                <path d="M137.4 406.6l-128-127.1C3.125 272.4 0 264.2 0 255.1s3.125-16.38 9.375-22.63l128-127.1c9.156-9.156 22.91-11.9 34.88-6.943S192 115.1 192 128v255.1c0 12.94-7.781 24.62-19.75 29.58S146.5 415.8 137.4 406.6z" />
                            </motion.svg>
                        </BtnSlider>
                        <BtnSlider isNext={true} onClick={increaseInex}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 256 512"
                                fill="currentColor"
                            >
                                <path d="M118.6 105.4l128 127.1C252.9 239.6 256 247.8 256 255.1s-3.125 16.38-9.375 22.63l-128 127.1c-9.156 9.156-22.91 11.9-34.88 6.943S64 396.9 64 383.1V128c0-12.94 7.781-24.62 19.75-29.58S109.5 96.23 118.6 105.4z" />
                            </svg>
                        </BtnSlider>
                    </SliderWrapper>

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
                                                {clickedMovie.original_title}
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
        </div>
    );
}

export default Slider;

import { useQuery } from "react-query";
import { getMovies, IGetMoviesResult } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
const Wrapper = styled.div`
    background: black;
`;
const Loader = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const Banner = styled.div<{ bgPhoto: string }>`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
        url(${(props) => props.bgPhoto});
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
const Box = styled(motion.div)<{ bgPhoto: string }>`
    background-color: white;
    background-image: url(${(props) => props.bgPhoto});
    background-size: cover;
    background-position: center center;
    height: 200px;
    color: red;
    font-size: 60px;
    position: relative;
    &:first-child {
        transform-origin: center left;
    }
    &:last-child {
        transform-origin: center right;
    }
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
const Info = styled(motion.div)`
    padding: 20px;
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
function Home() {
    const { data, isLoading } = useQuery<IGetMoviesResult>(
        ["movies", "nowPlaying"],
        getMovies
    );
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);

    const boxVariants = {
        normal: {
            scale: 0,
        },
        hover: {
            scale: 1.3,
            zIndex: 99,
            y: -50,
            transition: {
                delay: 0.5,
                duration: 0.3,
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
            duration: 0.3,
            type: "tween",
        },
    };
    const offset = 6;

    const increaseInex = () => {
        if (data) {
            if (leaving) return;
            toggleLeaving();
            const totalMovies = data?.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    const toggleLeaving = () => setLeaving((prev) => !prev);
    console.log(data, isLoading);
    return (
        <Wrapper>
            {isLoading ? (
                <Loader>Loading... </Loader>
            ) : (
                <>
                    <Banner
                        onClick={increaseInex}
                        bgPhoto={makeImagePath(
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
                                            key={movie.id}
                                            whileHover="hover"
                                            initial="normal"
                                            variants={boxVariants}
                                            bgPhoto={makeImagePath(
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
                </>
            )}
        </Wrapper>
    );
}
export default Home;

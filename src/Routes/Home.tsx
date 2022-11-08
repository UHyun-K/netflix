import { useQuery } from "react-query";
import { getMovies, IGetMoviesResult } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMatch, PathMatch } from "react-router-dom";
import Slider from "../Components/Slider";
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

    const toggleLeaving = () => setLeaving((prev) => !prev);

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
                        bgphoto={makeImagePath(
                            data?.results[0].backdrop_path || ""
                        )}
                    >
                        <Title>{data?.results[0].original_title}</Title>
                        <Overview>{data?.results[0].overview}</Overview>
                    </Banner>
                    <Slider data={data!} subject={"넷플릭스 인기 콘텐츠"} />

                    {/*       <Slider >
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
                                                movie.poster_path,
                                                "w300"
                                            )}
                                        >
                                            <Info variants={infoVariants}>
                                                <h4>{movie.original_title}</h4>
                                            </Info>
                                        </Box>
                                    ))}
                            </Row>
                        
                        </AnimatePresence>
                    </Slider> */}
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
        </Wrapper>
    );
}
export default Home;

import styled from "styled-components";
import { motion, useScroll } from "framer-motion";
import { IMovie } from "../api";
import { useNavigate } from "react-router-dom";
import { makeImagePath } from "../utils";

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
    z-index: 99;
`;
const BigCover = styled.div`
    width: 100%;
    background-size: cover;
    background-position: center center;
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
        width: 20%;
        border-radius: 10%;
    }
`;
const BigTitle = styled.h3`
    color: ${(props) => props.theme.white.lighter};
    padding: 10px;
    font-size: 35px;
    position: relative;
    top: -65px;
    text-align: center;
`;
const BigOverview = styled.p`
    padding: 20px;
    position: relative;
    top: -55px;
    line-height: 23px;
    color: ${(props) => props.theme.white.lighter};
    word-spacing: 3px;
`;
interface IMovieDetail {
    layoutId: string;
    back: string;
    clickedMovie: IMovie;
    scrolly: number;
}
function MovieDetail({ layoutId, back, clickedMovie, scrolly }: IMovieDetail) {
    const navigate = useNavigate();
    const onOverlayClicked = () => navigate(back);

    return (
        <>
            <Overlay
                onClick={onOverlayClicked}
                exit={{ opacity: "0" }}
                animate={{ opacity: "1" }}
            />
            <BigMovie layoutId={layoutId} scrolly={scrolly}>
                {clickedMovie && (
                    <>
                        <BigCover
                            style={{
                                backgroundImage: `linear-gradient( to top , #181818, rgba(0,0,0,0.5) ), 
          url(
            ${makeImagePath(clickedMovie.backdrop_path)}
          )`,
                            }}
                        >
                            <img
                                src={makeImagePath(clickedMovie.poster_path)}
                            ></img>
                        </BigCover>
                        <BigTitle>
                            {clickedMovie.title || clickedMovie.name}
                        </BigTitle>
                        <BigOverview>
                            {clickedMovie.overview === ""
                                ? "정보 없음"
                                : clickedMovie.overview}
                        </BigOverview>
                    </>
                )}
            </BigMovie>
        </>
    );
}
export default MovieDetail;

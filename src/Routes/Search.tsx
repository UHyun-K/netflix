import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import { multiSearch } from "../api";
import { ISearchResults } from "../api";
import { makeImagePath } from "../utils";
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
`;

function Search() {
    const location = useLocation();
    const navigate = useNavigate();
    console.log(location);
    const keyword = new URLSearchParams(location.search).get("keyword");
    const newKeyword = keyword!.replace(/^[a-z]/, (char) => char.toUpperCase());
    const { data, isLoading } = useQuery<ISearchResults>(
        ["search", "results"],
        () => multiSearch(keyword!)
    );

    return (
        <Wrapper>
            {isLoading ? (
                <Loader>"Loading..."</Loader>
            ) : (
                <>
                    <SearchedTitle> {newKeyword}</SearchedTitle>
                    <Row>
                        {data?.results.map((movie) => (
                            <Box
                                key={movie.id}
                                bgphoto={makeImagePath(movie.backdrop_path)}
                            ></Box>
                        ))}
                    </Row>
                </>
            )}
        </Wrapper>
    );
}
export default Search;

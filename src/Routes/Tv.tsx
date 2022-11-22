import { getTvs, IGetMoviesResult } from "../api";
import styled from "styled-components";
import { useQuery } from "react-query";
import { makeImagePath, Types } from "../utils";
import { SliderTv } from "../Components/Slider";

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
    font-size: 40px;
    margin-bottom: 30px;
`;

const Overview = styled.p`
    line-height: 28px;
    font-size: 20px;
    width: 50%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
`;

function Tv() {
    const { data, isLoading } = useQuery<IGetMoviesResult>(
        ["tv", "getBanner"],
        () => getTvs(Types.popular)
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
                        <Title>{data?.results[0].title}</Title>
                        <Overview>{data?.results[0].overview}</Overview>
                    </Banner>
                    <>
                        <SliderTv type={Types.popular} />
                        <SliderTv type={Types.top_rated} />
                        <SliderTv type={Types.on_the_air} />
                    </>
                </>
            )}
        </Wrapper>
    );
}
export default Tv;

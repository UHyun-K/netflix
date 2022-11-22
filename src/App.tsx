import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";
import { Helmet, HelmetProvider } from "react-helmet-async";

function App() {
    return (
        <BrowserRouter>
            <HelmetProvider>
                <Helmet>
                    <title>Netflix</title>
                </Helmet>
            </HelmetProvider>

            <Header />
            <Routes>
                <Route path="/*" element={<Home />}>
                    <Route path="movies/:movieId" element={<Home />} />
                </Route>
                <Route path="/tv" element={<Tv />}>
                    <Route path="/tv/:movieId" element={<Tv />} />
                </Route>
                <Route path="/search" element={<Search />}>
                    <Route path="/search/:movieId" element={<Search />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;

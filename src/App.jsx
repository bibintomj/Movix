import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { fetchDataFromApi } from "./utils/api";

import { useSelector, useDispatch } from "react-redux";
import { getApiConfiguration, getGenres } from "./store/homeSlice";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Details from "./pages/details/Details";
import SearchResult from "./pages/searchResult/SearchResult";
import Explore from "./pages/explore/Explore";
import PageNotFound from "./pages/PageNotFound/PageNotFound";

// main app component
function App() {
  const dispatch = useDispatch();
  const { url } = useSelector((state) => state.home);
  console.log(url); // log api config urls

  useEffect(() => {
    fetchApiConfig(); // fetch api configuration on mount
    genresCall(); // fetch genres on mount
  }, []);

  // fetches api configuration and dispatches to redux store
  const fetchApiConfig = () => {
    fetchDataFromApi("/configuration").then((res) => {
      console.log(res); // log configuration response

      const url = {
        backdrop: res.images.secure_base_url + "original",
        poster: res.images.secure_base_url + "original",
        profile: res.images.secure_base_url + "original",
      };

      dispatch(getApiConfiguration(url)); // update redux store
    });
  };

  // fetches genres for tv and movie, merges and dispatches to redux store
  const genresCall = async () => {
    let promises = [];
    let endPoints = ["tv", "movie"];
    let allGenres = {};

    endPoints.forEach((url) => {
      promises.push(fetchDataFromApi(`/genre/${url}/list`)); // add fetch promises
    });

    const data = await Promise.all(promises); // wait for all genre fetches
    console.log(data); // log genres data
    data.map(({ genres }) => {
      return genres.map((item) => (allGenres[item.id] = item)); // merge genres by id
    });

    dispatch(getGenres(allGenres)); // update redux store
  };

  // renders routes and layout
  return (
    <>
      <BrowserRouter>
        <Header />
        <>
          <Routes>
            <Route path="/" element={<Home />} /> {/* home page route */}
            <Route path="/:mediaType/:id" element={<Details />} /> {/* details page route */}
            <Route path="/search/:query" element={<SearchResult />} /> {/* search results route */}
            <Route path="/explore/:mediaType" element={<Explore />} /> {/* explore page route */}
            <Route path="*" element={<PageNotFound />} /> {/* fallback route */}
          </Routes>
          <Footer />
        </>
      </BrowserRouter>
    </>
  );
}

export default App; // export app component
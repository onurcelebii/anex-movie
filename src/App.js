import { useEffect, useState, useRef } from "react";
import "./App.css";
import axios from "axios";
import Movie from "./components/MovieCard";
import Youtube from "react-youtube";
import { PiTelevisionSimpleBold } from "react-icons/pi";
import { FaImdb } from "react-icons/fa";
import { FaCirclePlay } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Footer from "./components/Footer";
import { useTranslation } from "react-i18next";
import i18n from "./i18n";

function App() {
  const API_KEY = "8f46844674bfd02f0ea39744e7e9f337";
  const BACKDROP_PATH = "https://image.tmdb.org/t/p/w1280";
  const MOVIE_API = "https://api.themoviedb.org/3/";
  const SEARCH_API = MOVIE_API + "search/movie";
  const TOP_RATED_API = MOVIE_API + "movie/top_rated";
  const UPCOMING_API = MOVIE_API + "movie/upcoming";

  const [playing, setPlaying] = useState(false);
  const [trailer, setTrailer] = useState(null);
  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [movie, setMovie] = useState({ title: "Loading Movies" });
  const [data, setData] = useState(null);
  const [visibleMovies, setVisibleMovies] = useState(4);
  const [searchResultsTitle, setSearchResultsTitle] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState({});
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [visibleUpcomingMovies, setVisibleUpcomingMovies] = useState(4);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentUpcomingCardIndex, setCurrentUpcomingCardIndex] = useState(0);

  const popupRef = useRef(null);
  let navigate = useNavigate();

  const { t, i18n } = useTranslation();

  const clickHandle = (lang) => {
    i18n.changeLanguage(lang);
  };

  useEffect(() => {
    fetchMovies();
    fetchUpcomingMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const fetchMovies = async (searchValue = searchKey) => {
    try {
      const { data } = await axios.get(
        `${searchValue ? SEARCH_API : TOP_RATED_API}`,
        {
          params: {
            api_key: API_KEY,
            query: searchValue,
          },
        }
      );

      setMovies(data.results);

      if (data.results.length > 0) {
        const selectedMovie = searchValue ? data.results[0] : data.results[0];
        setMovie(selectedMovie);
        await fetchMovie(selectedMovie.id);
        if (searchValue) {
          navigate(`movie/${selectedMovie.id}`);
        }
      }

      if (searchValue) {
        setSearchResultsTitle(t("search_results_title"));
      } else {
        setSearchResultsTitle(t("featured_movies_title"));
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    const clearUrl = () => {
      const url = window.location.href;
      const hasMovieId = url.includes("movie/") && movies.length > 0;

      if (hasMovieId) {
        const baseUrl = url.split("movie/")[0];
        window.history.replaceState(null, "", baseUrl);
      }
    };
    clearUrl();
    const handlePopState = () => {
      clearUrl();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [movies]);

  const fetchMovie = async (id) => {
    try {
      const { data } = await axios.get(`${MOVIE_API}movie/${id}`, {
        params: {
          api_key: API_KEY,
          append_to_response: "videos",
        },
      });

      if (data.videos && data.videos.results) {
        const trailer = data.videos.results.find(
          (vid) => vid.name === "Official Trailer"
        );
        setTrailer(trailer ? trailer : data.videos.results[0]);
      }

      setData(data);
    } catch (error) {
      console.error("Error fetching movie:", error);
    }
  };

  const fetchUpcomingMovies = async () => {
    try {
      const { data } = await axios.get(`${UPCOMING_API}`, {
        params: {
          api_key: API_KEY,
        },
      });
      setUpcomingMovies(data.results);
    } catch (error) {
      console.error("Error fetching upcoming movies:", error);
    }
  };

  const selectMovie = (movie, index) => {
    fetchMovie(movie.id);
    setPlaying(false);
    setMovie(movie);
    // setCurrentCardIndex(index);
    // setCurrentUpcomingCardIndex(index);
    window.scrollTo(0, 0);
    navigate(`movie/${movie.id}`);
  };

  const renderMovies = () =>
    movies
      .slice(currentCardIndex, currentCardIndex + visibleMovies)
      .map((movie, index) => (
        <Movie
          selectMovie={(movie) => selectMovie(movie, currentCardIndex + index)}
          key={movie.id}
          movie={movie}
          data={data}
        />
      ));

  const renderUpcomingMovies = () =>
    upcomingMovies
      .slice(
        currentUpcomingCardIndex,
        currentUpcomingCardIndex + visibleUpcomingMovies
      )
      .map((movie, index) => (
        <Movie
          selectMovie={(movie) =>
            selectMovie(movie, currentUpcomingCardIndex + index)
          }
          key={movie.id}
          movie={movie}
          data={data}
        />
      ));

  const handleSeeMore = () => {
    setVisibleMovies((prevVisibleMovies) => prevVisibleMovies + 4);
  };

  const handleUpcomingSeeMore = () => {
    setVisibleUpcomingMovies((prevVisibleMovies) => prevVisibleMovies + 4);
  };

  const handleSearchInput = async (event) => {
    const input = event.target.value;
    setSearchKey(input);

    if (input.length > 0) {
      const { data } = await axios.get(`${SEARCH_API}`, {
        params: {
          api_key: API_KEY,
          query: input,
        },
      });

      if (data.results.length > 0) {
        setPopupContent(data.results[0]);
        setShowPopup(true);
      } else {
        setShowPopup(false);
      }
    } else {
      setShowPopup(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handlePopupClick();
      fetchMovies();
      setShowPopup(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showPopup]);

  const handlePopupClick = () => {
    setSearchKey("");
  };

  const navigateToNextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % movies.length);
  };

  const navigateToPrevCard = () => {
    setCurrentCardIndex(
      (prevIndex) => (prevIndex - 1 + movies.length) % movies.length
    );
  };

  const navigateToNextUpcomingCard = () => {
    setCurrentUpcomingCardIndex((prevIndex) => (prevIndex + 1) % movies.length);
  };

  const navigateToPrevUpcomingCard = () => {
    setCurrentUpcomingCardIndex(
      (prevIndex) => (prevIndex - 1 + movies.length) % movies.length
    );
  };

  return (
    <div className="App">
      {movies.length ? (
        <main>
          {movie ? (
            <div
              className="poster"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${BACKDROP_PATH}${movie.backdrop_path})`,
              }}
            >
              <header className="center-max-size header">
                <div className="movie-box">
                  <span
                    className="brand flex items-center cursor-pointer"
                    onClick={() => window.location.reload()}
                  >
                    <PiTelevisionSimpleBold className="tv-icon mr-2" />
                    {t("movieBox")}
                  </span>
                </div>
                <form className="form relative">
                  <input
                    placeholder={t("search")}
                    className="search border border-white bg-transparent px-10 py-5 rounded-6 text-white w-200"
                    type="text"
                    id="search"
                    onInput={handleSearchInput}
                    onKeyDown={handleKeyDown}
                    value={searchKey}
                  />
                  {showPopup && (
                    <div
                      ref={popupRef}
                      className="popup bg-gray-300 cursor-pointer"
                      onClick={(event) => {
                        event.preventDefault();
                        fetchMovies();
                        setShowPopup(false);
                        handlePopupClick();
                      }}
                    >
                      <div className="search-popup flex items-center">
                        <img
                          className="search-popup-img w-16 h-21 object-cover rounded"
                          src={BACKDROP_PATH + popupContent.poster_path}
                          alt={popupContent.title}
                        />
                        <div className="popup-content ml-2">
                          <h2 className="popup-content-title">
                            {popupContent.title}
                          </h2>
                          {data?.genres && (
                            <div className="genres-container">
                              <p>
                                {data.genres
                                  .map((genre) => genre.name)
                                  .join(", ")}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  <button
                    className="submit-search bg-transparent text-white border-none cursor-pointer"
                    onClick={(event) => {
                      event.preventDefault();
                      fetchMovies();
                      setShowPopup(false);
                      handlePopupClick();
                    }}
                  >
                    <IoSearch className="search-icon" />
                  </button>
                </form>
              </header>
              <div className="language-button">
                <button onClick={() => clickHandle("en")}>English</button>
                <button onClick={() => clickHandle("de")}>Deutsch</button>
              </div>
              {playing ? (
                <>
                  <Youtube
                    videoId={trailer.key}
                    className="youtube amru"
                    containerClassName="youtube-container amru"
                    opts={{
                      width: "100%",
                      height: "450px",
                      alignItems: "center",
                      playerVars: {
                        autoplay: 1,
                        controls: 0,
                        cc_load_policy: 0,
                        fs: 0,
                        iv_load_policy: 0,
                        modestbranding: 0,
                        rel: 0,
                        showinfo: 0,
                      },
                    }}
                  />
                  <button
                    onClick={() => setPlaying(false)}
                    className="button close-video"
                  >
                    {t("close")}
                  </button>
                </>
              ) : (
                <div className="center-max-size">
                  <div className="poster-content">
                    {trailer ? (
                      <>
                        <h1 className="text-8xl">{movie.title}</h1>
                        <div className="header-imdb flex items-center">
                          <FaImdb className="header-imdb-icon w-6 h-8 mr-2 text-fcc400" />
                          <span className="imdb-rating mr-2 font-light">
                            {movie.vote_average.toFixed(1)}
                          </span>
                        </div>
                        <p className="mt-4">{movie.overview}</p>
                        <button
                          className="button play-video mt-4"
                          onClick={() => setPlaying(true)}
                          type="button"
                        >
                          <span className="watch-trailer-title flex items-center">
                            <FaCirclePlay className="watch-trailer-icon mr-2" />
                            {t("watch_trailer")}
                          </span>
                        </button>
                      </>
                    ) : (
                      <div>{t("no_trailer_avaible")}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : null}

          <div>
            <div className="featured-movie">
              <span id="result-title">{searchResultsTitle}</span>
              {visibleMovies < movies.length && (
                <div className="see-more-container">
                  <button
                    onClick={handleSeeMore}
                    className="see-more-button text-c7171a border-none px-10 cursor-pointer flex items-center"
                  >
                    {t("see_more")} <span className="arrow ml-1">&#10140;</span>
                  </button>
                </div>
              )}
            </div>

            <div className="pagination-container">
              <div className="pagination-buttons flex justify-between items-center w-full">
                <button
                  className="arrow-button text-black bg-transparent border-none text-16 cursor-pointer"
                  onClick={navigateToPrevCard}
                >
                  &lt;
                </button>
                <div className="center-max-size container">
                  {renderMovies()}
                </div>
                <button
                  className="arrow-button text-black bg-transparent border-none text-16 cursor-pointer"
                  onClick={navigateToNextCard}
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="featured-movie">
              <span id="result-title">{t("new_arrival")}</span>
              {visibleMovies < movies.length && (
                <div className="see-more-container">
                  <button
                    onClick={handleUpcomingSeeMore}
                    className="see-more-button text-c7171a border-none px-10 cursor-pointer flex items-center"
                  >
                    {t("see_more")} <span className="arrow ml-1">&#10140;</span>
                  </button>
                </div>
              )}
            </div>

            <div className="pagination-container">
              <div className="pagination-buttons flex justify-between items-center w-full">
                <button
                  className="arrow-button text-black bg-transparent border-none text-16 cursor-pointer"
                  onClick={navigateToPrevUpcomingCard}
                >
                  &lt;
                </button>
                <div className="center-max-size container">
                  {renderUpcomingMovies()}
                </div>
                <button
                  className="arrow-button text-black bg-transparent border-none text-16 cursor-pointer"
                  onClick={navigateToNextUpcomingCard}
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <div>{t("no_movie_found")}</div>
      )}
      <Footer />
    </div>
  );
}

export default App;

import { FaImdb } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const Movie = ({ movie, selectMovie }) => {
  const MOVIE_API = "https://api.themoviedb.org/3/";
  const API_KEY = "8f46844674bfd02f0ea39744e7e9f337";
  const IMAGE_PATH = "https://image.tmdb.org/t/p/w342";

  const releaseYear = movie.release_date.split("-")[0];
  const [data, setData] = useState(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const { data } = await axios.get(`${MOVIE_API}movie/${movie.id}`, {
          params: {
            api_key: API_KEY,
            append_to_response: "videos",
          },
        });

        setData(data);
      } catch (error) {
        console.error("Error fetching movie:", error);
      }
    };

    fetchMovieData();
  }, [movie.id]);

  return (
    <div onClick={() => selectMovie(movie)} className={"movie"}>
      <div className="movie-title">
        {movie.poster_path ? (
          <img src={IMAGE_PATH + movie.poster_path} alt={movie.title} />
        ) : (
          <p>{t("no_movie_poster_found")}</p>
        )}
        <h6 className="production-countries">
          {releaseYear !== undefined ? (
            <span>{releaseYear}</span>
          ) : (
            <p>{t("release_year_not_found")}</p>
          )}
          {","}
          {data?.production_countries &&
          data.production_countries.length > 0 ? (
            <>
              {data.production_countries.map((country, index) => (
                <span key={index}>
                  {country.iso_3166_1}
                  {index !== data.production_countries.length - 1 && ", "}
                </span>
              ))}
            </>
          ) : (
            <p>{t("production_countries_not_found")}</p>
          )}
        </h6>

        <div className={"flex between movie-infos"}>
          <h5 className={"movie-title"}>{movie.title}</h5>
        </div>

        <div className="imdb-container">
          <FaImdb className="imdb-icon" />
          {movie.vote_average ? (
            <h5 className="imdb-rating">{movie.vote_average.toFixed(1)}</h5>
          ) : (
            <p>{t("imdb_not_found")}</p>
          )}
        </div>

        <div>
          {data?.genres && data.genres.length > 0 ? (
            <div className="genres-container">
              <p>{data.genres.map((genre) => genre.name).join(", ")}</p>
            </div>
          ) : (
            <p className="genres-container">{t("genres_not_found")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Movie;

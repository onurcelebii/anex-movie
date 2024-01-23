import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      welcome: "Welcome",
      movieBox: "MovieBox",
      search: "Search",
      close: "Close",
      watch_trailer: "Watch Trailer",
      search_results_title: "Search Result",
      featured_movies_title: "Featured Movie",
      see_more: "See More",
      new_arrival: "New Arrival",
      no_movie_poster_found: "No movie poster found",
      release_year_not_found: "Release year not found",
      production_countries_not_found: "Production countries not found",
      imdb_not_found: "IMDb not found",
      genres_not_found: "Genres not found",
      conditions_of_use: "Conditions of Use",
      privacy_policy: "Privacy & Policy",
      press_room: "Press Room",
      no_trailer_avaible: "Sorry, no trailer available",
      no_movie_found: "Sorry, no movies found",
    },
  },
  de: {
    translation: {
      welcome: "Willkommen",
      movieBox: "MovieBox",
      search: "Suchen",
      close: "Schließen",
      watch_trailer: "Trailer Ansehen",
      search_results_title: "Suchergebnis",
      featured_movies_title: "Ausgewählter Film",
      see_more: "Mehr sehen",
      new_arrival: "Neuankömmling",
      no_movie_poster_found: "Kein Filmplakat gefunden",
      release_year_not_found: "Erscheinungsjahr nicht gefunden",
      production_countries_not_found: "Produktionsländer nicht gefunden",
      imdb_not_found: "IMDb-Score nicht gefunden",
      genres_not_found: "Genre nicht gefunden",
      conditions_of_use: "Nutzungsbedingungen",
      privacy_policy: "Datenschutzrichtlinie",
      press_room: "Presseraum",
      no_trailer_avaible: "Leider ist kein Trailer verfügbar",
      no_movie_found: "Leider wurden keine Filme gefunden",
    },
  },
};

i18n.use(initReactI18next).init({
  lng: "en",
  resources,
});

export default i18n;

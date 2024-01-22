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
      new_arrival: "New Arrival"
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
      new_arrival: "Neuankömmling"
    },
  },
};

i18n.use(initReactI18next).init({
  lng: "en",
  resources,
});

export default i18n;

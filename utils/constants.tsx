import { HiOutlineColorSwatch } from "react-icons/hi";
import { TfiLayoutMediaLeft, TfiLayoutMediaOverlay } from "react-icons/tfi";
import { RiLayout5Line } from "react-icons/ri";
export const ROUTES = {
  "/access/login": {
    restrictedAccess: false,
  },
  "/access/registration": {
    restrictedAccess: false,
  },
  "/access/forgot": {
    restrictedAccess: false,
  },
  "/": {
    restrictedAccess: false,
  },
  "/access/reset": {
    restrictedAccess: false,
  },
  "/access/verification": {
    restrictedAccess: false,
  },
  "/welcome": {
    restrictedAccess: true,
  },
  "/categories": {
    restrictedAccess: true,
  },
};
export enum RoutesName {
  LOGIN = "/access/login",
  REGISTRATION = "/access/registration",
  FORGOT = "/access/forgot",
  INDEX = "/",
  RESET = "/access/reset",
  VERIFICATION = "/access/verification",
  WELCOME = "/welcome",
  Categories = "/categories",
  AUTHORS = "/home/authors",
}

export const TAB_BAR_ITEMS = [
  {
    path: "/home",
    icon: "home",
    name: "home",
    id: 1,
  },
  {
    path: "/instants",
    icon: "instants",
    name: "instants",
    id: 2,
  },
  {
    path: "/write",
    icon: "write",
    name: "",
    id: 3,
  },
  {
    path: "/explore",
    icon: "explore",
    name: "explore",
    id: 4,
  },
  {
    path: "/saved",
    icon: "saved",
    name: "saved",
    id: 5,
  },
];

export const FILTERS = ["All", "Today", "Continue To Read", "Unread"];

export const RATING_FILTERS = ["All", "5", "4", "3", "2", "1"];

import Posts from "../components/authorView/Posts";
import About from "../components/authorView/About";
import Libraries from "../components/authorView/Library";
import Analytics from "../components/authorView/Analytics";
import Drafts from "../components/authorView/Drafts";

export const AUTHOR_TABS = [
  {
    Tab: Posts,
    name: "posts",
    id: 0,
  },
  {
    Tab: Libraries,
    name: "libraries",
    id: 1,
  },
  // {
  //   Tab: Analytics,
  //   name: "analytics",
  //   id: 2,
  // },
  {
    Tab: About,
    name: "about",
    id: 2,
  },
];

export const ME_TABS = [
  {
    Tab: Posts,
    name: "posts",
    id: 0,
  },
  {
    Tab: About,
    name: "about",
    id: 1,
  },
  // {
  //   Tab: Drafts,
  //   name: "drafts",
  //   id: 2,
  // },
];

export const MAX_WORDS = 100;
export const MAX_WORDS_FOR_REDIRECT = 300;
export const MAX_POST_LENGTH = 110;

export const COLLPSE_SETTINGS = [
  {
    radios: [
      {
        Icon: TfiLayoutMediaOverlay,
        label: "Normal Post",
      },
      {
        Icon: TfiLayoutMediaLeft,
        label: "Small Post",
      },
    ],
    id: 0,
    Icon: RiLayout5Line,
    name: "Post Layout",
  },
  {
    name: "Appearance",
    Icon: HiOutlineColorSwatch,
    id: 1,
    radios: [
      {
        Icon: () => (
          <div className="flex relative w-6 h-6 bg-gray-100 rounded-3xl ">
            <div className="absolute left-0 top-0 w-3 h-6 rounded-l-3xl bg-black"></div>
          </div>
        ),
        label: "System",
      },
      {
        Icon: () => <div className="w-6 h-6 bg-black rounded-full" />,
        label: "Dark",
      },

      {
        Icon: () => (
          <div className="w-6 h-6 border bg-gray-100 border-gray-300 rounded-full" />
        ),
        label: "Light",
      },
    ],
  },
];

import localFont from "@next/font/local";
export const AVAILABLE_FONTS = [
  "Cedarville",
  "Lato",
  "Montserrat",
  "OpenSans",
  "Roboto",
];
export const AVAILABLE_AUDIOS = [
  "a_close_friend.mp3",
  "Anaiah_Bordeaux_Shootout.mp3",
  "Dark_beach-bozo.mp3",
  "Dzanum-teya_dora.mp3",
  "Green_to_blue-Daniel.mp3",
  "Hotline_bling-Gibrian_Alcocer.mp3",
  "Interstellar_main_theme.mp3",
  "Je_te_lasserai_de_mots.mp3",
  "JIGR_heart_over_mind.mp3",
  "Love_story-aelle.mp3",
  "Nocture_in_d-flat_major_Eric_christian.mp3",
  "Scandalous-CPRCRN.mp3",
  "Snowfall_lluvia.mp3",
];

export const Cedarville = localFont({
  src: [
    {
      path: "../public/assets/Cedarville.ttf",
    },
  ],
});
export const Lato = localFont({
  src: "../public/assets/Lato.ttf",
});
export const Montserrat = localFont({
  src: "../public/assets/Montserrat.ttf",
});
export const Roboto = localFont({
  src: "../public/assets/Roboto.ttf",
});
export const OpenSans = localFont({
  src: "../public/assets/OpenSans.ttf",
});

function getFontClassName(val: string) {
  switch (val.toLowerCase()) {
    case "cedarville":
      return Cedarville;
    case "lato":
      return Lato;
    case "montserrat":
      return Montserrat;
    case "roboto":
      return Roboto;
    case "opensans":
      return OpenSans;
  }
}

export const INSTANTS_PAGEABLE_PAGE_SIZE = 2;
export const ARTICLE_PAGEABLE_PAGE_SIZE = 3;
export const AUTHORS_PAGEABLE_PAGE_SIZE = 11;
export const FOLLOWED_AUTHORS_PAGE_SIZE = 3;
export const LIBRARY_PAGEABLE_SIZE = 3;
export const RATINGS_PAGEABLE_SIZE = 3;
export const REPLIES_PAGEABLE_SIZE = 3;

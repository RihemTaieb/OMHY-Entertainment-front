import React from "react";

// Admin Imports


import LandingPage from "views/client/LandingPage"
import ArtistDetails from "views/client/ArtistDetails"
import Casting from "views/client/Casting";
import Nocasting from "views/client/Nocasting";
import Albums from "views/client/Albums";
import AlbumDetail from "views/client/AlbumsDetails";
// Auth Imports
import SignIn from "views/auth/SignIn";


// Icon Imports
import {
  MdBarChart,
  MdLock,
} from "react-icons/md";
import ArtisteTable from "views/admin/artiste/artistetable";
import ChansonTable from "views/admin/chanson/chansontable";
import NewsTable from "views/admin/new/newtable";
import AlbumTable from "views/admin/album/albumtable";
import CastingTable from "views/admin/Casting/castingtable";
import GroupeTable from "views/admin/groupe/groupetable";
import NewsletterTable from "views/admin/newsletter/newsletter";
import BackgroundImageTable from "views/admin/backgroud/BackgroundImageTable";


const routes = [
 

  {
    name: "BackgroundImage",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "Background-ImageTable",
    component: <BackgroundImageTable />,
  },
  {
    name: "Artistes",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "artiste-tables",
    component: <ArtisteTable />,
  },
  {
    name: "Groupe",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "groupe-tables",
    component: <GroupeTable />,
  },
  {
    name: "Chansons",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "chanson-tables",
    component: <ChansonTable />,
  },
  {
    name: "albums",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "albums-tables",
    component: <AlbumTable />,
  },
  {
    name: "News",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "news-tables",
    component: <NewsTable />,
  },
  
  {
    name: "Casting",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "casting-tables",
    component: <CastingTable />,
  },

  {
    name: "Newsletter",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "Newsletter-tables",
    component: <NewsletterTable />,
  },
 
  
  




  

 
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },

  {
    name: "Landing Page",
    layout: "/home",
    path: "",
    component: <LandingPage />,
  },
  {
    name: "Artist Details",
    layout: "/artistdetails",
    path: "",
    component: <ArtistDetails />,
  },

  {
    name: "Casting",
    layout: "/casting",
    path: "",
    component: <Casting />,
  },
  {
    name: "Nocasting",
    layout: "/nocasting",
    path: "",
    component: <Nocasting />,
  },
  {
    name: "Albums",
    layout: "/album",
    path: "",
    component: <Albums />,
  },
  {
    name: "Album Details",
    layout: "/albumdetails",
    path: "",
    component: <AlbumDetail />,
  },
 
];
export default routes;

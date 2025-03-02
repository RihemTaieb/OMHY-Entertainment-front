import React from "react";
import Dropdown from "components/dropdown";
import { FiAlignJustify } from "react-icons/fi";
import { Link } from "react-router-dom";
import navbarimage from "assets/img/layout/Navbar.png";
import { BsArrowBarUp } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import {
  IoMdNotificationsOutline,
  IoMdInformationCircleOutline,
} from "react-icons/io";
import avatar from "assets/img/avatars/avatar4.png";

import { logout } from "services/authService"; // Import de la fonction logout

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4  shadow-md">
      <h1 className="text-xl font-bold"></h1>
      
      {/* Bouton de déconnexion */}
      <button
        onClick={logout} // Appelle la fonction logout
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
      >
        Logout
      </button>
    </nav>
  );
}


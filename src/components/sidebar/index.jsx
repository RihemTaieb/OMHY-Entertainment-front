/* eslint-disable */

import { HiX } from "react-icons/hi";
import Links from "./components/Links";
import customlogo from "../../assets/img/custom-logo.png"
import customlogodark from "../../assets/img/custom-logo-dark.png"
import SidebarCard from "components/sidebar/componentsrtl/SidebarCard";
import routes from "routes.js";

const Sidebar = ({ open, onClose }) => {
  return (
    <div
      className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${
        open ? "translate-x-0" : "-translate-x-96"
      }`}
    >
      <span
        className="absolute top-4 right-4 block cursor-pointer xl:hidden"
        onClick={onClose}
      >
        <HiX />
      </span>

      <div className={`mx-[56px] mt-[50px] flex items-center`}>
  <img
    src={customlogodark} // Default logo (light mode)
    alt="OMHY Logo"
    className="h-20 dark:hidden" // Hide in dark mode
  />
  <img
    src={customlogo} // Dark mode logo
    alt="OMHY Logo"
    className="h-20 hidden dark:block" // Show only in dark mode
  />
</div>


      <div className="mt-[58px] mb-7 h-px bg-gray-300 dark:bg-white/30" />
      {/* Nav item */}

      <ul className="mb-auto pt-1">
        <Links routes={routes} />
      </ul>

      {/* Free Horizon Card */}

      {/* Nav item end */}
    </div>
  );
};

export default Sidebar;

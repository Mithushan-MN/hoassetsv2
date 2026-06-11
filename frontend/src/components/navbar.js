import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-zinc-950/85 backdrop-blur-md border-b border-zinc-900 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3">
          <img src="/images/logo2.png" alt="Logo" className="h-10 w-auto object-contain" />
          <NavLink to="/" className="text-white font-extrabold text-lg tracking-wide uppercase hover:text-red-500 transition-colors">
            Huntsman Assets
          </NavLink>
        </div>

        {/* Hamburger toggle */}
        <button
          className="md:hidden text-zinc-400 hover:text-white text-xl focus:outline-none transition-colors"
          onClick={toggleMenu}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLink to="/dealer" className={({ isActive }) => `text-sm font-semibold tracking-wide uppercase transition-colors duration-200 ${isActive ? "text-red-500 font-bold" : "text-zinc-400 hover:text-white"}`}>
            Dealer Locator
          </NavLink>
          <NavLink to="/support-info" className={({ isActive }) => `text-sm font-semibold tracking-wide uppercase transition-colors duration-200 ${isActive ? "text-red-500 font-bold" : "text-zinc-400 hover:text-white"}`}>
            Support & Info
          </NavLink>
          <NavLink to="/website" className={({ isActive }) => `text-sm font-semibold tracking-wide uppercase transition-colors duration-200 ${isActive ? "text-red-500 font-bold" : "text-zinc-400 hover:text-white"}`}>
            Websites
          </NavLink>
          <NavLink to="/news" className={({ isActive }) => `text-sm font-semibold tracking-wide uppercase flex items-center transition-colors duration-200 ${isActive ? "text-red-500 font-bold" : "text-zinc-400 hover:text-white"}`}>
            New Updates
            <FontAwesomeIcon icon={faBell} className="ml-2 animate-bounce" />
          </NavLink>
        </div>
      </div>

      {/* Mobile Links */}
      <div
        className={`md:hidden absolute top-20 left-0 w-full bg-zinc-950/95 border-b border-zinc-900 transition-all duration-300 ${menuOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-2 invisible pointer-events-none"}`}
      >
        <div className="px-6 py-6 flex flex-col space-y-4">
          <NavLink to="/dealer" className={({ isActive }) => `text-base font-semibold tracking-wide uppercase py-2 transition-colors ${isActive ? "text-red-500" : "text-zinc-400 hover:text-white"}`} onClick={() => setMenuOpen(false)}>
            Dealer Locator
          </NavLink>
          <NavLink to="/support-info" className={({ isActive }) => `text-base font-semibold tracking-wide uppercase py-2 transition-colors ${isActive ? "text-red-500" : "text-zinc-400 hover:text-white"}`} onClick={() => setMenuOpen(false)}>
            Support & Info
          </NavLink>
          <NavLink to="/website" className={({ isActive }) => `text-base font-semibold tracking-wide uppercase py-2 transition-colors ${isActive ? "text-red-500" : "text-zinc-400 hover:text-white"}`} onClick={() => setMenuOpen(false)}>
            Websites
          </NavLink>
          <NavLink to="/news" className={({ isActive }) => `text-base font-semibold tracking-wide uppercase py-2 flex items-center transition-colors ${isActive ? "text-red-500" : "text-zinc-400 hover:text-white"}`} onClick={() => setMenuOpen(false)}>
            New Updates
            <FontAwesomeIcon icon={faBell} className="ml-2 animate-bounce" />
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

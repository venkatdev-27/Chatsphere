import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import logoImage from "../assets/logo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/", section: "hero" },
    { name: "Overview", path: "/", section: "overview" },
    { name: "Features", path: "/", section: "features" },
    { name: "Services", path: "/", section: "services" },
  ];

  const handleNavClick = (link) => {
    setIsMenuOpen(false);

    // If we're not on the home page, navigate to home first
    if (location.pathname !== "/") {
      navigate("/");
      // Wait for navigation, then scroll
      setTimeout(() => {
        const el = document.getElementById(link.section);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else {
      // Already on home page, just scroll
      const el = document.getElementById(link.section);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md">
      {/* Navbar bar */}
      <div className="flex items-center justify-between h-14 px-4 md:px-8">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img
            src={logoImage}
            alt="ChatSphere Logo"
            className="h-6 w-6 md:h-8 md:w-8 object-contain"
          />
          <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            ChatSphere
          </h1>
        </button>

        {/* Desktop links */}
        <nav className="hidden md:flex gap-8 text-sm text-slate-300">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link)}
              className="hover:text-white transition"
            >
              {link.name}
            </button>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsMenuOpen((v) => !v)}
          className="md:hidden text-slate-200"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown (UNDER navbar) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full right-0 w-[45%] bg-slate-900 shadow-xl"
          >
            <nav className="flex flex-col p-4 space-y-3">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link)}
                  className="text-left text-sm text-slate-300 hover:text-white transition"
                >
                  {link.name}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;

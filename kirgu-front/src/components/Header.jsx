import React from "react";
import { useTheme } from "../context/ThemeContext";
import "../styles/header.scss";

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="main-header">
      <div className="header-content">
        <img src="/logo.svg" />

        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Тёмная" : "☀️ Светлая"}
        </button>
      </div>
    </header>
  );
};

export default Header;

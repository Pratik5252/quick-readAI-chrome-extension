import { useEffect, useState } from "react";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Load the theme from localStorage or default to system preference
    return (
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className="flex justify-end">
      <button
        onClick={toggleTheme}
        className="flex justify-center items-center w-10 h-10 p-2 rounded bg-secondary-bg hover:bg-secondary-bg/80 text-white border border-br transition-transform duration-300"
      >
        {isDarkMode ? (
          <LightModeIcon className="text-primary" fontSize="small" />
        ) : (
          <DarkModeIcon className="text-primary" fontSize="small" />
        )}
      </button>
    </div>
  );
};

export default ThemeToggle;

import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import SearchBar from "./SearchBar.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const initials = user.display_name?.slice(0, 2).toUpperCase() || "U";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  const linkClass = (path) =>
    `text-sm transition-colors duration-200 ${
      isActive(path)
        ? "text-black dark:text-primary font-medium"
        : "text-gray-500 dark:text-secondary hover:text-black dark:hover:text-primary"
    }`;

  return (
    <nav className="border-b border-gray-200 dark:border-subtle bg-white dark:bg-card px-6 py-4 transition-colors duration-200">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
        <div className="text-lg font-bold text-black dark:text-primary">LearnFlow</div>
        <div className="hidden flex-1 items-center justify-center md:flex">
          <SearchBar />
        </div>
        <div className="hidden items-center gap-6 md:flex">
          <Link to="/" className={linkClass("/")}>
            Dashboard
          </Link>
          <Link to="/learning" className={linkClass("/learning")}>
            Learning
          </Link>
          <Link to="/roadmap" className={linkClass("/roadmap")}>
            Roadmap
          </Link>
          <Link to="/progress" className={linkClass("/progress")}>
            Progress
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 dark:border-subtle text-gray-500 dark:text-secondary transition-all duration-200 hover:bg-gray-100 dark:hover:bg-card-hover hover:text-black dark:hover:text-primary"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <div className="group relative">
            <Link to="/profile">
              <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#6366f1] text-xs font-semibold text-white transition-all duration-200 hover:ring-2 hover:ring-[#6366f1]">
                {initials}
              </div>
            </Link>
            {user.username && (
              <div className="invisible absolute right-0 top-10 z-30 w-44 rounded-lg border border-gray-200 dark:border-subtle bg-white dark:bg-card p-1 opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:opacity-100">
                <Link
                  to={`/u/${user.username}`}
                  className="block rounded-md px-3 py-2 text-xs text-gray-500 dark:text-secondary transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-card-hover hover:text-black dark:hover:text-primary"
                >
                  View Public Profile
                </Link>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 dark:text-secondary transition-colors duration-200 hover:text-black dark:hover:text-primary"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sun, Moon, LogOut, X as CloseIcon } from "lucide-react";
import SearchBar from "./SearchBar.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const initials = user.display_name?.slice(0, 2).toUpperCase() || "U";

  const handleLogout = () => {
    localStorage.clear();
    setShowLogoutModal(false);
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const linkClass = (path) =>
    `text-sm transition-colors duration-200 ${
      isActive(path)
        ? "text-black dark:text-primary font-medium"
        : "text-gray-500 dark:text-secondary hover:text-black dark:hover:text-primary"
    }`;

  return (
    <>
      <nav className="border-b border-gray-200 dark:border-subtle bg-white dark:bg-card px-6 py-4 transition-colors duration-200 sticky top-0 z-40">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
          <div className="text-lg font-bold text-black dark:text-primary">Tracks</div>
          <div className="hidden flex-1 items-center justify-center md:flex">
            <SearchBar />
          </div>
          <div className="hidden items-center gap-6 md:flex">
            <Link to="/dashboard" className={linkClass("/dashboard")}>
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
                <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white transition-all duration-200 hover:ring-2 hover:ring-indigo-600">
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
              onClick={() => setShowLogoutModal(true)}
              className="text-sm text-gray-500 dark:text-secondary transition-colors duration-200 hover:text-black dark:hover:text-primary"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowLogoutModal(false)}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-subtle bg-card p-6 shadow-2xl transition-all">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                <LogOut size={24} />
              </div>
              <h3 className="mb-2 text-lg font-bold text-primary">Confirm Logout</h3>
              <p className="mb-6 text-sm text-secondary">
                Are you sure you want to log out of Tracks? You'll need to sign in again to access your progress.
              </p>
              
              <div className="flex w-full gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 rounded-xl border border-subtle bg-main py-2.5 text-sm font-semibold text-primary transition-all hover:bg-card-hover"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700 shadow-lg shadow-indigo-600/20"
                >
                  Logout
                </button>
              </div>
            </div>
            
            <button
              onClick={() => setShowLogoutModal(false)}
              className="absolute right-4 top-4 text-muted transition-colors hover:text-primary"
            >
              <CloseIcon size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

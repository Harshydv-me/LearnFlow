import { Link, useLocation, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar.jsx";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
      isActive(path) ? "text-white font-medium" : "text-[#666] hover:text-white"
    }`;

  return (
    <nav className="border-b border-[#1f1f1f] bg-[#111] px-6 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
        <div className="text-lg font-bold text-white">LearnFlow</div>
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
          <div className="group relative">
            <Link to="/profile">
              <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#6366f1] text-xs font-semibold text-white transition-all duration-200 hover:ring-2 hover:ring-[#6366f1]">
                {initials}
              </div>
            </Link>
            {user.username && (
              <div className="invisible absolute right-0 top-10 z-30 w-44 rounded-lg border border-[#1f1f1f] bg-[#111] p-1 opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:opacity-100">
                <Link
                  to={`/u/${user.username}`}
                  className="block rounded-md px-3 py-2 text-xs text-[#666] transition-colors duration-200 hover:bg-[#1a1a1a] hover:text-white"
                >
                  View Public Profile
                </Link>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-[#666] transition-colors duration-200 hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

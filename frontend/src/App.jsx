import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Roadmap from "./pages/Roadmap.jsx";
import LearningHub from "./pages/LearningHub.jsx";
import Profile from "./pages/Profile.jsx";
import Progress from "./pages/Progress.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import PublicProfile from "./pages/PublicProfile.jsx";

const App = () => {
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [location.pathname]);

  return (
    <Routes>
      <Route
        path="/login"
        element={token ? <Navigate to="/" replace /> : <Login setToken={setToken} />}
      />
      <Route
        path="/roadmap"
        element={token ? <Roadmap /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/learning"
        element={token ? <LearningHub /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/profile"
        element={token ? <Profile /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/progress"
        element={token ? <Progress /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/search"
        element={token ? <SearchPage /> : <Navigate to="/login" replace />}
      />
      <Route path="/u/:username" element={<PublicProfile />} />
      <Route
        path="/*"
        element={token ? <Dashboard token={token} /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
};

export default App;

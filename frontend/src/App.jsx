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
import LandingPage from "./pages/LandingPage.jsx";

const App = () => {
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [location.pathname]);

  // Use the actual current storage value for routing decisions to avoid sync lag
  const currentToken = localStorage.getItem("token");

  return (
    <Routes>
      <Route
        path="/"
        element={currentToken ? <Navigate to="/dashboard" replace /> : <LandingPage />}
      />
      <Route
        path="/login"
        element={currentToken ? <Navigate to="/dashboard" replace /> : <Login setToken={setToken} />}
      />
      <Route
        path="/dashboard"
        element={currentToken ? <Dashboard token={currentToken} /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/roadmap"
        element={currentToken ? <Roadmap /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/learning"
        element={currentToken ? <LearningHub /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/profile"
        element={currentToken ? <Profile /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/progress"
        element={currentToken ? <Progress /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/search"
        element={currentToken ? <SearchPage /> : <Navigate to="/login" replace />}
      />
      <Route path="/u/:username" element={<PublicProfile />} />
      <Route
        path="/*"
        element={currentToken ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />}
      />
    </Routes>
  );
};

export default App;

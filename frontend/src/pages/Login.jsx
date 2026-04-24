import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../api/dashboard.js";

const Login = ({ setToken }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (loading) return;

    if (mode === "register" && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const payload =
        mode === "login"
          ? await login(email, password)
          : await register(displayName, email, password);

      if (!payload?.token) {
        throw new Error("Authentication failed");
      }

      setToken(payload.token);
      navigate("/");
    } catch (err) {
      setError(err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-main px-4">
      <div className="w-full max-w-md rounded-2xl border border-subtle bg-card p-8 shadow-xl">
        <div className="text-center">
          <div className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-2xl font-semibold text-transparent">
            LearnFlow
          </div>
          <p className="mt-2 text-sm text-secondary">
            Level up your technical skills with daily practice.
          </p>
        </div>

        <div className="mt-6 flex rounded-lg border border-subtle bg-main p-1 text-xs text-secondary">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 rounded-md px-3 py-2 transition-all ${
              mode === "login"
                ? "bg-card text-primary"
                : "hover:text-primary"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`flex-1 rounded-md px-3 py-2 transition-all ${
              mode === "register"
                ? "bg-card text-primary"
                : "hover:text-primary"
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === "register" && (
            <div>
              <label className="mb-2 block text-xs text-secondary">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                className="w-full rounded-lg border border-subtle bg-main px-4 py-3 text-sm text-primary placeholder-muted focus:border-[#6366f1] focus:outline-none"
                placeholder="Your name"
                required
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-xs text-secondary">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-subtle bg-main px-4 py-3 text-sm text-primary placeholder-muted focus:border-[#6366f1] focus:outline-none"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-xs text-secondary">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-subtle bg-main px-4 py-3 text-sm text-primary placeholder-muted focus:border-[#6366f1] focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="mb-2 block text-xs text-secondary">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-lg border border-subtle bg-main px-4 py-3 text-sm text-primary placeholder-muted focus:border-[#6366f1] focus:outline-none"
                placeholder="••••••••"
                required
              />
            </div>
          )}

          {error && <div className="text-xs text-red-400">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#6366f1] py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-500"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Sign In"
                : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

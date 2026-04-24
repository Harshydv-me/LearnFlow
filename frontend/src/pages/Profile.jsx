import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  Check,
  CheckSquare,
  Edit2,
  Flame,
  Layers,
  Loader2,
  X
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import StreakHeatmap from "../components/StreakHeatmap.jsx";
import dashboardApi, { getProfile, updateProfileName } from "../api/dashboard.js";

const SkeletonBlock = ({ className }) => (
  <div className={`animate-pulse rounded-xl bg-[#1f1f1f] ${className}`} />
);

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [nameError, setNameError] = useState("");
  const [nameSaved, setNameSaved] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([getProfile(), dashboardApi.getHeatmap()])
      .then(([profileData, heatmap]) => {
        if (profileData) {
          setProfile(profileData);
          setNameInput(profileData.user.display_name || "");
        }
        setHeatmapData(heatmap || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSaveName = async () => {
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setNameError("Name cannot be empty");
      return;
    }

    if (trimmed === profile?.user?.display_name) {
      setEditingName(false);
      setNameError("");
      return;
    }

    setSavingName(true);
    setNameError("");

    const result = await updateProfileName(trimmed);
    if (!result || result.error) {
      setNameError(result?.error || "Failed to update name");
      setSavingName(false);
      return;
    }

    setProfile((prev) =>
      prev
        ? {
            ...prev,
            user: {
              ...prev.user,
              display_name: result.user.display_name
            }
          }
        : prev
    );

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    user.display_name = result.user.display_name;
    localStorage.setItem("user", JSON.stringify(user));

    setEditingName(false);
    setSavingName(false);
    setNameError("");
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 3000);
  };

  const handleCancelEdit = () => {
    setEditingName(false);
    setNameInput(profile?.user?.display_name || "");
    setNameError("");
  };

  const stats = profile?.stats || {
    totalTasksCompleted: 0,
    totalTopicsCompleted: 0,
    totalSkillsStarted: 0,
    longestStreak: 0,
    currentStreak: 0
  };

  const initials = useMemo(
    () => getInitials(profile?.user?.display_name || ""),
    [profile]
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <p className="mt-1 text-sm text-[#666]">
            Manage your account and track your learning journey.
          </p>
        </div>

        {loading ? (
          <div className="mt-8 space-y-6">
            <SkeletonBlock className="h-32 w-full" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <SkeletonBlock key={idx} className="h-24 w-full" />
              ))}
            </div>
            <SkeletonBlock className="h-40 w-full" />
          </div>
        ) : (
          <>
            <div className="mt-8 rounded-xl border border-[#1f1f1f] bg-[#111] p-6">
              <div className="flex items-start gap-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#6366f1] text-2xl font-bold text-white">
                  {initials}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    {!editingName ? (
                      <>
                        <div className="text-2xl font-bold text-white">
                          {profile?.user?.display_name}
                        </div>
                        <button
                          onClick={() => {
                            setEditingName(true);
                            setNameError("");
                          }}
                          className="text-[#666] transition-colors duration-200 hover:text-white"
                        >
                          <Edit2 size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <input
                          value={nameInput}
                          onChange={(event) => setNameInput(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") handleSaveName();
                            if (event.key === "Escape") handleCancelEdit();
                          }}
                          className="w-64 rounded-lg border border-[#6366f1] bg-[#0a0a0a] px-3 py-1.5 text-xl font-bold text-white outline-none focus:ring-1 focus:ring-[#6366f1]"
                          autoFocus
                        />
                        <button
                          onClick={handleSaveName}
                          className="rounded-lg bg-[#6366f1] px-3 py-1.5 text-sm text-white transition-all duration-200 hover:bg-indigo-500"
                        >
                          {savingName ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Check size={16} />
                          )}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="rounded-lg border border-[#1f1f1f] px-3 py-1.5 text-sm text-[#666] transition-all duration-200 hover:border-[#333] hover:text-white"
                        >
                          <X size={16} />
                        </button>
                      </>
                    )}
                  </div>

                  {nameError && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-red-400">
                      <AlertCircle size={12} />
                      {nameError}
                    </div>
                  )}

                  {nameSaved && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-green-400">
                      <Check size={12} />
                      Name updated successfully
                    </div>
                  )}

                  <div className="mt-1 text-sm text-[#666]">{profile?.user?.email}</div>
                  <div className="mt-1 text-xs text-[#444]">
                    Member since {profile?.user?.member_since}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl border border-[#1f1f1f] bg-[#111] p-4 text-center">
                <CheckSquare size={20} className="mx-auto text-[#6366f1]" />
                <div className="mt-2 text-2xl font-bold text-white">
                  {stats.totalTasksCompleted}
                </div>
                <div className="mt-1 text-xs text-[#666]">Tasks Done</div>
              </div>
              <div className="rounded-xl border border-[#1f1f1f] bg-[#111] p-4 text-center">
                <BookOpen size={20} className="mx-auto text-purple-400" />
                <div className="mt-2 text-2xl font-bold text-white">
                  {stats.totalTopicsCompleted}
                </div>
                <div className="mt-1 text-xs text-[#666]">Topics Finished</div>
              </div>
              <div className="rounded-xl border border-[#1f1f1f] bg-[#111] p-4 text-center">
                <Layers size={20} className="mx-auto text-orange-400" />
                <div className="mt-2 text-2xl font-bold text-white">
                  {stats.totalSkillsStarted}
                </div>
                <div className="mt-1 text-xs text-[#666]">Skills Started</div>
              </div>
              <div className="rounded-xl border border-[#1f1f1f] bg-[#111] p-4 text-center">
                <Flame size={20} className="mx-auto text-yellow-400" />
                <div className="mt-2 text-2xl font-bold text-white">
                  {stats.longestStreak} days
                </div>
                <div className="mt-1 text-xs text-[#666]">Best Streak</div>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-4 text-sm font-semibold text-white">
                Learning Activity
              </div>
              <StreakHeatmap data={heatmapData} />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Profile;

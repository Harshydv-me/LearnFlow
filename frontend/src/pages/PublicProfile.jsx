import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BadgeCheck, CheckSquare, Flame, Zap } from "lucide-react";
import { getPublicProfile } from "../api/dashboard.js";

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const relativeDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  if (Number.isNaN(diffMs) || diffMs < 0) return "";
  const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months === 1) return "1 month ago";
  return `${months} months ago`;
};

const PublicProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    getPublicProfile(username)
      .then(setProfile)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [username]);

  const initials = useMemo(
    () => getInitials(profile?.user?.display_name || ""),
    [profile]
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="flex items-center justify-between border-b border-[#1f1f1f] bg-[#111] px-6 py-4">
        <div className="text-lg font-bold text-white">LearnFlow</div>
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="rounded-lg border border-[#1f1f1f] px-4 py-2 text-sm text-[#666] transition-all duration-200 hover:text-white"
        >
          Sign Up Free
        </button>
      </nav>

      {notFound ? (
        <div className="mt-32 text-center">
          <div className="text-2xl font-bold text-white">Profile not found</div>
          <div className="mt-2 text-sm text-[#666]">
            This user does not exist or has a private profile
          </div>
        </div>
      ) : loading ? (
        <main className="mx-auto max-w-3xl px-6 py-12">
          <div className="h-28 animate-pulse rounded-xl bg-[#1f1f1f]" />
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-[#1f1f1f]" />
            ))}
          </div>
          <div className="mt-8 h-48 animate-pulse rounded-xl bg-[#1f1f1f]" />
        </main>
      ) : (
        <main className="mx-auto max-w-3xl px-6 py-12">
          <div className="flex flex-col items-start">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#6366f1] text-2xl font-bold text-white">
              {initials}
            </div>
            <div className="mt-4 text-3xl font-bold text-white">{profile?.user?.display_name}</div>
            <div className="mt-1 text-sm text-[#666]">@{profile?.user?.username}</div>
            <div className="mt-1 text-xs text-[#444]">Member since {profile?.user?.memberSince}</div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-[#1f1f1f] bg-[#111] p-5 text-center">
              <CheckSquare className="mx-auto text-[#6366f1]" size={20} />
              <div className="mt-2 text-2xl font-bold text-white">{profile?.stats?.totalTasksCompleted || 0}</div>
              <div className="mt-1 text-xs text-[#666]">Tasks Completed</div>
            </div>
            <div
              className={`rounded-xl border bg-[#111] p-5 text-center ${
                (profile?.stats?.verifiedTopics || 0) > 0
                  ? "border-green-500/30"
                  : "border-[#1f1f1f]"
              }`}
            >
              <BadgeCheck className="mx-auto text-green-400" size={20} />
              <div className="mt-2 text-2xl font-bold text-white">{profile?.stats?.verifiedTopics || 0}</div>
              <div className="mt-1 text-xs text-[#666]">Topics Verified</div>
            </div>
            <div className="rounded-xl border border-[#1f1f1f] bg-[#111] p-5 text-center">
              <Zap className="mx-auto text-yellow-400" size={20} />
              <div className="mt-2 text-2xl font-bold text-white">{profile?.stats?.currentStreak || 0} days</div>
              <div className="mt-1 text-xs text-[#666]">Current Streak</div>
            </div>
            <div className="rounded-xl border border-[#1f1f1f] bg-[#111] p-5 text-center">
              <Flame className="mx-auto text-orange-400" size={20} />
              <div className="mt-2 text-2xl font-bold text-white">{profile?.stats?.longestStreak || 0} days</div>
              <div className="mt-1 text-xs text-[#666]">Best Streak</div>
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-6 text-xl font-bold text-white">Skills</div>
            {(profile?.skills || []).map((skill) => (
              <div
                key={skill.id}
                className={`mb-4 rounded-xl border bg-[#111] p-6 transition-all duration-200 hover:border-[#333] ${
                  skill.isVerified ? "border-green-500/30" : "border-[#1f1f1f]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-lg font-semibold text-white">{skill.name}</div>
                    {skill.isVerified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-1 text-xs text-green-400">
                        <BadgeCheck size={12} />
                        Verified
                      </span>
                    )}
                  </div>
                  <div
                    className={`text-lg font-bold ${
                      skill.progressPercentage === 100
                        ? "text-green-400"
                        : skill.progressPercentage > 0
                          ? "text-white"
                          : "text-[#444]"
                    }`}
                  >
                    {skill.progressPercentage}%
                  </div>
                </div>
                <div className="mt-1 text-sm text-[#666]">{skill.description}</div>
                <div className="mt-4 h-2 w-full rounded-full bg-[#1f1f1f]">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      skill.isVerified
                        ? "bg-green-500"
                        : skill.progressPercentage > 0
                          ? "bg-[#6366f1]"
                          : "bg-[#1f1f1f]"
                    }`}
                    style={{ width: `${skill.progressPercentage}%` }}
                  />
                </div>
                
                {skill.topics && skill.topics.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#444]">
                      Topic Progress
                    </div>
                    {skill.topics.map((topic) => (
                      <div
                        key={topic.id}
                        className="flex items-center justify-between rounded-lg bg-[#0a0a0a] px-4 py-3 border border-[#1f1f1f]"
                      >
                        <div className="text-sm text-[#999]">{topic.title}</div>
                        {topic.score !== null ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-green-400">
                              {topic.score}/10
                            </span>
                            <BadgeCheck size={16} className="text-green-400" />
                          </div>
                        ) : (
                          <span className="text-xs text-[#444]">Not verified</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between text-xs text-[#666]">
                  <span>
                    {skill.completedTasks} / {skill.totalTasks} tasks
                  </span>
                  {skill.isVerified && (
                    <div className="flex items-center gap-2 rounded-full bg-green-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-green-400">
                      Final Result: {skill.totalCorrect} / {skill.maxSkillScore}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <footer className="mt-16 border-t border-[#1f1f1f] py-8 text-center">
            <div className="text-xs text-[#444]">Powered by LearnFlow</div>
            <div className="mt-1 text-xs text-[#333]">Track your learning journey</div>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-2 text-xs text-[#6366f1] transition-colors duration-200 hover:text-indigo-400"
            >
              Start Learning Free →
            </button>
          </footer>
        </main>
      )}
    </div>
  );
};

export default PublicProfile;

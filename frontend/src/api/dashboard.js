const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_ROOT = `${API_BASE}/api`;

const request = async (path, { method = "GET", data, token } = {}) => {
  const headers = {};
  if (data !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const authToken = token || localStorage.getItem("token");
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_ROOT}${path}`, {
    method,
    headers,
    body: data !== undefined ? JSON.stringify(data) : undefined
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
    throw new Error(payload?.error || "Unauthorized");
  }

  if (!response.ok) {
    const message = payload?.error || "Request failed";
    throw new Error(message);
  }

  return payload;
};

export const login = async (email, password) => {
  const payload = await request("/auth/login", {
    method: "POST",
    data: { email, password }
  });

  if (payload?.token) {
    localStorage.setItem("token", payload.token);
  }
  if (payload?.user) {
    localStorage.setItem("user", JSON.stringify(payload.user));
  }

  return payload;
};

export const register = async (display_name, email, password) => {
  const payload = await request("/auth/register", {
    method: "POST",
    data: { display_name, email, password }
  });

  if (payload?.token) {
    localStorage.setItem("token", payload.token);
  }
  if (payload?.user) {
    localStorage.setItem("user", JSON.stringify(payload.user));
  }

  return payload;
};

export const getSkills = async () => request("/skills");
export const getTopics = async (skillId) => request(`/topics/${skillId}`);
export const getSkillsProgress = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_ROOT}/progress/skills`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (res.status === 401) {
    localStorage.clear();
    window.location.href = "/login";
    return null;
  }
  return res.json();
};
export const getRecommendedTopics = async () => request("/recommended-topics");
export const getRecommendation = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_ROOT}/recommendation`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (res.status === 401) {
    localStorage.clear();
    window.location.href = "/login";
    return null;
  }
  return res.json();
};
export const getWeeklyProgress = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_ROOT}/progress/weekly`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (res.status === 401) {
    localStorage.clear();
    window.location.href = "/login";
    return null;
  }
  return res.json();
};

export const getProgressHistory = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_ROOT}/progress/history`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (res.status === 401) {
    localStorage.clear();
    window.location.href = "/login";
    return null;
  }
  return res.json();
};

export const getProgressInsights = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_ROOT}/progress/insights`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (res.status === 401) {
    localStorage.clear();
    window.location.href = "/login";
    return null;
  }
  return res.json();
};
export const getProfile = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_ROOT}/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (res.status === 401) {
    localStorage.clear();
    window.location.href = "/login";
    return null;
  }
  return res.json();
};

export const updateProfileName = async (display_name) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_ROOT}/profile/name`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ display_name })
  });
  if (res.status === 401) {
    localStorage.clear();
    window.location.href = "/login";
    return null;
  }
  return res.json();
};
export const getTaskContent = async (taskId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_ROOT}/ai/task/${taskId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (res.status === 401) {
    localStorage.clear();
    window.location.href = "/login";
    return null;
  }
  return res.json();
};
export const searchContent = async (query) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `${API_ROOT}/search?q=${encodeURIComponent(query)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (res.status === 401) {
    localStorage.clear();
    window.location.href = "/login";
    return null;
  }
  return res.json();
};

export const getCustomTasks = async () => request("/custom-tasks");

export const createCustomTask = async (data) =>
  request("/custom-tasks", {
    method: "POST",
    data
  });

export const updateCustomTask = async (id, data) =>
  request(`/custom-tasks/${id}`, {
    method: "PATCH",
    data
  });

export const toggleCustomTaskComplete = async (id) =>
  request(`/custom-tasks/${id}/complete`, {
    method: "PATCH"
  });

export const deleteCustomTask = async (id) =>
  request(`/custom-tasks/${id}`, {
    method: "DELETE"
  });

export const updateDailyGoal = async (goal) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_ROOT}/daily-goal`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ goal })
  });
  if (res.status === 401) {
    localStorage.clear();
    window.location.href = "/login";
    return null;
  }
  return res.json();
};

export const generateTaskQuiz = async (taskId) =>
  request(`/quiz/task/${taskId}`);

export const generateTopicQuiz = async (topicId) =>
  request(`/quiz/topic/${topicId}`);

export const submitTaskQuiz = async (taskId, data) =>
  request(`/quiz/task/${taskId}/submit`, { method: "POST", data });

export const submitTopicQuiz = async (topicId, data) =>
  request(`/quiz/topic/${topicId}/submit`, { method: "POST", data });

export const checkTopicVerified = async (topicId) =>
  request(`/quiz/topic/${topicId}/verified`);

export const getPublicProfile = async (username) => {
  const res = await fetch(`${API_ROOT}/public/profile/${username}`);
  if (!res.ok) throw new Error("Profile not found");
  return res.json();
};

const dashboardApi = {
  getDashboard: () => request("/dashboard"),
  getStreak: () => request("/streak"),
  getStats: () => request("/stats"),
  getActivity: () => request("/activity"),
  getDailyGoal: () => request("/daily-goal"),
  getAchievements: () => request("/achievements"),
  getHeatmap: () => request("/heatmap"),
  getActiveTopic: () => request("/active-topic"),
  getMe: () => request("/me"),
  getSkills,
  getTopics,
  getSkillsProgress,
  getRecommendedTopics,
  getTasks: (topicId) => request(`/tasks/${topicId}`),
  generateTaskQuiz,
  generateTopicQuiz,
  submitTaskQuiz,
  submitTopicQuiz,
  checkTopicVerified,
  updateTaskProgress: (taskId) =>
    request("/progress", {
      method: "POST",
      data: { taskId }
    })
};

export default dashboardApi;

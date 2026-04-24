const API_BASE = "http://localhost:3000/api";

const request = async (path, { method = "GET", data, token } = {}) => {
  const headers = {};
  if (data !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: data !== undefined ? JSON.stringify(data) : undefined
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.error || "Request failed";
    throw new Error(message);
  }

  return payload;
};

const api = {
  login: (data) => request("/auth/login", { method: "POST", data }),
  signup: (data) => request("/auth/signup", { method: "POST", data }),
  getDashboard: (token) => request("/progress/dashboard", { token }),
  getStreak: (token) => request("/streak", { token }),
  getTasks: (topicId, token) => request(`/tasks/${topicId}`, { token }),
  updateTaskProgress: (taskId, token) =>
    request("/progress", {
      method: "POST",
      token,
      data: { task_id: taskId, status: "completed" }
    })
};

export default api;

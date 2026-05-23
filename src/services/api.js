import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

export const getToken = () => localStorage.getItem("sb_user") || localStorage.getItem("sb_token");
export const setToken = (t) => localStorage.setItem("sb_token", t);
export const clearToken = () => {
  localStorage.removeItem("sb_user");
  localStorage.removeItem("sb_token");
};

const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  try {
    const rawUser = localStorage.getItem("sb_user");
    const fallbackToken = localStorage.getItem("sb_token");
    
    let token = fallbackToken;
    if (rawUser) {
      const parsed = JSON.parse(rawUser);
      token = parsed?.access_token || parsed?.token || parsed?.data?.token || fallbackToken;
    }
    
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {
    clearToken();
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const handleError = (err) => {
  const message =
    err?.response?.data?.error ||
    err?.response?.data?.message ||
    err?.message ||
    "Something went wrong";
  console.error("API ERROR:", message);
  throw new Error(message);
};

export const apiCheckEmail = async (email) => {
  try {
    const { data } = await apiClient.post("/auth/check-email", { email });
    return data;
  } catch (err) { handleError(err); }
};

export const apiSignup = async (name, email, password) => {
  try {
    const { data } = await apiClient.post("/auth/register", { name, email, password, institution_id: null });
    return data;
  } catch (err) { handleError(err); }
};

export const apiLogin = async (email, password) => {
  try {
    const { data } = await apiClient.post("/auth/login", { email, password });
    localStorage.setItem("sb_user", JSON.stringify(data));
    if (data.access_token || data.token) {
      setToken(data.access_token || data.token);
    }
    return data;
  } catch (err) { handleError(err); }
};

export const apiLogout = () => clearToken();

export const apiGetMe = async () => {
  try {
    const { data } = await apiClient.get("/auth/me");
    return data;
  } catch (err) { handleError(err); }
};

export const apiUpdateProfile = async (updates) => {
  try {
    const { data } = await apiClient.put("/users/profile", updates);
    return data;
  } catch (err) { handleError(err); }
};

export const auth = {
  register: async (payload) => {
    const { data } = await apiClient.post("/auth/register", payload);
    return data;
  },
  login: async (payload) => {
    const { data } = await apiClient.post("/auth/login", payload);
    localStorage.setItem("sb_user", JSON.stringify(data));
    if (data.access_token || data.token) setToken(data.access_token || data.token);
    return data;
  },
  me: async () => {
    const { data } = await apiClient.get("/auth/me");
    return data;
  },
  checkEmail: async (email) => {
    const { data } = await apiClient.post("/auth/check-email", { email });
    return data;
  },
  logout: () => clearToken()
};

export const fetchChallenges = async (difficulty = "all") => {
  try {
    const { data } = await apiClient.get("/challenges", {
      params: difficulty !== "all" ? { difficulty } : {},
    });
    return data?.data || [];
  } catch { return []; }
};

export const fetchChallenge = async (id) => {
  try {
    const { data } = await apiClient.get(`/challenges/${id}`);
    return data?.data || null;
  } catch { return null; }
};

export const runCodeSandbox = async (code, language, testCases = []) => {
  const versionMap = { javascript: "18.15.0", python: "3.10.0" };
  const langMap = { javascript: "js", python: "py" };

  try {
    const res = await axios.post("https://emkc.org/api/v2/piston/execute", {
      language: language,
      version: versionMap[language],
      files: [{ name: `main.${langMap[language]}`, content: code }],
      stdin: testCases.length > 0 ? (testCases[0].input || testCases[0].input_data || "") : "",
    });
    
    return {
      success: res.data.run.code === 0,
      status: res.data.run.code === 0 ? "Finished" : "Runtime Error",
      stdout: res.data.run.stdout,
      stderr: res.data.run.stderr,
      output: res.data.run.output
    };
  } catch (err) {
    throw new Error("Sandbox execution failed. Please try again.");
  }
};

export const submitCode = async (challengeId, code, language) => {
  try {
    const { data } = await apiClient.post("/submissions/submit-code", { challenge_id: challengeId, code, language });
    return data;
  } catch (err) { handleError(err); }
};

export const fetchLeaderboard = async (tab) => {
  try {
    let path = "/leaderboard";
    if (tab === "groups") path = "/leaderboard/groups";
    if (tab === "weekly") path = "/leaderboard/weekly/1";
    const { data } = await apiClient.get(path);
    return data?.data || [];
  } catch { return []; }
};

export const fetchGroups  = async () => { try { const { data } = await apiClient.get("/groups"); return data?.data || []; } catch { return []; } };
export const createGroup  = async (payload) => { try { const { data } = await apiClient.post("/groups", payload); return data; } catch (err) { handleError(err); } };
export const joinGroup    = async (inviteCode) => { try { const { data } = await apiClient.post("/groups/join", { invite_code: inviteCode }); return data; } catch (err) { handleError(err); } };
export const searchGroups = async (query) => { try { const { data } = await apiClient.get("/groups/search", { params: { q: query } }); return data; } catch (err) { handleError(err); } };

export const fetchFriends      = async () => { try { const { data } = await apiClient.get("/friends"); return data; } catch { return []; } };
export const sendFriendRequest = async (userId) => { try { const { data } = await apiClient.post("/friends/request", { receiver_id: userId }); return data; } catch (err) { handleError(err); } };

export const fetchNotifications    = async () => { try { const { data } = await apiClient.get("/notifications"); return data; } catch { return []; } };
export const markNotificationRead  = async (id) => { try { const { data } = await apiClient.put(`/notifications/${id}/read`); return data; } catch (err) { handleError(err); } };
export const markAllNotificationsRead = async () => { try { const { data } = await apiClient.put("/notifications/read-all"); return data; } catch (err) { handleError(err); } };

export const fetchAdminStats = async () => {
  try {
    const { data } = await apiClient.get("/admin/stats");
    return data?.data || data || null;
  } catch (err) { handleError(err); }
};

export const fetchAdminUsers = async (params = {}) => {
  try {
    const { data } = await apiClient.get("/admin/users", {
      params: {
        search:    params.search    || undefined,
        role:      params.role      || undefined,
        is_banned: params.is_banned ?? undefined,
        page:      params.page      || 1,
        per_page:  params.perPage   || 15,
      },
    });
    return data?.data || data || [];
  } catch (err) { handleError(err); }
};

export const updateUserRole = async (userId, role) => {
  try {
    const { data } = await apiClient.put(`/admin/users/${userId}/role`, { role });
    return data;
  } catch (err) { handleError(err); }
};

export const toggleUserBan = async (userId) => {
  try {
    const { data } = await apiClient.put(`/admin/users/${userId}/toggle-status`);
    return data;
  } catch (err) { handleError(err); }
};

export const adminDeleteUser = async (userId) => {
  try {
    const { data } = await apiClient.delete(`/admin/users/${userId}`);
    return data;
  } catch (err) { handleError(err); }
};

export const fetchAdminChallenges = async (params = {}) => {
  try {
    const { data } = await apiClient.get("/admin/challenges", {
      params: {
        search:     params.search     || undefined,
        difficulty: params.difficulty || undefined,
        page:       params.page       || 1,
        per_page:   params.perPage    || 12,
      },
    });
    return data?.challenges || data?.data || data || [];
  } catch (err) { handleError(err); }
};

export const adminCreateChallenge = async (payload) => {
  try {
    const { data } = await apiClient.post("/admin/challenges", {
      title:         payload.title,
      description:   payload.description,
      difficulty:    payload.difficulty,
      points_reward: payload.points_reward,
      is_published:  payload.is_published,
      test_cases:    payload.testCases,
    });
    return data;
  } catch (err) { handleError(err); }
};

export const adminUpdateChallenge = async (id, payload) => {
  try {
    const body = { ...payload };
    if (payload.testCases) { body.test_cases = payload.testCases; delete body.testCases; }
    const { data } = await apiClient.put(`/admin/challenges/${id}`, body);
    return data;
  } catch (err) { handleError(err); }
};

export const deleteChallenge = async (id) => {
  try {
    const { data } = await apiClient.delete(`/admin/challenges/${id}`);
    return data;
  } catch (err) { handleError(err); }
};

export const fetchAdminSubmissions = async (params = {}) => {
  try {
    const { data } = await apiClient.get("/admin/submissions", {
      params: {
        search:   params.search   || undefined,
        status:   params.status   || undefined,
        language: params.language || undefined,
        page:     params.page     || 1,
        per_page: params.perPage  || 15,
      },
    });
    return data?.data || data || [];
  } catch (err) { handleError(err); }
};

export const adminDeleteSubmission = async (id) => {
  try {
    const { data } = await apiClient.delete(`/admin/submissions/${id}`);
    return data;
  } catch (err) { handleError(err); }
};

export const adminRejudgeSubmission = async (id) => {
  try {
    const { data } = await apiClient.post(`/admin/submissions/${id}/rejudge`);
    return data;
  } catch (err) { handleError(err); }
};

export const fetchAdminReports = async () => {
  try {
    const { data } = await apiClient.get("/admin/reports");
    return data?.data || data || [];
  } catch (err) { handleError(err); }
};

export const broadcastNotification = async (message) => {
  try {
    const { data } = await apiClient.post("/admin/notifications/broadcast", { message });
    return data;
  } catch (err) { handleError(err); }
};

export default apiClient;
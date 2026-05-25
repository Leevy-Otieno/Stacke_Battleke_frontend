import axios from "axios";

export const getToken = () => localStorage.getItem("sb_token");

export const setToken = (t) => localStorage.setItem("sb_token", t);

export const clearToken = () => {
  localStorage.removeItem("sb_token");
  localStorage.removeItem("sb_user");
};

const BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) clearToken();
    return Promise.reject(error);
  }
);

const handleError = (err) => {
  console.error("🚨 REAL BACKEND ERROR:", err?.response?.data);
  
  const msg =
    err?.response?.data?.error ||
    err?.response?.data?.message ||
    err?.message ||
    "Something went wrong";
  throw new Error(msg);
};

export const auth = {
  register: async (payload) => {
    try {
      const { data } = await apiClient.post("/auth/register", payload);
      if (data.token) setToken(data.token);
      return data;
    } catch (err) {
      handleError(err);
    }
  },

  login: async (payload) => {
    try {
      const { data } = await apiClient.post("/auth/login", payload);
      if (data.token) setToken(data.token);
      return data;
    } catch (err) {
      handleError(err);
    }
  },

  me: async () => {
    try {
      const { data } = await apiClient.get("/auth/me");
      return data;
    } catch (err) {
      handleError(err);
    }
  },

  checkEmail: async (email) => {
    try {
      const { data } = await apiClient.post("/auth/check-email", { email });
      return data;
    } catch (err) {
      handleError(err);
    }
  },

  logout: () => clearToken(),
};

export const challenges = {
  list: async (difficulty) => {
    try {
      const { data } = await apiClient.get("/challenges", {
        params: difficulty && difficulty !== "all" ? { difficulty } : {},
      });
      return data?.data || [];
    } catch {
      return [];
    }
  },

  get: async (id) => {
    try {
      const { data } = await apiClient.get(`/challenges/${id}`);
      return { data: data?.data || data };
    } catch (err) {
      handleError(err);
    }
  },

  practice: async () => {
    try {
      const { data } = await apiClient.get("/challenges/practice");
      return data?.data || [];
    } catch {
      return [];
    }
  },

  weekly: async () => {
    try {
      const { data } = await apiClient.get("/challenges/weekly");
      return data?.data || null;
    } catch {
      return null;
    }
  },
};

export const submissions = {
  submit: async ({ challenge_id, language, code }) => {
    try {
      const { data } = await apiClient.post("/submissions/submit-code", {
        challenge_id,
        language,
        code,
      });
      return data;
    } catch (err) {
      handleError(err);
    }
  },

  list: async () => {
    try {
      const { data } = await apiClient.get("/submissions/results");
      return data?.data || data || [];
    } catch {
      return [];
    }
  },

  get: async (id) => {
    try {
      const { data } = await apiClient.get(`/submissions/results/${id}`);
      return data;
    } catch (err) {
      handleError(err);
    }
  },
};

const PISTON_URL = "https://emkc.org/api/v2/piston/execute";

const PISTON_VERSION = {
  python: "3.10.0",
  javascript: "18.15.0",
};

const PISTON_EXT = {
  python: "py",
  javascript: "js",
};

export const runCodeSandbox = async ({ language, code, stdin = "" }) => {
  try {
    const res = await axios.post(PISTON_URL, {
      language,
      version: PISTON_VERSION[language] || "latest",
      files: [
        {
          name: `main.${PISTON_EXT[language] || "txt"}`,
          content: code,
        },
      ],
      stdin,
    });

    const run = res.data?.run ?? {};

    return {
      stdout: run.stdout ?? "",
      stderr: run.stderr ?? res.data?.compile?.stderr ?? "",
      exitCode: run.code ?? 1,
    };
  } catch {
    throw new Error(
      "Sandbox execution failed — check your internet connection or try again."
    );
  }
};

export const fetchLeaderboard = async (tab = "global") => {
  try {
    let path = "/leaderboard";

    if (tab === "groups") path = "/leaderboard/groups";
    if (tab === "weekly") path = "/leaderboard/weekly/1";

    const { data } = await apiClient.get(path);

    return data?.data || [];
  } catch {
    return [];
  }
};

export const fetchGroups = async () => {
  try {
    const { data } = await apiClient.get("/groups");
    return data?.data || [];
  } catch {
    return [];
  }
};

export const searchGroups = async (query) => {
  try {
    const { data } = await apiClient.get(`/groups/search?q=${query}`);
    return data?.data || [];
  } catch {
    return [];
  }
};

export const createGroup = async (p) => {
  try {
    const { data } = await apiClient.post("/groups", p);
    return data;
  } catch (err) {
    handleError(err);
  }
};

export const joinGroup = async (c) => {
  try {
    const { data } = await apiClient.post("/groups/join", {
      invite_code: c,
    });
    return data;
  } catch (err) {
    handleError(err);
  }
};

export const fetchFriends = async () => {
  try {
    const { data } = await apiClient.get("/friends");
    return Array.isArray(data) ? data : data?.data || [];
  } catch {
    return [];
  }
};

export const sendFriendRequest = async (userId) => {
  try {
    const { data } = await apiClient.post("/friends/request", { receiver_id: userId });
    return data;
  } catch (err) {
    handleError(err);
  }
};

export const fetchNotifications = async () => {
  try {
    const { data } = await apiClient.get("/notifications");
    return Array.isArray(data) ? data : data?.data || [];
  } catch {
    return [];
  }
};

export const markNotificationRead = async (id) => {
  try {
    const { data } = await apiClient.put(`/notifications/${id}/read`);
    return data;
  } catch (err) {
    handleError(err);
  }
};

export const markAllNotificationsRead = async () => {
  try {
    const { data } = await apiClient.put("/notifications/read-all");
    return data;
  } catch (err) {
    handleError(err);
  }
};

export const apiGetMe = async () => {
  try {
    const { data } = await apiClient.get("/auth/me");
    return data;
  } catch (err) {
    handleError(err);
  }
};

export const apiUpdateProfile = async (updates) => {
  try {
    const { data } = await apiClient.put("/users/profile", updates);
    return data;
  } catch (err) {
    handleError(err);
  }
};

export const fetchChallenges = challenges.list;

export const fetchChallenge = async (id) => {
  const r = await challenges.get(id);
  return r?.data || null;
};

export const submitCode = async (id, code, language) =>
  submissions.submit({
    challenge_id: id,
    language,
    code,
  });

export const apiLogin = async (email, password) => auth.login({ email, password });

export const apiSignup = async (name, email, password) =>
  auth.register({ name, email, password });

export const apiCheckEmail = async (email) => auth.checkEmail(email);

export const apiLogout = () => auth.logout();

export const fetchAdminStats = async () => {
  try {
    const { data } = await apiClient.get("/admin/stats");
    return data?.data || data || null;
  } catch (err) {
    handleError(err);
  }
};

export const fetchAdminUsers = async (params = {}) => {
  try {
    const { data } = await apiClient.get("/admin/users", {
      params: {
        search: params.search || undefined,
        role: params.role || undefined,
        page: params.page || 1,
        per_page: params.perPage || 15,
      },
    });
    return data?.data || data || [];
  } catch (err) {
    handleError(err);
  }
};

export const updateUserRole = async (userId, role) => {
  try {
    const { data } = await apiClient.patch(`/admin/users/${userId}/action`, {
      action: role === "admin" ? "promote" : "demote",
    });
    return data;
  } catch (err) {
    handleError(err);
  }
};

export const toggleUserBan = async (userId, ban) => {
  try {
    const { data } = await apiClient.patch(`/admin/users/${userId}/action`, {
      action: ban ? "ban" : "unban",
    });
    return data;
  } catch (err) {
    handleError(err);
  }
};

export const adminDeleteUser = async (userId) => {
  try {
    const { data } = await apiClient.delete(`/admin/users/${userId}`);
    return data;
  } catch (err) {
    handleError(err);
  }
};

export const fetchAdminChallenges = async (params = {}) => {
  try {
    const { data } = await apiClient.get("/admin/challenges", {
      params: {
        search: params.search || undefined,
        difficulty: params.difficulty || undefined,
        page: params.page || 1,
        per_page: params.perPage || 12,
      },
    });
    return data?.challenges || data?.data || data || [];
  } catch (err) {
    handleError(err);
  }
};

export const adminCreateChallenge = async (payload) => {
  try {
    const { data } = await apiClient.post("/admin/challenges", {
      title: payload.title,
      description: payload.description,
      difficulty: payload.difficulty,
      points_reward: payload.points_reward,
      test_cases: payload.testCases,
    });
    return data;
  } catch (err) {
    handleError(err);
  }
};

export const adminUpdateChallenge = async (id, p) => {
  try {
    const body = { ...p };

    if (p.testCases) {
      body.test_cases = p.testCases;
      delete body.testCases;
    }

    const { data } = await apiClient.put(`/admin/challenges/${id}`, body);

    return data;
  } catch (err) {
    handleError(err);
  }
};

export const deleteChallenge = async (id) => {
  try {
    const { data } = await apiClient.delete(`/admin/challenges/${id}`);
    return data;
  } catch (err) {
    handleError(err);
  }
};

export const fetchAdminSubmissions = async (p = {}) => {
  try {
    const { data } = await apiClient.get("/admin/submissions", {
      params: {
        search: p.search || undefined,
        status: p.status || undefined,
        language: p.language || undefined,
        page: p.page || 1,
        per_page: p.perPage || 15,
      },
    });
    return data?.data || data || [];
  } catch (err) {
    handleError(err);
  }
};

export const adminDeleteSubmission = async (id) => {
  try {
    const { data } = await apiClient.delete(`/admin/submissions/${id}`);
    return data;
  } catch (err) {
    handleError(err);
  }
};

export const adminRejudgeSubmission = async (id) => {
  try {
    const { data } = await apiClient.post(`/admin/submissions/${id}/rejudge`);
    return data;
  } catch (err) {
    handleError(err);
  }
};

export const fetchAdminReports = async () => {
  try {
    const { data } = await apiClient.get("/admin/reports");
    return data?.data || data || [];
  } catch (err) {
    handleError(err);
  }
};

export const broadcastNotification = async (msg) => {
  try {
    const { data } = await apiClient.post("/admin/notifications/broadcast", { message: msg });
    return data;
  } catch (err) {
    handleError(err);
  }
};

export default apiClient;

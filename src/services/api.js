// src/services/api.js
// Central API layer using Axios.
// Automatically attaches JWT token and handles 401 → redirect to login.
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

// ── REQUEST INTERCEPTOR: attach JWT ────────────────────────────────────────
apiClient.interceptors.request.use((config) => {
  try {
    const rawUser = localStorage.getItem("sb_user");
    if (rawUser) {
      const parsed = JSON.parse(rawUser);
      const token = parsed?.access_token || parsed?.token || parsed?.data?.token;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    localStorage.removeItem("sb_user");
  }
  return config;
});

// ── RESPONSE INTERCEPTOR: global 401 handling ──────────────────────────────
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("sb_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ── Error normaliser ──────────────────────────────────────────────────────
const handleError = (err) => {
  const message =
    err?.response?.data?.error ||
    err?.response?.data?.message ||
    err?.message ||
    "Something went wrong";
  console.error("API ERROR:", message);
  throw new Error(message);
};

// ==========================================================================
// AUTH
// ==========================================================================

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
    return data;
  } catch (err) { handleError(err); }
};

export const apiLogout = () => localStorage.removeItem("sb_user");

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

// ==========================================================================
// CHALLENGES (public / student)
// ==========================================================================

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

export const submitCode = async (challengeId, code, language) => {
  try {
    const { data } = await apiClient.post("/submissions/submit-code", { challenge_id: challengeId, code, language });
    return data;
  } catch (err) { handleError(err); }
};

// ==========================================================================
// LEADERBOARD
// ==========================================================================

export const fetchLeaderboard = async (tab) => {
  try {
    let path = "/leaderboard";
    if (tab === "groups") path = "/leaderboard/groups";
    if (tab === "weekly") path = "/leaderboard/weekly/1";
    const { data } = await apiClient.get(path);
    return data?.data || [];
  } catch { return []; }
};

// ==========================================================================
// GROUPS
// ==========================================================================

export const fetchGroups  = async () => { try { const { data } = await apiClient.get("/groups"); return data?.data || []; } catch { return []; } };
export const createGroup  = async (payload) => { try { const { data } = await apiClient.post("/groups", payload); return data; } catch (err) { handleError(err); } };
export const joinGroup    = async (inviteCode) => { try { const { data } = await apiClient.post("/groups/join", { invite_code: inviteCode }); return data; } catch (err) { handleError(err); } };
export const searchGroups = async (query) => { try { const { data } = await apiClient.get("/groups/search", { params: { q: query } }); return data; } catch (err) { handleError(err); } };

// ==========================================================================
// FRIENDS
// ==========================================================================

export const fetchFriends      = async () => { try { const { data } = await apiClient.get("/friends"); return data; } catch { return []; } };
export const sendFriendRequest = async (userId) => { try { const { data } = await apiClient.post("/friends/request", { receiver_id: userId }); return data; } catch (err) { handleError(err); } };

// ==========================================================================
// NOTIFICATIONS
// ==========================================================================

export const fetchNotifications    = async () => { try { const { data } = await apiClient.get("/notifications"); return data; } catch { return []; } };
export const markNotificationRead  = async (id) => { try { const { data } = await apiClient.put(`/notifications/${id}/read`); return data; } catch (err) { handleError(err); } };
export const markAllNotificationsRead = async () => { try { const { data } = await apiClient.put("/notifications/read-all"); return data; } catch (err) { handleError(err); } };

// ==========================================================================
// ADMIN — STATS
// ==========================================================================

/**
 * GET /api/admin/stats
 * Returns { total_users, total_challenges, total_submissions, active_users,
 *           user_trend, submission_trend }
 */
export const fetchAdminStats = async () => {
  try {
    const { data } = await apiClient.get("/admin/stats");
    return data?.data || data || null;
  } catch (err) { handleError(err); }
};

// ==========================================================================
// ADMIN — USERS
// ==========================================================================

/**
 * GET /api/admin/users
 * Query params: search, role, is_banned, page, per_page
 * Returns { items: [...], total, page, pages }
 */
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

/**
 * PUT /api/admin/users/:id/role
 * Body: { role: "admin" | "student" }
 */
export const updateUserRole = async (userId, role) => {
  try {
    const { data } = await apiClient.put(`/admin/users/${userId}/role`, { role });
    return data;
  } catch (err) { handleError(err); }
};

/**
 * PUT /api/admin/users/:id/toggle-status
 * Toggles banned / active without needing to know current state client-side.
 */
export const toggleUserBan = async (userId) => {
  try {
    const { data } = await apiClient.put(`/admin/users/${userId}/toggle-status`);
    return data;
  } catch (err) { handleError(err); }
};

/**
 * DELETE /api/admin/users/:id
 */
export const adminDeleteUser = async (userId) => {
  try {
    const { data } = await apiClient.delete(`/admin/users/${userId}`);
    return data;
  } catch (err) { handleError(err); }
};

// ==========================================================================
// ADMIN — CHALLENGES
// ==========================================================================

/**
 * GET /api/admin/challenges
 * Query params: search, difficulty, page, per_page
 */
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
    return data?.data || data || [];
  } catch (err) { handleError(err); }
};

/**
 * POST /api/admin/challenges
 * Body: { title, description, difficulty, points_reward, is_published, testCases }
 */
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

/**
 * PUT /api/admin/challenges/:id
 */
export const adminUpdateChallenge = async (id, payload) => {
  try {
    const body = { ...payload };
    // Remap testCases → test_cases for the backend
    if (payload.testCases) { body.test_cases = payload.testCases; delete body.testCases; }
    const { data } = await apiClient.put(`/admin/challenges/${id}`, body);
    return data;
  } catch (err) { handleError(err); }
};

/**
 * DELETE /api/admin/challenges/:id
 */
export const deleteChallenge = async (id) => {
  try {
    const { data } = await apiClient.delete(`/admin/challenges/${id}`);
    return data;
  } catch (err) { handleError(err); }
};

// ==========================================================================
// ADMIN — SUBMISSIONS
// ==========================================================================

/**
 * GET /api/admin/submissions
 * Query params: search, status, language, page, per_page
 */
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

/**
 * DELETE /api/admin/submissions/:id
 */
export const adminDeleteSubmission = async (id) => {
  try {
    const { data } = await apiClient.delete(`/admin/submissions/${id}`);
    return data;
  } catch (err) { handleError(err); }
};

/**
 * POST /api/admin/submissions/:id/rejudge
 * Re-queues the submission through the judge engine.
 */
export const adminRejudgeSubmission = async (id) => {
  try {
    const { data } = await apiClient.post(`/admin/submissions/${id}/rejudge`);
    return data;
  } catch (err) { handleError(err); }
};

// ==========================================================================
// ADMIN — MODERATION
// ==========================================================================

/**
 * GET /api/admin/reports
 * Returns list of flagged users/content reports.
 * Backend endpoint may not exist yet — AdminModeration handles empty gracefully.
 */
export const fetchAdminReports = async () => {
  try {
    const { data } = await apiClient.get("/admin/reports");
    return data?.data || data || [];
  } catch (err) { handleError(err); }
};

/**
 * POST /api/admin/notifications/broadcast
 * Body: { message }
 * Sends a notification to all users.
 */
export const broadcastNotification = async (message) => {
  try {
    const { data } = await apiClient.post("/admin/notifications/broadcast", { message });
    return data;
  } catch (err) { handleError(err); }
};

export default apiClient;
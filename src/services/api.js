import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL?.trim();

const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

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

const handleError = (err) => {
  const message =
    err?.response?.data?.error ||
    err?.response?.data?.message ||
    err?.message ||
    "Something went wrong";
  throw new Error(message);
};

export const fetchChallenges = async (difficulty = "all") => {
  const { data } = await apiClient.get("/challenges", {
    params: difficulty !== "all" ? { difficulty } : {},
  });
  return data?.data || [];
};

export const fetchChallenge = async (id) => {
  const { data } = await apiClient.get(`/challenges/${id}`);
  return data?.data || null;
};

export const submitCode = async (challengeId, code, language) => {
  const { data } = await apiClient.post("/submissions/submit-code", {
    challenge_id: challengeId,
    code,
    language,
  });
  return data;
};

export const fetchLeaderboard = async (tab) => {
  let path = "/leaderboard";
  if (tab === "groups") path = "/leaderboard/groups";
  if (tab === "weekly") path = "/leaderboard/weekly/1";

  const { data } = await apiClient.get(path);
  return data?.data || [];
};

export const fetchGroups = async () => {
  const { data } = await apiClient.get("/groups");
  return data?.data || [];
};

export const createGroup = async (payload) => {
  const { data } = await apiClient.post("/groups", payload);
  return data;
};

export const joinGroup = async (invite_code) => {
  const { data } = await apiClient.post("/groups/join", { invite_code });
  return data;
};

export const searchGroups = async (q) => {
  const { data } = await apiClient.get("/groups/search", { params: { q } });
  return data;
};

export const fetchFriends = async () => {
  const { data } = await apiClient.get("/friends");
  return data;
};

export const sendFriendRequest = async (receiver_id) => {
  const { data } = await apiClient.post("/friends/request", { receiver_id });
  return data;
};

export const fetchNotifications = async () => {
  const { data } = await apiClient.get("/notifications");
  return data;
};

export const markNotificationRead = async (id) => {
  const { data } = await apiClient.put(`/notifications/${id}/read`);
  return data;
};

export const markAllNotificationsRead = async () => {
  const { data } = await apiClient.put("/notifications/read-all");
  return data;
};

export default apiClient;

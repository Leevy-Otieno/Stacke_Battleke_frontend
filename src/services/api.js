import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

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

      const token =
        parsed?.access_token ||
        parsed?.token ||
        parsed?.data?.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch {
    localStorage.removeItem("sb_user");
  }

  return config;
});

const getData = (res) => res?.data;

export const fetchChallenges = async (difficulty = "all") => {
  const res = await apiClient.get("/challenges", {
    params: difficulty !== "all" ? { difficulty } : {},
  });
  return getData(res)?.data || [];
};

export const fetchChallenge = async (id) => {
  const res = await apiClient.get(`/challenges/${id}`);
  return getData(res)?.data || null;
};

export const submitCode = async (challengeId, code, language) => {
  const res = await apiClient.post("/submissions/submit-code", {
    challenge_id: challengeId,
    code,
    language,
  });
  return getData(res);
};

export const fetchLeaderboard = async (tab) => {
  let path = "/leaderboard";

  if (tab === "groups") path = "/leaderboard/groups";
  if (tab === "weekly") path = "/leaderboard/weekly/1";

  const res = await apiClient.get(path);
  return getData(res)?.data || [];
};

export const fetchGroups = async () => {
  const res = await apiClient.get("/groups");
  return getData(res)?.data || [];
};

export const createGroup = async (payload) => {
  const res = await apiClient.post("/groups", payload);
  return getData(res);
};

export const joinGroup = async (invite_code) => {
  const res = await apiClient.post("/groups/join", { invite_code });
  return getData(res);
};

export const searchGroups = async (q) => {
  const res = await apiClient.get("/groups/search", {
    params: { q },
  });
  return getData(res);
};

export const fetchFriends = async () => {
  const res = await apiClient.get("/friends");
  return getData(res);
};

export const sendFriendRequest = async (receiver_id) => {
  const res = await apiClient.post("/friends/request", {
    receiver_id,
  });
  return getData(res);
};

export const fetchNotifications = async () => {
  const res = await apiClient.get("/notifications");
  return getData(res);
};

export const markNotificationRead = async (id) => {
  const res = await apiClient.put(`/notifications/${id}/read`);
  return getData(res);
};

export const markAllNotificationsRead = async () => {
  const res = await apiClient.put("/notifications/read-all");
  return getData(res);
};

export default apiClient;

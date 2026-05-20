import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  console.error("❌ VITE_API_URL is missing in .env");
}

const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
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
    } catch (err) {
      console.warn("Invalid auth storage - clearing");
      localStorage.removeItem("sb_user");
    }

    return config;
  },
  (error) => Promise.reject(error)
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
  } catch (err) {
    handleError(err);
  }
};

export const apiSignup = async (name, email, password) => {
  try {
    const { data } = await apiClient.post("/auth/register", {
      name,
      email,
      password,
      institution_id: null,
    });
    return data;
  } catch (err) {
    handleError(err);
  }
};

export const apiLogin = async (email, password) => {
  try {
    const { data } = await apiClient.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("sb_user", JSON.stringify(data));
    return data;
  } catch (err) {
    handleError(err);
  }
};

export const apiLogout = () => {
  localStorage.removeItem("sb_user");
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

export const fetchChallenges = async (difficulty = "all") => {
  try {
    const { data } = await apiClient.get("/challenges", {
      params: {
        difficulty: difficulty !== "all" ? difficulty : undefined,
      },
    });

    return data?.data || [];
  } catch (err) {
    console.log("fetchChallenges error:", err.message);
    return [];
  }
};

export const fetchChallenge = async (id) => {
  try {
    const { data } = await apiClient.get(`/challenges/${id}`);
    return data?.data || null;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const submitCode = async (challengeId, code, language) => {
  try {
    const { data } = await apiClient.post("/submissions/submit-code", {
      challenge_id: challengeId,
      code,
      language,
    });

    return data;
  } catch (err) {
    handleError(err);
  }
};


export const fetchLeaderboard = async (tab) => {
  try {
    let path = "/leaderboard/";

    if (tab === "groups") path = "/leaderboard/groups";
    if (tab === "weekly") path = "/leaderboard/weekly/1";

    const res = await apiClient.get(path);
    return res?.data?.data || res?.data || [];
  } catch (err) {
    console.log(err);
    return [];
  }
};


export const fetchGroups = async () => {
  try {
    const { data } = await apiClient.get("/groups");
    return data?.data || data || [];
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const createGroup = async ({ name, description, isPublic = true }) => {
  try {
    const { data } = await apiClient.post("/groups", {
      name,
      description,
      isPublic,
    });
    return data;
  } catch (err) {
    handleError(err);
  }
};

export const joinGroup = async (inviteCode) => {
  try {
    const { data } = await apiClient.post("/groups/join", {
      invite_code: inviteCode,
    });
    return data;
  } catch (err) {
    handleError(err);
  }
};

export const searchGroups = async (query) => {
  try {
    const { data } = await apiClient.get("/groups/search", {
      params: { q: query },
    });
    return data;
  } catch (err) {
    handleError(err);
  }
};


export const fetchFriends = async () => {
  try {
    const { data } = await apiClient.get("/friends");
    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const sendFriendRequest = async (userId) => {
  try {
    const { data } = await apiClient.post("/friends/request", {
      receiver_id: userId,
    });
    return data;
  } catch (err) {
    handleError(err);
  }
};

export const fetchNotifications = async () => {
  try {
    const { data } = await apiClient.get("/notifications");
    return data;
  } catch (err) {
    console.log(err);
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

export default apiClient;

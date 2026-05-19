import axios from 'axios';

// ================================================================
// Axios Setup
// ================================================================

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ================================================================
// Attach JWT token automatically
// ================================================================

apiClient.interceptors.request.use((config) => {
  const savedUser = localStorage.getItem('sb_user');

  if (savedUser) {
    try {
      const parsedUser = JSON.parse(savedUser);

      const token = parsedUser?.token;

      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    } catch (err) {
      console.warn('Invalid sb_user in localStorage');
    }
  }

  return config;
});

// ================================================================
// Error Handler
// ================================================================

const handleApiError = (error) => {
  const message =
    error.response?.data?.error ||
    error.response?.data?.message ||
    error.response?.data?.details ||
    error.message ||
    'An unexpected error occurred';

  throw new Error(message);
};

// ================================================================
// AUTH
// ================================================================

export const apiCheckEmail = async (email) => {
  try {
    const { data } = await apiClient.post('/auth/check-email', { email });
    return data;
  } catch (error) {
    handleApiError(error);
  }
};

export const apiSignup = async (name, email, password) => {
  try {
    const { data } = await apiClient.post('/auth/register', {
      name,
      email,
      password,
      institution_id: null,
    });

    return data;
  } catch (error) {
    handleApiError(error);
  }
};

export const apiLogin = async (email, password) => {
  try {
    const { data } = await apiClient.post('/auth/login', {
      email,
      password,
    });

    return data;
  } catch (error) {
    handleApiError(error);
  }
};

export const apiGetMe = async () => {
  try {
    const { data } = await apiClient.get('/auth/me');
    return data;
  } catch (error) {
    handleApiError(error);
  }
};

export const apiUpdateProfile = async (updates) => {
  try {
    const { data } = await apiClient.put('/users/profile', updates);
    return data;
  } catch (error) {
    handleApiError(error);
  }
};

// ================================================================
// CHALLENGES
// ================================================================

export const fetchChallenges = async (difficulty = 'all') => {
  try {
    const { data } = await apiClient.get('/challenges', {
      params: {
        difficulty: difficulty !== 'all' ? difficulty : undefined,
      },
    });

    return data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchChallenge = async (id) => {
  try {
    const { data } = await apiClient.get(`/challenges/${id}`);
    return data;
  } catch (error) {
    handleApiError(error);
  }
};

export const submitCode = async (challengeId, code, language) => {
  try {
    const { data } = await apiClient.post('/submissions/submit-code', {
      challenge_id: challengeId,
      code,
      language,
    });

    return data;
  } catch (error) {
    handleApiError(error);
  }
};

// ================================================================
// LEADERBOARD (MATCHES YOUR FLASK BACKEND)
// ================================================================

export const fetchLeaderboard = async (tab = 'global', weekNumber = null) => {
  try {
    let url = '/leaderboard/';

    if (tab === 'groups') {
      url = '/leaderboard/groups';
    }

    if (tab === 'weekly' && weekNumber) {
      url = `/leaderboard/weekly/${weekNumber}`;
    }

    const { data } = await apiClient.get(url);
    return data;
  } catch (error) {
    handleApiError(error);
  }
};

// ================================================================
// GROUPS
// ================================================================

export const fetchGroups = async () => {
  try {
    const { data } = await apiClient.get('/groups');
    return data;
  } catch (error) {
    handleApiError(error);
  }
};

export const createGroup = async ({ name, description, isPublic = true }) => {
  try {
    const { data } = await apiClient.post('/groups', {
      name,
      description,
      isPublic,
    });

    return data;
  } catch (error) {
    handleApiError(error);
  }
};

export const joinGroup = async (groupId) => {
  try {
    const { data } = await apiClient.post(`/groups/${groupId}/join`);
    return data;
  } catch (error) {
    handleApiError(error);
  }
};

export const searchGroups = async (query) => {
  try {
    const { data } = await apiClient.get('/groups/search', {
      params: { q: query },
    });

    return data;
  } catch (error) {
    handleApiError(error);
  }
};

// ================================================================
// FRIENDS
// ================================================================

export const fetchFriends = async () => {
  try {
    const { data } = await apiClient.get('/friends');
    return data;
  } catch (error) {
    handleApiError(error);
  }
};

export const sendFriendRequest = async (userId) => {
  try {
    const { data } = await apiClient.post('/friends/request', {
      userId,
    });

    return data;
  } catch (error) {
    handleApiError(error);
  }
};

// ================================================================
// NOTIFICATIONS (FIXED EXPORTS)
// ================================================================
// NOTIFICATIONS
export const fetchNotifications = async () => {
  const { data } = await apiClient.get('/notifications');
  return data;
};

export const markNotificationRead = async (id) => {
  const { data } = await apiClient.patch(`/notifications/${id}/read`);
  return data;
};

export const markAllNotificationsRead = async () => {
  const { data } = await apiClient.patch('/notifications/read-all');
  return data;
};
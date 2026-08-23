import axios from "axios";

const API_URL = "http://localhost:5000/api/admin";


// ======================================
// AUTH CONFIG
// ======================================

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};


// ======================================
// GET ALL APPROVED USERS
// ======================================

export const getUsers = async () => {
  const response = await axios.get(
    `${API_URL}/users`,
    getAuthConfig()
  );

  return response.data;
};


// ======================================
// GET PENDING CANDIDATES
// ======================================

export const getPendingUsers = async () => {
  const response = await axios.get(
    `${API_URL}/users/pending`,
    getAuthConfig()
  );

  return response.data;
};


// ======================================
// APPROVE CANDIDATE
// ======================================

export const approveUser = async (userId) => {
  const response = await axios.patch(
    `${API_URL}/users/${userId}/approve`,
    {},
    getAuthConfig()
  );

  return response.data;
};


// ======================================
// REJECT CANDIDATE
// ======================================

export const rejectUser = async (userId) => {
  const response = await axios.patch(
    `${API_URL}/users/${userId}/reject`,
    {},
    getAuthConfig()
  );

  return response.data;
};

// Remove candidate
export const deleteUser = async (userId) => {
  const response = await axios.delete(
    `${API_URL}/users/${userId}`,
    getAuthConfig()
  );

  return response.data;
};


// ======================================
// UPDATE CANDIDATE STACK
// ======================================

export const updateUserStack = async (userId, stack) => {
  const response = await axios.patch(
    `${API_URL}/users/${userId}/stack`,
    { stack },
    getAuthConfig()
  );

  return response.data;
};


// ======================================
// GET CANDIDATE INTERVIEW HISTORY
// ======================================

export const getCandidateInterviews = async (userId) => {
  const response = await axios.get(
    `${API_URL}/users/${userId}/interviews`,
    getAuthConfig()
  );

  return response.data;
};


// ======================================
// GET ANALYTICS
// ======================================

export const getAnalytics = async (days = 30) => {
  const response = await axios.get(
    `${API_URL}/analytics?days=${days}`,
    getAuthConfig()
  );

  return response.data;
};


// ======================================
// GET RESUMES (Admin Resume Reviews)
// ======================================

export const getResumes = async () => {
  const response = await axios.get(
    `${API_URL}/resumes`,
    getAuthConfig()
  );

  return response.data;
};


// ======================================
// GET DASHBOARD OVERVIEW
// ======================================

export const getDashboardOverview = async () => {
  const response = await axios.get(
    `${API_URL}/dashboard-overview`,
    getAuthConfig()
  );

  return response.data;
};
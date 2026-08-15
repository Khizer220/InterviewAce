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
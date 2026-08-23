import axios from "axios";

const API_URL = "http://localhost:5000/api/resumes";

const getAuthConfig = (extraHeaders = {}) => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      ...extraHeaders,
    },
  };
};

// ======================================
// UPLOAD / REPLACE RESUME
// ======================================

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);

  const response = await axios.post(
    API_URL,
    formData,
    getAuthConfig({ "Content-Type": "multipart/form-data" })
  );

  return response.data;
};

// ======================================
// GET MY RESUME
// ======================================

export const getMyResume = async () => {
  const response = await axios.get(
    `${API_URL}/me`,
    getAuthConfig()
  );

  return response.data;
};

// ======================================
// DELETE MY RESUME
// ======================================

export const deleteMyResume = async () => {
  const response = await axios.delete(
    `${API_URL}/me`,
    getAuthConfig()
  );

  return response.data;
};
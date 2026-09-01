import axios from "axios";

const API_URL = "http://localhost:5000/api/coding-practice";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getPublishedProblems = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await axios.get(
    `${API_URL}${query ? `?${query}` : ""}`,
    getAuthConfig()
  );
  return response.data;
};

export const getPublishedProblem = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthConfig());
  return response.data;
};

export const submitCode = async (id, code, language) => {
  const response = await axios.post(
    `${API_URL}/${id}/submit`,
    { code, language },
    getAuthConfig()
  );
  return response.data;
};

export const getMySubmissions = async (id) => {
  const response = await axios.get(`${API_URL}/${id}/submissions`, getAuthConfig());
  return response.data;
};
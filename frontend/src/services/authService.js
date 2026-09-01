import axios from "axios";

const API = "http://localhost:5000/api";

export const loginUser = async (userData) => {
  const response = await axios.post(
    `${API}/auth/login`,
    userData
  );

  // Save authentication data immediately
  if (response.data?.success && response.data?.token) {
    localStorage.setItem(
      "token",
      response.data.token
    );

    if (response.data.user) {
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );
    }
  }

  return response.data;
};

export const registerUser = async (userData) => {
  const response = await axios.post(
    `${API}/auth/register`,
    userData
  );

  return response.data;
};
import axios from "axios";

const API_URL = "http://localhost:5000/api/coding";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ======================================
// GET CODING PROBLEMS
// ======================================

export const getCodingProblems = async (params = {}) => {
  const response = await axios.get(API_URL, {
    ...getAuthConfig(),
    params,
  });

  return response.data;
};

// ======================================
// GET SINGLE CODING PROBLEM
// ======================================

export const getCodingProblem = async (problemId) => {
  const response = await axios.get(
    `${API_URL}/${problemId}`,
    getAuthConfig()
  );

  return response.data;
};

// ======================================
// GET CODING STATISTICS
// ======================================

export const getCodingStatistics = async () => {
  const response = await axios.get(
    `${API_URL}/statistics`,
    getAuthConfig()
  );

  return response.data;
};

// ======================================
// CREATE CODING PROBLEM
// ======================================

export const createCodingProblem = async (problemData) => {
  const response = await axios.post(
    API_URL,
    problemData,
    getAuthConfig()
  );

  return response.data;
};

// ======================================
// UPDATE CODING PROBLEM
// ======================================

export const updateCodingProblem = async (
  problemId,
  problemData
) => {
  const response = await axios.patch(
    `${API_URL}/${problemId}`,
    problemData,
    getAuthConfig()
  );

  return response.data;
};

// ======================================
// UPDATE STATUS
// ======================================

export const updateCodingProblemStatus = async (
  problemId,
  status
) => {
  const response = await axios.patch(
    `${API_URL}/${problemId}/status`,
    { status },
    getAuthConfig()
  );

  return response.data;
};

// ======================================
// DELETE CODING PROBLEM
// ======================================

export const deleteCodingProblem = async (problemId) => {
  const response = await axios.delete(
    `${API_URL}/${problemId}`,
    getAuthConfig()
  );

  return response.data;
};

// ======================================
// GENERATE CODING PROBLEMS WITH AI
// ======================================

export const generateCodingProblems = async (
  generationData
) => {
  const response = await axios.post(
    `${API_URL}/generate`,
    generationData,
    getAuthConfig()
  );

  return response.data;
};
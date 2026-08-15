import api from "./api";

// ==========================================
// GET ALL QUESTIONS
// ==========================================
export const getQuestions = async () => {
  const response = await api.get("/questions");
  return response.data;
};


// ==========================================
// CREATE QUESTION
// ==========================================
export const createQuestion = async (questionData) => {
  const response = await api.post(
    "/questions",
    questionData
  );

  return response.data;
};


// ==========================================
// UPDATE QUESTION
// ==========================================
export const updateQuestion = async (
  id,
  questionData
) => {
  const response = await api.put(
    `/questions/${id}`,
    questionData
  );

  return response.data;
};


// ==========================================
// DELETE QUESTION
// ==========================================
export const deleteQuestion = async (id) => {
  const response = await api.delete(
    `/questions/${id}`
  );

  return response.data;
};


// ==========================================
// GET QUESTIONS BY CATEGORY
// ==========================================
export const getQuestionsByCategory = async (
  categoryId
) => {
  const response = await api.get(
    `/questions/category/${categoryId}`
  );

  return response.data;
};


// ==========================================
// SAVE AI GENERATED QUESTIONS
// ==========================================
export const saveAIQuestions = async (
  category,
  questions
) => {
  const response = await api.post(
    "/questions/save-ai",
    {
      category,
      questions,
    }
  );

  return response.data;
};
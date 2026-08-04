import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

const defaultForm = {
  title: "",
  description: "",
  category: "",
  interviewType: "Technical",
  difficulty: "Beginner",
  duration: 30,
  instructions: "",

  role: "",
  skills: "",
  experience: "",
  numberOfQuestions: 10,
};

const useInterviewModal = (interview, onSuccess) => {
  const [formData, setFormData] = useState(defaultForm);

  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  // NEW
  const [aiQuestions, setAIQuestions] = useState([]);

  const [saving, setSaving] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (formData.category) {
      fetchQuestions(formData.category);
    } else {
      setQuestions([]);
    }
  }, [formData.category]);

  useEffect(() => {
    if (!interview) {
      setFormData(defaultForm);
      setSelectedQuestions([]);
      setAIQuestions([]);
      return;
    }

    setFormData({
      title: interview.title || "",
      description: interview.description || "",
      category: interview.category?._id || "",
      interviewType: interview.interviewType || "Technical",
      difficulty: interview.difficulty || "Beginner",
      duration: interview.duration || 30,
      instructions: interview.instructions || "",

      role: interview.title || "",
      skills: "",
      experience: "",
      numberOfQuestions:
        interview.questions?.length || 10,
    });

    setSelectedQuestions(
      interview.questions?.map((q) => q._id) || []
    );

    setAIQuestions([]);
  }, [interview]);

  const fetchCategories = async () => {
    const res = await axios.get(`${API}/categories`);
    setCategories(res.data.categories || []);
  };

  const fetchQuestions = async (categoryId) => {
    const res = await axios.get(
      `${API}/questions/category/${categoryId}`
    );

    setQuestions(res.data.questions || []);
  };

  // ==================================
  // Generate AI Questions
  // ==================================

 const generateAIQuestions = async () => {
  if (!formData.category) {
    alert("Please select a category.");
    return;
  }

  if (!formData.role) {
    alert("Please enter Job Role.");
    return;
  }

  try {
    setGeneratingAI(true);

    // Step 1 - Generate from Gemini
    const aiRes = await axios.post(
      `${API}/ai/generate-questions`,
      {
        role: formData.role,
        skills: formData.skills,
        experience: formData.experience,
        difficulty: formData.difficulty,
        interviewType: formData.interviewType,
        numberOfQuestions: formData.numberOfQuestions,
      }
    );

    // Step 2 - Save generated questions in MongoDB
    const saveRes = await axios.post(
      `${API}/questions/save-ai`,
      {
        category: formData.category,
        questions: aiRes.data.questions,
      }
    );

    // Step 3 - Refresh Question Bank
    await fetchQuestions(formData.category);

    // Step 4 - Auto-select saved question IDs
    setSelectedQuestions(
      saveRes.data.questions.map((q) => q._id)
    );

    // Clear temporary AI questions
    setAIQuestions([]);

    alert("AI Questions Generated Successfully.");

  } catch (err) {
    console.error(err);
    alert("AI Question Generation Failed.");
  } finally {
    setGeneratingAI(false);
  }
};

  // ==================================
// Save Interview
// ==================================

const saveInterview = async () => {
  try {
    setSaving(true);

    const payload = {
      ...formData,
    };

   payload.questions = selectedQuestions;

    // ==========================
    // DEBUG
    // ==========================
    console.log("=================================");
    console.log("Interview Payload");
   console.log(JSON.stringify(payload, null, 2));
    console.log("=================================");

    if (interview) {
      await axios.put(
        `${API}/interview-templates/${interview._id}`,
        payload
      );
    } else {
      await axios.post(
        `${API}/interview-templates`,
        payload
      );
    }

    onSuccess();

  } catch (err) {
    console.error("SAVE ERROR:", err);

    if (err.response) {
      console.log("Backend Response:");
      console.log(err.response.data);
    }

    alert("Failed to save interview.");
  } finally {
    setSaving(false);
  }
};

  return {
    formData,
    setFormData,

    categories,

    questions,

    selectedQuestions,
    setSelectedQuestions,

    saving,
    saveInterview,

    generatingAI,
    generateAIQuestions,
  };
};

export default useInterviewModal;
const ai = require("../config/gemini");

// ============================================
// Generate AI Interview Questions
// ============================================
const generateInterviewQuestions = async (data) => {
  const prompt = `
You are an expert technical interviewer.

Generate ${data.numberOfQuestions} interview questions.

Candidate Details:

Job Role: ${data.role}
Skills: ${data.skills}
Experience: ${data.experience}
Difficulty: ${data.difficulty}
Interview Type: ${data.interviewType}

Return ONLY valid JSON.

Format:

[
  {
    "question": "",
    "expectedAnswer": "",
    "difficulty": "",
    "topic": "",
    "followUpQuestion": "",
    "evaluationCriteria": [
      "",
      "",
      ""
    ]
  }
]

Do not return markdown.
Do not return \`\`\`json.
Return only JSON.
`;

  const response = await ai.models.generateContent({
    model: "models/gemini-3.6-flash",
    contents: prompt,
  });

  return response.text;
};

// ============================================
// Evaluate Candidate Interview
// ============================================
const evaluateInterview = async (interview, answers) => {
  const prompt = `
You are a Senior Technical Interviewer.

Evaluate the candidate's interview.

Interview Title:
${interview.title}

Questions:

${interview.questions
  .map((q, index) => {
    return `
Question ${index + 1}
${q.question}

Expected Answer:
${q.expectedAnswer}

Candidate Answer:
${
  answers.find(
    (a) => String(a.question) === String(q._id)
  )?.answer || "No Answer"
}
`;
  })
  .join("\n")}

Return ONLY valid JSON.

Format:

{
  "overallScore": 0,
  "percentage": 0,
  "overallFeedback": "",
  "strengths": [
    "",
    ""
  ],
  "improvements": [
    "",
    ""
  ]
}

Do not return markdown.
Do not return \`\`\`json.
Return only JSON.
`;

  const response = await ai.models.generateContent({
    model: "models/gemini-3.6-flash",
    contents: prompt,
  });

  return response.text;
};

module.exports = {
  generateInterviewQuestions,
  evaluateInterview,
};
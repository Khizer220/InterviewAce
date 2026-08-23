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
You are a Senior Technical Interviewer evaluating a candidate's technical interview.

Your job is to carefully evaluate EVERY question and calculate a fair overall score.

INTERVIEW TITLE:
${interview.title}

QUESTIONS AND ANSWERS:

${interview.questions
  .map((q, index) => {
    const candidateAnswer = answers.find(
      (a) => String(a.question) === String(q._id)
    )?.answer;

    return `
----------------------------------------
Question ${index + 1}
----------------------------------------

Question:
${q.question}

Expected Answer:
${q.expectedAnswer || "No expected answer provided"}

Candidate Answer:
${candidateAnswer || "No Answer"}
`;
  })
  .join("\n")}

EVALUATION RULES:

1. Evaluate every question individually.
2. Compare the candidate's answer with the expected answer.
3. Give credit when the candidate demonstrates correct understanding, even if the wording is different from the expected answer.
4. Give partial credit when the answer is partially correct.
5. Give very little or zero credit when the answer is incorrect, irrelevant, or missing.
6. Consider technical accuracy, understanding, completeness, and relevance.
7. Calculate the final score based on the actual quality of all candidate answers.
8. overallScore must be a number from 0 to 100.
9. percentage must be the same final score from 0 to 100.
10. Do not use 0 as a placeholder. Use 0 only when the candidate genuinely deserves a score of 0.

SCORING GUIDE:

90-100 = Excellent
75-89 = Very Good
60-74 = Good
40-59 = Needs Improvement
0-39 = Poor

Return ONLY valid JSON.

Use exactly this structure:

{
  "overallScore": 75,
  "percentage": 75,
  "overallFeedback": "Brief evaluation of the candidate's overall performance.",
  "strengths": [
    "Strength 1",
    "Strength 2"
  ],
  "improvements": [
    "Improvement 1",
    "Improvement 2"
  ]
}

IMPORTANT:

- Replace the example score of 75 with the ACTUAL calculated score.
- overallScore and percentage must be numeric values, not strings.
- Do not return markdown.
- Do not return \`\`\`json.
- Return only the JSON object.
`;

  const response = await ai.models.generateContent({
    model: "models/gemini-3.6-flash",
    contents: prompt,
  });

  return response.text;
};

// ============================================
// Generate AI Coding Problems
// ============================================

const generateCodingProblems = async (data) => {
  const prompt = `
You are an expert coding interview problem designer.

Generate ${data.numberOfProblems} unique coding problems.

Category:
${data.category}

Difficulty:
${data.difficulty}

Programming Language:
${data.language}

Additional Instructions:
${data.instructions || "None"}

IMPORTANT REQUIREMENTS:

1. Problems must be appropriate for the requested difficulty.
2. Problems must be related to the selected category.
3. Problems must be suitable for technical coding interviews.
4. Do not generate duplicate problems.
5. Do not use the difficulty of another level.
6. Provide clear problem descriptions.
7. Provide realistic constraints.
8. Provide input and output formats.
9. Provide at least two examples.
10. Provide starter code for the requested language.
11. Provide hidden test cases.
12. Include time and space complexity.
13. Do not include solutions.
14. Do not return Markdown.
15. Do not return code fences.
16. Return ONLY valid JSON.

Return exactly this JSON structure:

[
  {
    "title": "",
    "description": "",
    "inputFormat": "",
    "outputFormat": "",
    "constraints": [
      ""
    ],
    "examples": [
      {
        "input": "",
        "output": "",
        "explanation": ""
      },
      {
        "input": "",
        "output": "",
        "explanation": ""
      }
    ],
    "starterCode": "",
    "testCases": [
      {
        "input": "",
        "expectedOutput": "",
        "isHidden": true
      },
      {
        "input": "",
        "expectedOutput": "",
        "isHidden": true
      }
    ],
    "hints": [
      ""
    ],
    "timeComplexity": "",
    "spaceComplexity": ""
  }
]

Return ONLY the JSON array.
`;

  const response = await ai.models.generateContent({
    model: "models/gemini-3.6-flash",
    contents: prompt,
  });

  return response.text;
};

// ============================================
// Export
// ============================================
module.exports = {
  generateInterviewQuestions,
  evaluateInterview,
  generateCodingProblems,
};
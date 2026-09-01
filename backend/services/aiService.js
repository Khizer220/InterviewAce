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
3. Give credit when the candidate demonstrates correct understanding even if wording differs.
4. Give partial credit when the answer is partially correct.
5. Give very little or zero credit when the answer is incorrect, irrelevant, or missing.
6. Consider technical accuracy, understanding, completeness, and relevance.
7. Calculate the overall score from the actual quality of ALL answers.
8. overallScore must be a number from 0 to 100.
9. Do not use 0 as a placeholder.
10. Use 0 only when the candidate genuinely deserves a zero.

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

- Replace 75 with the ACTUAL score.
- overallScore MUST be numeric.
- Do NOT calculate or return percentage.
- Do NOT return Markdown.
- Do NOT return code fences.
- Return ONLY the JSON object.
`;

  const response = await ai.models.generateContent({
    model: "models/gemini-3.6-flash",
    contents: prompt,
  });

  let text = response.text.trim();

  // Remove accidental markdown code fences if Gemini adds them.
  text = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  // Extract the JSON object if Gemini adds surrounding text.
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("AI returned an invalid evaluation response.");
  }

  const jsonText = text.substring(start, end + 1);

  const result = JSON.parse(jsonText);

  const score = Number(result.overallScore);

  if (!Number.isFinite(score)) {
    throw new Error("AI returned an invalid interview score.");
  }

  // Keep score safely between 0 and 100.
  result.overallScore = Math.max(
    0,
    Math.min(100, Math.round(score))
  );

  return JSON.stringify(result);
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
// Generate AI MCQ Questions
// ============================================

const generateMCQQuestions = async (data) => {
  const prompt = `
You are an expert technical assessment creator.

Generate ${data.numberOfQuestions} multiple choice questions (MCQs).

Category:
${data.category}

Difficulty:
${data.difficulty}

Additional Focus:
${data.topic || "None"}

REQUIREMENTS:

1. Each question must have exactly 4 answer options.
2. Exactly one option must be correct.
3. Options must be plausible — avoid obviously wrong distractors that give away the answer.
4. Do not generate duplicate questions.
5. Questions must be appropriate for the requested difficulty.
6. Do not include explanations inside the question text.
7. Do not return Markdown.
8. Do not return code fences.
9. Return ONLY valid JSON.

Return exactly this JSON structure:

[
  {
    "question": "",
    "options": ["", "", "", ""],
    "correctAnswer": 0,
    "difficulty": "",
    "topic": ""
  }
]

IMPORTANT:
- correctAnswer is the ZERO-BASED INDEX of the correct option in the options array (0, 1, 2, or 3).
- Every question must have exactly 4 entries in "options".
- Return ONLY the JSON array.
`;

  const response = await ai.models.generateContent({
    model: "models/gemini-3.6-flash",
    contents: prompt,
  });

  return response.text;
};

// ============================================
// Evaluate a Coding Submission (AI-based judge)
// NOTE: This is AI code review, not real execution — no sandbox runs
// the code. Gemini reasons about what the code would output for each
// test case. Good for typical logic problems; can occasionally be
// wrong about exact formatting, subtle runtime errors, or infinite
// loops in ways real execution never would be. Labeled "AI Evaluated"
// on the frontend for the same reason interview scoring is.
// ============================================

const evaluateCodeSubmission = async (data) => {
  const prompt = `
You are an expert code judge evaluating a candidate's submitted solution against real test cases for a coding problem.

PROBLEM TITLE:
${data.title}

PROBLEM DESCRIPTION:
${data.description}

CANDIDATE'S SOLUTION (language: ${data.language}):
${data.code}

TEST CASES (evaluate the code against ALL of these, in this exact order):

${data.testCases
  .map(
    (tc, index) => `
----------------------------------------
Test Case ${index + 1}
----------------------------------------
Input:
${tc.input}

Expected Output:
${tc.expectedOutput}
`
  )
  .join("\n")}

INSTRUCTIONS:

1. First, check whether the code is syntactically valid for ${data.language}. If there is a clear syntax or compilation error, set "compilationError" to true and explain it — then every test case must be marked as failed.
2. If the code is syntactically valid, carefully and literally trace through its execution logic for each test case, one at a time.
3. Determine whether the code's actual output would exactly match the expected output for each test case — pay attention to exact formatting, whitespace, and edge cases.
4. Do not assume the code is correct just because it looks reasonable — reason through the actual logic.
5. Be honest: it's fine and expected for some test cases to fail if the logic is genuinely wrong.

Return ONLY valid JSON in exactly this structure, with exactly ${data.testCases.length} entries in "testCaseResults", in the same order as the test cases above:

{
  "compilationError": false,
  "compilationErrorMessage": "",
  "testCaseResults": [
    {
      "passed": true,
      "predictedOutput": "what the code would actually print for this test case",
      "reasoning": "one short sentence on why it passed or failed"
    }
  ],
  "overallFeedback": "one or two sentence summary of the submission's correctness"
}

Do not return Markdown.
Do not return \`\`\`json.
Return only the JSON object.
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
  generateMCQQuestions,
  evaluateCodeSubmission,
};
// ======================================
// Code execution via Piston (emkc.org)
// Free, public, no signup or API key required — switched from Judge0
// after hitting RapidAPI's billing/card requirement on the Basic plan.
// Piston doesn't have Judge0's "expected_output" comparison built in,
// so pass/fail is computed here by comparing trimmed stdout directly.
// ======================================

const PISTON_URL = "https://emkc.org/api/v2/piston/execute";

// Piston needs an exact language + version pair, not a numeric ID like
// Judge0. These versions are commonly available on the public instance;
// if a language ever starts failing, check https://emkc.org/api/v2/piston/runtimes
// for the currently available version and update here.
const LANGUAGE_IDS = {
  python: { language: "python", version: "3.10.0" },
  javascript: { language: "javascript", version: "18.15.0" },
  java: { language: "java", version: "15.0.2" },
  cpp: { language: "cpp", version: "10.2.0" },
  c: { language: "c", version: "10.2.0" },
};

const runOnPiston = async ({ sourceCode, language, version, stdin }) => {
  const response = await fetch(PISTON_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      language,
      version,
      files: [{ content: sourceCode }],
      stdin: stdin || "",
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Piston request failed (${response.status}): ${text}`);
  }

  return response.json();
};

// Runs one submission against every test case sequentially.
const runTestCases = async ({ sourceCode, language, testCases }) => {
  const runtime = LANGUAGE_IDS[language?.toLowerCase()];

  if (!runtime) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const results = [];

  for (const testCase of testCases) {
    const pistonResult = await runOnPiston({
      sourceCode,
      language: runtime.language,
      version: runtime.version,
      stdin: testCase.input,
    });

    // Compiled languages (Java/C/C++) report a separate compile step.
    // A non-zero compile exit code means it never even ran.
    const compileFailed = pistonResult.compile && pistonResult.compile.code !== 0;

    const actualOutput = (pistonResult.run?.stdout || "").trim();
    const expected = (testCase.expectedOutput || "").trim();
    const passed = !compileFailed && actualOutput === expected;

    results.push({
      isHidden: !!testCase.isHidden,
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      actualOutput: pistonResult.run?.stdout || "",
      passed,
      statusDescription: compileFailed
        ? "Compilation Error"
        : passed
        ? "Accepted"
        : "Wrong Answer",
      stderr: pistonResult.run?.stderr || "",
      compileOutput: compileFailed
        ? pistonResult.compile?.stderr || pistonResult.compile?.output || ""
        : "",
    });
  }

  return results;
};

module.exports = { runTestCases, LANGUAGE_IDS };
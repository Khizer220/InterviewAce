import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getPublishedProblem,
  submitCode,
} from "../../../../services/codingPracticeService";
import "./CodingSolve.css";

const LANGUAGES = [
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
];

const CodingSolve = () => {
  const { id } = useParams();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getPublishedProblem(id);
        setProblem(data.problem);
        const starter = data.problem?.starterCode?.[language] || "";
        setCode(starter);
      } catch (err) {
        console.error(err);
        setError("Couldn't load this problem.");
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    const starter = problem?.starterCode?.[lang];
    if (starter) setCode(starter);
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      setSubmitError("Write some code first.");
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);
      setResult(null);

      const data = await submitCode(id, code, language);
      setResult(data.submission);
    } catch (err) {
      console.error(err);
      setSubmitError(err?.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="cs-state">Loading problem...</div>;
  if (error || !problem) return <div className="cs-state cs-error">{error || "Problem not found."}</div>;

  return (
    <div className="cs-page">
      <div className="cs-left">
        <h1>{problem.title}</h1>
        <span className={`cs-diff cs-diff-${problem.difficulty?.toLowerCase()}`}>
          {problem.difficulty}
        </span>

        <p className="cs-description">{problem.description}</p>

        {problem.examples?.length > 0 && (
          <div className="cs-examples">
            <h3>Examples</h3>
            {problem.examples.map((ex, i) => (
              <div className="cs-example" key={i}>
                <div><strong>Input:</strong> <code>{ex.input}</code></div>
                <div><strong>Output:</strong> <code>{ex.output}</code></div>
                {ex.explanation && <div className="cs-explain">{ex.explanation}</div>}
              </div>
            ))}
          </div>
        )}

        {problem.constraints?.length > 0 && (
          <div className="cs-constraints">
            <h3>Constraints</h3>
            <ul>
              {problem.constraints.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>
        )}
      </div>

      <div className="cs-right">
        <div className="cs-editor-toolbar">
          <select value={language} onChange={(e) => handleLanguageChange(e.target.value)}>
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>

          <button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Judging..." : "Submit"}
          </button>
        </div>

        <textarea
          className="cs-editor"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
        />

        {submitError && <div className="cs-submit-error">{submitError}</div>}

        {result && (
          <div className="cs-result">
            <div className={`cs-verdict cs-verdict-${result.status.toLowerCase().replace(/\s+/g, "-")}`}>
              <span className="cs-ai-badge">AI Evaluated</span>
              {result.status} — {result.testCasesPassed}/{result.totalTestCases} test cases passed
            </div>

            {result.overallFeedback && (
              <p className="cs-ai-feedback">{result.overallFeedback}</p>
            )}

            <div className="cs-results-list">
              {result.results.map((r, i) => (
                <div key={i} className={`cs-result-row ${r.passed ? "cs-pass" : "cs-fail"}`}>
                  <span>Test {i + 1} {r.isHidden ? "(hidden)" : ""}</span>
                  <span>{r.passed ? "Passed" : "Failed"}</span>
                  {!r.isHidden && !r.passed && (
                    <div className="cs-result-detail">
                      <div><strong>Expected:</strong> <code>{r.expectedOutput}</code></div>
                      <div><strong>Got:</strong> <code>{r.actualOutput || r.stderr || r.compileOutput}</code></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodingSolve;

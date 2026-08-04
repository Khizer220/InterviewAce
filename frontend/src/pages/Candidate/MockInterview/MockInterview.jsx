import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import "./MockInterview.css";

import InterviewIntro from "./components/InterviewIntro/InterviewIntro";
import QuestionScreen from "./components/QuestionScreen/QuestionScreen";

const API = "http://localhost:5000/api";

const MockInterview = () => {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [interview, setInterview] = useState(null);

  useEffect(() => {
    fetchInterview();
  }, []);

  const fetchInterview = async () => {
    try {
      const res = await axios.get(
        `${API}/interview-templates/${id}`
      );

      setInterview(res.data.template);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-page">
        Loading Interview...
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="loading-page">
        Interview Not Found
      </div>
    );
  }

  return (
    <>
      {!started ? (
        <InterviewIntro
          interview={interview}
          onStart={() => setStarted(true)}
        />
      ) : (
        <QuestionScreen interview={interview} />
      )}
    </>
  );
};

export default MockInterview;
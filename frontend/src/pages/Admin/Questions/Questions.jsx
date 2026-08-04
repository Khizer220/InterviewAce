import { useEffect, useMemo, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  FaQuestionCircle,
  FaCheckCircle,
  FaBook,
  FaGraduationCap,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import AdminLayout from "../../../components/admin/common/AdminLayout/AdminLayout";
import PageHeader from "../../../components/admin/common/PageHeader/PageHeader";
import SearchBar from "../../../components/admin/common/SearchBar/SearchBar";
import StatsCard from "../../../components/admin/common/StatsCard/StatsCard";
import QuestionModal from "../../../components/admin/questions/QuestionModal/QuestionModal";

import {
  getQuestions,
  createQuestion,
} from "../../../services/questionService";

import styles from "./Questions.module.css";

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const data = await getQuestions();
      setQuestions(data.questions);
    } catch {
      toast.error("Failed to load questions");
    }
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter(
      (q) =>
        q.question.toLowerCase().includes(search.toLowerCase()) ||
        q.category?.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [questions, search]);

  const handleSaveQuestion = async (data) => {
    try {
      await createQuestion(data);
      toast.success("Question Added Successfully");
      setOpenModal(false);
      fetchQuestions();
    } catch {
      toast.error("Unable to save question");
    }
  };

  return (
    <>
      <Toaster position="top-right" />

      <AdminLayout>
        <PageHeader
          title="Interview Questions"
          subtitle="Manage interview questions for InterviewAce."
          buttonText="+ Add Question"
          onButtonClick={() => {
            setSelectedQuestion(null);
            setOpenModal(true);
          }}
        />

        <div className={styles.statsGrid}>
          <StatsCard
            title="Total Questions"
            value={questions.length}
            icon={<FaQuestionCircle />}
            color="#6C4CF1"
          />

          <StatsCard
            title="Active"
            value={questions.filter((q) => q.status).length}
            icon={<FaCheckCircle />}
            color="#10B981"
          />

          <StatsCard
            title="Beginner"
            value={
              questions.filter((q) => q.difficulty === "Beginner").length
            }
            icon={<FaBook />}
            color="#F59E0B"
          />

          <StatsCard
            title="Advanced"
            value={
              questions.filter((q) => q.difficulty === "Advanced").length
            }
            icon={<FaGraduationCap />}
            color="#EF4444"
          />
        </div>

        <div className={styles.toolbar}>
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Questions..."
          />

          <span className={styles.count}>
            {filteredQuestions.length} Questions
          </span>
        </div>

        <div className={styles.questionGrid}>
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((question) => (
              <div key={question._id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>{question.question}</h3>

                  <div className={styles.actions}>
                    <button className={styles.editBtn} title="Edit">
                      <FaEdit />
                    </button>

                    <button className={styles.deleteBtn} title="Delete">
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <div className={styles.badges}>
                  <span className={styles.categoryBadge}>
                    {question.category?.name}
                  </span>

                  <span className={styles.difficultyBadge}>
                    {question.difficulty}
                  </span>

                  <span className={styles.marksBadge}>
                    {question.marks} Marks
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.empty}>
              No Questions Found
            </div>
          )}
        </div>

        <QuestionModal
          isOpen={openModal}
          initialData={selectedQuestion}
          onClose={() => {
            setOpenModal(false);
            setSelectedQuestion(null);
          }}
          onSave={handleSaveQuestion}
        />
      </AdminLayout>
    </>
  );
};

export default Questions;
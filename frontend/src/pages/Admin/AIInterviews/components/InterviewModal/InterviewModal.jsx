import "./InterviewModal.css";

import ModalHeader from "./ModalHeader";
import InterviewForm from "./InterviewForm";
import QuestionSelector from "./QuestionSelector";
import ModalFooter from "./ModalFooter";
import useInterviewModal from "./useInterviewModal";

const InterviewModal = ({
  isOpen,
  onClose,
  onSuccess,
  interview,
}) => {
  const {
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

  } = useInterviewModal(interview, onSuccess);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="interview-modal">

        <ModalHeader
          isEdit={!!interview}
          onClose={onClose}
        />

        <div className="modal-body">

          <InterviewForm
            formData={formData}
            setFormData={setFormData}
            categories={categories}
            generateAIQuestions={generateAIQuestions}
            generatingAI={generatingAI}
          />

          <QuestionSelector
            questions={questions}
            selectedQuestions={selectedQuestions}
            setSelectedQuestions={setSelectedQuestions}
          />

        </div>

        <ModalFooter
          isEdit={!!interview}
          saving={saving}
          onClose={onClose}
          onSave={saveInterview}
        />

      </div>
    </div>
  );
};

export default InterviewModal;
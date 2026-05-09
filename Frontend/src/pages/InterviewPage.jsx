import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {sendInterviewMessage, endInterviewApi} from "../api/interviewApi";
import ChatWindow from "../components/ChatWindow";
import InterviewInput from "../components/InterviewInput";
import ReportModal from "../components/ReportModal";
import EndInterviewModal from "../components/EndInterviewModal";
import Header from "../components/Header";


const InterviewPage = () => {
  const { id: interviewId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi! I'm your AI interviewer. Let's begin — introduce yourself."
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [ending, setEnding] = useState(false);
  const [report, setReport] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isInterviewEnded, setIsInterviewEnded] = useState(false);



  const handleEndClick = () => {
    setShowConfirm(true);
  };

  const confirmEndInterview = async () => {
    setShowConfirm(false);
    setEnding(true);

    try {
      const data = await endInterviewApi(interviewId);
      setReport(data);
      setShowReport(true);
      setIsInterviewEnded(true);
    } catch (err) {
      console.error("End interview error:", err.message);
      alert("Failed to end interview. Please try again.");
    } finally {
      setEnding(false);
    }
  };

  const cancelEndInterview = () => {
    setShowConfirm(false);
  };

  const sendMessage = async (text) => {
    const userMsg = { role: "user", text };

    if (isInterviewEnded) return; 

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const data = await sendInterviewMessage(interviewId, text);

      const aiText = data?.reply || data?.response;

      const aiMsg = {
        role: "ai",
        text: aiText
      };

      setMessages((prev) => [...prev, aiMsg]);

      // ✅ detect end
      if (aiText?.toLowerCase().includes("interview completed")) {
        setIsInterviewEnded(true);
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            text: "Interview is over. Please click the End Interview button to continue."
          }
        ]);
      }

    } catch (err) {
      console.error("Send message error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoHome = () => {
    setShowReport(false);
    navigate("/home");
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* HEADER */}
      <Header />

      {/* CHAT */}
      <ChatWindow messages={messages} loading={loading} />

      {/* INPUT */}
      <InterviewInput
        onSend={sendMessage}
        onEnd={handleEndClick}
        loading={loading}
        ending={ending}
        disabled={isInterviewEnded}
      />

      {/* CONFIRMATION DIALOG */}
      {showConfirm && (
        <EndInterviewModal
          onCancel={cancelEndInterview}
          onConfirm={confirmEndInterview}
        />
      )}

      {/* REPORT MODAL */}
      {showReport && (
        <ReportModal
          report={report}
          onClose={() => setShowReport(false)}
          onGoHome={handleGoHome}
        />
      )}
    </div>
  );
};

export default InterviewPage;
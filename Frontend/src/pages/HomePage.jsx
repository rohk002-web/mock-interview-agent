import { useState } from "react";
import toast from "react-hot-toast";
import AnimatedBackground from "../components/AnimatedBackground";
import StepIndicator from "../components/StepIndicator";
import UploadStep from "../components/UploadStep";
import InterviewDetailsStep from "../components/InterviewDetailsStep";
import SuccessStep from "../components/SuccessStep";

const steps = {
  UPLOAD: "upload",
  DETAILS: "details",
  SUCCESS: "success",
};

const HomePage = () => {
  const [currentStep, setCurrentStep] = useState(steps.UPLOAD);
  const [resumeId, setResumeId] = useState(null);
  const [interviewData, setInterviewData] = useState(null);

  const handleUploadSuccess = (id) => {
    setResumeId(id);
    setCurrentStep(steps.DETAILS);
  };

  const handleDetailsSuccess = (data) => {
    setInterviewData(data);
    setCurrentStep(steps.SUCCESS);
  };

  const handleBackToUpload = () => {
    setCurrentStep(steps.UPLOAD);
  };

  const handleStartInterview = () => {
    toast.success("Starting your mock interview...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 via-slate-100 to-indigo-200 relative overflow-hidden">
      {/* Soft Animated Blobs - Slightly darker */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-400/20 rounded-full filter blur-[80px] animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400/20 rounded-full filter blur-[80px] animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-slate-400/15 rounded-full filter blur-[80px] animate-blob animation-delay-4000"></div>

      {/* Compact Header */}
      <header className="relative z-10 pt-8 pb-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/70 border border-slate-300 rounded-full mb-4 shadow-sm">
          <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse"></span>
          <span className="text-xs font-medium text-slate-700">AI-Powered Interview Prep</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
          Mock Interview <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700">AI</span>
        </h1>
        <p className="mt-2 text-sm text-slate-700">
          Upload resume → Get AI questions → Practice & Improve
        </p>
      </header>

      {/* Progress Steps */}
      <StepIndicator currentStep={currentStep} steps={steps} />

      {/* Main Content - Compact */}
      <main className="relative z-10 max-w-2xl mx-auto px-4">
        <div className="bg-white/85 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-300/50 border border-slate-200/80 overflow-hidden">
          {currentStep === steps.UPLOAD && (
            <UploadStep onUploadSuccess={handleUploadSuccess} />
          )}

          {currentStep === steps.DETAILS && (
            <InterviewDetailsStep
              resumeId={resumeId}
              onBack={handleBackToUpload}
              onSuccess={handleDetailsSuccess}
            />
          )}

          {currentStep === steps.SUCCESS && interviewData && (
            <SuccessStep
              interviewData={interviewData}
              onStartInterview={handleStartInterview}
            />
          )}
        </div>

      </main>

      {/* CSS Animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounceIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HomePage;

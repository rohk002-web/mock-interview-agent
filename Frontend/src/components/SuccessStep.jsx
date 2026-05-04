import { CheckCircle, Play } from "lucide-react";
import toast from "react-hot-toast";

const SuccessStep = ({ interviewData, onStartInterview }) => {
  return (
    <div className="p-6 text-center animate-fade-in">
      <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-200">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Ready!</h2>
      <p className="text-sm text-slate-600 mb-4">
        Your personalized interview is prepared.
      </p>

      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-4 border border-indigo-100">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs text-slate-500 font-medium">Role</p>
            <p className="text-sm font-semibold text-slate-800 truncate">{interviewData.role}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Experience</p>
            <p className="text-sm font-semibold text-slate-800">{interviewData.years_of_experience} years</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Level</p>
            <p className="text-sm font-semibold text-slate-800">{interviewData.interview_level}</p>
          </div>
        </div>
      </div>

      <button
        onClick={onStartInterview}
        className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-200 hover:shadow-xl transition-all flex items-center justify-center gap-2"
      >
        <Play className="w-4 h-4" />
        Start Mock Interview
      </button>
    </div>
  );
};

export default SuccessStep;

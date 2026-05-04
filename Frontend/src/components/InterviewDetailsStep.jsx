import { useState } from "react";
import toast from "react-hot-toast";
import { Briefcase, ArrowLeft } from "lucide-react";
import { addInterviewDetails } from "../api/interviewApi";

const interviewLevels = ["Junior", "Mid", "Senior", "Lead"];

const InterviewDetailsStep = ({ resumeId, onBack, onSuccess }) => {
  const [submitting, setSubmitting] = useState(false);
  const [interviewData, setInterviewData] = useState({
    role: "",
    years_of_experience: "",
    interview_level: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInterviewData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitDetails = async () => {
    if (!interviewData.role.trim()) {
      toast.error("Please enter a role");
      return;
    }
    if (!interviewData.years_of_experience) {
      toast.error("Please enter years of experience");
      return;
    }

    const payload = {
      resume_id: resumeId || "temp-id",
      role: interviewData.role,
      years_of_experience: parseInt(interviewData.years_of_experience),
      interview_level: interviewData.interview_level || "Mid"
    };

    setSubmitting(true);
    try {
      const res = await addInterviewDetails(payload);
      toast.success(res.message);
      onSuccess(interviewData);
    } catch (err) {
      toast.error(err?.message || "Failed to save interview details");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="text-center mb-4">
        <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mx-auto mb-3 border border-purple-200">
          <Briefcase className="w-7 h-7 text-purple-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Interview Details</h2>
      </div>

      <div className="space-y-4">
        {/* Role & Experience - Side by Side */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Role *</label>
            <input
              type="text"
              name="role"
              value={interviewData.role}
              onChange={handleInputChange}
              placeholder="e.g., Software Engineer"
              className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Experience (yrs) *</label>
            <input
              type="number"
              name="years_of_experience"
              value={interviewData.years_of_experience}
              onChange={handleInputChange}
              placeholder="e.g., 3"
              min="0"
              max="50"
              className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
          </div>
        </div>

        {/* Interview Level */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">Level</label>
          <div className="flex gap-2">
            {interviewLevels.map((level) => (
              <button
                key={level}
                onClick={() => setInterviewData((prev) => ({ ...prev, interview_level: level }))}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                  interviewData.interview_level === level
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-200"
                    : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSubmitDetails}
          disabled={submitting}
          className="flex-1 py-3 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-200 hover:shadow-xl transition-all disabled:opacity-50"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </span>
          ) : (
            "Start Interview"
          )}
        </button>
      </div>
    </div>
  );

}
export default InterviewDetailsStep;

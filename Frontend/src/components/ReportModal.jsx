import { X, Trophy, Target, Lightbulb, FileText, Home } from "lucide-react";

const ReportModal = ({ report, onClose, onGoHome }) => {
  if (!report) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-all" onClick={onClose} />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-lg max-h-[85vh] overflow-auto rounded-2xl shadow-2xl animate-fade-in">

          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Interview Complete!</h2>
                  <p className="text-indigo-100 text-sm">Here's your performance report</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Score Card */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Total Score</p>
                  <p className="text-4xl font-bold text-indigo-600 mt-1">
                    {report.total_score}<span className="text-lg text-slate-400">/100</span>
                  </p>
                </div>
              
              </div>
            </div>

            {/* Weak Topics */}
            {report.weak_topics?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-rose-500" />
                  <h3 className="font-semibold text-slate-800">Areas to Improve</h3>
                </div>
                <div className="bg-rose-50 rounded-xl p-4 border border-rose-100">
                  <ul className="space-y-2">
                    {report.weak_topics.map((t, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="w-1.5 h-1.5 bg-rose-400 rounded-full mt-2 shrink-0" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Suggestions */}
            {report.improvement_suggestions?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  <h3 className="font-semibold text-slate-800">Improvement Tips</h3>
                </div>
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                  <ul className="space-y-2">
                    {report.improvement_suggestions.map((t, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="w-5 h-5 bg-amber-400 text-white rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Summary */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-emerald-500" />
                <h3 className="font-semibold text-slate-800">Summary</h3>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                <p className="text-sm text-slate-700 leading-relaxed">
                  {report.summary}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={onGoHome}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-indigo-200 transition-all cursor-pointer"
              >
                <Home className="w-4 h-4" />
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
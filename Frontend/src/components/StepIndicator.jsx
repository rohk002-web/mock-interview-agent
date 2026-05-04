import { Check } from "lucide-react";

const StepIndicator = ({ currentStep, steps }) => {
  const isUpload = currentStep === steps.UPLOAD;
  const isDetails = currentStep === steps.DETAILS;
  const isSuccess = currentStep === steps.SUCCESS;

  return (
    <div className="relative z-10 max-w-sm mx-auto mb-6">
      <div className="flex items-center justify-between">
        {/* Step 1 */}
        <div className={`flex flex-col items-center ${isUpload ? "opacity-100" : "opacity-75"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 border ${
            isUpload ? "bg-indigo-700 border-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-slate-100 border-slate-400 text-slate-600"
          }`}>
            1
          </div>
          <span className="mt-1 text-xs text-slate-700 font-medium">Upload</span>
        </div>

        {/* Progress Bar 1 */}
        <div className="flex-1 h-0.5 mx-3 bg-slate-300 rounded-full">
          <div className={`h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-500 ${
            isUpload ? "w-0" : "w-full"
          }`}></div>
        </div>

        {/* Step 2 */}
        <div className={`flex flex-col items-center ${isDetails ? "opacity-100" : "opacity-75"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 border ${
            isDetails ? "bg-indigo-700 border-indigo-600 text-white shadow-lg shadow-indigo-200" : isSuccess ? "bg-indigo-700 border-indigo-600 text-white" : "bg-slate-100 border-slate-400 text-slate-600"
          }`}>
            2
          </div>
          <span className="mt-1 text-xs text-slate-700 font-medium">Details</span>
        </div>

        {/* Progress Bar 2 */}
        <div className="flex-1 h-0.5 mx-3 bg-slate-300 rounded-full">
          <div className={`h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-500 ${
            isSuccess ? "w-full" : "w-0"
          }`}></div>
        </div>

        {/* Step 3 */}
        <div className={`flex flex-col items-center ${isSuccess ? "opacity-100" : "opacity-75"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 border ${
            isSuccess ? "bg-green-600 border-green-500 text-white shadow-lg shadow-green-200" : "bg-slate-100 border-slate-400 text-slate-500"
          }`}>
            <Check className="w-4 h-4" />
          </div>
          <span className="mt-1 text-xs text-slate-700 font-medium">Ready</span>
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;

import { useState } from "react";
import toast from "react-hot-toast";
import { FileText, Upload, Check } from "lucide-react";
import { uploadResume } from "../api/uploadresume";

const UploadStep = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("upload_file", file);

    setUploading(true);
    try {
      const res = await uploadResume(formData);
      toast.success(res?.message || "Resume uploaded successfully!");
      onUploadSuccess(res?.resume_id || res?.id);
    } catch (err) {
      toast.error(err?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="text-center mb-4">
        <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3 border border-indigo-200">
          <FileText className="w-7 h-7 text-indigo-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Upload Resume</h2>
        <p className="text-xs text-slate-500 mt-1">PDF, DOC, or DOCX</p>
      </div>

      {/* Drop Zone */}
      <div className="relative">
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
          id="resume-upload"
        />
        <label
          htmlFor="resume-upload"
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
            file
              ? "border-indigo-500 bg-indigo-50"
              : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50"
          }`}
        >
          {file ? (
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2 border border-green-200">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm font-semibold text-slate-800 truncate max-w-xs">{file.name}</span>
              <span className="text-xs text-slate-500">Click to change</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mb-2 border border-indigo-200">
                <Upload className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-sm font-medium text-slate-600">Drop file or click to browse</span>
            </div>
          )}
        </label>
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className={`w-full mt-4 py-3 rounded-lg font-semibold text-white transition-all duration-300 cursor-pointer ${
          file && !uploading
            ? "bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-200 hover:shadow-xl"
            : "bg-slate-300 text-slate-500 cursor-not-allowed"
        }`}
      >
        {uploading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Uploading...
          </span>
        ) : (
          "Upload Resume"
        )}
      </button>
    </div>
  );
};

export default UploadStep;

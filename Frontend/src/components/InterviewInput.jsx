import { Send, Square, Loader2 } from "lucide-react";
import { useState } from "react";

const InterviewInput = ({
  onSend,
  onEnd,
  loading,
  ending,
  disabled
}) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim() || disabled) return;

    onSend(text);
    setText("");
  };

  return (
    <div className="p-4 border-t bg-white/80 backdrop-blur-sm">
      <div className="flex items-center gap-3 bg-slate-100/80 border border-slate-200 rounded-xl px-4 py-3 shadow-sm">

        {/* input */}
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={disabled ? "Interview completed" : "Type your answer..."}
          className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder-slate-400"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          disabled={disabled || ending}
        />

        {/* send */}
        <button
          onClick={handleSend}
          disabled={loading || ending || disabled}
          className="p-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-all cursor-pointer"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </button>

        {/* end interview */}
        <button
          onClick={onEnd}
          disabled={ending}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-rose-500 text-white font-medium text-sm hover:shadow-lg hover:shadow-red-200 disabled:opacity-60 transition-all cursor-pointer"
          title="End Interview & Generate Report"
        >
          {ending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Ending...
            </>
          ) : (
            <>
              <Square size={16} fill="currentColor" />
              End
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InterviewInput;
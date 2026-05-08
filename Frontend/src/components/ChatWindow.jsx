import MessageBubble from "./MessageBubble";

const TypingBubble = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-white border shadow-sm px-4 py-3 rounded-2xl rounded-bl-none flex gap-1 items-center">
        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
      </div>
    </div>
  );
};

const ChatWindow = ({ messages, loading }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">

      {/* messages */}
      {messages.map((msg, idx) => (
        <MessageBubble key={idx} msg={msg} />
      ))}

      {/* typing indicator bubble */}
      {loading && <TypingBubble />}

    </div>
  );
};

export default ChatWindow;
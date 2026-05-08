const MessageBubble = ({ msg }) => {
  const isUser = msg.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow
          ${isUser
            ? "bg-indigo-600 text-white rounded-br-none"
            : "bg-white border rounded-bl-none"
          }
        `}
      >
        {msg.text}
      </div>
    </div>
  );
};

export default MessageBubble;
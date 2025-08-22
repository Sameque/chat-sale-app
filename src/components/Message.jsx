export default function Message({ msg, username }) {
  const isMine = msg.sender === username;

  return (
    <div className={`flex mb-2 ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`p-2 rounded-xl max-w-xs ${
          isMine ? "bg-green-300" : "bg-gray-300"
        }`}
      >
        <p className="text-sm">{msg.text}</p>
        <span className="text-xs text-gray-600 block text-right">
          {new Date(msg.created_at || msg.createdAt).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}

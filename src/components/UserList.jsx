export default function UserList({ users, username, onSelect, setShowUsers }) {
  return (
    <div className="w-64 bg-gray-100 border-r h-screen p-4">
      <h2 className="font-bold mb-4">{username}</h2>
      {users.map((u) => (
        <div
          key={u.username}
          onClick={() => {
            onSelect(u);
            setShowUsers(false);
          }}
          className="p-2 mb-2 bg-white rounded shadow cursor-pointer hover:bg-gray-200"
        >
          {u.username}
        </div>
      ))}
    </div>
  );
}

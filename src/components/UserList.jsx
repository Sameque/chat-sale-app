export default function UserList({ users, onSelect }) {
  return (
    <div className="w-64 bg-gray-100 border-r h-screen p-4">
      <h2 className="font-bold mb-4">Contatos</h2>
      {users.map((u) => (
        <div
          key={u.username}
          onClick={() => onSelect(u.username)}
          className="p-2 mb-2 bg-white rounded shadow cursor-pointer hover:bg-gray-200"
        >
          {u.username}
        </div>
      ))}
    </div>
  );
}

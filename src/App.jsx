import { useState } from "react";
import Login from "./components/Login";
import Chat from "./components/Chat";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [username, setUsername] = useState("");

  const handleLogin = (t, u) => {
    console.log("Login realizado com sucesso:", t, u,token, username);
    
    setToken(t);
    setUsername(u);
  };

  return token ? (
    <Chat token={token} username={username} />
  ) : (
    <Login onLogin={handleLogin} />
  );
}

// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

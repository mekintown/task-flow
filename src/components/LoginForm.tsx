import { useState } from "react";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="w-screen h-screen flex justify-center items-center rounded">
      <div className="flex flex-col w-[40%] shadow-xl p-5 gap-5">
        <h2>LOGIN</h2>
        <div className="flex flex-col">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-5 py-2 border-black rounded-2xl"
          ></input>
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-5 py-2 border-black rounded-2xl"
          ></input>
        </div>
        <button>Login</button>
      </div>
    </div>
  );
}

export default LoginForm;

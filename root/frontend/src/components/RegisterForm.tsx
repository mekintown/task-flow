import { useState } from "react";

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  return (
    <div className="grid grid-cols-3 h-screen items-center ">
      <div className="flex flex-col items-center justify-center">
        <img src="../assets/chulalongkornHospital.jpeg"></img>
        <h2>Join us now!</h2>
      </div>
      <div className="flex items-center justify-center h-full bg-slate-600 p-5 col-span-2 ">
        <div className="grid grid-cols-2 gap-5 h-[50%] ">
          <div className="flex flex-col gap-2 col-span-2">
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
          <div className="flex flex-col gap-2 col-span-2">
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
          <div className="flex flex-col gap-2 col-span-2">
            <label htmlFor="password2">Type Password Again</label>
            <input
              id="password2"
              type="password2"
              placeholder="Type password again"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              className="px-5 py-2 border-black rounded-2xl"
            ></input>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="firstName"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="px-5 py-2 border-black rounded-2xl"
            ></input>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              type="lastName"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="px-5 py-2 border-black rounded-2xl"
            ></input>
          </div>
          <button>Submit</button>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;

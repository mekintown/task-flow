"use client";
import { useState } from "react";
import chula from "../assets/chulalongkornHospital.jpeg";

const SignUpForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");

  const [passwordError, setPasswordError] = useState("");

  const validatePasswords = () => {
    if (password !== password2) {
      setPasswordError("Passwords do not match!");
      return false;
    }
    setPasswordError(""); // Clear error message if passwords match
    return true;
  };

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
  };
  return (
    <div className="w-screen h-screen">
      <div className="grid grid-cols-3 h-full items-center dark:bg-[#1a1a2e]">
        <div className=" flex px-5 h-full bg-white col-span-3 lg:col-span-2 dark:bg-[#1a1a2e] ">
          <div className="flex flex-col gap-5 w-full max-w-lg m-auto self-stretch">
            <div>
              <h2 className="text-2xl font-bold leading-9  text-gray-900 dark:text-white">
                New Here? Sign up now!
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Already has an account?{" "}
                <a
                  href="/auth/signin"
                  className="font-semibold leading-6 text-sky-600 hover:text-sky-500"
                >
                  Login
                </a>
              </p>
            </div>
            <form onSubmit={onSubmit} className="grid grid-cols-2 gap-5">
              <div className="flex flex-col gap-2 col-span-2 dark:text-white">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  placeholder="mekintown"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="px-5 py-2 border-gray-300 border-[1px] rounded-2xl"
                ></input>
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <label htmlFor="password" className="dark:text-white">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`px-5 py-2 border-${
                    passwordError ? "red-500" : "gray-300"
                  } border-[1px] rounded-2xl`}
                ></input>
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <label htmlFor="password2" className="dark:text-white">
                  Confirm your password
                </label>
                <input
                  id="password2"
                  type="password"
                  placeholder="Type password again"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  className={`px-5 py-2 border-${
                    passwordError ? "red-500" : "gray-300"
                  } border-[1px] rounded-2xl`}
                ></input>
                {passwordError && (
                  <p className="text-red-500">{passwordError}</p>
                )}
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <label htmlFor="firstName" className="dark:text-white">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-5 py-2 border-gray-300 border-[1px] rounded-2xl"
                ></input>
              </div>

              <button
                type="submit"
                className="rounded-2xl bg-sky-500 py-2 mt-2 text-white"
              >
                Sign up
              </button>
            </form>
          </div>
        </div>
        <div className="relative h-full w-full invisible lg:visible">
          <img
            className="object-cover w-full h-full"
            src={chula}
            alt="camping"
          ></img>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;

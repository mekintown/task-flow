"use client";
import { useState } from "react";
import taskAndBoardImage from "../assets/taskAndBoard.png";
import authService from "../services/auth";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [name, setName] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

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
    if (!validatePasswords()) {
      return;
    }

    authService.register({ username, password, name });
    navigate("/login");
  };

  return (
    <div className="w-screen h-screen">
      <div className="grid grid-cols-3 h-full items-center dark:bg-gray-900">
        <div className=" flex px-5 h-full bg-white col-span-3 lg:col-span-2 dark:bg-gray-900 ">
          <div className="flex flex-col gap-5 w-full max-w-lg m-auto self-stretch">
            <div>
              <h2 className="text-2xl font-bold leading-9  text-gray-900 dark:text-white">
                New Here? Register now!
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Already has an account?{" "}
                <a href="/login" className="bold-text">
                  Login
                </a>
              </p>
            </div>
            <form onSubmit={onSubmit} className="grid grid-cols-2 gap-5">
              <div className="flex flex-col gap-2 col-span-2 dark:text-white">
                <label htmlFor="username" className="input-label">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="mekintown"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="login-input border-gray-300"
                ></input>
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <label htmlFor="password" className="input-label">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`login-input border-${
                    passwordError ? "red-500" : "gray-300"
                  }`}
                ></input>
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <label htmlFor="password2" className="input-label">
                  Confirm your password
                </label>
                <input
                  id="password2"
                  type="password"
                  placeholder="Type password again"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  className={`login-input border-${
                    passwordError ? "red-500" : "gray-300"
                  }`}
                ></input>
                {passwordError && (
                  <p className="text-red-500">{passwordError}</p>
                )}
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <label htmlFor="firstName" className="input-label">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="login-input"
                ></input>
              </div>

              <button
                type="submit"
                className="btn-primary col-span-1 mt-2 dark:text-white"
              >
                Sign up
              </button>
            </form>
          </div>
        </div>
        <div className="relative h-full w-full invisible lg:visible">
          <img
            className="object-cover w-full h-full"
            src={taskAndBoardImage}
            alt="camping"
          ></img>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;

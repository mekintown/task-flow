"use client";
import { BsCloudHaze2Fill } from "react-icons/bs";
import { useState } from "react";
import authService from "../services/auth";
import { User } from "../types";
import axios from "axios";

interface Props {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const LogInForm = ({ setUser }: Props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    try {
      const user = await authService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));

      setUser(user);
      setUsername("");
      setPassword("");
    } catch (e) {
      if (axios.isAxiosError(e)) {
        console.log(e.response?.data);
      }
    }
  };

  return (
    <div className="h-screen">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 dark:bg-gray-900">
        <div className="flex flex-col justify-center items-center gap-10">
          <BsCloudHaze2Fill className="mx-auto h-10 w-auto text-sky-400" />
          <h2 className="text-center text-2xl font-bold leading-9  text-gray-900 dark:text-white">
            Log in to your account
          </h2>
        </div>

        <div className="flex flex-col gap-10 mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="username" className="input-label">
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="login-input"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="input-label">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="login-input"
                />
              </div>
            </div>

            <div>
              <button type="submit" className="btn-primary">
                Log in
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-500">
            Not a member?{" "}
            <a href="/register" className="bold-text">
              Register now{" "}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogInForm;

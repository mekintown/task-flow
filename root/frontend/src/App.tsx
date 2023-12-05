import LogInForm from "./components/LogInForm";
import { Routes, Route } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
import { useEffect, useState } from "react";
import authService from "./services/auth";
import { User } from "./types";
import HomePage from "./components/HomePage";
import DefaultLayout from "./components/DefaultLayout";

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(
      "loggedTaskManagementUser"
    );
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
  }, []);

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem("loggedTaskManagementUser");
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <DefaultLayout>
            <HomePage />
          </DefaultLayout>
        }
      />
      <Route path="/login" element={<LogInForm setUser={setUser} />} />
      <Route path="/register" element={<RegisterForm />} />
    </Routes>
  );
}

export default App;

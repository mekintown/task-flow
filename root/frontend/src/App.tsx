import LogInForm from "./components/LogInForm";
import { Routes, Route } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
import HomePage from "./components/HomePage";
import DefaultLayout from "./components/DefaultLayout";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route
          path="/"
          element={
            <DefaultLayout>
              <HomePage />
            </DefaultLayout>
          }
        />
        <Route path="/login" element={<LogInForm />} />
        <Route path="/register" element={<RegisterForm />} />
      </Routes>
    </UserProvider>
  );
}

export default App;

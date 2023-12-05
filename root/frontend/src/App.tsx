import LogInForm from "./components/LogInForm";
import { Routes, Route } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
import HomePage from "./components/HomePage";
import DefaultLayout from "./components/DefaultLayout";
import { UserProvider } from "./context/UserContext";
import TaskPage from "./components/TaskPage";

function App() {
  return (
    <UserProvider>
      <DefaultLayout>
        <Routes>
          <Route path="/" element={<></>} />
          <Route path="/boards/:boardId" element={<TaskPage />}></Route>
          <Route path="/login" element={<LogInForm />} />
          <Route path="/register" element={<RegisterForm />} />
          {/* other routes */}
        </Routes>
      </DefaultLayout>
    </UserProvider>
  );
}

export default App;

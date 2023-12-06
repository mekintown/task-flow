import LogInForm from "./components/LogInForm";
import { Routes, Route } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
import HomePage from "./components/HomePage";
import DefaultLayout from "./components/DefaultLayout";
import TaskPage from "./components/TaskPage";
import ProtectedRoute from "./components/ProtectedRoute";
import DashBoardPage from "./components/BoardsPage";

function App() {
  return (
    <DefaultLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LogInForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/boards" element={<DashBoardPage />} />
          <Route path="/boards/:boardId" element={<TaskPage />}></Route>
        </Route>
      </Routes>
    </DefaultLayout>
  );
}

export default App;

import LogInForm from "./components/LogInForm";
import { Routes, Route } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
import HomePage from "./components/HomePage";
import DefaultLayout from "./components/DefaultLayout";
import TaskPage from "./components/TaskPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <DefaultLayout>
      <Routes>
        <Route path="/login" element={<LogInForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<></>} />
          <Route path="/boards/:boardId" element={<TaskPage />}></Route>
        </Route>
      </Routes>
    </DefaultLayout>
  );
}

export default App;

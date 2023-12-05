import Home from "./components/HomePage";
import LogInForm from "./components/LogInForm";
import { Routes, Route } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LogInForm />} />
      <Route path="/register" element={<RegisterForm />} />
    </Routes>
  );
}

export default App;

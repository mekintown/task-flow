import Home from "./components/HomePage";
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth/signup" element={<SignUpForm />} />
      <Route path="/auth/login" element={<LoginForm />}></Route>
    </Routes>
  );
}

export default App;

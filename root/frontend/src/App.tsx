import Home from "./components/HomePage";
import SignInForm from "./components/SignInForm";
import SignUpForm from "./components/SignUpForm";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth/signup" element={<SignUpForm />} />
      <Route path="/auth/signin" element={<SignInForm />} />
    </Routes>
  );
}

export default App;

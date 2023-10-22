import BoardCard from "./components/BoardCard";
import BoardList from "./components/BoardList";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Sidebar from "./components/Sidebar/Sidebar";
import TopMenu from "./components/TopMenu";

function App() {
  return (
    <div className="flex items-stretch h-screen">
      <Sidebar />
      <div className="flex-grow">
        <TopMenu />
        <BoardList />
      </div>
    </div>
    // <RegisterForm />
  );
}

export default App;

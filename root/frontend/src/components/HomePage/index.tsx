import BoardList from "../BoardList";
import Sidebar from "../Sidebar/Sidebar";

const Home = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div>
        <BoardList />
      </div>
    </div>
  );
};

export default Home;

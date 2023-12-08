import { Link } from "react-router-dom";
import { BsCloudHaze2Fill } from "react-icons/bs"; // Ensure to install react-icons if not already
import CreateBoardPicture from "../assets/create-board.png";
import OrganizeTaskPicture from "../assets/organize-task.png";
import ResponsiveDesignPicture from "../assets/responsive-design.png";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-[70vh] flex flex-col justify-center isolate mx-auto px-6 py-16 text-center overflow-hidden">
        <BsCloudHaze2Fill className="text-6xl text-sky-400 mx-auto animate-bounce" />
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to Task Flow
        </h1>
        <p className="text-lg text-gray-800 dark:text-gray-50 mb-8">
          Organize your tasks and boards efficiently
        </p>
        <div className="flex justify-center gap-4 mb-16">
          <Link
            to="/login"
            className="bg-sky-400 text-white hover:bg-sky-500 font-semibold py-2 px-4 border border-sky-500 hover:border-transparent rounded"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="bg-transparent hover:bg-sky-500 text-gray-800 dark:text-white hover:text-white font-semibold py-2 px-4 border border-sky-500 hover:border-transparent rounded"
          >
            Register
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white dark:bg-gray-900 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
            Features
          </h2>

          {/* Feature 1 */}
          <div className="flex flex-wrap mb-8">
            <div className="w-full sm:w-1/2 p-4">
              <img
                src={CreateBoardPicture}
                alt="Create Board Feature"
                className="rounded shadow-lg"
              />
            </div>
            <div className="w-full sm:w-1/2 p-4 flex flex-col mt-4">
              <h3 className="text-2xl font-bold mb-3 dark:text-white">
                Create Your Board
              </h3>
              <p className="dark:text-gray-50">
                Invite people to join and collaborate on tasks effectively.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-wrap mb-8">
            <div className="w-full sm:w-1/2 p-4 flex flex-col justify-center order-last sm:order-first">
              <h3 className="text-2xl font-bold mb-3 dark:text-white">
                Organize Tasks
              </h3>
              <p className="dark:text-gray-90">
                Work together with friends to manage tasks within boards.
              </p>
            </div>
            <div className="w-full sm:w-1/2 p-4">
              <img
                src={OrganizeTaskPicture}
                alt="Organize Task Feature"
                className="rounded shadow-lg"
              />
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-wrap">
            <div className="w-full sm:w-1/2 p-4">
              <img
                src={ResponsiveDesignPicture}
                alt="Responsive Design"
                className="rounded max-h-96"
              />
            </div>
            <div className="w-full sm:w-1/2 p-4 flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-3 dark:text-white">
                Responsive & Dark Mode
              </h3>
              <p className="dark:text-gray-50">
                Enjoy a responsive design that supports all devices and dark
                mode for comfortable viewing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

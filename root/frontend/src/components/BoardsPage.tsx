import waitingPicture from "../assets/waiting-picture.svg";

const BoardsPage = () => {
  return (
    <div className="flex flex-col gap-4 h-screen items-center justify-center">
      <img src={waitingPicture} className="p-4 max-w-[20rem]"></img>
      <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-xl dark:text-white">
        Access some board at right hand side{" "}
      </h1>
    </div>
  );
};

export default BoardsPage;

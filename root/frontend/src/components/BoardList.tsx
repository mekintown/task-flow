import BoardCard from "./BoardCard";

function BoardList() {
  const mockBoardData = [
    { boardId: "1", ImgSrc: "", boardName: "Chula", collaborators: "" },
    { boardId: "1", ImgSrc: "", boardName: "Chula", collaborators: "" },
  ];
  return (
    <div className="grid grid-cols-4 gap-4 mt-4 p-4">
      <BoardCard />
      <BoardCard />
      <BoardCard />
      <BoardCard />
      <BoardCard />
      <BoardCard />
      <BoardCard />
      <BoardCard />
    </div>
  );
}

export default BoardList;

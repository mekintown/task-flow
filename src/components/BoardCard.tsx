import chula from "../assets/chulalongkornHospital.jpeg";

function BoardCard() {
  return (
    <div className="shadow-lg bg-neutral-50 flex flex-col gap-5 p-5 items-center">
      <img src={chula}></img>
      <h3>Chula</h3>
      <h3 className="self-start">Collaborator</h3>
    </div>
  );
}

export default BoardCard;

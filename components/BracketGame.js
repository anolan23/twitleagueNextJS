import bracket from "../sass/components/Bracket.module.scss";
function BracketGame() {
  return (
    <div className={bracket["bracket__round__game"]}>
      <div
        className={`${bracket["bracket__round__game__slot"]} ${bracket["bracket__round__game__slot--top"]}`}
      >
        <div className={bracket["bracket__round__game__slot__seed"]}>1</div>
        <div className={bracket["bracket__round__game__slot__team"]}>
          White Sox
        </div>
        <div className={bracket["bracket__round__game__slot__score"]}>10</div>
      </div>
      <div
        className={`${bracket["bracket__round__game__slot"]} ${bracket["bracket__round__game__slot--bottom"]}`}
      >
        <div className={bracket["bracket__round__game__slot__seed"]}>2</div>
        <div className={bracket["bracket__round__game__slot__team"]}>Cubs</div>
        <div className={bracket["bracket__round__game__slot__score"]}>3</div>
      </div>
    </div>
  );
}
export default BracketGame;

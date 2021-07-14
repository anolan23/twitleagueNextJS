import usePan from "../lib/usePan";

function UsePanExample() {
  const [offset, startPan] = usePan();

  return (
    <div
      onMouseDown={startPan}
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "grey",
        fontSize: "1.5rem",
        color: "white",
        fontWeight: 700,
      }}
    >
      <span>{JSON.stringify(offset)}</span>
    </div>
  );
}

export default UsePanExample;

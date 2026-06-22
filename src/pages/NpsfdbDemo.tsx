import { useEffect } from "react";

const NpsfdbDemo = () => {
  useEffect(() => {
    document.title = "NPS FDB Demo | epiSolve";
  }, []);

  return (
    <iframe
      src="https://episolve-nps-showcase.lovable.app"
      title="NPS FDB Demo"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        border: "none",
        margin: 0,
        padding: 0,
        zIndex: 9999,
        background: "#fff",
      }}
    />
  );
};

export default NpsfdbDemo;
import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Chart from "./components/Chart";

function App() {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand>QuixDash</Navbar.Brand>
      </Navbar>
      <div style={{ width: "100%" }}>
        <Chart title="Some Sensor" />
      </div>
    </>
  );
}

export default App;

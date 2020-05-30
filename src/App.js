import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Chart from "./components/Chart";

function App() {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand>QuixDash</Navbar.Brand>
      </Navbar>
      <div
        style={{ position: "absolute", top: 56, right: 0, bottom: 0, left: 0 }}
      >
        <Chart title="Some Sensor" />
      </div>
    </>
  );
}

export default App;

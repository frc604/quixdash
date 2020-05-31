import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Dygraph from "dygraphs";

class LiveChart extends Component {
  lastVal = 0; // Used for faking data
  data = [];
  dataBuffer = [];

  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      isPaused: false,
    };
  }

  componentDidMount() {
    this.createChart();

    // Setup fake data
    this.startTime = new Date().getTime();
    this.interval = setInterval(this.addFakeData, 10);
    this.intervalUpdate = setInterval(this.updateGraph, 50);
  }

  componentWillUnmount() {
    this.chart.destroy();
    window.clearInterval(this.interval);
    window.clearInterval(this.intervalUpdate);
  }

  createChart = () => {
    const { title } = this.props;
    this.chart = new Dygraph(this.ref.current, this.data, {
      title: title,
      showRoller: false,
      showRangeSelector: true,
      labels: ["Time", "Value"]
    });
  };

  updateGraph = () => {
    if (!this.state.isPaused) {
      this.chart.updateOptions({file: this.data});
    }
  };


  addFakeData = () => {
    const benchStart = new Date().getTime();
    const elapsedTime = new Date().getTime() - this.startTime;
    const elapsedTimeMs = elapsedTime / 1000;
    this.lastVal += Math.random() * 2 - 1;

    var dataChild = [elapsedTimeMs, this.lastVal];

    if (!this.state.isPaused) {
      this.data.push(...this.dataBuffer);
      this.dataBuffer = [];
      this.data.push(dataChild);
    } else {
      this.dataBuffer.push(dataChild);
    }

    //console.log(new Date().getTime() - benchStart);
    if(new Date().getTime() - benchStart > 10){
      console.error("Failed: " + this.data.length + " Time: " + (new Date().getTime() - benchStart));
    }
  };

  clear = () => {
    this.data = [];
    this.dataBuffer = [];
    this.startTime = new Date().getTime();
    this.lastVal = 0;
    this.chart.updateOptions({ file: this.data });
    this.setState({ isPaused: false });
  };

  pause = () => {
    this.setState({ isPaused: !this.state.isPaused });
  };

  update = () => {
    this.data.push(...this.dataBuffer);
    this.dataBuffer = [];
    this.chart.updateOptions({ file: this.data });
  };

  stepForward = () => {
    if (this.dataBuffer.length !== 1) {
      this.data.push(this.dataBuffer[0]);
      this.dataBuffer.shift();
      this.chart.updateOptions({ file: this.data });
    }
  };

  stepBackwards = () => {
    this.data.pop();
    this.chart.updateOptions({ file: this.data });
  };

  render() {
    return (
        <>
          <div className="jumbotron mx-auto pr-5" style={{ width: "90%" }}>
            <div ref={this.ref} style={{ width: "100%" }} />
          </div>
          <Button onClick={this.clear}>Clear</Button>
          <Button onClick={this.pause}>Pause</Button>
          <Button onClick={this.update}>Update</Button>
          <Button onClick={this.stepBackwards} disabled={!this.state.isPaused}>
            ←
          </Button>
          <Button onClick={this.stepForward} disabled={!this.state.isPaused}>
            →
          </Button>
        </>
    );
  }
}

export default LiveChart;

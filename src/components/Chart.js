import React, { Component } from "react";
import Chart from 'chart.js'
import Button from "react-bootstrap/Button";

class LiveChart extends Component {
  lastVal = 0; // Used for faking data
  dataBuffer = [];

  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      isPaused: false
    };
  }

  componentDidMount() {
    this.createChart();

    // Setup fake data
    this.startTime = new Date().getTime();
    this.interval = setInterval(this.addFakeData, 20);
  }

  componentWillUnmount() {
    this.chart.destroy();
    window.clearInterval(this.interval);
  }

  createChart = () => {
    const chartRef = this.ref.current.getContext("2d");

    this.chart = new Chart(chartRef, {
      type: 'scatter',
      data: {
        labels: [1],
        datasets: [{
          label: 'Data??',
          showLine: true,
          pointRadius: 0,
          fill: false,
          borderWidth: 6,
          borderColor: "#FBB604",
          data: this.data
        }]
      },
      options: {
        title: {
          display: true,
          text: 'World population per region (in millions)'
        },
        animation: {
          duration: 0.01
        },
      }
    });
  };

  addFakeData = () => {
    const elapsedTime = new Date().getTime() - this.startTime;
    const elapsedTimeMs = elapsedTime / 1000;
    this.lastVal += Math.random() * 2 - 1;

    let dataChild = {
      x: elapsedTimeMs,
      y: this.lastVal
    };

    if(!this.state.isPaused) {
      this.chart.data.datasets[0].data.push(...this.dataBuffer);
      this.dataBuffer = []
      this.chart.data.datasets[0].data.push(dataChild);
      this.chart.update();
    } else {
      this.dataBuffer.push(dataChild);
      this.chart.update();
    }
  };

  clear = () => {
    this.chart.data.datasets[0].data = [];
    this.dataBuffer = [];
    this.startTime = new Date().getTime();
    this.lastVal = 0;
    this.chart.update();
    this.setState({isPaused: false});
  }

  pause = () => {
    this.setState({isPaused: !this.state.isPaused});
  }

  update = () => {
    this.chart.data.datasets[0].data.push(...this.dataBuffer);
    this.dataBuffer = [];
  }

  stepForward = () => {
    this.chart.data.datasets[0].data.push(this.dataBuffer[0]);
    this.dataBuffer.shift();
  }

  stepBackwards = () => {
    this.chart.data.datasets[0].data.pop();
  }

  render() {
    return (
      <>
        <canvas ref={this.ref} style={{ height: "100%" }} />
        <Button onClick={this.clear}>Clear</Button>
        <Button onClick={this.pause}>Pause</Button>
        <Button onClick={this.update}>Update</Button>
        <Button onClick={this.stepBackwards} disabled={!this.state.isPaused}> ← </Button>
        <Button onClick={this.stepForward} disabled={!this.state.isPaused}> → </Button>
      </>
    );
  }
}

export default LiveChart;

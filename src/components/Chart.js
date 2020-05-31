import React, { Component } from "react";
import Chart from 'chart.js'

class LiveChart extends Component {
  lastVal = 0; // Used for faking data

  constructor(props) {
    super(props);
    this.ref = React.createRef();
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

    this.chart.data.datasets[0].data.push(dataChild);

    this.chart.update();
  };

  render() {
    return <canvas ref={this.ref} style={{ height: "100%" }} />;
  }
}

export default LiveChart;

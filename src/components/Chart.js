import React, { Component } from "react";
import { lightningChart } from "@arction/lcjs";

class Chart extends Component {
  chartId = Math.trunc(Math.random() * 100000); // Unique ID to target div
  lastVal = 0; // Used for faking data

  componentDidMount() {
    this.createChart();

    // Setup fake data
    this.startTime = new Date().getTime();
    this.interval = setInterval(this.addFakeData, 20);
  }

  componentWillUnmount() {
    this.chart.dispose();
    window.clearInterval(this.interval);
  }

  createChart = () => {
    const { title } = this.props;
    this.chart = lightningChart().ChartXY({ containerId: this.chartId });
    this.chart.setTitle(title);
    this.lineSeries = this.chart.addLineSeries();
    this.lineSeries.setStrokeStyle(style => style.setThickness(3));
  };

  addFakeData = () => {
    const elapsedTime = new Date().getTime() - this.startTime;
    const elapsedTimeMs = elapsedTime / 1000;
    this.lastVal += Math.random() * 2 - 1;
    this.lineSeries.add([{ x: elapsedTimeMs, y: this.lastVal }]);
  };

  render() {
    return <div id={this.chartId} style={{ height: "100%" }} />;
  }
}

export default Chart;

import React, { Component } from "react";
import Dygraph from "dygraphs";

class Chart extends Component {
  data = [];
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
    const { title } = this.props;
    this.chart = new Dygraph(this.ref.current, this.data, {
      title: title,
      showRoller: true,
      labels: ["Time", "Value"]
    });
  };

  addFakeData = () => {
    const elapsedTime = new Date().getTime() - this.startTime;
    const elapsedTimeMs = elapsedTime / 1000;
    this.lastVal += Math.random() * 2 - 1;
    this.data.push([elapsedTimeMs, this.lastVal]);
    this.chart.updateOptions({ file: this.data });
  };

  render() {
    return <div ref={this.ref} style={{ height: "100%" }} />;
  }
}

export default Chart;

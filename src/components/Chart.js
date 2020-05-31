import "chartjs-plugin-zoom";
import React, { Component } from "react";
import Chart from "chart.js";
import Button from "react-bootstrap/Button";

class LiveChart extends Component {
  lastVal = 0; // Used for faking data
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
    this.interval = setInterval(this.addFakeData, 20);
  }

  componentWillUnmount() {
    this.chart.destroy();
    window.clearInterval(this.interval);
  }

  createChart = () => {
    const chartRef = this.ref.current.getContext("2d");

    this.chart = new Chart(chartRef, {
      type: "scatter",
      data: {
        labels: [1],
        datasets: [
          {
            label: "Data??",
            showLine: true,
            pointRadius: 0.5,
            fill: false,
            borderWidth: 1,
            borderColor: "#FBB604",
            backgroundColor: "#FBB604",
            datalabels: {
              align: "start",
              anchor: "start",
            },
            data: this.data,
          },
        ],
      },
      options: {
        live: true,
        title: {
          display: true,
          text: "#AllGraphEverything",
        },
        tooltips: {
          mode: "nearest",
          intersect: false,
          yAlign: "bottom",
        },
        animation: {
          duration: 0.01,
        },
        pan: {
          enabled: true,
          mode: "x",
        },
        zoom: {
          enabled: true,
          mode: "x",
        },
      },
    });

    var originalLineDraw = Chart.controllers.line.prototype.draw;
    Chart.helpers.extend(Chart.controllers.line.prototype, {
      draw: function () {
        originalLineDraw.apply(this, arguments);

        if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
          var activePoint = this.chart.tooltip._active[0];
          var ctx = this.chart.ctx;

          var x = activePoint.tooltipPosition().x;
          var y = activePoint.tooltipPosition().y;

          var topY = this.chart.scales["y-axis-1"].top;
          var bottomY = this.chart.scales["y-axis-1"].bottom;

          var leftX = this.chart.scales["x-axis-1"].left;
          var rightX = this.chart.scales["x-axis-1"].right;

          // draw line
          ctx.save();

          ctx.beginPath();
          ctx.moveTo(x, topY);
          ctx.lineTo(x, bottomY);
          ctx.lineWidth = 0.75;
          ctx.strokeStyle = "#0490fb";
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(leftX, y);
          ctx.lineTo(rightX, y);
          ctx.lineWidth = 0.75;
          ctx.strokeStyle = "#0490fb";
          ctx.stroke();

          ctx.restore();
        }
      },
    });
  };

  addFakeData = () => {
    const elapsedTime = new Date().getTime() - this.startTime;
    const elapsedTimeMs = elapsedTime / 1000;
    this.lastVal += Math.random() * 2 - 1;

    let dataChild = {
      x: elapsedTimeMs,
      y: this.lastVal,
    };

    if (!this.state.isPaused) {
      this.chart.data.datasets[0].data.push(...this.dataBuffer);
      this.dataBuffer = [];
      this.chart.data.datasets[0].data.push(dataChild);
      this.chart.update();
    } else {
      this.dataBuffer.push(dataChild);
    }
  };

  clear = () => {
    this.chart.data.datasets[0].data = [];
    this.dataBuffer = [];
    this.startTime = new Date().getTime();
    this.lastVal = 0;
    this.chart.update();
    this.setState({ isPaused: false });
  };

  pause = () => {
    this.setState({ isPaused: !this.state.isPaused });
  };

  update = () => {
    this.chart.data.datasets[0].data.push(...this.dataBuffer);
    this.dataBuffer = [];
    this.chart.update();
  };

  stepForward = () => {
    if (this.dataBuffer.length !== 1) {
      this.chart.data.datasets[0].data.push(this.dataBuffer[0]);
      this.dataBuffer.shift();
      this.chart.update();
    }
  };

  stepBackwards = () => {
    this.chart.data.datasets[0].data.pop();
    this.chart.update();
  };

  render() {
    return (
      <>
        <canvas ref={this.ref} style={{ height: "100%" }} />
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

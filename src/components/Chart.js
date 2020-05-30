import React, { Component } from "react";
import ApexCharts, { XAXISRANGE } from 'apexcharts'

class LiveChart extends Component {
  lastVal = 0; // Used for faking data
  data = [];

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

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

    var options = {
      chart: {
        id: 'realtime',
        height: 350,
        type: 'line',
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: {
            speed: 1
          }
        }
      },
      series: [],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      title: {
        text: 'Dynamic Updating Chart',
        align: 'center'
      },
      markers: {
        size: 0
      },
      xaxis: {
        type: 'numeric',
        tickPlacement: 'between',
        floating: false,
      },
      legend: {
        show: false
      },
      noData: {
        text: 'Loading...'
      }
    };

    this.chart = new ApexCharts(this.ref.current, options);

    this.chart.render();
  };

  addFakeData = () => {
    const elapsedTime = new Date().getTime() - this.startTime;
    const elapsedTimeMs = elapsedTime / 1000;
    this.lastVal += Math.random() * 2 - 1;

    var dataChild = {
      x: elapsedTimeMs,
      y: this.lastVal
    };

    this.data.push(dataChild);

    this.chart.updateSeries([{
        name: 'Value',
        data: this.data
    }]);
  };

  render() {
    return <div ref={this.ref} style={{ height: "100%" }} />;
  }
}

export default LiveChart;

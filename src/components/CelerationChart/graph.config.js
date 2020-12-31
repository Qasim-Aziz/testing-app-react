// defines the shared configuration
const graphConfig = {
  dataset: {
    fill: false,
    backgroundColor: '#000',
    pointBorderColor: '#000',
    pointBackgroundColor: '#000',
    pointBorderWidth: 1,
    pointHoverRadius: 4,
    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
    pointHoverBorderColor: 'rgba(220,220,220,1)',
    pointHoverBorderWidth: 2,
    pointRadius: 4,
    pointHitRadius: 10,
    lineTension: 0,
  },
  afterBuildTicks(chartObj) {
    chartObj.ticks = []
    chartObj.ticks.push(0.001)
    chartObj.ticks.push(0.005)
    chartObj.ticks.push(0.01)
    chartObj.ticks.push(0.05)
    chartObj.ticks.push(0.1)
    chartObj.ticks.push(0.5)
    chartObj.ticks.push(1)
    chartObj.ticks.push(5)
    chartObj.ticks.push(10)
    chartObj.ticks.push(50)
    chartObj.ticks.push(100)
    chartObj.ticks.push(500)
    chartObj.ticks.push(1000)
  },
}

export default graphConfig

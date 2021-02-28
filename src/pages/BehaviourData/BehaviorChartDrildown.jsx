import React from 'react'
import { Line } from 'react-chartjs-2'
import 'chartjs-plugin-annotation'

const BehaviorChartDrildown = ({ decelData }) => {
  const getChartOptions = () => ({
    tooltips: {
      mode: 'label',
    },
    scales: {
      xAxes: [
        {
          id: 'x-axis-0',
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Time (in seconds)',
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            precision: 0,
          },
          display: true,
          id: 'y-axis-1',
          gridLines: {
            display: true,
          },
          labels: {
            show: true,
          },
          scaleLabel: {
            display: true,
            labelString: 'Frequency',
          },
        },
      ],
    },
  })

  const getChartData = () => {
    const frequencies = decelData.frequency.edges.map(({ node }) => node.count)
    const time = decelData.frequency.edges.map(({ node }) => (node.time / 1000).toFixed(2))

    return {
      labels: time,
      datasets: [
        {
          label: 'Frequency',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointSize: 15,
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(75,192,192,1)',
          pointHoverBorderWidth: 5,
          pointRadius: 4,
          pointHitRadius: 0,
          data: frequencies,
        },
      ],
    }
  }

  return <Line options={getChartOptions()} data={getChartData()} />
}

export default BehaviorChartDrildown

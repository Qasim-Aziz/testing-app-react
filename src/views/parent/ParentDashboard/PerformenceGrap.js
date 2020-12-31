import React from 'react'
import ChartistGraph from 'react-chartist'
import './performenceGap.scss'

const biPolarBarChartData = {
  labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'],
  series: [[1, 2, 4, 8, 6, -2, -1, -4, -6, -2]],
}

const biPolarBarChartOptions = {
  height: 260,
  high: 10,
  low: -10,
  axisX: {
    labelInterpolationFnc(value, index) {
      return index % 2 === 0 ? value : null
    },
  },
}

const PerformenceGrap = () => {
  return (
    <div className="root">
      <ChartistGraph data={biPolarBarChartData} options={biPolarBarChartOptions} type="Line" />
    </div>
  )
}

export default PerformenceGrap

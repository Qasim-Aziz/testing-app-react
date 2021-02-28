import React, { useState, useEffect } from 'react'
import { Bar } from 'react-chartjs-2'
import 'chartjs-plugin-annotation'
import { useQuery } from 'react-apollo'
import groupObj from '@hunters/group-object'
import _ from 'lodash'
import LoadingComponent from 'pages/staffProfile/LoadingComponent'
import { GET_BEHAVIOR_CHART_DATA } from './query'

const BehaviorChart = ({ templateId, studentId }) => {
  const [durationArray, setDurationArray] = useState([])
  const [dateLabelsArray, setDateLabelsArray] = useState([])
  const [frequancyCountsArray, setFrequancyCountsArray] = useState([])

  const { data: decelData, error: decelError } = useQuery(GET_BEHAVIOR_CHART_DATA, {
    variables: {
      studentId,
      templateId,
    },
  })

  useEffect(() => {
    if (decelData && decelData.getDecelData.edges && decelData.getDecelData.edges.length > 0) {
      const durationCollection = []
      const dateLabelsCollection = []
      const frequancyCountsCollection = []

      const nodes = decelData.getDecelData.edges.map(({ node }) => node)
      const groupedDataByDate = groupObj.group(_.orderBy(nodes, 'date'), 'date')
      const dates = Object.keys(groupedDataByDate)

      // create sum for all frequancies
      for (let i = 0; i < dates.length; i += 1) {
        let frequencyCounts = 0
        let duration = 0
        groupedDataByDate[dates[i]].forEach(item => {
          if (item.frequency.edges.length > 0 || item.duration) {
            frequencyCounts += item.frequency.edges.length

            if (item.duration) {
              duration += Number.isNaN(Math.round(item.duration / 1000))
                ? 0
                : Math.round(item.duration / 1000)
            } else {
              duration += 0
            }
          }
        })
        dateLabelsCollection.push(dates[i])
        frequancyCountsCollection.push(frequencyCounts)
        durationCollection.push(duration)
      }

      // Save in state
      setDurationArray(durationCollection)
      setDateLabelsArray(dateLabelsCollection)
      setFrequancyCountsArray(frequancyCountsCollection)
    }
  }, [decelData])

  const getChartOptions = () => ({
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      mode: 'label',
    },
    annotation: {
      annotations: [
        {
          drawTime: 'afterDatasetsDraw',
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 1,
          borderWidth: 5,
          borderColor: 'red',
          label: {
            content: 'Status Change',
            enabled: true,
            position: 'top',
          },
        },
      ],
    },
    elements: {
      line: {
        fill: false,
      },
    },
    scales: {
      xAxes: [
        {
          id: 'x-axis-0',
          display: true,
          labels: dateLabelsArray,
          gridLines: {
            display: false,
          },
        },
      ],
      yAxes: [
        {
          type: 'linear',
          display: true,
          position: 'left',
          id: 'y-axis-2',
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
        {
          type: 'linear',
          display: true,
          position: 'right',
          id: 'y-axis-1',
          gridLines: {
            display: false,
          },
          labels: {
            show: true,
          },
          scaleLabel: {
            display: true,
            labelString: 'Duration (in seconds)',
          },
        },
      ],
    },
  })

  const getChartData = () => ({
    datasets: [
      {
        label: 'Frequency ',
        type: 'line',
        fill: false,
        borderColor: '#EC932F',
        backgroundColor: '#EC932F',
        pointBorderColor: '#EC932F',
        pointBackgroundColor: '#EC932F',
        pointHoverBackgroundColor: '#EC932F',
        pointHoverBorderColor: '#EC932F',
        lineTension: 0,
        yAxisID: 'y-axis-2',
        data: frequancyCountsArray,
      },
      {
        type: 'bar',
        label: 'Duration ',
        fill: false,
        backgroundColor: '#a6cee3',
        borderColor: '#a6cee3',
        hoverBackgroundColor: '#a6cee3',
        hoverBorderColor: '#a6cee3',
        yAxisID: 'y-axis-1',
        data: durationArray,
      },
    ],
  })

  if (decelError) return <h3>An error occurred to load chart data.</h3>
  if (decelData) return <Bar options={getChartOptions()} data={getChartData()} height={360} />

  return <LoadingComponent />
}

export default BehaviorChart

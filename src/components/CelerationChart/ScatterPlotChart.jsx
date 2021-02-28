import React from 'react'
import moment from 'moment'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'

const ScatterPlotChart = ({ chart, totalDays, categoryName }) => {
  const getDayFromDate = date => moment(chart.startDate).diff(date, 'days')

  const scatterDataForSessionType = () => {
    const correctPointData = []
    const errorPointData = []
    const promptPointData = []

    chart.points.forEach(row => {
      if (row.correct) {
        let existingCorrectRecord = correctPointData.find(x => x.date === row.date)
        if (!existingCorrectRecord) {
          existingCorrectRecord = { x: getDayFromDate(row.date), y: 0, date: row.date }
          correctPointData.push(existingCorrectRecord)
        }
        existingCorrectRecord.y += row.correct + row.peakCorrect
      }
      if (row.error) {
        let existingErrorRecord = errorPointData.find(x => x.date === row.date)
        if (!existingErrorRecord) {
          existingErrorRecord = { x: getDayFromDate(row.date), y: 0, date: row.date }
          errorPointData.push(existingErrorRecord)
        }
        existingErrorRecord.y += row.error + row.peakError
      }
      if (row.prompt) {
        let existingPromptRecord = promptPointData.find(x => x.date === row.date)
        if (!existingPromptRecord) {
          existingPromptRecord = { x: getDayFromDate(row.date), y: 0, date: row.date }
          promptPointData.push(existingPromptRecord)
        }
        existingPromptRecord.y += row.prompt + row.peakPrompt
      }
    })

    return {
      correctPointData,
      errorPointData,
      promptPointData,
    }
  }

  const scatterDataForBehaviorType = () => {
    // TODO: Update this method, as of now we dont have proper data
    // so even line chart is giving wrong result
    const correctPointData = []
    const errorPointData = []
    const promptPointData = []

    chart.points.forEach(row => {
      if (row.correct) {
        let existingCorrectRecord = correctPointData.find(x => x.date === row.date)
        if (!existingCorrectRecord) {
          existingCorrectRecord = { x: getDayFromDate(row.date), y: 0, date: row.date }
          correctPointData.push(existingCorrectRecord)
        }
        existingCorrectRecord.y += row.correct
      }
      if (row.error) {
        let existingErrorRecord = errorPointData.find(x => x.date === row.date)
        if (!existingErrorRecord) {
          existingErrorRecord = { x: getDayFromDate(row.date), y: 0, date: row.date }
          errorPointData.push(existingErrorRecord)
        }
        existingErrorRecord.y += row.error
      }
      if (row.prompt) {
        let existingPromptRecord = promptPointData.find(x => x.date === row.date)
        if (!existingPromptRecord) {
          existingPromptRecord = { x: getDayFromDate(row.date), y: 0, date: row.date }
          promptPointData.push(existingPromptRecord)
        }
        existingPromptRecord.y += row.prompt
      }
    })

    return {
      correctPointData,
      errorPointData,
      promptPointData,
    }
  }

  const scatterDataForOtherType = () => {
    const correctPointData = []
    const errorPointData = []
    const promptPointData = []

    chart.points.forEach(row => {
      if (row.dataType === 1) {
        let existingCorrectRecord = correctPointData.find(x => x.day === row.day)
        if (!existingCorrectRecord) {
          existingCorrectRecord = { x: row.day, y: 0, day: row.day }
          correctPointData.push(existingCorrectRecord)
        }
        existingCorrectRecord.y += row.count
      }
      if (row.dataType === 0) {
        let existingErrorRecord = errorPointData.find(x => x.day === row.day)
        if (!existingErrorRecord) {
          existingErrorRecord = { x: row.day, y: 0, day: row.day }
          errorPointData.push(existingErrorRecord)
        }
        existingErrorRecord.y += row.count
      }
      if (row.dataType === 2) {
        let existingPromptRecord = promptPointData.find(x => x.day === row.day)
        if (!existingPromptRecord) {
          existingPromptRecord = { x: row.day, y: 0, day: row.day }
          promptPointData.push(existingPromptRecord)
        }
        existingPromptRecord.y += row.count
      }
    })

    return {
      correctPointData,
      errorPointData,
      promptPointData,
    }
  }

  const getScatterPlotData = () => {
    let scatterData = { correctPointData: [], errorPointData: [], promptPointData: [] }
    if (categoryName === 'Session') scatterData = scatterDataForSessionType()
    if (categoryName === 'Behaviour') scatterData = scatterDataForBehaviorType()
    if (categoryName === 'Others') scatterData = scatterDataForOtherType()

    const chartData = [
      {
        id: 'Correct',
        data: scatterData.correctPointData,
      },
      {
        id: 'Error',
        data: scatterData.errorPointData,
      },
      {
        id: 'Prompt',
        data: scatterData.promptPointData,
      },
    ]

    return chartData
  }

  const chartOptions = {
    margin: { top: 70, right: 50, bottom: 50, left: 50 },
    xScale: { type: 'linear', min: 0, max: totalDays },
    yScale: { type: 'linear', min: 0, max: 'auto' },
    colors: { scheme: 'dark2' },
    blendMode: 'multiply',
    // axisTop: {
    //   orient: 'bottom',
    //   tickSize: 5,
    //   tickPadding: 5,
    //   tickRotation: 0,
    //   legend: 'SUCCESSIVE CALENDAR WEEKS',
    //   legendPosition: 'middle',
    //   legendOffset: -40,
    // },
    // axisRight: {
    //   orient: 'left',
    //   tickSize: 5,
    //   tickPadding: 5,
    //   tickRotation: 0,
    //   legend: 'COUNTING TIMES',
    //   legendPosition: 'middle',
    //   legendOffset: 45,
    // },
    axisBottom: {
      orient: 'bottom',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: chart.labelX ? chart.labelX : 'SUCCESSIVE CALENDAR DAYS',
      legendPosition: 'middle',
      legendOffset: 40,
    },
    axisLeft: {
      orient: 'left',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: chart.labelY ? chart.labelY : 'COUNT PER MINUTE',
      legendPosition: 'middle',
      legendOffset: -40,
    },
    legends: [
      {
        anchor: 'top',
        direction: 'row',
        justify: false,
        translateX: 0,
        translateY: -70,
        itemWidth: 80,
        itemHeight: 12,
        itemsSpacing: 5,
        itemDirection: 'left-to-right',
        symbolSize: 12,
        symbolShape: 'circle',
        effects: [
          {
            on: 'hover',
            style: {
              itemOpacity: 1,
            },
          },
        ],
      },
    ],
    tooltip: ({ node }) => (
      <div style={{ backgroundColor: '#dfdfdf', padding: '8px' }}>
        <div>
          <span style={{ background: node.style.color, marginRight: '5px' }}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
          <strong style={{ fontSize: '1.2rem' }}>{node.data.serieId}</strong>
        </div>
        {node.data.date && (
          <div>
            <span>
              <b>Date: </b>
            </span>
            <span>{node.data.date}</span>
          </div>
        )}
        {node.data.day && (
          <div>
            <span>
              <b>Day: </b>
            </span>
            <span>{node.data.day}</span>
          </div>
        )}
        <div>
          <span>
            <b>Frequency: </b>
          </span>
          <span>{node.data.y}</span>
        </div>
      </div>
    ),
  }

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ResponsiveScatterPlot data={getScatterPlotData()} {...chartOptions} />
    </div>
  )
}

export default ScatterPlotChart

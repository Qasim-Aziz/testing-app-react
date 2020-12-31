/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable object-shorthand */
import React, { useEffect } from 'react'
import { Typography, Button, notification } from 'antd'
import { ClockCircleOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons'
import { ResponsiveBar } from '@nivo/bar'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'

const { Title, Text } = Typography

const Graph = ({ style, data = null }) => {
  const graphData = []
  if (data) {
    const item = data.sessionEdges.edges
    const sessionArray = []
    let totalTrial = 0
    const Mand = 0
    const Behaviours = 0
    let No = 0
    let Prompted = 0
    let Correct = 0
    const Incorrect = 0
    if (item !== undefined) {
      for (let i = 0; i < item.length; i += 1) {
        sessionArray.push(item[i].node.sessionRecord)
      }
      sessionArray.forEach(entry => {
        totalTrial += entry.totalTrial
        Prompted += entry.totalPrompt
        Correct += entry.totalCorrect
        No += entry.totalError
      })
    }
    graphData.push({ label: 'Total Trials', Prompted: Prompted, No: No, Correct: Correct })
    graphData.push({ label: 'Correct', Correct: Correct })
    graphData.push({ label: 'Incorrect', Incorrect: No + Prompted })
    graphData.push({ label: 'Prompted', Prompted: Prompted })
    graphData.push({ label: 'No Trials', No: No })
  }

  return (
    <ResponsiveBar
      data={graphData}
      keys={['Total', 'Correct', 'Incorrect', 'Prompted', 'No']}
      indexBy="label"
      margin={{ top: 20, right: 60, bottom: 20, left: 60 }}
      padding={0.3}
      // groupMode="grouped"
      colors={{ scheme: 'paired' }}
      defs={[
        {
          id: 'Incorrect',
          type: 'patternLines',
          background: '#FF8080',
          color: '#FF9C52',
          size: 4,
          rotation: -45,
          spacing: 10,
          lineWidth: 5,
        },
        {
          id: 'No',
          type: 'patternLines',
          background: '#FF8080',
          color: 'white',
          size: 4,
          rotation: -45,
          spacing: 10,
          lineWidth: 1,
        },
        {
          id: 'Prompted',
          type: 'patternLines',
          background: '#FF9C52',
          color: 'white',
          size: 4,
          rotation: -45,
          spacing: 10,
          lineWidth: 1,
        },
        {
          id: 'Correct',
          type: 'patternLines',
          background: '#4BAEA0',
          color: 'white',
          size: 4,
          rotation: -45,
          spacing: 10,
          lineWidth: 1,
        },
      ]}
      fill={[
        {
          match: {
            id: 'Correct',
          },
          id: 'Correct',
        },
        {
          match: {
            id: 'Incorrect',
          },
          id: 'Incorrect',
        },
        {
          match: {
            id: 'Prompted',
          },
          id: 'Prompted',
        },
        {
          match: {
            id: 'No',
          },
          id: 'No',
        },
      ]}
      borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      axisTop={null}
      axisRight={null}
      // axisBottom={{
      //     tickSize: 5,
      //     tickPadding: 5,
      //     tickRotation: 0,
      //     legend: 'label',
      //     legendPosition: 'middle',
      //     legendOffset: 32
      // }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Trials',
        legendPosition: 'middle',
        legendOffset: -40,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
    />
  )
}

export default Graph

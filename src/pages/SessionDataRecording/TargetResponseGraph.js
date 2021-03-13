/* eslint-disable react/no-unused-state */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-template */
/* eslint-disable prefer-destructuring */
/* eslint-disable object-shorthand */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable prefer-const */

import React, { Component } from 'react'
import { Card, Progress, Typography, Button, Icon, notification } from 'antd'
import { connect } from 'react-redux'
import { ResponsiveLine } from '@nivo/line'
import { gql } from 'apollo-boost'
import moment from 'moment'
import apolloClient from '../../apollo/config'

const { Title, Text } = Typography
const peakId = 'VGFyZ2V0RGV0YWlsVHlwZTo4'

@connect(({ sessionrecording }) => ({ sessionrecording }))
class TargetResponseGraph extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      data: [],
      GraphData: [
        { id: 'Incorrect', data: [] },
        { id: 'Prompt', data: [] },
        { id: 'Correct', data: [] },
      ],
    }
  }

  componentDidMount() {
    this.getTargetPercentages()
  }

  getTargetPercentages = () => {
    const {
      sessionrecording: {
        TargetResponse,
        TargetActiveIndex,
        TargetActiveId,
        MasterSession,
        CorrectCount,
        IncorrectCount,
        Count,
        StimulusActiveIndex,
        StimulusActiveId,
        StepActiveIndex,
        StepActiveId,
        SelectedPeakStimulusIndex,
      },
    } = this.props

    let activeTargetId = ''
    let activeStimulusId = ''
    let activeStepId = ''
    let sessionTypeId = ''

    if (MasterSession){
      sessionTypeId = MasterSession.sessionName?.id
    }

    if (
      MasterSession.targets.edges[TargetActiveIndex].node.targetAllcatedDetails.targetType.id ===
      peakId
    ) {
      console.log('Peak Found')
      activeTargetId = TargetActiveId
      activeStimulusId = MasterSession.targets.edges[TargetActiveIndex].node.sd.edges[SelectedPeakStimulusIndex]?.node.id
    } else if (MasterSession.targets.edges[TargetActiveIndex].node.sd.edges.length > 0) {
      console.log('found stimulus')
      activeTargetId = TargetActiveId
      activeStimulusId = StimulusActiveId
    } else if (MasterSession.targets.edges[TargetActiveIndex].node.steps.edges.length > 0) {
      console.log('found Step')
      activeTargetId = TargetActiveId
      activeStepId = StepActiveId
    } else {
      console.log('Found Target')
      activeTargetId = TargetActiveId
    }

    apolloClient
      .query({
        query: gql`
          query GetTargetPercentage($target: ID!, $sd: ID, $step: ID, $sessionId: ID) {
            get5dayPercentage2(target: $target, sd: $sd, step: $step, sessionType: $sessionId) {
              date
              correctPercent
              errorPercent
              promptPercent
              incorrectPercent
              noResponsePercent
            }
          }
        `,
        variables: {
          target: activeTargetId,
          sd: activeStimulusId,
          step: activeStepId,
          sessionId: sessionTypeId,
        },
        fetchPolicy: 'network-only',
      })
      .then(result => {
        const correctData = []
        const incorrectData = []
        const promptData = []

        result.data.get5dayPercentage2?.map(item => {
          correctData.push({ x: item.date, y: item.correctPercent })
          incorrectData.push({ x: item.date, y: item.incorrectPercent + item.noResponsePercent })
          promptData.push({ x: item.date, y: item.promptPercent })
        })

        this.setState({
          GraphData: [
            { id: 'Incorrect', data: incorrectData },
            { id: 'Prompt', data: promptData },
            { id: 'Correct', data: correctData },
          ],
        })

        
      })
      .catch(error => {
        error.graphQLErrors.map(item => {
          return notification.error({
            message: 'Somthing went wrong getting graph percentage',
            description: item.message,
          })
        })
      })
  }

  render() {
    const { loading, data, GraphData } = this.state

    console.log("GraphData- " ,GraphData)
    if (loading) {
      return 'Loading...'
    }

    const {
      sessionrecording: {
        TargetResponse,
        TargetActiveIndex,
        TargetActiveId,
        MasterSession,
        CorrectCount,
        IncorrectCount,
        Count,
        StimulusActiveIndex,
        StimulusActiveId,
        StepActiveIndex,
        StepActiveId,
      },
    } = this.props

    let LocalData = []
    let correctCount = 0
    let promptCount = 0
    let errorCount = 0

    // if (MasterSession.targets.edges[TargetActiveIndex].node.targetAllcatedDetails.targetType.id === peakId){
    //   console.log('Peak Found')
    // }
    // else if (MasterSession.targets.edges[TargetActiveIndex].node.sd.edges.length > 0){
    //     console.log('found stimulus')
    //     TargetResponse[TargetActiveId].sd[StimulusActiveId]?.map(item => {
    //       if (item.trial === 'CORRECT'){correctCount+=1}
    //       if (item.trial === 'PROMPT'){promptCount+=1}
    //       if (item.trial === 'ERROR'){errorCount+=1}
    //     })
    //     if (correctCount !== 0){
    //       correctCount = ((correctCount*100)/TargetResponse[TargetActiveId].target.length).toFixed(2)
    //     }
    //     if (errorCount !== 0){
    //       errorCount = ((errorCount*100)/TargetResponse[TargetActiveId].target.length).toFixed(2)
    //     }
    //     if (promptCount !== 0){
    //       promptCount = ((promptCount*100)/TargetResponse[TargetActiveId].target.length).toFixed(2)
    //     }
    //     LocalData = [
    //       { label: 'Correct', Correct: correctCount },
    //       { label: 'Error', Error: errorCount },
    //       { label: 'Prompt', Prompt: promptCount },
    //     ]
    // }
    // else if (MasterSession.targets.edges[TargetActiveIndex].node.steps.edges.length > 0){
    //   console.log('found Step')
    //   TargetResponse[TargetActiveId].step[StepActiveId]?.map(item => {
    //     if (item.trial === 'CORRECT'){correctCount+=1}
    //     if (item.trial === 'PROMPT'){promptCount+=1}
    //     if (item.trial === 'ERROR'){errorCount+=1}
    //   })
    //   if (correctCount !== 0){
    //     correctCount = ((correctCount*100)/TargetResponse[TargetActiveId].target.length).toFixed(2)
    //   }
    //   if (errorCount !== 0){
    //     errorCount = ((errorCount*100)/TargetResponse[TargetActiveId].target.length).toFixed(2)
    //   }
    //   if (promptCount !== 0){
    //     promptCount = ((promptCount*100)/TargetResponse[TargetActiveId].target.length).toFixed(2)
    //   }
    //   LocalData = [
    //     { label: 'Correct', Correct: correctCount },
    //     { label: 'Error', Error: errorCount },
    //     { label: 'Prompt', Prompt: promptCount },
    //   ]
    // }
    // else{
    //   console.log('Found Target')
    //   TargetResponse[TargetActiveId].target.map(item => {
    //     if (item.trial === 'CORRECT'){correctCount+=1}
    //     if (item.trial === 'PROMPT'){promptCount+=1}
    //     if (item.trial === 'ERROR'){errorCount+=1}
    //   })
    //   if (correctCount !== 0){
    //     correctCount = ((correctCount*100)/TargetResponse[TargetActiveId].target.length).toFixed(2)
    //   }
    //   if (errorCount !== 0){
    //     errorCount = ((errorCount*100)/TargetResponse[TargetActiveId].target.length).toFixed(2)
    //   }
    //   if (promptCount !== 0){
    //     promptCount = ((promptCount*100)/TargetResponse[TargetActiveId].target.length).toFixed(2)
    //   }
    //   LocalData = [
    //     { label: 'Correct', Correct: correctCount },
    //     { label: 'Error', Error: errorCount },
    //     { label: 'Prompt', Prompt: promptCount },
    //   ]
    // }

    return (
      <div style={{ height: '250px' }}>
        <ResponsiveLine
          data={GraphData}
          margin={{ top: 30, right: 50, bottom: 30, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 0, max: 100, stacked: false, reverse: false }}
          curve="linear"
          axisTop={null}
          axisRight={null}
          // axisBottom={{
          //   orient: 'bottom',
          //   tickSize: 5,
          //   tickPadding: 5,
          //   tickRotation: 0,
          //   legend: 'transportation',
          //   legendOffset: 36,
          //   legendPosition: 'middle'
          // }}
          axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Response (%)',
            legendOffset: -40,
            legendPosition: 'middle',
          }}
          colors={{ scheme: 'category10' }}
          lineWidth={3}
          pointSize={5}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabel="y"
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[
            {
              anchor: 'top-left',
              direction: 'row',
              justify: false,
              translateX: 78,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, .5)',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemBackground: 'rgba(0, 0, 0, .03)',
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      </div>
    )
  }
}
export default TargetResponseGraph

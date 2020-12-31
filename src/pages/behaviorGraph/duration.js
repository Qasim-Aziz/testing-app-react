/* eslint-disable react/no-unused-state */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-underscore-dangle */
/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-useless-concat */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-var */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable camelcase */
/* eslint-disable prefer-const */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable prefer-template */
/* eslint-disable array-callback-return */
/* eslint-disable no-restricted-globals */

import React from 'react'
import { Row, Col, Card, Button, Typography, Affix, Empty } from 'antd'
import { connect } from 'react-redux'
import { ResponsiveLine } from '@nivo/line'
import groupObj from '@hunters/group-object'
import { gql } from 'apollo-boost'
import client from '../../apollo/config'

var moment = require('moment')

const { Title, Text } = Typography

const data = [
  {
    id: 'japan',
    color: 'hsl(2, 70%, 50%)',
    data: [
      {
        x: '2020-07-01',
        y: '150.889',
      },
      {
        x: '2020-07-02',
        y: 201,
      },
      {
        x: '2020-07-02',
        y: 201,
      },
      {
        x: '2020-07-03',
        y: 175,
      },
    ],
  },
  {
    id: 'france',
    color: 'hsl(110, 70%, 50%)',
    data: [
      {
        x: '2020-07-05',
        y: 230,
      },
      {
        x: '2020-07-06',
        y: 90,
      },
      {
        x: '2020-07-07',
        y: 259,
      },
      {
        x: '2020-07-08',
        y: 125,
      },
      {
        x: '2020-07-09',
        y: 48,
      },
      {
        x: '2020-07-010',
        y: 141,
      },
      {
        x: '2020-07-11',
        y: 158,
      },
      {
        x: '2020-07-12',
        y: 148,
      },
    ],
  },
]

class LeftArea extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      GraphData: [
        {
          id: 'Baseline',
          color: 'hsl(2, 70%, 50%)',
          data: [],
        },
        {
          id: 'In-Therapy',
          color: 'hsl(2, 70%, 50%)',
          data: [],
        },
      ],
      statusselected: null,
      inTherapyDate: null,
    }
  }

  componentWillMount() {
    let { selectedBehavior, startDate, endDate } = this.props
    startDate = moment(startDate).format('YYYY-MM-DD')
    endDate = moment(endDate).format('YYYY-MM-DD')
    if (selectedBehavior !== '') {
      client
        .query({
          query: gql`query{
                getDecelData(
                    template:"${selectedBehavior}"
                    date_Gte:"${startDate}", date_Lte: "${endDate}"
                ){
                    intherapyDate
                    edges{
                        node{
                            statusname
                            id,
                            irt,
                            intensity,
                            note,
                            date,
                            duration,
                            intherapyOn
                            session{
                                id
                                sessionDate
                            }
                            template{
                                id,
                                behaviorDef,
                                behaviorDescription,
                            },
                            environment{
                                id,
                                name
                            },
                            status{
                                id,
                                statusName
                            }
                            frequency{
                                edges{
                                    node{
                                        id,
                                        count,
                                        time
                                    }
                                }
                            }
                        }
                    }
                }
            }
          `,
        })
        .then(result => {
          // console.log(result)
          const nodeLessData = []
          result.data.getDecelData.edges.map(item => {
            nodeLessData.push(item.node)
          })
          let groupedData = groupObj.group(nodeLessData, 'statusname')
          console.log('Grouped data', groupedData)

          const graphData = []
          const baselineData = []
          const inTherapyData = []

          if (groupedData.Baseline) {
            const baselineDateGroupData = groupObj.group(groupedData.Baseline, 'date')
            console.log(baselineDateGroupData)
            const baselineDates = Object.keys(baselineDateGroupData)
            console.log(baselineDates)
            for (let i = 0; i < baselineDates.length; i++) {
              let totalDuration = 0
              baselineDateGroupData[baselineDates[i]].map(item => {
                if (item.duration) {
                  if (isNaN(parseInt(item.duration, 10))) {
                    totalDuration += 0
                  } else {
                    totalDuration += parseInt(item.duration, 10)
                  }
                }
              })
              baselineData.push({ x: baselineDates[i], y: totalDuration })
            }
          }

          if (groupedData['In-Therapy']) {
            const inTherapyDateGroupData = groupObj.group(groupedData['In-Therapy'], 'date')
            console.log(inTherapyDateGroupData)
            const inTherapyDates = Object.keys(inTherapyDateGroupData)
            console.log(inTherapyDates)
            for (let i = 0; i < inTherapyDates.length; i++) {
              let totalDuration = 0
              inTherapyDateGroupData[inTherapyDates[i]].map(item => {
                if (item.duration) {
                  if (isNaN(parseInt(item.duration, 10))) {
                    totalDuration += 0
                  } else {
                    totalDuration += parseInt(item.duration, 10)
                  }
                }
              })
              inTherapyData.push({ x: inTherapyDates[i], y: totalDuration })
            }
          }

          console.log(baselineData, inTherapyData)

          this.setState({
            GraphData: [
              {
                id: 'Baseline',
                color: 'hsl(2, 70%, 50%)',
                data: baselineData,
              },
              {
                id: 'In-Therapy',
                color: 'hsl(2, 70%, 50%)',
                data: inTherapyData,
              },
            ],
            inTherapyDate: result.data.getDecelData.intherapyDate,
          })
          // console.log(baselineData)
        })
    }
  }

  render() {
    const textStyle = {
      fontSize: '16px',
      lineHeight: '19px',
    }

    const { GraphData, inTherapyDate } = this.state
    const { selectedBehavior } = this.props

    console.log(selectedBehavior)
    return (
      <>
        <div
          role="presentation"
          style={{
            borderRadius: 10,
            border: '2px solid #F9F9F9',
            // padding: '28px 27px 20px',
            display: 'block',
            // marginLeft: '10px',
            width: '100%',
            height: '450px',
            // overflowY: 'auto'
          }}
        >
          {GraphData.length === 0 ? (
            <>
              <Empty style={{ marginTop: '100px' }} />
            </>
          ) : (
            ''
          )}
          {GraphData && (
            <ResponsiveLine
              data={GraphData}
              margin={{ top: 50, right: 100, bottom: 50, left: 100 }}
              xScale={{ type: 'point' }}
              yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                orient: 'bottom',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Date',
                legendOffset: 36,
                legendPosition: 'middle',
              }}
              axisLeft={{
                orient: 'left',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'duration',
                legendOffset: -40,
                legendPosition: 'middle',
              }}
              colors={{ scheme: 'nivo' }}
              pointSize={10}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              pointLabel="y"
              pointLabelYOffset={-12}
              useMesh={true}
              markers={
                inTherapyDate
                  ? [
                      {
                        axis: 'x',
                        value: inTherapyDate,
                        lineStyle: { stroke: '#b0413e', strokeWidth: 2 },
                        legend: 'Status Change',
                      },
                    ]
                  : []
              }
            />
          )}
        </div>
      </>
    )
  }
}

export default LeftArea

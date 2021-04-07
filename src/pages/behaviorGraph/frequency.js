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
/* eslint-disable object-shorthand */
/* eslint-disable dot-notation */

import React from 'react'
import { Row, Col, Card, Button, Typography, Affix, Empty } from 'antd'
import { connect } from 'react-redux'
import { ResponsiveBar } from '@nivo/bar'
import groupObj from '@hunters/group-object'
import { gql } from 'apollo-boost'
import client from '../../apollo/config'

var moment = require('moment')

const { Title, Text } = Typography

class LeftArea extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      GraphData: [],
      heighestCount: 1,
      statusselected: null,
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
                                intherapyOn,
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
          const nodeLessData = []
          result.data.getDecelData.edges.map(item => {
            nodeLessData.push(item.node)
          })
          let groupedData = groupObj.group(nodeLessData, 'statusname')

          const graphData = []
          // const baselineData = []
          // const inTherapyData = []
          // let heighestCount = 1

          if (groupedData.Baseline) {
            const dateGroupData = groupObj.group(nodeLessData, 'date')
            const dates = Object.keys(dateGroupData)
            for (let i = 0; i < dates.length; i++) {
              const dateData = { date: dates[i] }
              let count = 0
              dateGroupData[dates[i]].map(item => {
                if (item.frequency.edges.length > 0) {
                  count += item.frequency.edges.length
                }
              })
              dateData['Count'] = count
              graphData.push(dateData)
            }
          }
          this.setState({
            GraphData: graphData,
          })
        })
    }
  }

  render() {
    const textStyle = {
      fontSize: '16px',
      lineHeight: '19px',
    }

    const { GraphData, heighestCount } = this.state
    const { selectedBehavior } = this.props

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
            <ResponsiveBar
              data={GraphData}
              keys={['Count']}
              indexBy="date"
              margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
              padding={0.15}
              colors={{ scheme: 'paired' }}
              defs={[
                {
                  id: 'dots',
                  type: 'patternDots',
                  background: 'inherit',
                  color: '#38bcb2',
                  size: 4,
                  padding: 1,
                  stagger: true,
                },
                {
                  id: 'lines',
                  type: 'patternLines',
                  background: 'inherit',
                  color: '#eed312',
                  rotation: -45,
                  lineWidth: 6,
                  spacing: 10,
                },
              ]}
              fill={[
                {
                  match: {
                    id: 'fries',
                  },
                  id: 'dots',
                },
                {
                  match: {
                    id: 'sandwich',
                  },
                  id: 'lines',
                },
              ]}
              borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Date Range',
                legendPosition: 'middle',
                legendOffset: 32,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Frequency Count',
                legendPosition: 'middle',
                legendOffset: -40,
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              legends={[
                {
                  dataFrom: 'keys',
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 120,
                  translateY: 0,
                  itemsSpacing: 2,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemDirection: 'left-to-right',
                  itemOpacity: 0.85,
                  symbolSize: 20,
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemOpacity: 1,
                      },
                    },
                  ],
                },
              ]}
              animate={true}
              motionStiffness={90}
              motionDamping={15}
            />
          )}
        </div>
      </>
    )
  }
}

export default LeftArea

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

import React from 'react'
import { Row, Col, Card, Button, Typography, Affix, Empty } from 'antd'
import { connect } from 'react-redux'
import { ResponsiveBar } from '@nivo/bar'
import groupObj from '@hunters/group-object'
import { gql } from 'apollo-boost'
import client from '../../apollo/config'

var moment = require('moment')

const { Title, Text } = Typography

const data = [
  {
    country: 'AD',
    'hot dog': 165,
    'hot dogColor': 'hsl(234, 70%, 50%)',
    burger: 180,
    burgerColor: 'hsl(77, 70%, 50%)',
    sandwich: 144,
    sandwichColor: 'hsl(323, 70%, 50%)',
    kebab: 63,
    kebabColor: 'hsl(248, 70%, 50%)',
    fries: 22,
    friesColor: 'hsl(219, 70%, 50%)',
    donut: 74,
    donutColor: 'hsl(34, 70%, 50%)',
  },
  {
    country: 'AE',
    'hot dog': 172,
    'hot dogColor': 'hsl(160, 70%, 50%)',
    burger: 191,
    burgerColor: 'hsl(211, 70%, 50%)',
    sandwich: 180,
    sandwichColor: 'hsl(112, 70%, 50%)',
    kebab: 169,
    kebabColor: 'hsl(160, 70%, 50%)',
    fries: 196,
    friesColor: 'hsl(193, 70%, 50%)',
    donut: 77,
    donutColor: 'hsl(187, 70%, 50%)',
  },
  {
    country: 'AF',
    'hot dog': 179,
    'hot dogColor': 'hsl(208, 70%, 50%)',
    burger: 28,
    burgerColor: 'hsl(276, 70%, 50%)',
    sandwich: 164,
    sandwichColor: 'hsl(269, 70%, 50%)',
    kebab: 58,
    kebabColor: 'hsl(201, 70%, 50%)',
    fries: 137,
    friesColor: 'hsl(159, 70%, 50%)',
    donut: 156,
    donutColor: 'hsl(6, 70%, 50%)',
  },
  {
    country: 'AG',
    'hot dog': 128,
    'hot dogColor': 'hsl(203, 70%, 50%)',
    burger: 19,
    burgerColor: 'hsl(34, 70%, 50%)',
    sandwich: 4,
    sandwichColor: 'hsl(69, 70%, 50%)',
    kebab: 103,
    kebabColor: 'hsl(316, 70%, 50%)',
    fries: 82,
    friesColor: 'hsl(238, 70%, 50%)',
    donut: 112,
    donutColor: 'hsl(136, 70%, 50%)',
  },
  {
    country: 'AI',
    'hot dog': 176,
    'hot dogColor': 'hsl(61, 70%, 50%)',
    burger: 4,
    burgerColor: 'hsl(332, 70%, 50%)',
    sandwich: 149,
    sandwichColor: 'hsl(329, 70%, 50%)',
    kebab: 100,
    kebabColor: 'hsl(333, 70%, 50%)',
    fries: 2,
    friesColor: 'hsl(189, 70%, 50%)',
    donut: 121,
    donutColor: 'hsl(219, 70%, 50%)',
  },
  {
    country: 'AL',
    'hot dog': 197,
    'hot dogColor': 'hsl(118, 70%, 50%)',
    burger: 81,
    burgerColor: 'hsl(51, 70%, 50%)',
    sandwich: 198,
    sandwichColor: 'hsl(263, 70%, 50%)',
    kebab: 59,
    kebabColor: 'hsl(342, 70%, 50%)',
    fries: 85,
    friesColor: 'hsl(147, 70%, 50%)',
    donut: 111,
    donutColor: 'hsl(277, 70%, 50%)',
  },
  {
    country: 'AM',
    'hot dog': 162,
    'hot dogColor': 'hsl(24, 70%, 50%)',
    burger: 68,
    burgerColor: 'hsl(31, 70%, 50%)',
    sandwich: 60,
    sandwichColor: 'hsl(216, 70%, 50%)',
    kebab: 6,
    kebabColor: 'hsl(40, 70%, 50%)',
    fries: 123,
    friesColor: 'hsl(208, 70%, 50%)',
    donut: 4,
    donutColor: 'hsl(231, 70%, 50%)',
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
          // console.log('Grouped data', groupedData)

          const graphData = []
          const baselineData = []
          const inTherapyData = []
          let heighestCount = 1

          if (groupedData.Baseline) {
            const baselineDateGroupData = groupObj.group(groupedData.Baseline, 'date')
            // console.log(baselineDateGroupData)
            const baselineDates = Object.keys(baselineDateGroupData)
            // console.log(baselineDates)
            for (let i = 0; i < baselineDates.length; i++) {
              const dateData = { date: baselineDates[i] }
              let trial = 0
              baselineDateGroupData[baselineDates[i]].map(item => {
                if (item.frequency.edges.length > 0) {
                  let initialDuration = 0
                  item.frequency.edges.map((frequencyItem, index) => {
                    trial += 1
                    const count = 'Count ' + trial
                    // let custObject = {}
                    dateData[count] = frequencyItem.node.time - initialDuration
                    // dateData.push(custObject)
                    initialDuration = frequencyItem.node.time
                  })
                }
              })
              if (trial >= heighestCount) {
                heighestCount = trial
              }
              baselineData.push(dateData)
              console.log(dateData)
            }
          }
          this.setState({
            GraphData: baselineData,
            heighestCount: heighestCount,
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

    const { GraphData, heighestCount } = this.state
    const { selectedBehavior } = this.props

    const countLabels = []
    for (let i = 0; i < heighestCount; i++) {
      const label = 'Count ' + (i + 1)
      countLabels.push(label)
    }

    console.log(selectedBehavior, countLabels)
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
          {data.length === 0 ? (
            <>
              <Empty style={{ marginTop: '100px' }} />
            </>
          ) : (
            ''
          )}
          {data && (
            <ResponsiveBar
              data={GraphData}
              keys={countLabels}
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
                legend: 'country',
                legendPosition: 'middle',
                legendOffset: 32,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'food',
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

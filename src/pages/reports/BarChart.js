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
/* eslint-disable import/newline-after-import */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable camelcase */
/* eslint-disable prefer-const */
/* eslint-disable no-var */
/* eslint-disable radix */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/jsx-props-no-multi-spaces */
/* eslint-disable react/jsx-tag-spacing */
/* eslint-disable prefer-const */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable vars-on-top */
/* eslint-disable block-scoped-var */
/* eslint-disable no-empty */
/* eslint-disable no-redeclare */
/* eslint-disable dot-notation */
/* eslint-disable prefer-destructuring */
/* eslint-disable vars-on-top */

import React from 'react'
import { Row, Col, Card, Button, Typography, Affix } from 'antd'
import { connect } from 'react-redux'
import { ResponsiveBar } from '@nivo/bar'
import { gql } from 'apollo-boost'
import groupObj from '@hunters/group-object'
import client from '../../apollo/config'

// var groupObj = require('@hunters/group-object')
var moment = require('moment')
const { Title, Text } = Typography

class BarChart extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      GraphData: [],
    }
  }

  componentDidMount() {
    let { start_date, end_date, selectedprogram, domainSelected, statusselected } = this.props
    const studentId = localStorage.getItem('studentId')
    this.createBarGraph(studentId, start_date, end_date, selectedprogram, statusselected)
  }

  componentDidUpdate(prevProps) {
    let {
      start_date,
      end_date,
      selectedprogram,
      domainSelected,
      statusselected,
      studentIdSelected,
    } = this.props
    const studentId = localStorage.getItem('studentId')
    start_date = moment(start_date).format('YYYY-MM-DD')
    end_date = moment(end_date).format('YYYY-MM-DD')
    if (
      start_date != prevProps.start_date ||
      end_date != prevProps.end_date ||
      selectedprogram != prevProps.selectedprogram ||
      domainSelected != prevProps.domainSelected ||
      statusselected != prevProps.statusselected ||
      studentIdSelected != prevProps.studentIdSelected
    ) {
      this.createBarGraph(
        studentId,
        start_date,
        end_date,
        selectedprogram,
        statusselected,
        domainSelected,
      )
    }
  }

  createBarGraph(studentId, start_date, end_date, selectedprogram, statusselected, domainSelected) {
    client
      .query({
        query: gql`{
          domainMastered(studentId: ${studentId}, dateGte:"${start_date}", dateLte:"${end_date}", programArea:"${selectedprogram}", targetStatus:"${statusselected}"){
            totalCount
            target {
              id
              domainName
              targetId {
                domain {
                  id
                  domain
                }
              }
              targetAllcatedDetails {
                targetName
                dateBaseline
              }
              intherapyDate
              masterDate
              inmaintainenceDate
            }
          }
        }`,
        fetchPolicy: 'network-only',
      })
      .then(result => {
        var data = []
        var graphData = {}

        let targets = result.data.domainMastered.target

        console.log('result.data bar ===> ', result.data)
        const baseline = 'U3RhdHVzVHlwZTox'
        const intherapy = 'U3RhdHVzVHlwZToz'
        const mastered = 'U3RhdHVzVHlwZTo0'
        const inmaintainence = 'U3RhdHVzVHlwZTo1'
        const onhold = 'U3RhdHVzVHlwZTo2'
        const deleted = 'U3RhdHVzVHlwZTo3'

        // let domains = []
        // if (targets.length > 0) {
        //   for (let i = 0; i < targets.length; i++) {
        //     if (targets[i].domainName) {
        //       if (!domains.includes(targets[i].domainName)) {
        //         domains.push(targets[i].domainName)
        //       }
        //     }
        //   }
        // }
        const domainData = []
        result.data.domainMastered.target.map(item => {
          return domainData.push({
            domain: item.targetId ? item.targetId.domain.domain : 'Others',
            target: item.targetAllcatedDetails.targetName,
            dateBaseline: item.targetAllcatedDetails.dateBaseline,
            intherapyDate: item.intherapyDate,
            inmaintainence: item.inmaintainenceDate,
            masterDate: item.masterDate,
          })
        })

        let groupedData = groupObj.group(domainData, 'domain')
        let domains = Object.keys(groupedData)
        if (domainSelected) {
          domains = []
          domains.push(domainSelected)
        }
        console.log('Grouped data1 ===>', groupedData)
        let gData = []

        // Graph for Baseline targets
        if (statusselected === baseline) {
          console.log(statusselected, 'baseline', baseline)
          for (let i = 0; i < domains.length; i++) {
            let domainStr = domains[i]
            let count = 0
            let length = 0
            if (groupedData[domains[i]]) {
              for (let j = 0; j < groupedData[domains[i]].length; j++) {
                let dateBaseline = moment(groupedData[domains[i]][j].dateBaseline)
                let currentDate = moment()
                let diff = parseInt((currentDate - dateBaseline) / (1000 * 3600 * 24))
                count += diff
                length += 1
              }
            }
            gData.push({ domain: domainStr, 'Master Time': parseInt((count / length).toFixed()) })
          }
          this.setState({
            GraphData: gData,
          })
        }
        // Graph for Intherapy Targets
        if (statusselected === intherapy) {
          console.log(statusselected, 'intherapy', intherapy)
          console.log('Intherapy====>', domains)
          for (let i = 0; i < domains.length; i++) {
            let domainStr = domains[i]
            let count = 0
            let length = 0
            if (groupedData[domains[i]]) {
              for (let j = 0; j < groupedData[domains[i]].length; j++) {
                let desiredDate = groupedData[domains[i]][j].intherapyDate
                if (desiredDate) {
                  desiredDate = moment(desiredDate)
                } else {
                  desiredDate = moment(groupedData[domains[i]][j].dateBaseline)
                }
                let currentDate = moment()
                let diff = parseInt((currentDate - desiredDate) / (1000 * 3600 * 24))
                count += diff
                length += 1
              }
            }
            gData.push({ domain: domainStr, 'Master Time': parseInt((count / length).toFixed()) })
          }
          this.setState({
            GraphData: gData,
          })
        }
        // Graph for inmaintainence Targets
        if (statusselected === inmaintainence) {
          console.log('Inmaintainence====>')
          console.log(statusselected, 'inmaintainence', inmaintainence)
          for (let i = 0; i < domains.length; i++) {
            let domainStr = domains[i]
            let count = 0
            let length = 0
            if (groupedData[domains[i]]) {
              for (let j = 0; j < groupedData[domains[i]].length; j++) {
                let desiredDate = groupedData[domains[i]][j].inmaintainence
                if (desiredDate) {
                  desiredDate = moment(desiredDate)
                } else {
                  desiredDate = moment(groupedData[domains[i]][j].dateBaseline)
                }
                let currentDate = moment()
                let diff = parseInt((currentDate - desiredDate) / (1000 * 3600 * 24))
                count += diff
                length += 1
              }
            }
            gData.push({ domain: domainStr, 'Master Time': parseInt((count / length).toFixed()) })
          }
          this.setState({
            GraphData: gData,
          })
        }
        // Graph for Mastered Targets
        if (statusselected === mastered) {
          console.log(statusselected, 'mastered', mastered)
          console.log('Mastered====>')
          for (let i = 0; i < domains.length; i++) {
            let domainStr = domains[i]
            let count = 0
            let length = 0
            if (groupedData[domains[i]]) {
              for (let j = 0; j < groupedData[domains[i]].length; j++) {
                let desiredDate = groupedData[domains[i]][j].masterDate
                if (desiredDate) {
                  desiredDate = moment(desiredDate)
                } else {
                  desiredDate = moment(groupedData[domains[i]][j].dateBaseline)
                }
                let currentDate = moment()
                let diff = parseInt((currentDate - desiredDate) / (1000 * 3600 * 24))
                count += diff
                length += 1
              }
            }
            gData.push({ domain: domainStr, 'Master Time': parseInt((count / length).toFixed()) })
          }
          this.setState({
            GraphData: gData,
          })
        }
      })
  }

  render() {
    const textStyle = {
      fontSize: '16px',
      lineHeight: '19px',
    }

    const { GraphData } = this.state

    return (
      <>
        <div
          role="presentation"
          style={{
            borderRadius: 10,
            border: '2px solid #F9F9F9',
            display: 'block',
            width: '100%',
            height: '250px',
          }}
        >
          {GraphData && (
            <ResponsiveBar
              data={GraphData}
              keys={['Master Time']}
              indexBy="domain"
              margin={{ top: 50, right: 20, bottom: 20, left: 60 }}
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
                legend: '',
                legendPosition: 'middle',
                legendOffset: 32,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Number of days',
                legendPosition: 'middle',
                legendOffset: -40,
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              // legends={[
              //   {
              //     dataFrom: 'keys',
              //     anchor: 'bottom-right',
              //     direction: 'column',
              //     justify: false,
              //     translateX: 120,
              //     translateY: 0,
              //     itemsSpacing: 2,
              //     itemWidth: 100,
              //     itemHeight: 20,
              //     itemDirection: 'left-to-right',
              //     itemOpacity: 0.85,
              //     symbolSize: 20,
              //     effects: [
              //       {
              //         on: 'hover',
              //         style: {
              //           itemOpacity: 1,
              //         },
              //       },
              //     ],
              //   },
              // ]}
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

export default BarChart

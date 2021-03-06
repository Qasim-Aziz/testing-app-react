/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
/* eslint-disable prefer-const */
/* eslint-disable no-var */
/* eslint-disable radix */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-template */

import React from 'react'
import { notification, Typography, Affix, Empty } from 'antd'
import { ResponsiveBar } from '@nivo/bar'
import { gql } from 'apollo-boost'
import groupObj from '@hunters/group-object'
import moment from 'moment'
import client from '../../apollo/config'

class BarChart extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      GraphData: [],
      barKeys: [],
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
          domainMastered(studentId: ${studentId},
              dateGte:"${start_date}",
              dateLte:"${end_date}",
              programArea:"${selectedprogram}",
              targetStatus:"${statusselected}"){
            totalCount
            target {
              id
              domainName
              targetId {
                id
                domain {
                  id
                  domain
                }
              }
              targetAllcatedDetails {
                id
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
        const baseline = 'U3RhdHVzVHlwZTox'
        const intherapy = 'U3RhdHVzVHlwZToz'
        const mastered = 'U3RhdHVzVHlwZTo0'
        const inmaintainence = 'U3RhdHVzVHlwZTo1'
        const onhold = 'U3RhdHVzVHlwZTo2'
        const deleted = 'U3RhdHVzVHlwZTo3'

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
        let gData = []

        // Graph for Baseline targets
        if (statusselected === baseline) {
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
            gData.push({
              id: domainStr,

              [domainStr]: parseInt((count / length).toFixed()),
            })
          }
          let tt = []
          tt = gData.map(item => item.id)
          this.setState({
            barKeys: tt,
            GraphData: gData,
          })
        }
        // Graph for Intherapy Targets
        if (statusselected === intherapy) {
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
            gData.push({
              id: domainStr,

              [domainStr]: parseInt((count / length).toFixed()),
            })
          }
          let tt = []
          tt = gData.map(item => item.id)

          this.setState({
            barKeys: tt,
            GraphData: gData,
          })
        }
        // Graph for inmaintainence Targets
        if (statusselected === inmaintainence) {
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
            gData.push({
              id: domainStr,

              [domainStr]: parseInt((count / length).toFixed()),
            })
          }
          let tt = []
          tt = gData.map(item => item.id)
          this.setState({
            barKeys: tt,
            GraphData: gData,
          })
        }
        // Graph for Mastered Targets
        if (statusselected === mastered) {
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
            gData.push({
              id: domainStr,

              [domainStr]: parseInt((count / length).toFixed()),
            })
          }
          let tt = []
          tt = gData.map(item => item.id)
          this.setState({
            barKeys: tt,
            GraphData: gData,
          })
        }
      })
      .catch(error => {
        error.graphQLErrors.map(item => {
          return notification.error({
            message: 'Somthing went wrong',
            description: item.message,
          })
        })
      })
  }

  render() {
    const { GraphData, barKeys } = this.state
    return (
      <div style={{ width: '100%', height: '100%' }}>
        {GraphData && GraphData.length == 0 ? (
          <Empty style={{ marginTop: '100px' }} />
        ) : (
          <ResponsiveBar
            data={GraphData}
            keys={barKeys}
            margin={{ top: 20, right: 10, bottom: 60, left: 60 }}
            padding={0.15}
            colors={{ scheme: 'paired' }}
            borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            axisTop={null}
            axisRight={null}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            animate={true}
            motionStiffness={90}
            motionDamping={15}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -19,
              legend: '',
              legendPosition: 'middle',
              legendOffset: 32,
            }}
            tooltip={({ id, value, color }) => (
              <>
                <strong style={{ color }}>
                  {id}:{'  '}
                </strong>
                <span style={{ color: 'black' }}>{value}</span>
              </>
            )}
            theme={{
              tooltip: {
                container: {
                  background: '#fff',
                },
              },
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Number of days',
              legendPosition: 'middle',
              legendOffset: -40,
            }}
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
          />
        )}
      </div>
    )
  }
}

export default BarChart

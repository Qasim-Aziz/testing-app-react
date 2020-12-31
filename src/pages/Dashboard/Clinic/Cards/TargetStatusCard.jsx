/* eslint-disable camelcase */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/sort-comp */
/* eslint-disable import/order */
/* eslint-disable class-methods-use-this */
/* eslint-disable prefer-const */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable spaced-comment */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/destructuring-assignment */

import React from 'react'
import { DatePicker, Typography, Select } from 'antd'
import gql from 'graphql-tag'
import client from '../../../../apollo/config'
import Moment from 'moment'
import { ResponsiveBar } from '@nivo/bar'

const { Title } = Typography
const { Option } = Select
const { RangePicker } = DatePicker

const globleData = []

class TargetStatusCard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      graphdata: [],
      graphstartdate: Moment(Date.now())
        .subtract(14, 'days')
        .format('YYYY-MM-DD')
        .toString(),
      graphenddate: Moment(Date.now())
        .format('YYYY-MM-DD')
        .toString(),
      loading: true,
    }
  }

  componentWillMount() {
    this.state = {
      graphstartdate: Moment(Date.now())
        .format('YYYY-MM-DD')
        .toString(),
      graphenddate: Moment(Date.now())
        .subtract(14, 'days')
        .format('YYYY-MM-DD')
        .toString(),
    }
    this.CreateChart(
      'U3R1ZGVudFR5cGU6MTYz',
      Moment(Date.now())
        .subtract(14, 'days')
        .format('YYYY-MM-DD')
        .toString(),
      Moment(Date.now())
        .format('YYYY-MM-DD')
        .toString(),
    )
  }

  CreateChart = (studentId, start_date, end_date) => {
    client
      .query({
        query: gql`query {
        target_allocated:targetAllocates(date_Gte:"${start_date}", date_Lte:"${end_date}") {
        totalCount
        }
        mastered_targets:dashboardGraph(targetStatusId:"U3RhdHVzVHlwZTox", dateGte:"${start_date}", dateLte:"${end_date}") {
         tarCount
        }
        inmaintenance_targets:dashboardGraph(targetStatusId:"U3RhdHVzVHlwZTo1", dateGte:"${start_date}", dateLte:"${end_date}") {
         tarCount
        }
    }`,
      })
      .then(result => {
        // let chartdata = [];
        // chartdata.push({
        //   'status': 'Target Allocated',
        //   'value': result.data.target_allocated.totalCount
        // })
        // chartdata.push({
        //   'status': 'Mastered Targets',
        //   'value': result.data.mastered_targets.tarCount
        // })
        // chartdata.push({
        //   'status': 'Inmaintenance Targets',
        //   'value': result.data.inmaintenance_targets.tarCount
        // })
        this.setState({
          graphdata: [
            {
              status: 'Target Allocated',
              'Target Allocated': result.data.target_allocated.totalCount,
            },
            {
              status: 'Mastered Targets',
              'Mastered Targets': result.data.mastered_targets.tarCount,
            },
            {
              status: 'Inmaintenance Targets',
              'Inmaintenance Targets': result.data.inmaintenance_targets.tarCount,
            },
          ],
        })
      })

    this.setState({
      loading: false,
    })
  }

  DateChange = date => {
    this.setState({
      graphstartdate: Moment(date[0])
        .format('YYYY-MM-DD')
        .toString(),
      graphenddate: Moment(date[1])
        .format('YYYY-MM-DD')
        .toString(),
    })
    this.CreateChart(
      'U3R1ZGVudFR5cGU6MTYz',
      Moment(date[0])
        .format('YYYY-MM-DD')
        .toString(),
      Moment(date[1])
        .format('YYYY-MM-DD')
        .toString(),
    )
  }

  MyResponsiveBar = data => (
    <ResponsiveBar
      data={data}
      keys={['Target Allocated', 'Mastered Targets', 'Inmaintenance Targets']}
      indexBy="status"
      margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
      padding={0.3}
      colors={{ scheme: 'nivo' }}
      defs={[
        {
          id: 'dots',
          type: 'patternDots',
          background: 'green',
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
            id: 'Mastered Targets',
          },
          id: 'dots',
        },
        {
          match: {
            id: 'Target Allocated',
          },
          id: 'lines',
        },
      ]}
      borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      axisTop={null}
      axisRight={null}
      // axisBottom={{
      //     tickSize: 5,
      //     tickPadding: 5,
      //     tickRotation: 0,
      //     legend: 'country',
      //     legendPosition: 'middle',
      //     legendOffset: 32
      // }}
      // axisLeft={{
      //     tickSize: 5,
      //     tickPadding: 5,
      //     tickRotation: 0,
      //     legend: 'Targets',
      //     legendPosition: 'middle',
      //     legendOffset: -40
      // }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      // legends={[
      //     {
      //         dataFrom: 'keys',
      //         anchor: 'bottom-right',
      //         direction: 'column',
      //         justify: false,
      //         translateX: 120,
      //         translateY: 0,
      //         itemsSpacing: 2,
      //         itemWidth: 100,
      //         itemHeight: 20,
      //         itemDirection: 'left-to-right',
      //         itemOpacity: 0.85,
      //         symbolSize: 20,
      //         effects: [
      //             {
      //                 on: 'hover',
      //                 style: {
      //                     itemOpacity: 1
      //                 }
      //             }
      //         ]
      //     }
      // ]}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
    />
  )

  render() {
    const { graphstartdate, graphenddate, graphdata, loading } = this.state

    let barGraphData = []
    if (graphdata) {
      barGraphData = graphdata
    }

    if (loading) {
      return 'Loading...'
    }

    return (
      <div
        style={{
          background: '#FFFFFF',
          // border: '1px solid #E4E9F0',
          borderRadius: 10,
          padding: '10px',
          marginTop: 10,
        }}
      >
        <div style={{ height: 320 }}>{this.MyResponsiveBar(barGraphData)} </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <RangePicker
            style={{
              width: 300,
              marginRight: 31,
            }}
            defaultValue={[
              Moment(graphstartdate, 'YYYY-MM-DD'),
              Moment(graphenddate, 'YYYY-MM-DD'),
            ]}
            format="YYYY-MM-DD"
            onChange={this.DateChange}
          />
        </div>
        {/* <div id="chartdiv" style={{ height: 400 }}></div> */}
      </div>
    )
  }
}

export default TargetStatusCard

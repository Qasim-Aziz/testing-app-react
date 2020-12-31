import React, { useState } from 'react'
import { DatePicker, Typography } from 'antd'
import gql from 'graphql-tag'
import Moment from 'moment'
import { ResponsiveBar } from '@nivo/bar'
import { useSelector } from 'react-redux'
import { useQuery } from 'react-apollo'
import Spinner from '../../Spinner'

const { RangePicker } = DatePicker
const { Text } = Typography

const QUERY = gql`
  query($therapistId: ID!, $startDate: Date!, $endDate: Date!) {
    attendanceReport: attendanceReport(
      therapist: $therapistId
      dateGte: $startDate
      dateLte: $endDate
    ) {
      date
      hours
    }
    timesheetReport: timesheetReport(
      therapist: $therapistId
      dateGte: $startDate
      dateLte: $endDate
    ) {
      date
      hours
    }
  }
`

const AttendenceGraph = () => {
  const [graphStartDate, setGaphStartDate] = useState(
    Moment(Date.now())
      .subtract(5, 'days')
      .format('YYYY-MM-DD')
      .toString(),
  )
  const [graphEndDate, setGraphEndDate] = useState(
    Moment(Date.now())
      .format('YYYY-MM-DD')
      .toString(),
  )

  const therapistId = useSelector(s => s.user.staffId)
  const { data, loading, error } = useQuery(QUERY, {
    variables: {
      therapistId,
      startDate: graphStartDate,
      endDate: graphEndDate,
    },
  })

  const onDateChange = date => {
    setGaphStartDate(
      Moment(date[0])
        .format('YYYY-MM-DD')
        .toString(),
    )
    setGraphEndDate(
      Moment(date[1])
        .format('YYYY-MM-DD')
        .toString(),
    )
  }

  const generateBarChart = barData => (
    <ResponsiveBar
      data={barData}
      keys={['attendanceHours', 'timesheetHoues']}
      indexBy="date"
      margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
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
            id: 'attendanceHours',
          },
          id: 'dots',
        },
        {
          match: {
            id: 'timesheetHoues',
          },
          id: 'lines',
        },
      ]}
      borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      axisTop={null}
      axisRight={null}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      animate
      motionStiffness={90}
      motionDamping={15}
    />
  )

  if (error) return <Text type="danger">Opp&apos;s their is a error</Text>
  if (loading) return <Spinner />

  if (data) {
    const graphData = []
    for (let index = 0; index < data.attendanceReport.length; index += 1) {
      graphData.push({
        date: data.attendanceReport[index].date,
        attendanceHours: data.attendanceReport[index].hours,
        timesheetHours: 0,
      })
    }

    for (let index = 0; index < data.timesheetReport.length; index += 1) {
      const existingRecord = graphData.find(x => x.date === data.timesheetReport[index].date)
      if (existingRecord) {
        existingRecord.timesheetHours = data.timesheetReport[index].hours
      } else {
        graphData.push({
          date: data.timesheetReport[index].date,
          attendanceHours: 0,
          timesheetHours: data.timesheetReport[index].hours,
        })
      }
    }

    console.log(data)
    console.log(graphData)
    return (
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 10,
          padding: '3px 10px',
        }}
      >
        <div style={{ height: 120 }}>{generateBarChart(graphData)} </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '8px',
          }}
        >
          <RangePicker
            style={{
              width: 250,
            }}
            defaultValue={[
              Moment(graphStartDate, 'YYYY-MM-DD'),
              Moment(graphEndDate, 'YYYY-MM-DD'),
            ]}
            format="YYYY-MM-DD"
            onChange={onDateChange}
          />
        </div>
      </div>
    )
  }
  return <Spinner />
}

export default AttendenceGraph

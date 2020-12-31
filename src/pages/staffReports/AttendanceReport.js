import React, { useState, useEffect } from 'react'
import { DatePicker, Table } from 'antd'
import moment from 'moment'
import { useQuery } from 'react-apollo'
import { GET_ATTENDANCE } from './query'

const { RangePicker } = DatePicker

export default ({ therapist }) => {
  const [timeRange, setTimeRange] = useState([moment().startOf('week'), moment().endOf('week')])
  const [columns, setColumns] = useState([])
  const { data, error, loading } = useQuery(GET_ATTENDANCE, {
    variables: {
      start: moment(timeRange[0]).format('YYYY-MM-DD'),
      end: moment(timeRange[1]).format('YYYY-MM-DD'),
      therapist,
    },
  })

  const start = timeRange[0]
  const end = timeRange[1]

  const days = []
  let day = start

  while (day <= end) {
    days.push(day.toDate())
    day = day.clone().add(1, 'd')
  }

  useEffect(() => {
    const myColumns = []
    // eslint-disable-next-line array-callback-return
    days.map(dateStr => {
      myColumns.push({
        key: dateStr,
        title: moment(dateStr).format('DD MMMM'),
        width: '120px',
        render(obj) {
          return <div>{obj.hours} hour</div>
        },
      })
    })
    setColumns(myColumns)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange, data])

  if (error) {
    return <h4 style={{ color: 'red', marginTop: 30 }}>Opps their are something wrong</h4>
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: 15,
          marginTop: 30,
        }}
      >
        <RangePicker
          size="large"
          value={timeRange}
          onChange={value => setTimeRange(value)}
          allowClear={false}
        />
      </div>
      <Table
        style={{ width: '100%' }}
        loading={loading}
        dataSource={data?.attendanceReport}
        columns={columns}
        scroll={{
          x: 'max-content',
        }}
      />
    </div>
  )
}

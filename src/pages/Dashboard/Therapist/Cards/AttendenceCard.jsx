import React from 'react'
import { Typography, Empty } from 'antd'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import moment from 'moment'
import { useSelector } from 'react-redux'
import Spinner from '../../Spinner'

const { Text } = Typography

const ATTENDENCE_QUERY = gql`
  query($therapistId: ID!, $startDate: Date!, $endDate: Date!) {
    attendanceReport(therapist: $therapistId, dateGte: $startDate, dateLte: $endDate, last: 5) {
      date
      hours
    }
  }
`

const SingleRecord = ({ date, hours }) => (
  <a
    className="hover_me_item"
    href="#/viewTask"
    style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: '5px 10px',
    }}
  >
    <div style={{ flex: 3 }}>
      <span style={{ fontWeight: 'bold', color: '#333' }}>{date}</span>
    </div>
    <span style={{ flex: 1, color: '#222', textAlign: 'right' }}>
      <span style={{ fontWeight: 'bold', color: '#333' }}>{hours}</span>
    </span>
  </a>
)

const AttendenceCard = () => {
  const therapistId = useSelector(state => state.user.staffId)
  const startDate = moment()
    .subtract(7, 'days')
    .format('YYYY-MM-DD')
  const endDate = moment().format('YYYY-MM-DD')

  const { loading, data, error } = useQuery(ATTENDENCE_QUERY, {
    variables: {
      therapistId,
      startDate,
      endDate,
    },
  })

  return (
    <div>
      {error && <Text type="danger">Opp&apos;s their is a error</Text>}
      {loading && <Spinner />}
      {data && data.attendanceReport && data.attendanceReport.length === 0 && <Empty />}
      {data &&
        data.attendanceReport.map(node => (
          <div key={node.date} style={{ borderBottom: '1px solid #ddd' }}>
            <SingleRecord date={node.date} hours={node.hours} />
          </div>
        ))}
      {data && data.attendanceReport && data.attendanceReport.length > 5 && (
        <div className="more-row">
          <a href="#/viewTask">
            <span style={{ fontWeight: 'bold', fontSize: 12 }}>More...</span>
          </a>
        </div>
      )}
    </div>
  )
}

export default AttendenceCard

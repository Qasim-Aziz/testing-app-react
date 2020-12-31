import React from 'react'
import moment from 'moment'
import { Typography } from 'antd'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import LearReqCard from './LearReqCard'
import TimeCard from './TimeCard'

const { Text } = Typography

const timeFormat = 'HH:mm a'

const ATTENDANCE = gql`
  query StaffAttendances($staffId: ID!, $date: Date!) {
    leaveRequest(staffId: $staffId, start_Lte: $date, end_Gte: $date) {
      edges {
        node {
          id
          start
          end
          description
          status # (0, 'Pending'),(1, 'Approved'),(2, 'Cancelled')
        }
      }
    }
    attendances(createdBy: $staffId, checkIn_Date: $date) {
      edges {
        node {
          id
          checkIn
          checkOut
          checkInLocation
        }
      }
    }
  }
`

export default ({ activeEm, date }) => {
  const { data, loading, error } = useQuery(ATTENDANCE, {
    variables: { staffId: activeEm, date },
  })

  if (loading) {
    return 'Loading...'
  }

  if (error) {
    return <Text>Opps their something wrong</Text>
  }

  return (
    <div>
      {data && (
        <>
          {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
          {data.leaveRequest.edges.map(({ node }) => {
            return <LearReqCard />
          })}

          {data.attendances.edges.map(({ node }) => (
            <TimeCard
              title={moment(node.checkIn).format('MMMM DD')}
              location={node.location && node.location.location}
              startTime={moment(node.checkIn).format(timeFormat)}
              endTime={moment(node.checkOut).format(timeFormat)}
              style={{ marginTop: 24 }}
            />
          ))}
        </>
      )}
    </div>
  )
}

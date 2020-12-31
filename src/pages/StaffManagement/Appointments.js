import React from 'react'
import moment from 'moment'
import { Typography } from 'antd'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import TimeCard from './TimeCard'

const { Text } = Typography

const timeFormat = 'HH:mm a'

const APPOINTMENT = gql`
  query appointments($date: Date!, $staffId: ID!) {
    appointments(start_Date: $date, therapist: $staffId) {
      edges {
        node {
          id
          start
          end
          student {
            id
            firstname
          }
          location {
            id
            location
          }
        }
      }
    }
  }
`

export default ({ date, activeEm }) => {
  const { data, loading, error } = useQuery(APPOINTMENT, {
    variables: {
      date,
      staffId: activeEm,
    },
  })

  if (loading) {
    return 'Loading..'
  }

  if (error) {
    return <Text type="danger">Opps their is something wrong</Text>
  }

  return (
    <div>
      {data &&
        data.appointments.edges.map(({ node }) => (
          <TimeCard
            title={node.student.firstname}
            location={node.location.location}
            startTime={moment(node.start).format(timeFormat)}
            endTime={moment(node.end).format(timeFormat)}
            style={{ marginTop: 24 }}
          />
        ))}
    </div>
  )
}

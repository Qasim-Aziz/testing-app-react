import React from 'react'
import moment from 'moment'
import { Typography } from 'antd'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import TimeCard from './TimeCard'

const { Text } = Typography

const timeFormat = 'HH:mm a'

const TIME_SHEETS = gql`
  query timesheets($date: Date!, $staffId: ID!) {
    timesheets(start_Date: $date, staffId: $staffId) {
      edges {
        node {
          id
          title
          start
          end
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
  const { data, loading, error } = useQuery(TIME_SHEETS, {
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
        data.timesheets.edges.map(({ node }) => (
          <TimeCard
            style={{ marginTop: 21 }}
            title={node.title}
            location={node.location.location}
            startTime={moment(node.start).format(timeFormat)}
            endTime={moment(node.end).format(timeFormat)}
          />
        ))}
    </div>
  )
}

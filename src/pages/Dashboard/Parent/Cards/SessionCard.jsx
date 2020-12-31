import React, { useState } from 'react'
import { Typography, Empty } from 'antd'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import moment from 'moment'
import Spinner from '../../Spinner'

const { Text } = Typography

const SESSIONS = gql`
  query parentDashboard($studentId: ID!, $date: Date!) {
    getDateSessions(student: $studentId, date: $date) {
      id
      sessionName {
        id
        name
      }
      duration
      sessionHost {
        edges {
          node {
            memberName
            relationship {
              name
            }
          }
        }
      }
    }
  }
`

const SingleRecord = ({ title, duration, hostName }) => (
  <a
    href="#/sessionDetails"
    className="hover_me_item"
    style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: '5px 10px',
    }}
  >
    <div style={{ flex: 3 }}>
      <span style={{ fontWeight: 'bold', color: '#333' }}>{hostName ?? 'N/A'}</span>
      <span style={{ color: '#888' }}> - {title}</span>
    </div>
    <span style={{ flex: 1.5, color: '#222', textAlign: 'right' }}>{duration ?? 'N/A'}</span>
  </a>
)

const SessionCard = ({ style }) => {
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'))
  const studentId = localStorage.getItem('studentId')

  const { data, loading, error } = useQuery(SESSIONS, {
    fetchPolicy: 'no-cache',
    variables: {
      studentId,
      date,
    },
    errorPolicy: 'all',
    onError(err) {
      console.log(err);
    },
  })

  const host =
    data && data.getDateSessions.sessionHost ? data.getDateSessions.sessionHost.edges[0].node : null
  return (
    <div>
      {error && <Text type="danger">Opp&apos;s their is a error</Text>}
      {loading && <Spinner />}
      {data && data.getDateSessions.length === 0 && <Empty />}
      {data &&
        data.getDateSessions.map((i, index) => {
          const { length } = data.getDateSessions
          let hostName = null
          if (i.sessionHost && i.sessionHost.edges[0] && i.sessionHost.edges[0].node)
            hostName = i.sessionHost.edges[0].node.memberName

          return (
            <div
              key={i.id}
              style={{ borderBottom: index === length - 1 ? 'none' : '1px solid #ddd' }}
            >
              <SingleRecord title={i.sessionName.name} duration={i.duration} hostName={hostName} />
            </div>
          )
        })}
    </div>
  )
}

export default SessionCard

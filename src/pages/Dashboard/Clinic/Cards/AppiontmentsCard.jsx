import React from 'react'
import { Typography, Empty, Badge, Spin } from 'antd'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import moment from 'moment'
import Spinner from '../../Spinner'

const { Text } = Typography

const APPIONTMENTS = gql`
  query {
    upcoming_appointment: appointments {
      edges {
        node {
          id
          start
          end
          title
          therapist {
            name
          }
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

const SingleRecord = ({ title, studentName, startDate, endDate }) => {
  return (
    <a className="hover_me_item single-row" href="#/appointmentData">
      <div style={{ flex: 3 }}>
        <span style={{ fontWeight: 'bold', color: '#333' }}>{title}</span>
        <span style={{ color: '#888' }}> - {studentName}</span>
      </div>
      <span style={{ flex: 1.5, color: '#222', textAlign: 'right' }}>
        {moment(startDate).format('YYYY-MM-DD')} - {moment(endDate).format('YYYY-MM-DD')}
      </span>
    </a>
  )
}

const AppiontmentsCard = ({ style, status }) => {
  const { loading, data, error } = useQuery(APPIONTMENTS, {fetchPolicy: 'network-only'})

  const filtered =
    data &&
    data.upcoming_appointment.edges.filter(({ node }) => {
      return moment(node.start).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') ? node : null
    })

  return (
    <div>
      {error && <Text type="danger">Opp&apos;s their is a error</Text>}
      {loading && <Spinner />}
      {filtered && filtered.length === 0 && <Empty />}
      {filtered &&
        filtered.map(({ node }, index) => {
          const { length } = data.upcoming_appointment.edges
          return index < 5 ? (
            <div
              key={node.id}
              style={{ borderBottom: index === length - 1 ? 'none' : '1px solid #ddd' }}
            >
              <SingleRecord
                title={node.title}
                studentName={node.student?.firstname}
                startDate={node.start}
                endDate={node.end}
              />
            </div>
          ) : null
        })}
      {filtered && filtered.length > 5 && (
        <div className="more-row">
          <a href="#/appointmentData">
            <span style={{ fontWeight: 'bold', fontSize: 12 }}>More...</span>
          </a>
        </div>
      )}
    </div>
  )
}

export default AppiontmentsCard

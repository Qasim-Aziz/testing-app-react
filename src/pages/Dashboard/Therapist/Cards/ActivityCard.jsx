import { Empty, Typography } from 'antd'
import gql from 'graphql-tag'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-apollo'
import Spinner from '../../Spinner'

const { Text } = Typography

const GET_ACTIVITIES_QUERY = gql`
  query($user: ID) {
    getActivity(user: $user) {
      edges {
        node {
          id
          subject
          date
          length
          addNote
        }
      }
    }
  }
`

const SingleRecord = ({ title, date, note }) => {
  return (
    <a className="hover_me_item single-row" href="#/therapist/activitylog">
      <div style={{ flex: 3 }}>
        <span style={{ fontWeight: 'bold', color: '#333' }}>{title}</span>
        <span style={{ color: '#888' }}> - {note}</span>
      </div>
      <span style={{ flex: 1, color: '#222', textAlign: 'right' }}>{date}</span>
    </a>
  )
}

const ActivityCard = ({ status }) => {
  const [userId, setUserId] = useState('')
  const userRole = JSON.parse(localStorage.getItem('role'))

  console.log(userRole)

  useEffect(() => {
    if (userRole === 'therapist') {
      const id = JSON.parse(localStorage.getItem('userId'))
      setUserId(id)
    }
  }, [userRole])

  const { loading, data, error } = useQuery(GET_ACTIVITIES_QUERY, {
    variables: {
      user: userId,
    },
  })

  const [filtered, setFiltered] = useState([])

  useEffect(() => {
    if (data) {
      const activities =
        data.getActivity.edges.length > 0 &&
        data.getActivity.edges.map((i, index) => {
          return i
        })
      setFiltered(activities)
    }
  }, [data])

  return (
    <div>
      {error && <Text type="danger">Opp&apos;s their is a error</Text>}
      {loading && <Spinner />}
      {filtered && filtered.length === 0 && <Empty />}
      {filtered &&
        filtered.map(({ node }, index) => {
          return index < 5 ? (
            <div key={node.id} style={{ borderBottom: '1px solid #ddd' }}>
              <SingleRecord title={node.subject} date={node.date} note={node.addNote} />
            </div>
          ) : null
        })}
      {filtered && filtered.length > 5 && (
        <div className="more-row">
          <a href="#/therapist/activitylog">
            <span style={{ fontWeight: 'bold', fontSize: 12 }}>More...</span>
          </a>
        </div>
      )}
    </div>
  )
}

export default ActivityCard

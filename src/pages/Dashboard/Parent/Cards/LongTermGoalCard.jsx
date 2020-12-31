import React from 'react'
import { Typography, Empty, Badge } from 'antd'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import Spinner from '../../Spinner'

const { Text } = Typography

const QUERY = gql`
  query longTerm($studentId: ID!) {
    longTerm(student: $studentId, last: 5) {
      edges {
        node {
          id
          goalName
          dateEnd
          student {
            firstname
            lastname
          }
          goalStatus {
            status
          }
        }
      }
    }
  }
`

const SingleRecord = ({ title, status, endDate, studentName }) => {
  let statusClass = 'processing-badge'
  switch (status) {
    case 'Met':
      statusClass = 'success-badge'
      break
    case 'On Hold':
      statusClass = 'warning-badge'
      break
    case 'Discontinued':
      statusClass = 'danger-badge'
      break
    case 'In Progress':
    case 'In-maintainence':
      statusClass = 'processing-badge'
      break
    default:
      statusClass = 'processing-badge'
  }

  return (
    <a className="hover_me_item single-row" href="#/Goals">
      <div style={{ flex: 3 }}>
        <span style={{ fontWeight: 'bold', color: '#333' }}>{title}</span>
        <span style={{ color: '#888' }}> - {studentName}</span>
      </div>
      <span style={{ flex: 1.5, textAlign: 'right' }}>
        <Badge count={status} className={statusClass} />
        <span style={{ marginLeft: 5, color: '#222' }}>{endDate}</span>
      </span>
    </a>
  )
}

const LongTermGoalCard = ({ status }) => {
  const studentId = localStorage.getItem('studentId')
  const { loading, data, error } = useQuery(QUERY, {
    variables: {
      studentId,
    },
    errorPolicy: 'all',
    onError(err) {
      console.log(err);
    },
  })

  return (
    <div>
      {error && <Text type="danger">Opp&apos;s their is a error</Text>}
      {loading && <Spinner />}
      {data && data.longTerm && data.longTerm.edges.length === 0 && <Empty />}
      {data &&
        data.longTerm.edges.map(({ node }) => (
          <div key={node.id} style={{ borderBottom: '1px solid #ddd' }}>
            <SingleRecord
              title={node.goalName}
              status={node.goalStatus?.status}
              studentName={`${node.student.firstname} ${node.student.lastName ?? ''}`}
              endDate={node.dateEnd}
            />
          </div>
        ))}
    </div>
  )
}

export default LongTermGoalCard

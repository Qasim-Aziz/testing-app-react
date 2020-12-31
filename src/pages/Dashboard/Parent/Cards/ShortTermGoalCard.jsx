import React from 'react'
import { Typography, Empty, Badge } from 'antd'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import Spinner from '../../Spinner'

const { Text } = Typography

const QUERY = gql`
  {
    shortTerm(last: 5) {
      edges {
        node {
          id
          goalName
          dateEnd
          goalStatus {
            status
          }
        }
      }
    }
  }
`

const SingleRecord = ({ title, status, endDate }) => {
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
      </div>
      <span style={{ flex: 1.5, textAlign: 'right' }}>
        <Badge count={status} className={statusClass} />
        <span style={{ marginLeft: 5, color: '#222' }}>{endDate}</span>
      </span>
    </a>
  )
}

const ShortTermGoalCard = ({ status }) => {
  const { loading, data, error } = useQuery(QUERY)

  return (
    <div>
      {error && <Text type="danger">Opp&apos;s their is a error</Text>}
      {loading && <Spinner />}
      {data && data.shortTerm && data.shortTerm.edges.length === 0 && <Empty />}
      {data &&
        data.shortTerm.edges.map(({ node }) => (
          <div key={node.id} style={{ borderBottom: '1px solid #ddd' }}>
            <SingleRecord
              title={node.goalName}
              status={node.goalStatus?.status}
              endDate={node.dateEnd}
            />
          </div>
        ))}
    </div>
  )
}

export default ShortTermGoalCard

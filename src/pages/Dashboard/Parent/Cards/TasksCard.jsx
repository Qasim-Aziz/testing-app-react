import React from 'react'
import { Typography, Empty, Badge } from 'antd'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import Spinner from '../../Spinner'

const { Text } = Typography

const TASKS = gql`
  query {
    tasks: tasks {
      edges {
        node {
          id
          taskName
          status {
            taskStatus
          }
          students {
            edges {
              node {
                firstname
                lastname
              }
            }
          }
        }
      }
    }
  }
`

const SingleRecord = ({ title, status, students }) => {
  const studentNames = students
    .map(({ node }) => {
      return node.firstname
    })
    .join(', ')

  return (
    <a className="hover_me_item single-row" href="#/viewTask">
      <div style={{ flex: 3 }}>
        <span style={{ fontWeight: 'bold', color: '#333' }}>{title}</span>
        <span style={{ color: '#888' }}> - {studentNames}</span>
      </div>
      <span style={{ flex: 1, color: '#222', textAlign: 'right' }}>
        <Badge count={status} className={status === 'Open' ? 'success-badge' : 'danger-badge'} />
      </span>
    </a>
  )
}

const TasksCard = ({ status }) => {
  const { loading, data, error } = useQuery(TASKS)

  return (
    <div>
      {error && <Text type="danger">Opp&apos;s their is a error</Text>}
      {loading && <Spinner />}
      {data && data.length === 0 && <Empty />}
      {data &&
        data.tasks.edges.map(({ node }, index) => {
          return index < 5 ? (
            <div key={node.id} style={{ borderBottom: '1px solid #ddd' }}>
              <SingleRecord
                title={node.taskName}
                status={node.status?.taskStatus}
                students={node.students.edges}
              />
            </div>
          ) : null
        })}
    </div>
  )
}

export default TasksCard

import React from 'react'
import { Typography, Empty } from 'antd'
import gql from 'graphql-tag'
import { useSelector } from 'react-redux'
import { useQuery } from 'react-apollo'
import moment from 'moment'
import Spinner from '../../Spinner'

const { Text } = Typography

const QUERY = gql`
  query($userId: ID!) {
    ChatMessage(user: $userId, last: 5) {
      edges {
        node {
          id
          thread {
            id
            firstUser {
              id
              firstName
              lastName
            }
            secondUser {
              id
              firstName
              lastName
            }
          }
          user {
            id
          }
          message
          timestamp
        }
      }
    }
  }
`

const SingleRecord = ({ node }) => {
  const { thread, user, message, timestamp } = node
  const title =
    user.id !== thread.firstUser.id
      ? `${thread.firstUser.firstName} ${thread.firstUser.lastName ?? ''}`
      : `${thread.secondUser.firstName} ${thread.secondUser.lastName ?? ''}`

  return (
    <a className="hover_me_item single-row" href="#/chat">
      <div style={{ flex: 3 }}>
        <span style={{ fontWeight: 'bold', color: '#333' }}>{title}</span>
        <span style={{ color: '#888' }}> - {message}</span>
      </div>
      <span style={{ flex: 1.5, textAlign: 'right' }}>
        <span style={{ marginLeft: 5, color: '#222' }}>
          {moment(timestamp).format('YYYY-MM-DD')}
        </span>
      </span>
    </a>
  )
}

const ChatMessageCard = () => {
  const userId = useSelector(state => state.user.id)

  const { loading, data, error } = useQuery(QUERY, {
    variables: {
      userId,
    },
  })

  return (
    <div>
      {error && <Text type="danger">Opp&apos;s their is a error</Text>}
      {loading && <Spinner />}
      {data && data.ChatMessage && data.ChatMessage.edges.length === 0 && <Empty />}
      {data &&
        data.ChatMessage.edges.map(({ node }) => (
          <div key={node.id} style={{ borderBottom: '1px solid #ddd' }}>
            <SingleRecord node={node} />
          </div>
        ))}
    </div>
  )
}

export default ChatMessageCard

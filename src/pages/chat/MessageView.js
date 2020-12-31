/* eslint-disable no-shadow */
import React, { useRef, useState, useEffect } from 'react'
import { Typography } from 'antd'
import { useQuery } from 'react-apollo'
import Websocket from 'react-websocket'
import Scrollbars from 'react-custom-scrollbars'
import { useSelector } from 'react-redux'
import moment from 'moment'
import client from 'apollo/config'
import { GET_MESSAGE } from './query'
import MessageForm from './MessageForm'
import ChatMess from './ChatMess'

const { Title } = Typography

export default ({ secondUser, style }) => {
  const [newMessLoading, setNewMessLoading] = useState(false)
  const scrollbar = useRef(null)
  const socketRef = useRef(null)
  const userId = useSelector(state => state.user.id)

  const handleData = data => {
    data = JSON.parse(data)
    console.log('data', data.user_id)
    console.log(userId)
    if (data.user_id === userId) {
      setNewMessLoading(false)
    }

    const cacheMessages = client.readQuery({
      query: GET_MESSAGE,
      variables: {
        secondUser,
      },
    })

    const newChat = {
      node: {
        user: {
          id: data.user_id,
          __typename: 'UserType',
        },
        message: data.message,
        timestamp: moment().format(),
        __typename: 'ChatMessageType',
      },
      __typename: 'ChatMessageTypeEdge',
    }

    if (cacheMessages.userthread) {
      client.writeQuery({
        query: GET_MESSAGE,
        variables: {
          secondUser,
        },
        data: {
          userthread: {
            firstUser: cacheMessages.userthread?.firstUser || userId,
            secondUser: cacheMessages.userthread?.secondUser || secondUser,
            chatmessageSet: {
              edges: [...cacheMessages.userthread.chatmessageSet.edges, newChat],
              __typename: 'ChatMessageTypeConnection',
            },
            __typename: 'ThreadType',
          },
        },
      })
    } else {
      refetch()
    }
  }

  const { data, error, loading, refetch } = useQuery(GET_MESSAGE, {
    variables: {
      secondUser,
    },
  })

  useEffect(() => {
    if (data && scrollbar.current) {
      // eslint-disable-next-line no-unused-expressions
      scrollbar.current.scrollToBottom()
      console.log(scrollbar.current)
    }
  }, [data, scrollbar])

  return (
    <div style={{ ...style }}>
      {loading && (
        <Title style={{ textAlign: 'center', marginBottom: 150, fontSize: 20 }}>Loading...</Title>
      )}
      {!loading && error && <pre>{JSON.stingify(error, null, 2)}</pre>}
      <Scrollbars style={{ height: 'calc(100% - 75px)' }} autoHide ref={scrollbar}>
        <div style={{ marginRight: 25 }}>
          {!loading &&
            data?.userthread?.chatmessageSet.edges.map(({ node }) => {
              return (
                <div key={node.timestamp}>
                  <ChatMess
                    message={node.message}
                    time={moment(node.timestamp).format('HH:mm')}
                    me={node.user.id === userId}
                  />
                </div>
              )
            })}
        </div>
      </Scrollbars>
      <Websocket
        url={`wss://application.cogniable.us/ws/chat/${userId}/${secondUser}`}
        onMessage={handleData}
        ref={socketRef}
      />
      <MessageForm
        socket={socketRef.current}
        loading={newMessLoading}
        setLoading={setNewMessLoading}
        style={{ position: 'absolute', bottom: 0 }}
      />
    </div>
  )
}

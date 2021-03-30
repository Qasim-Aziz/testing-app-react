/* eslint-disable no-shadow */
import React, { useRef, useState, useEffect } from 'react'
import { Typography, Avatar } from 'antd'
import { useQuery } from 'react-apollo'
import Websocket from 'react-websocket'
import Scrollbars from 'react-custom-scrollbars'
import { useSelector } from 'react-redux'
import moment from 'moment'
import client from 'apollo/config'
import LoadingComponent from 'components/LoadingComponent'
import { COLORS } from 'assets/styles/globalStyles'
import { GET_MESSAGE } from './query'
import MessageForm from './MessageForm'
import ChatMess from './ChatMess'

const { Title } = Typography

export default ({ secondUser, style, selectedPeopleDetails }) => {
  const [newMessLoading, setNewMessLoading] = useState(false)
  const scrollbar = useRef(null)
  const socketRef = useRef(null)
  const userId = useSelector(state => state.user.id)

  const handleData = data => {
    data = JSON.parse(data)
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
    }
  }, [data, scrollbar])

  return (
    <div style={{ ...style, border: '1px solid #e8e8e8' }}>
      <div
        style={{
          width: '100%',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          padding: '10px 16px',
          backgroundColor: COLORS.grayFill,
        }}
      >
        <Avatar
          src={
            selectedPeopleDetails.profileImg
              ? selectedPeopleDetails.profileImg
              : 'https://www.thewodge.com/wp-content/uploads/2019/11/avatar-icon.png'
          }
          style={{
            margin: 'auto 0',
            width: '41px',
            height: '41px',
            border: '1px solid #f6f7fb',
            marginRight: '15px',
            marginBottom: `${selectedPeopleDetails.profileImg ? '10px' : 0}`,
          }}
        />
        <div style={{ fontSize: 16 }}>{selectedPeopleDetails?.name}</div>
      </div>

      <div style={{ height: 'calc(100% - 120px)' }}>
        {loading ? (
          <LoadingComponent />
        ) : (
          <Scrollbars style={{ height: 'calc(100% - 0px)' }} autoHide ref={scrollbar}>
            <div style={{ padding: '0 36px' }}>
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
        )}
      </div>
      {!loading && error && <pre>{JSON.stingify(error, null, 2)}</pre>}

      <Websocket
        url={`wss://application.cogniable.us/ws/chat/${userId}/${secondUser}`}
        onMessage={handleData}
        ref={socketRef}
      />
      <MessageForm
        socket={socketRef.current}
        loading={newMessLoading}
        setLoading={setNewMessLoading}
      />
    </div>
  )
}

/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-indent-props */
import React, { useEffect, useState } from 'react'
import { Typography, Card, Button, Drawer } from 'antd'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import taskCardHeroImg from './images/taskCardHero.jpg'
import SessionInstructionDrawer from './SessionInstructionDrawer'

const GET_STATUS = gql`
  query getChildSession($sessionId: ID!) {
    getChildSession(sessions: $sessionId) {
      edges {
        node {
          id
          status
        }
      }
    }
  }
`

const { Title, Text } = Typography

const TaskCard = ({ style, id, sessionName, duration, hostList, session }) => {
    const dispatch = useDispatch()
    const [visible, setVisible] = useState(false)

    const { data, error } = useQuery(GET_STATUS, {
        variables: {
            sessionId: id,
        },
    })

    useEffect(() => {
        if (data) {
            console.log(data)
        }
    }, [data])

    const showDrawer = () => {
        setVisible(true)
    }

    const onClose = () => {
        setVisible(false)
    }

    const startDataRecording = () => {
        dispatch({
            type: 'sessionrecording/SET_STATE',
            payload: {
                SessionId: id,
                SessionDate: moment().format('YYYY-MM-DD')
            },
        })
        setVisible(true)
    }

    return (
        <div
            style={{
                background: '#FFFFFF',
                border: '1px solid #E4E9F0',
                boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
                borderRadius: 10,
                width: '340px',
                marginRight: '20px',
                padding: '12px 12px',
                alignItems: 'center',
                display: 'inline-block',
                marginTop: '20px'
            }}
        >

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Title style={{ fontSize: 20, display: 'inline', margin: 0 }}>
                    {sessionName} Session
          </Title>
                <Text style={{ fontWeight: 600 }}>
                    {data && data.getChildSession.edges.length > 0
                        ? data.getChildSession.edges[0].node.status
                        : 'PENDING'}
                </Text>
            </div>




            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: 10,
                }}
            >
                <Text style={{ fontSize: 16, color: '#000', marginTop: 7 }}>{duration ? duration : 'Duration not define'}</Text>
                <Button
                    type="primary"
                    style={{
                        marginLeft: 'auto',
                        color: '#fff',
                        width: 140,
                        background: '#0B35B3',
                        height: 40,
                        fontSize: 14,
                        lineHeight: '22px',
                    }}
                    onClick={startDataRecording}
                >
                    Start Session
          </Button>
            </div>
            <Drawer width={500} placement="right" title="Session Preview" closable={true} onClose={onClose} visible={visible}>
                <SessionInstructionDrawer session={session} />
            </Drawer>
        </div>
    )
}

export default TaskCard

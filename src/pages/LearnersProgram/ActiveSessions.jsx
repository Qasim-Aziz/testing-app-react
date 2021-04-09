import React, { useState, useEffect } from 'react'
import { Button, Table, Drawer } from 'antd'
import { useQuery } from '@apollo/react-hooks'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import {getSessionName} from 'utilities'
import SessionInstructionDrawer from 'pages/parent/ParentDashboard/SessionInstructionDrawer'
import { GET_TODAYS_SESSION } from './SessionsTabsQuery'

const ActiveSessions = ({ studentId }) => {
  const { data: allSessionData, loading: isSessionLoading, error: sessionError } = useQuery(
    GET_TODAYS_SESSION,
    {
      variables: {
        studentId,
      },
    },
  )

  const dispatch = useDispatch()
  const [sessionData, setSessionData] = useState()
  const [selectedSession, setSelectedSession] = useState()
  const [isDrawerVisible, setDrawerVisible] = useState()

  useEffect(() => {
    if (allSessionData) {
      let data = allSessionData.GetStudentSession.edges.map(({ node }) => node)
      data = data.filter(x => x.targets.edges.length > 0)
      setSessionData(data)
    }
  }, [allSessionData])

  const sessionColumns = [
    {
      title: 'Session Name',
      render: obj =>  getSessionName(obj),
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      render: text => text ?? 'Not defined',
    },
    {
      title: 'Total Targets',
      dataIndex: 'targets.edges.length',
    },
    {
      title: 'Status',
      dataIndex: '',
      render: (text, record) =>
        record.childsessionSet.edges.length > 0
          ? record.childsessionSet.edges[0].node.status
          : 'PENDING',
    },
    {
      title: 'Start',
      dataIndex: '',
      align: 'center',
      render: (text, record) => (
        <Button type="primary" size="small" onClick={() => startSession(record)}>
          Start Session
        </Button>
      ),
    },
  ]

  const startSession = session => {
    setSelectedSession(session)
    dispatch({
      type: 'sessionrecording/SET_STATE',
      payload: {
        SessionId: session.id,
        SessionDate: moment().format('YYYY-MM-DD'),
      },
    })
    setDrawerVisible(true)
  }

  return (
    <>
      <Table
        loading={isSessionLoading}
        columns={sessionColumns}
        dataSource={sessionData}
        rowKey="id"
        size="small"
        bordered
        pagination={false}
      />
      <Drawer
        width={500}
        placement="right"
        title="Session Preview"
        closable
        onClose={() => setDrawerVisible(false)}
        visible={isDrawerVisible}
      >
        <SessionInstructionDrawer session={selectedSession} />
      </Drawer>
    </>
  )
}

export default ActiveSessions

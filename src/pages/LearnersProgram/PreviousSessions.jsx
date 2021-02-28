import React, { useState, useEffect } from 'react'
import { Button, Table, Drawer, Form, DatePicker } from 'antd'
import { useQuery } from '@apollo/react-hooks'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import SessionInstructionDrawer from 'pages/parent/ParentDashboard/SessionInstructionDrawer'
import { GET_SESSION_BY_DATE } from './SessionsTabsQuery'

const PreviousSessions = ({ studentId }) => {
  const dispatch = useDispatch()
  const [selectedDate, setSelectedDate] = useState(moment().subtract(1, 'day'))
  const [sessionData, setSessionData] = useState()
  const [selectedSession, setSelectedSession] = useState()
  const [isDrawerVisible, setDrawerVisible] = useState()

  const { data: allSessionData, loading: isSessionLoading, error: sessionError } = useQuery(
    GET_SESSION_BY_DATE,
    {
      variables: {
        studentId,
        date: selectedDate.format('YYYY-MM-DD'),
      },
    },
  )

  useEffect(() => {
    if (allSessionData) {
      const data = allSessionData.getDateSessions
      // data = data.filter(x => x.targets.edges.length > 0)
      setSessionData(data)
    }
  }, [allSessionData])

  const sessionColumns = [
    {
      title: 'Session Name',
      dataIndex: 'sessionName.name',
      render: text => `${text} Session`,
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
          See Session
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
        SessionDate: selectedDate.format('YYYY-MM-DD'),
      },
    })
    setDrawerVisible(true)
  }

  const titleComponent = () => (
    <Form layout="inline">
      <Form.Item label="Select Date">
        <DatePicker
          value={selectedDate}
          onChange={setSelectedDate}
          placeholder="Select Date"
          style={{ width: '180px' }}
          disabledDate={current => current && current > moment().startOf('day')}
        />
      </Form.Item>
    </Form>
  )

  return (
    <Form>
      <Table
        loading={isSessionLoading}
        columns={sessionColumns}
        dataSource={sessionData}
        rowKey="id"
        size="small"
        bordered
        pagination={false}
        title={titleComponent}
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
    </Form>
  )
}

export default PreviousSessions

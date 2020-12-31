import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Row, Col, Card, Button, Tooltip } from 'antd'

import StatusDropDown from '../StatusDropDown'
import TasksCard from './Cards/TasksCard'
import AppiontmentsCard from './Cards/AppiontmentsCard'
import PerformenceGraph from './Cards/PerformenceGraph'
import SessionCard from './Cards/SessionCard'
import LongTermGoalCard from './Cards/LongTermGoalCard'
import ShortTermGoalCard from './Cards/ShortTermGoalCard'
import DailyVitalCard from './Cards/DailyVitalCard'
import ChatMessageCard from './Cards/ChatMessageCard'

const DashboardTab = () => {
  const history = useHistory()
  const [selectedDailyVital, setSelectedDailyVital] = useState('Meal')

  const cardsList = [
    {
      title: 'Appointments',
      path: '/appointmentData',
      enableAdd: true,
      labelForAddButton: 'Add Appointment',
      component: <AppiontmentsCard />,
      color: 'red',
      style: { borderTop: '2px solid red' },
    },
    {
      title: 'Tasks',
      path: '/viewTask',
      enableAdd: true,
      labelForAddButton: 'Add Task',
      component: <TasksCard />,
      color: 'blue',
      style: { borderTop: '2px solid blue' },
    },
    {
      title: 'Graph',
      path: '#',
      color: 'green',
      enableAdd: false,
      style: { borderTop: '2px solid green' },
      component: <PerformenceGraph />,
    },
    {
      title: 'Chat Messages',
      path: '/chat',
      color: 'yellow',
      enableAdd: true,
      labelForAddButton: 'Add Message',
      style: { borderTop: '2px solid yellow' },
      component: <ChatMessageCard />,
    },
    {
      title: 'Long Term Goals',
      path: '/Goals',
      color: 'orange',
      enableAdd: true,
      labelForAddButton: 'Add Long Term Goal',
      style: { borderTop: '2px solid orange' },
      component: <LongTermGoalCard />,
    },
    {
      title: 'Short Term Goals',
      path: '/Goals',
      color: 'purple',
      enableAdd: true,
      labelForAddButton: 'Add Short Term Goal',
      style: { borderTop: '2px solid purple' },
      component: <ShortTermGoalCard />,
    },
    {
      title: 'Sessions',
      path: '/sessionDetails',
      color: 'brown',
      enableAdd: false,
      style: { flex: 1, marginRight: 5, borderTop: '2px solid brown' },
      component: <SessionCard />,
    },
    {
      title: 'Daily Vitals',
      path: '/therapistStudentDailyVitals',
      color: 'black',
      enableAdd: true,
      labelForAddButton: 'Add Daily Vital',
      style: { flex: 1, marginLeft: 5, borderTop: '2px solid black' },
      component: <DailyVitalCard type={selectedDailyVital.toLowerCase()} />,
      dropDown: (
        <StatusDropDown
          titleText="Type"
          defaultValue="Meal"
          statuses={['Meal', 'Mand', 'Medical', 'Toilet', 'ABC', 'Behaviour']}
          onStatusChange={setSelectedDailyVital}
        />
      ),
    },
  ]

  return (
    <Row>
      {cardsList.map(cardItem => (
        <Col key={cardItem.title} lg={12} md={24} className="card-column">
          <Card
            extra={cardItem.dropDown ?? null}
            className="shadowbox edit_hover_class"
            title={cardItem.title}
            size="small"
            bodyStyle={{
              minHeight: 170,
              maxHeight: 170,
              overflowX: 'scroll',
              padding: 0,
            }}
            style={cardItem.style}
            bordered={false}
          >
            {cardItem.component}
            {cardItem.enableAdd && (
              <div className="card-hover-button">
                <Tooltip placement="top" title={cardItem.labelForAddButton}>
                  <Button
                    shape="circle"
                    size="large"
                    onClick={() => history.push(cardItem.path)}
                    style={{ backgroundColor: cardItem.color }}
                  >
                    +
                  </Button>
                </Tooltip>
              </div>
            )}
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default DashboardTab

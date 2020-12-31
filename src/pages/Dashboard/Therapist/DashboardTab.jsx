import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Row, Col, Card, Button, Empty, Tooltip } from 'antd'

import StatusDropDown from '../StatusDropDown'
import AttendenceGraph from './Cards/AttendenceGraph'
import TasksCard from './Cards/TasksCard'
import AppiontmentsCard from './Cards/AppiontmentsCard'
import TimesheetCard from './Cards/TimesheetCard'
import InvoicesCard from './Cards/InvoicesCard'
import ActivityCard from './Cards/ActivityCard'
import AttendenceCard from './Cards/AttendenceCard'
import ChatMessageCard from './Cards/ChatMessageCard'

const DashboardTab = () => {
  const history = useHistory()

  const [taskStatus, setTaskStatus] = useState('All')
  const [appointmentStatus, setAppointmentStatus] = useState('All')
  const [invoiceStatus, setInvoiceStatus] = useState('All')

  const cardsList = [
    {
      title: 'Appointments',
      path: '/appointmentData',
      enableAdd: true,
      labelForAddButton: 'Add Appointment',
      component: <AppiontmentsCard />,
      color: 'red',
      style: { borderTop: '2px solid red' },
      dropDown: (
        <StatusDropDown
          statuses={['All', 'Approved', 'Unapproved']}
          onStatusChange={setAppointmentStatus}
        />
      ),
    },
    {
      title: 'Graph',
      path: '#',
      color: 'green',
      enableAdd: false,
      style: { borderTop: '2px solid green' },
      component: <AttendenceGraph />,
    },
    {
      title: 'Tasks',
      path: '/viewTask',
      enableAdd: true,
      labelForAddButton: 'Add Task',
      component: <TasksCard status={taskStatus} />,
      color: 'blue',
      style: { borderTop: '2px solid blue' },
      dropDown: (
        <StatusDropDown statuses={['All', 'Open', 'Closed']} onStatusChange={setTaskStatus} />
      ),
    },
    {
      title: 'Timesheets',
      path: '/workdone',
      color: 'yellow',
      enableAdd: true,
      labelForAddButton: 'Add Timesheet',
      style: { borderTop: '2px solid yellow' },
      component: <TimesheetCard />,
    },
    {
      title: 'Attendance',
      path: '#',
      color: 'orange',
      enableAdd: true,
      labelForAddButton: 'Add Attendance',
      style: { borderTop: '2px solid orange' },
      component: <AttendenceCard />,
    },
    {
      title: 'Chat Messages',
      path: '#/chat',
      color: 'brown',
      enableAdd: true,
      labelForAddButton: 'New Message',
      style: { borderTop: '2px solid brown' },
      component: <ChatMessageCard />,
    },
    {
      title: 'Invoices',
      path: '/invoices',
      color: 'purple',
      enableAdd: true,
      labelForAddButton: 'Add Invoice',
      style: { borderTop: '2px solid purple' },
      component: <InvoicesCard />,
      dropDown: (
        <StatusDropDown
          statuses={['All', 'Pending', 'Overdue', 'Paid', 'Canceled']}
          onStatusChange={setInvoiceStatus}
        />
      ),
    },
    {
      title: 'Activity & Call log',
      path: '/activitylog',
      color: 'black',
      enableAdd: true,
      labelForAddButton: 'Add Activity & Call log',
      style: { borderTop: '2px solid black' },
      component: <ActivityCard />,
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

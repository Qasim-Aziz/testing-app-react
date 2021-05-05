import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Row, Col, Card, Button, Empty, Tooltip } from 'antd'

import StatusDropDown from '../StatusDropDown'
import TargetStatusCard from './Cards/TargetStatusCard'
import TasksCard from './Cards/TasksCard'
import AppiontmentsCard from './Cards/AppiontmentsCard'
import InvoicesCard from './Cards/InvoicesCard'
import ActivityCard from './Cards/ActivityCard'

const DashboardTab = () => {
  const history = useHistory()

  const [taskStatus, setTaskStatus] = useState('Open')
  const [appointmentStatus, setAppointmentStatus] = useState('All')
  const [invoiceStatus, setInvoiceStatus] = useState('All')

  const topCardList = [
    {
      title: 'Appointments',
      path: '/appointmentData',
      enableAdd: true,
      labelForAddButton: 'Add Appointment',
      color: 'brown',
      style: { marginBottom: 20, borderTop: '2px solid brown' },
      component: <AppiontmentsCard status={appointmentStatus} />,
      dropDown: (
        <StatusDropDown
          statuses={['All', 'Approved', 'Unapproved']}
          onStatusChange={setAppointmentStatus}
        />
      ),
    },
    {
      title: 'Tasks',
      path: '/viewTask',
      enableAdd: true,
      labelForAddButton: 'Add Task',
      color: 'yellow',
      style: { borderTop: '2px solid yellow' },
      component: <TasksCard status={taskStatus} />,
      dropDown: (
        <StatusDropDown statuses={['All', 'Open', 'Closed']} onStatusChange={setTaskStatus} />
      ),
    },
  ]

  const bottomCardList = [
    {
      title: 'Authorizations',
      enableAdd: true,
      labelForAddButton: 'Add Authorization',
      component: <Empty />,
      color: 'red',
      style: { borderTop: '2px solid red' },
    },
    {
      title: 'Activity & Call log',
      enableAdd: true,
      labelForAddButton: 'Add Activity & Call log',
      path: '/activitylog',
      component: <ActivityCard status={taskStatus} />,
      color: 'blue',
      style: { borderTop: '2px solid blue' },
    },
    {
      title: 'Claims',
      enableAdd: true,
      labelForAddButton: 'Add Claim',
      color: 'orange',
      style: { flex: 1, borderTop: '2px solid orange' },
      component: <Empty />,
    },
    {
      title: 'Invoices',
      path: '/invoices',
      color: 'purple',
      enableAdd: true,
      labelForAddButton: 'Add Invoice',
      style: { flex: 1, borderTop: '2px solid purple' },
      component: <InvoicesCard status={invoiceStatus} />,
      dropDown: (
        <StatusDropDown
          statuses={['All', 'Pending', 'Overdue', 'Paid', 'Canceled']}
          onStatusChange={setInvoiceStatus}
        />
      ),
    },
  ]

  return (
    <>
      <Row>
        <Col lg={12} md={24} className="card-column">
          <Card
            className="shadowbox edit_hover_class"
            title="Graph"
            size="small"
            bodyStyle={{ minHeight: 397, maxHeight: 397, overflowY: 'scroll', padding: 0 }}
            style={{ borderTop: '2px solid green' }}
            bordered={false}
          >
            <TargetStatusCard />
          </Card>
        </Col>
        <Col lg={12} md={24} className="card-column">
          {topCardList.map(cardItem => {
            return (
              <Card
                key={cardItem.title}
                className="shadowbox edit_hover_class"
                extra={cardItem.dropDown ?? null}
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
            )
          })}
        </Col>
      </Row>

      <Row>
        {bottomCardList.map(cardItem => {
          return (
            <Col lg={12} md={24} className="card-column" key={cardItem.title}>
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
          )
        })}
      </Row>
    </>
  )
}

export default DashboardTab

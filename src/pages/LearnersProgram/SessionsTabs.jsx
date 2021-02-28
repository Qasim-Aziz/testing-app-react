import React from 'react'
import { Tabs } from 'antd'
import ActiveSessions from './ActiveSessions'
import PreviousSessions from './PreviousSessions'
import './SessionsTabs.scss'

const { TabPane } = Tabs

const SessionsTabs = ({ studentId }) => (
  <Tabs type="card" className="sessionsTabs">
    <TabPane tab="Active Sessions" key="activeSessions">
      <ActiveSessions studentId={studentId} />
    </TabPane>
    <TabPane tab="Previous Sessions" key="previousSessions">
      <PreviousSessions studentId={studentId} />
    </TabPane>
  </Tabs>
)

export default SessionsTabs

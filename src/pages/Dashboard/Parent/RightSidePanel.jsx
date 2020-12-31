import React from 'react'
import { Tabs } from 'antd'

import DashboardTab from './DashboardTab'
import ProfileTab from './ProfileTab'

const { TabPane } = Tabs

const RightSidePanel = ({
  activeTabKey,
  onActiveTabChange,
  activeProfileTabKey,
  onActiveProfileTabChange,
}) => (
  <div style={{ width: '100%', backgroundColor: '#fff' }}>
    <Tabs defaultActiveKey={activeTabKey} activeKey={activeTabKey} onChange={onActiveTabChange}>
      <TabPane className="scrollClass shadowbox" tab="My Dashboard" key="1">
        <DashboardTab />
      </TabPane>
      {/* <TabPane tab="My Profile" style={{ minHeight: 400, backgroundColor: '#f4f4f4' }} key="2">
        <ProfileTab
          activeProfileTab={activeProfileTabKey}
          onProfileTabChange={onActiveProfileTabChange}
        />
      </TabPane> */}
    </Tabs>
  </div>
)

export default RightSidePanel

import React from 'react'
import { Tabs } from 'antd'

import DashboardTab from './DashboardTab'
import ProfileTab from './ProfileTab'
import { COLORS } from '../../../assets/styles/globalStyles'

const { TabPane } = Tabs

const RightSidePanel = ({
  activeTabKey,
  onActiveTabChange,
  activeProfileTabKey,
  onActiveProfileTabChange,
}) => (
  <div
    style={{ width: '100%', backgroundColor: COLORS.palleteLightBlue, height: '100%' }}
    className="RightSidePanel-nav"
  >
    <Tabs
      defaultActiveKey={activeTabKey}
      activeKey={activeTabKey}
      onChange={onActiveTabChange}
      style={{ color: COLORS.palleteDarkBlue }}
    >
      <TabPane className="scrollClass shadowbox" tab="My Dashboard" key="1">
        <DashboardTab />
      </TabPane>
      <TabPane
        tab="My Profile"
        style={{ minHeight: 400, backgroundColor: '#f4f4f4', color: COLORS.palleteDarkBlue }}
        key="2"
      >
        <ProfileTab
          activeProfileTab={activeProfileTabKey}
          onProfileTabChange={onActiveProfileTabChange}
        />
      </TabPane>
    </Tabs>
  </div>
)

export default RightSidePanel

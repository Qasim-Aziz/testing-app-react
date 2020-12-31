import React from 'react'
import { Tabs } from 'antd'

import ChangePassword from 'components/changePassword/form'
import ContactDetails from '../../staffProfile/ContactDetails'
import NotiSett from '../../staffProfile/NotiSett'

const { TabPane } = Tabs

const ProfileTab = ({ activeProfileTab, onProfileTabChange }) => {
  return (
    <div style={{ margin: '10px' }}>
      <div
        className="shadowbox"
        style={{
          padding: '10px',
          backgroundColor: '#fff',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        <Tabs
          defaultActiveKey={activeProfileTab}
          tabPosition="left"
          activeKey={activeProfileTab}
          onChange={onProfileTabChange}
        >
          <TabPane tab="Contact Details" key="1" style={{ padding: 20 }}>
            <ContactDetails />
          </TabPane>
          <TabPane tab="Email Notification" key="2" style={{ padding: 20 }}>
            <NotiSett />
          </TabPane>
          <TabPane tab="Change Password" key="4" style={{ padding: 20 }}>
            <ChangePassword />
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

export default ProfileTab

import React from 'react'
import { Tabs } from 'antd'

import ChangePassword from 'components/changePassword/form'
import ContactDetails from '../../staffProfile/ContactDetails'
import NotiSett from '../../staffProfile/NotiSett'
import MasteryCriteria from '../../staffProfile/MasteryCriteria'
import LocationSett from '../../staffProfile/LocationSett'
import TherapistShifting from '../../staffProfile/TherapistShifting'
import PeakAutomaticTab from '../PeakAutomaticTab'
import SessionSettingTab from '../SessionSettingTab'

const { TabPane } = Tabs

const ProfileTab = ({ activeProfileTab, onProfileTabChange }) => {
  const tabs = [
    {
      key: 'contact-details',
      title: 'Contact Details',
      component: <ContactDetails />,
    },
    {
      key: 'email-notification',
      title: 'Email Notification',
      component: <NotiSett />,
    },
    {
      key: 'change-password',
      title: 'Change Password',
      component: <ChangePassword />,
    },
    {
      key: 'peak-automatic',
      title: 'Peak Automatic',
      component: <PeakAutomaticTab />,
    },
    {
      key: 'session-setting',
      title: 'Session Settings',
      component: <SessionSettingTab />,
    },
    {
      key: 'master-criteria',
      title: 'Master Criteria',
      component: <MasteryCriteria />,
    },
    {
      key: 'location',
      title: 'Location',
      component: <LocationSett />,
    },
    {
      key: 'therapist-shifting',
      title: 'Theapist Shifting',
      component: <TherapistShifting />,
    },
  ]

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
          className="profileTabs"
        >
          {tabs.map(tab => (
            <TabPane tab={tab.title} key={tab.key} style={{ padding: 10 }}>
              {tab.component}
            </TabPane>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

export default ProfileTab

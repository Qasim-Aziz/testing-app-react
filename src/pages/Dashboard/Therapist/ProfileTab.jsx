import React from 'react'
import { Tabs } from 'antd'
import {
  SettingOutlined,
  EnvironmentOutlined,
  BulbOutlined,
  FieldTimeOutlined,
  RiseOutlined,
  ContactsOutlined,
  MailOutlined,
  KeyOutlined,
} from '@ant-design/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStethoscope } from '@fortawesome/free-solid-svg-icons'

import ChangePassword from 'components/changePassword/form'
import ContactDetails from '../../staffProfile/ContactDetails'
import AccountDetails from '../../staffProfile/AccountDetails'
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
      key: 'account-details',
      title: 'Account',
      component: <AccountDetails />,
      iconName: <SettingOutlined />,
    },
    {
      key: 'contact-details',
      title: 'Contact Details',
      component: <ContactDetails />,
      iconName: <ContactsOutlined />,
    },
    {
      key: 'email-notification',
      title: 'Email Notification',
      component: <NotiSett />,
      iconName: <MailOutlined />,
    },
    {
      key: 'change-password',
      title: 'Change Password',
      component: <ChangePassword />,
      iconName: <KeyOutlined />,
    },
    {
      key: 'peak-automatic',
      title: 'Peak Automatic',
      component: <PeakAutomaticTab />,
      iconName: <RiseOutlined />,
    },
    {
      key: 'session-setting',
      title: 'Session Settings',
      component: <SessionSettingTab />,
      iconName: <FieldTimeOutlined />,
    },
    {
      key: 'master-criteria',
      title: 'Master Criteria',
      component: <MasteryCriteria />,
      iconName: <BulbOutlined />,
    },
    {
      key: 'location',
      title: 'Location',
      component: <LocationSett />,
      iconName: <EnvironmentOutlined />,
    },
    {
      key: 'therapist-shifting',
      title: 'Theapist Shifting',
      component: <TherapistShifting />,
      iconName: <FontAwesomeIcon icon={faStethoscope} style={{ marginRight: '10px' }} />,
    },
  ]

  return (
    <div style={{ margin: '10px' }}>
      <div
        className="shadowbox"
        style={{
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
            <TabPane
              tab={
                <span className="ProfileTab-container">
                  <span className="ProfileTab-icon">{tab.iconName}</span>
                  <span className="ProfileTab-title">{tab.title}</span>
                </span>
              }
              key={tab.key}
              style={{ paddingLeft: '3em', paddingRight: '3em' }}
            >
              {tab.component}
            </TabPane>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

export default ProfileTab

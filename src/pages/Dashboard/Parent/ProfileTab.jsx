import React from 'react'
import { Tabs } from 'antd'
import {
  ContactsOutlined,
  MailOutlined,
  KeyOutlined,
  RiseOutlined,
  FieldTimeOutlined,
  ExperimentOutlined,
} from '@ant-design/icons'

import Assessment from 'pages/GeneralAssessment/ForProfile/index'
import ChangePassword from 'components/changePassword/form'
import ContactDetails from '../../staffProfile/ContactDetails'
import NotiSett from '../../staffProfile/NotiSett'
import PeakAutomaticTab from '../PeakAutomaticTab'
import SessionSettingTab from '../SessionSettingTab'

const { TabPane } = Tabs

const ProfileTab = ({ activeProfileTab, onProfileTabChange }) => {
  const tabs = [
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
      key: 'assessment',
      title: 'Assessment',
      component: <Assessment />,
      iconName: <ExperimentOutlined />,
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
          className="profileTabs"
          defaultActiveKey={activeProfileTab}
          tabPosition="left"
          activeKey={activeProfileTab}
          onChange={onProfileTabChange}
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

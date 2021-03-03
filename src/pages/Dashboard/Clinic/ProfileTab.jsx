import React from 'react'
import { Tabs } from 'antd'

import EmailNotiSett from 'pages/ClinicProfile/EmailNotiSett'
import ContactDetails from 'pages/ClinicProfile/ContactDetails'
import InvCurrency from 'pages/ClinicProfile/InvCurrency'
import ChangePassword from 'components/changePassword/form'
import MasterCriteria from 'pages/ClinicProfile/MasteryCriteria'
import LocationSett from 'pages/ClinicProfile/LocationSett'
import Assessment from 'pages/GeneralAssessment/ForProfile/index'
import DisabledCurriculum from 'pages/ClinicProfile/DisabledCurriculum'
import PeakAutomaticTab from '../PeakAutomaticTab'
import AssessmentsTab from '../../../components/AssessmentsProfileTab'
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
      component: <EmailNotiSett />,
    },
    {
      key: 'invoice-currency',
      title: 'Invoice Currency',
      component: <InvCurrency />,
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
      key: 'assessments',
      title: 'Assessments',
      component: <AssessmentsTab />,
    },
    {
      key: 'master-criteria',
      title: 'Master Criteria',
      component: <MasterCriteria />,
    },
    {
      key: 'location',
      title: 'Location',
      component: <LocationSett />,
    },
    {
      key: 'disabled-curriculum',
      title: 'Disabled Curriculum',
      component: <DisabledCurriculum />,
    },
    {
      key: 'assessment',
      title: 'Assessment',
      component: <Assessment />,
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
          className="profileTabs"
          defaultActiveKey={activeProfileTab}
          tabPosition="left"
          activeKey={activeProfileTab}
          onChange={onProfileTabChange}
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

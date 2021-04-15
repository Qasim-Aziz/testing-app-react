import React from 'react'
import { Tabs } from 'antd'
import {
  CompassOutlined,
  SettingOutlined,
  BulbOutlined,
  ExperimentOutlined,
  MailOutlined,
  RobotOutlined,
  FileOutlined,
  EnvironmentOutlined,
  KeyOutlined,
  RiseOutlined,
  FieldTimeOutlined,
} from '@ant-design/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVial, faStethoscope } from '@fortawesome/free-solid-svg-icons'

import EmailNotiSett from 'pages/ClinicProfile/EmailNotiSett'
import ContactDetails from 'pages/ClinicProfile/ContactDetails'
import InvCurrency from 'pages/ClinicProfile/InvoiceRelated'
import ChangePassword from 'components/changePassword/form'
import MasterCriteria from 'pages/ClinicProfile/MasteryCriteria'
import LocationSett from 'pages/ClinicProfile/LocationSett'
import Assessment from 'pages/GeneralAssessment/ForProfile/index'
import DisabledCurriculum from 'pages/ClinicProfile/DisabledCurriculum'
import TherapistShifting from 'pages/ClinicProfile/TherapistShifting'
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
      iconName: <SettingOutlined />,
    },
    {
      key: 'email-notification',
      title: 'Email Notification',
      component: <EmailNotiSett />,
      iconName: <MailOutlined />,
    },
    {
      key: 'invoice-currency',
      title: 'Invoice',
      component: <InvCurrency />,
      iconName: <FileOutlined />,
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
      key: 'assessments',
      title: 'Assessments',
      component: <AssessmentsTab />,
      iconName: <FontAwesomeIcon icon={faVial} style={{ marginRight: '10px' }} />,
    },
    {
      key: 'master-criteria',
      title: 'Master Criteria',
      component: <MasterCriteria />,
      iconName: <BulbOutlined />,
    },
    {
      key: 'location',
      title: 'Location',
      component: <LocationSett />,
      iconName: <EnvironmentOutlined />,
    },
    {
      key: 'disabled-curriculum',
      title: 'Disabled Curriculum',
      component: <DisabledCurriculum />,
      iconName: <RobotOutlined />,
    },
    {
      key: 'assessment',
      title: 'Record Assessment Score',
      component: <Assessment />,
      iconName: <ExperimentOutlined />,
    },
    {
      key: 'therapist-shifting',
      title: 'Theapist Shif Time',
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
              style={{ paddingLeft: '2.5em', paddingRight: '1.5em' }}
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

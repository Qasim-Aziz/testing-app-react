import React, { useState, useEffect } from 'react'
import { Layout, Typography, Row, Col, Tabs, notification, Switch } from 'antd'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'
import { useSelector } from 'react-redux'
import ChangePassword from 'components/changePassword/form'
import clinicPicture from './img/profile.jpg'
import NotiSett from './NotiSett'
import SupportTicketSett from './SupportTicketSett'
import MasterCriteria from './MasteryCriteria'
import LocationSett from './LocationSett'
import ContactDetails from './ContactDetails'
import './staffProfileTabs.scss'

const { TabPane } = Tabs
const { Title, Text } = Typography

const CLINIC_QUERY = gql`
  query {
    schooldetail: schoolDetail {
      id
      schoolName
      address
    }
  }
`

const USER_SETTINGS = gql`
  query UserSettings($id: ID!) {
    userSettings(user: $id) {
      edges {
        node {
          id
          language
          peakAutomaticBlocks
          user {
            id
            username
          }
        }
      }
    }
  }
`

const UPDATE_PEAK_AUTOMATIC = gql`
  mutation updatePeakAutomatic($userId: ID!, $peakAutomatic: Boolean) {
    changeUserSetting(input: { user: $userId, peakAutomaticBlocks: $peakAutomatic }) {
      details {
        id
        language
        peakAutomaticBlocks
        user {
          id
          username
        }
      }
    }
  }
`

// key is mandatory and mast me uniq
const settingOptionViewList = [
  {
    key: 1,
    title: 'Notificaiton',
    component: <NotiSett />,
  },
  {
    key: 2,
    title: 'Support Ticket',
    component: <SupportTicketSett />,
  },
  {
    key: 3,
    title: 'Personal Info',
    component: <ContactDetails />,
  },
  {
    key: 6,
    title: 'Change Password',
    component: <ChangePassword />,
  },
  {
    key: 4,
    title: 'Master Criteria',
    component: <MasterCriteria />,
  },
  {
    key: 5,
    title: 'Location',
    component: <LocationSett />,
  },
]

const ClinicInfoCard = ({ style }) => {
  const { data: clinicInfo, loading } = useQuery(CLINIC_QUERY)
  return (
    <div style={{ display: 'flex', ...style }}>
      <img src={clinicPicture} alt="clinic Name" className="profilePicture" />
      <div>
        <Title style={{ marginBottom: 8, fontSize: 22 }}>
          {clinicInfo?.schooldetail.schoolName}
          {loading && 'Loading...'}
        </Title>
        <Text style={{ fontSize: 16, color: '#000' }}>{clinicInfo?.schooldetail.address}</Text>
      </div>
    </div>
  )
}

export default () => {
  const [peakAutomatic, setPeakAutomatic] = useState(false)

  const reduxUser = useSelector(state => state.user)
  const {
    data: userSettingData,
    error: userSettingError,
    loading: isUserSettingLoading,
  } = useQuery(USER_SETTINGS, {
    variables: {
      id: reduxUser?.id,
    },
  })

  const [
    updatePeakAutomatic,
    {
      data: updatedUserSettingData,
      error: userSettingUpdateErrors,
      loading: isUserSettingUpdating,
    },
  ] = useMutation(UPDATE_PEAK_AUTOMATIC)

  useEffect(() => {
    if (userSettingData)
      setPeakAutomatic(userSettingData.userSettings.edges[0]?.node.peakAutomaticBlocks)
  }, [userSettingData])

  useEffect(() => {
    if (updatedUserSettingData) {
      notification.success({
        message: 'Peak Automatic Updated sucessfully',
      })
    }
    if (userSettingUpdateErrors) {
      notification.error({
        message: 'Peak Automatic Update failed',
      })
    }
  }, [updatedUserSettingData, userSettingUpdateErrors])

  const onChange = checked => {
    updatePeakAutomatic({
      variables: {
        userId: reduxUser?.id,
        peakAutomatic: checked,
      },
    })
  }

  return (
    <Layout className="staffProfile">
      <Row>
        <Col lg={18} md={16} sm={24}>
          <ClinicInfoCard />
        </Col>
        <Col lg={6} md={8} sm={24}>
          <span className="peakAutomaticCheckbox">
            {isUserSettingLoading ? (
              'Loading...'
            ) : (
              <span>
                Peak Automatic: <Switch checked={peakAutomatic} onChange={onChange} />
              </span>
            )}
          </span>
        </Col>
      </Row>

      <Tabs type="card" tabPosition="left" className="staffProfileTabs" activeKey="3">
        {settingOptionViewList.map(tab => (
          <TabPane tab={tab.title} key={tab.key}>
            {tab.component}
          </TabPane>
        ))}
      </Tabs>
    </Layout>
  )
}

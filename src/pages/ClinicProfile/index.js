/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { Layout, Dropdown, Button, Menu, Modal, Switch, notification, Tabs } from 'antd'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'
import { useSelector } from 'react-redux'
import { SettingOutlined } from '@ant-design/icons'
import ChangePassword from 'components/changePassword/form'
import EmailNotiSett from './EmailNotiSett'
import SupportTicketSett from './SupportTicketSett'
import ContactDetails from './ContactDetails'
import InvoiceInfo from './Invoices'
import MasterCriteria from './MasteryCriteria'
import LogoSett from './LogoSett'
import LocationSett from './LocationSett'
import InvCurrency from './InvoiceRelated'
import VideoTutorial from './VideoTutorial'
import DisabledCurriculum from './DisabledCurriculum'
import './clinicProfile.scss'

const { TabPane } = Tabs

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

const profileSettingMenus = [
  {
    key: 4,
    title: 'Logo',
    component: <LogoSett />,
  },
  {
    key: 5,
    title: 'Invoicing Currency',
    component: <InvCurrency />,
  },
  {
    key: 1,
    title: 'Email Notification',
    component: <EmailNotiSett />,
  },
  {
    key: 2,
    title: 'Change Password',
    component: <ChangePassword />,
  },
  {
    key: 3,
    title: 'Contact Details',
    component: <ContactDetails />,
  },
]

const profileSettingTabs = [
  {
    key: 6,
    title: 'Support Ticket',
    component: <SupportTicketSett />,
  },
  {
    key: 7,
    title: 'Invoice Information',
    component: <InvoiceInfo />,
  },
  {
    key: 8,
    title: 'Video Tutorial',
    component: <VideoTutorial />,
  },
  {
    key: 9,
    title: 'Master Criteria',
    component: <MasterCriteria />,
  },
  {
    key: 10,
    title: 'Location',
    component: <LocationSett />,
  },
  {
    key: 11,
    title: 'Disabled Curriculum',
    component: <DisabledCurriculum />,
  },
]

export default () => {
  const [isModelVisible, setIsModelVisible] = useState(false)
  const [modalComponent, setModalComponent] = useState()
  const [modelTitle, setModalTitle] = useState('')

  const [peakAutomatic, setPeakAutomatic] = useState(false)

  const reduxUser = useSelector(state => state.user)
  const { data: userDeata, error: userDataError, loading: isUserDataLoading } = useQuery(
    USER_SETTINGS,
    {
      variables: {
        id: reduxUser?.id,
      },
    },
  )

  const [
    updatePeakAutomatic,
    { data: updateUserData, error: updateUserDataError, loading: isUpdateUserDataLoading },
  ] = useMutation(UPDATE_PEAK_AUTOMATIC)

  useEffect(() => {
    console.log(userDeata)
    if (userDeata) setPeakAutomatic(userDeata.userSettings.edges[0]?.node.peakAutomaticBlocks)
  }, [userDeata])

  useEffect(() => {
    if (updateUserData) {
      notification.success({
        message: 'Peak Automatic Updated sucessfully',
      })
    }
    if (updateUserDataError) {
      notification.error({
        message: 'Peak Automatic Update failed',
      })
    }
  }, [updateUserData, updateUserDataError])

  const openProfileModelDialog = menu => {
    setIsModelVisible(true)
    setModalComponent(menu.component)
    setModalTitle(menu.title)
  }

  const profileSettingMenu = (
    <Menu>
      {profileSettingMenus.map(menu => (
        <Menu.Item key={menu.key}>
          <Button type="link" size="small" onClick={() => openProfileModelDialog(menu)}>
            {menu.title}
          </Button>
        </Menu.Item>
      ))}
    </Menu>
  )

  const onChangingPeakAutomaticCheckbox = checked => {
    console.log(`switch to ${checked}`)

    updatePeakAutomatic({
      variables: {
        userId: reduxUser?.id,
        peakAutomatic: checked,
      },
    })
  }

  if (userDataError) {
    return <h4 style={{ color: 'red', marginTop: 40 }}>Opps therir are something wrong</h4>
  }

  return (
    <Layout className="clinicProfile">
      <div style={{ textAlign: 'right' }}>
        <span className="peakAutomaticCheckbox">Peak Automatic: </span>
        <Switch checked={peakAutomatic} onChange={onChangingPeakAutomaticCheckbox} />

        <Dropdown className="profileSettingMenu" overlay={profileSettingMenu} trigger={['click']}>
          <Button type="link" size="large">
            Profile Settings <SettingOutlined />
          </Button>
        </Dropdown>
      </div>

      <Tabs type="card" tabPosition="left" className="clinicProfileTabs">
        {profileSettingTabs.map(tab => (
          <TabPane tab={tab.title} key={tab.key}>
            {tab.component}
          </TabPane>
        ))}
      </Tabs>

      <Modal
        title={modelTitle}
        visible={isModelVisible}
        mask
        maskClosable
        width="80%"
        onCancel={() => setIsModelVisible(false)}
        footer={null}
      >
        {modalComponent}
      </Modal>
    </Layout>
  )
}

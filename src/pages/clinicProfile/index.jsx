import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { Button, Layout, Menu, Typography } from 'antd'
import styles from './clinicalProfile.module.scss'
import Authorize from '../../components/LayoutComponents/Authorize'
import MenuPages from './MenuPages'

const ClinicProfile = () => {
  const { Content, Sider } = Layout
  const { Title } = Typography

  const menuArray = [
    { id: 'emailNotification', title: 'Email Notification' },
    { id: 'supportTicket', title: 'Support Ticket' },
    { id: 'invoiceInformation', title: 'Invoice Information' },
    { id: 'contactDetails', title: 'Contact Details' },
    { id: 'masteryCriteria', title: 'Mastery Criteria' },
    { id: 'logo', title: 'Logo' },
    { id: 'invoicingCurrency', title: 'Invoicing Currency' },
  ]

  const [selectedTab, setSelectedTab] = useState('masteryCriteria')

  const setCurrentMenu = id => {
    setSelectedTab(id)
  }

  return (
    <Authorize roles={['school_admin']} redirect to="/dashboard/beta">
      <Helmet title="Partner" />
      <Layout>
        <Layout style={{ padding: '0' }}>
          <Sider
            width={400}
            className={styles.mainProfile}
            style={{
              background: 'transparent',
              boxShadow: 'none',
            }}
          >
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{
                height: '100%',
                padding: '30px',
                borderRight: 0,
                backgroundColor: '#f2f4f8',
              }}
            >
              <Title type="secondary" level={3} style={{ fontWeight: '500', fontSize: '22px' }}>
                Clinic Profile
              </Title>
              {menuArray.map(menu => {
                console.log('==selectedTab === menu.id==', selectedTab === menu.id)
                return (
                  <Button
                    key={menu.id}
                    className={`${styles.menuButton} ${
                      selectedTab === menu.id ? styles.selected : ''
                    }`}
                    onClick={() => setCurrentMenu(menu.id)}
                  >
                    {menu.title}
                  </Button>
                )
              })}
            </Menu>
          </Sider>
          <Layout>
            <Content style={{ padding: '0 30px' }}>
              <MenuPages selectedTab={selectedTab} />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </Authorize>
  )
}

export default ClinicProfile

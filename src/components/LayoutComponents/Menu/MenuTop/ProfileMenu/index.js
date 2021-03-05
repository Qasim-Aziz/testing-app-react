/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { connect } from 'react-redux'
import { Menu, Dropdown, Avatar, Badge, Select } from 'antd'
// import i18n from 'i18next'
import { FormattedMessage } from 'react-intl'
import styles from './style.module.scss'

@connect(({ user }) => ({ user }))
class ProfileMenu extends React.Component {
  state = {
    value: 'en',
  }

  logout = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'user/LOGOUT',
    })
  }

  // changeViewLanguage = event => {
  //   const newlang = event
  //   this.setState({ value: newlang })
  //   i18n.changeLanguage(newlang)
  // }

  render() {
    const { user } = this.props
    const menu = (
      <Menu selectable={false}>
        <Menu.Item>
          <strong>
            <FormattedMessage id="topBar.profileMenu.hello" />,
            {user.role === 'parents'
              ? user.parentName
              : user.role === 'therapist'
              ? user.staffName
              : user.role === 'school_admin'
              ? user.clinicName
              : 'Anonymous'}
          </strong>
          <div>
            <strong className="mr-1">
              <FormattedMessage id="topBar.profileMenu.billingPlan" />:{' '}
            </strong>
            Professional
          </div>
          <div>
            <strong>
              <FormattedMessage id="topBar.profileMenu.role" />:{' '}
            </strong>
            {user.role === 'parents' ? 'Parent' : ''}
            {user.role === 'therapist' ? 'Therapist' : ''}
            {user.role === 'school_admin' ? 'Clinic' : ''}
          </div>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <a href="/#/clinicSupportTicket">
            <strong>Tickets</strong>
          </a>
        </Menu.Item>
        {/* <Menu.Divider />
        {user.role === 'parents' ? (
          <Menu.Item>
            <a href="/#/profileSetting/">
              <i className={`${styles.menuIcon} icmn-user`} />
              <FormattedMessage id="topBar.profileMenu.editProfile" />
            </a>
          </Menu.Item>
        ) : (
          ''
        )}
        {user.role === 'therapist' ? (
          <Menu.Item>
            <a href="/#/staffProfile">
              <i className={`${styles.menuIcon} icmn-user`} />
              <FormattedMessage id="topBar.profileMenu.editProfile" />
            </a>
          </Menu.Item>
        ) : (
          ''
        )}
        {user.role === 'school_admin' ? (
          <Menu.Item>
            <a href="/#/clinicProfile">
              <i className={`${styles.menuIcon} icmn-user`} />
              <FormattedMessage id="topBar.profileMenu.editProfile" />
            </a>
          </Menu.Item>
        ) : (
          ''
        )} */}

        <Menu.Divider />
        <Menu.Item onClick={this.logout}>
          <a>
            <i className={`${styles.menuIcon} icmn-exit`} />
            <FormattedMessage id="topBar.profileMenu.logout" />
          </a>
        </Menu.Item>
      </Menu>
    )
    return (
      <Dropdown overlay={menu}>
        <div className={styles.dropdown}>
          <Badge>Logout</Badge>
        </div>
      </Dropdown>
    )
  }
}

export default ProfileMenu

/* eslint-disable import/newline-after-import */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-props-no-multi-spaces */
/* eslint-disable eqeqeq */
/* eslint-disable  */
/* eslint-disable array-callback-return */
/* eslint-disable react/destructuring-assignment */

import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Menu, Badge, Dropdown, Avatar, Comment, notification } from 'antd'
import { BellOutlined } from '@ant-design/icons'
import { Link, withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import _ from 'lodash'
import Moment from 'react-moment'
import store from 'store'
import moment from 'moment'
import client from '../../../../apollo/config'
import styles from './style.module.scss'
import ProfileMenu from './ProfileMenu'

const { SubMenu, Divider } = Menu
// const { t } = Trans

function compare(a, b) {
  if (moment(a.timestamp) < moment(b.timestamp)) {
    return 1
  }
  return -1
}

function MenuTop(props) {
  const [userId, setUserId] = useState(localStorage.getItem('userId'))
  const [selectedKeys, setSelectedKeys] = useState(store.get('app.menu.selectedKeys') || [])
  const [notificationList, setNotificationList] = useState([])
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [selectedNotifcation, setSelectedNotifcation] = useState(null)
  const [notificationRedirectUrl, setnotificationRedirectUrl] = useState('#')

  useEffect(() => {
    setSelectedKeysFun(props)
    if (userId) {
      fetchNotification(userId)
    }
    setTimeout(function() {
      setUserId(localStorage.getItem('userId'))
    }, 3000)
    setTimeout(function() {
      setUserId(localStorage.getItem('userId'))
    }, 5000)
  }, [])

  useEffect(() => {
    if (userId) {
      fetchNotification(userId)
    }
  }, [selectedNotifcation, userId])

  const fetchNotification = id => {
    client
      .query({
        query: gql`
          query {
            notification(recipient: ${id}) {
              edges {
                node {
                  id
                  title
                  description
                  timestamp
                  read
                  recipient {
                    id
                    username
                  }
                  actorObjectId
                  notifyType
                  modelId
                }
              }
            }
          }
        `,
        fetchPolicy: 'network-only',
      })
      .then(res => {
        let notiList = []
        let tempCount = 0
        res.data.notification.edges.map(item => {
          notiList.push(item.node)
          tempCount += item.node.read === false ? 1 : 0
        })
        notiList = notiList.sort(compare)
        setNotificationList(notiList)
        setUnreadNotifications(tempCount)
      })
      .catch(err =>
        notification.error({
          message: 'Something went wrong',
          description: 'Unable to fetch recent notifications',
        }),
      )
  }

  const setSelectedKeysFun = tt => {
    const { menuData } = props
    const flattenItems = (items, key) =>
      items.reduce((flattenedItems, item) => {
        flattenedItems.push(item)
        if (Array.isArray(item[key])) {
          return flattenedItems.concat(flattenItems(item[key], key))
        }
        return flattenedItems
      }, [])
    const selectedItem = _.find(flattenItems(menuData, 'children'), ['url', tt.location.pathname])

    setSelectedKeys(selectedItem ? [selectedItem.key] : [])
  }

  const handleClick = e => {
    const { dispatch, isSettingsOpen } = props
    store.set('app.menu.selectedKeys', [e.key])
    if (e.key === 'settings') {
      dispatch({
        type: 'settings/CHANGE_SETTING',
        payload: {
          setting: 'isSettingsOpen',
          value: !isSettingsOpen,
        },
      })
      return
    }

    setSelectedKeys([e.key])
  }

  const generateMenuItems = () => {
    const { menuData = [] } = props

    const generateItem = (item, isSubMenu) => {
      const { key, title, url, icon, pro, disabled } = item

      if (item.divider) {
        return <Divider key={Math.random()} />
      }
      if (item.url) {
        return (
          <Menu.Item
            key={key}
            title={title}
            disabled={disabled}
            style={{ padding: '0px 20px', textAlign: 'left', minWidth: 100 }}
          >
            {item.target ? (
              <a href={url} target={item.target} rel="noopener noreferrer">
                {icon && (
                  <>
                    <span
                      style={{ margin: 0 }}
                      title={title}
                      className={`${icon} ${styles.icon}`}
                    />
                    <p style={{ marginTop: -13, lineHeight: '10px', fontSize: 10 }}>{title}</p>
                  </>
                )}
                {isSubMenu && (
                  <>
                    <span className={styles.title}>
                      {/* <Trans>{title}</Trans> */}
                      {title}
                    </span>
                  </>
                )}
                {pro && <span className="badge badge-primary ml-2">PRO</span>}
              </a>
            ) : (
              <Link to={url}>
                {icon && (
                  <div style={{ margin: 0, textAlign: 'center' }}>
                    <span
                      style={{ margin: 0 }}
                      title={title}
                      className={`${icon} ${styles.icon}`}
                    />
                    <p style={{ marginTop: -13, lineHeight: '10px', fontSize: 10 }}>{title}</p>
                  </div>
                )}
                {isSubMenu && (
                  <>
                    <span className={styles.title}>{title}</span>
                  </>
                )}
                {pro && <span className="badge badge-primary ml-2">PRO</span>}
              </Link>
            )}
          </Menu.Item>
        )
      }
      return (
        <Menu.Item key={key} title={title} disabled={disabled}>
          {icon && (
            <>
              <span style={{ margin: 0 }} title={title} className={`${icon} ${styles.icon}`} />
              <p style={{ marginTop: -13, lineHeight: '10px', fontSize: 10 }}>{title}</p>
            </>
          )}
          <>
            <span className={styles.title}>{/* <Trans>{title}</Trans> */}</span>
            {title}
          </>
          {pro && <span className="badge badge-primary ml-2">PRO</span>}
        </Menu.Item>
      )
    }

    const generateSubmenu = items =>
      items.map(menuItem => {
        if (menuItem.children) {
          const subMenuTitle = (
            <span className={styles.menu} key={menuItem.key}>
              <span className={styles.title}>{menuItem.title}</span>
              {menuItem.icon && (
                <span style={{ margin: 0 }} className={`${menuItem.icon} ${styles.icon}`} />
              )}
            </span>
          )
          return (
            <SubMenu title={subMenuTitle} key={menuItem.key}>
              {generateSubmenu(menuItem.children)}
            </SubMenu>
          )
        }
        return generateItem(menuItem, true)
      })

    return menuData.map(menuItem => {
      if (menuItem.children) {
        const subMenuTitle = (
          <div
            className={styles.menu}
            key={menuItem.key}
            style={{ marginBottom: '11px', display: 'block' }}
          >
            {menuItem.icon && (
              <>
                <span
                  style={{ margin: 0 }}
                  title={menuItem.title}
                  className={`${menuItem.icon} ${styles.icon}`}
                />
                <p style={{ fontSize: 10, lineHeight: '13px', marginTop: -14, marginBottom: 3 }}>
                  {menuItem.title}
                </p>
              </>
            )}
          </div>
        )
        return (
          <SubMenu
            title={subMenuTitle}
            key={menuItem.key}
            style={{ padding: '0px 0px', textAlign: 'center', minWidth: 100 }}
          >
            {generateSubmenu(menuItem.children)}
          </SubMenu>
        )
      }
      return generateItem(menuItem, false)
    })
  }

  const handleReadNotification = item => {
    if (item && item.id) {
      client
        .mutate({
          mutation: gql`
        mutation {
          markAsRead(input: { pk: "${item.id}"  }) {
            details {
              id
              title
            }
          }
        }
        `,
        })
        .then(res => console.log(res, 'notification read'))
        .catch(err => {
          console.log(err, 'erer')
          notification.error({
            message: 'Somthing went wrong',
            description: 'Unable to mark notification as read',
          })
        })
      setSelectedNotifcation(item)
      // updatenotificationRedirectUrl(item.title)
    }
  }

  const {
    isLightTheme,
    history: { goBack },
  } = props

  const menu = (
    <Menu
      className={`${styles.menu}${styles.temp} ${styles.scroll}`}
      style={{ height: `${notificationList.length > 0 ? 500 : 180}px` }}
    >
      {/* <~Menu.Item style={{ height: '50px', fontSize: '17px' }}>Notifications</Menu.Item> */}
      {notificationList.length > 0 ? (
        notificationList.map((item, itemIdx) => {
          let url = '#'
          switch (item.title) {
            case 'New Task':
              // setnotificationRedirectUrl('#/viewTask')
              url = '#/viewTask'
              break
            case 'Appointment':
              // setnotificationRedirectUrl('#/appointmentData')
              url = '#/appointmentData'
              break
            case 'Meal Data':
              // setnotificationRedirectUrl('#/LearnerMeal')
              url = '#/LearnerMeal'
              break
            case 'Medical Data':
              // setnotificationRedirectUrl('#/LearnerMedical')
              url = '#/LearnerMedical'
              break
            case 'Toilet Data':
              // setnotificationRedirectUrl('#/LearnerToilet')
              url = '#/LearnerToilet'
              break
            case 'Behavior Data':
              // setnotificationRedirectUrl('#/LearnerBehavior')
              url = '#/LearnerBehavior'
              break
            case 'Session':
              // setnotificationRedirectUrl('#/LearnerSessions')
              url = '#/LearnerSessions'
              break
            default:
              url = '#'
              break
          }
          return (
            <Menu.Item
              key={Math.random()}
              style={{
                width: '100%',
                textOverflow: 'inherit',
                wordWrap: 'break-word',
                whiteSpace: 'normal',
                fontWeight: `${item.read ? 500 : 700}`,
                color: `${!item.read && 'black'}`,
              }}
              onClick={() => handleReadNotification(item)}
            >
              <a href={url} style={{ maxWidth: '100%' }}>
                <div className={styles.temp}>
                  <Comment
                    author={item.title}
                    avatar={
                      <Avatar
                        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                        alt="Han Solo"
                      />
                    }
                    content={
                      item.description.length > 80 ? (
                        <p style={{ height: '35px' }}>{item.description.slice(0, 80)}....</p>
                      ) : (
                        <p style={{ height: '35px' }}>{item.description}</p>
                      )
                    }
                    datetime={<Moment fromNow>{item.timestamp}</Moment>}
                  />
                </div>
              </a>
            </Menu.Item>
          )
        })
      ) : (
        <div style={{ textAlign: 'center', margin: '35px autp' }}>No notification</div>
      )}
    </Menu>
  )

  return (
    <div>
      <div className={styles.logo}>
        <div
          className={styles.logoContainer}
          style={{ backgroundColor: 'white', borderBottom: '1px solid #f2f2f2' }}
        >
          <img
            src="resources/images/HeaderLogo.png"
            alt="CogniAble Logo"
            style={{ marginLeft: '14px' }}
          />
        </div>
      </div>

      <Menu
        theme={isLightTheme ? 'light' : 'dark'}
        onClick={handleClick}
        selectedKeys={selectedKeys}
        mode="horizontal"
      >
        {generateMenuItems()}

        <Menu.Item
          style={{ padding: '8px 20px', textAlign: 'center', float: 'right', height: '58px' }}
        >
          <ProfileMenu />
        </Menu.Item>
        <Menu.Item
          style={{ padding: '8px 20px', textAlign: 'center', float: 'right', height: '58px' }}
          onClick={goBack}
        >
          <span className={styles.title}>Go Back</span>
        </Menu.Item>
        <Menu.Item
          style={{ padding: '8px 20px', textAlign: 'center', float: 'right', height: '58px' }}
        >
          <Dropdown
            className={`${styles.temp}`}
            style={{ width: 'fit-content' }}
            overlay={menu}
            trigger={['click']}
            placement="topRight"
          >
            <Badge count={unreadNotifications}>
              <BellOutlined style={{ fontSize: 18 }} />
            </Badge>
          </Dropdown>
        </Menu.Item>
      </Menu>
    </div>
  )
}

const mapStateToProps = ({ menu, settings }) => ({
  menuData: menu.menuTopData,
  isLightTheme: settings.isLightTheme,
  isSettingsOpen: settings.isSettingsOpen,
})

export default withRouter(connect(mapStateToProps)(MenuTop))

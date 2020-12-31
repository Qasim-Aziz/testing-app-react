/* eslint-disable import/newline-after-import */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-props-no-multi-spaces */
/* eslint-disable eqeqeq */
/* eslint-disable eqeqeq */
/* eslint-disable eqeqeq */
/* eslint-disable eqeqeq */
import React from 'react'
import { connect } from 'react-redux'
import { Menu, Button, Badge, Dropdown, Avatar, Comment, Tooltip, Popover } from 'antd'
import { Link, withRouter } from 'react-router-dom'
// import { Trans } from 'react-i18next'
import Moment from 'react-moment'
import store from 'store'
import _ from 'lodash'
import { BellOutlined } from '@ant-design/icons'
import styles from './style.module.scss'
import ProfileMenu from './ProfileMenu'

const { SubMenu, Divider } = Menu
// const { t } = Trans

const mapStateToProps = ({ menu, settings }) => ({
  menuData: menu.menuTopData,
  isLightTheme: settings.isLightTheme,
  isSettingsOpen: settings.isSettingsOpen,
})

@withRouter
@connect(mapStateToProps)
class MenuTop extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedKeys: store.get('app.menu.selectedKeys') || [],
    }
  }

  componentWillMount() {
    this.setSelectedKeys(this.props)
  }

  componentWillReceiveProps(newProps) {
    this.setSelectedKeys(newProps)
  }

  setSelectedKeys = props => {
    const { menuData } = this.props
    const flattenItems = (items, key) =>
      items.reduce((flattenedItems, item) => {
        flattenedItems.push(item)
        if (Array.isArray(item[key])) {
          return flattenedItems.concat(flattenItems(item[key], key))
        }
        return flattenedItems
      }, [])
    const selectedItem = _.find(flattenItems(menuData, 'children'), [
      'url',
      props.location.pathname,
    ])
    this.setState({
      selectedKeys: selectedItem ? [selectedItem.key] : [],
    })
  }

  handleClick = e => {
    const { dispatch, isSettingsOpen } = this.props
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
    this.setState({
      selectedKeys: [e.key],
    })
  }

  generateMenuItems = () => {
    const { menuData = [] } = this.props

    const generateItem = (item, isSubMenu) => {
      const { key, title, url, icon, pro, disabled } = item

      if (item.divider) {
        return <Divider key={Math.random()} />
      }
      if (item.url) {
        return (

          <Menu.Item key={key} title={title} disabled={disabled} style={{ padding: '0px 20px', textAlign: 'left', minWidth: 100 }}>
            {item.target ? (
              <a href={url} target={item.target} rel="noopener noreferrer">
                {icon &&
                  <>
                    <span style={{margin: 0}} title={title} className={`${icon} ${styles.icon}`} />
                    <p style={{ marginTop: -13, lineHeight: '10px', fontSize: 10 }}>{title}</p>
                  </>
                }
                {isSubMenu &&
                  <>
                    <span className={styles.title}>
                      {/* <Trans>{title}</Trans> */}
                      {title}
                    </span>
                  </>
                }
                {pro && <span className="badge badge-primary ml-2">PRO</span>}
              </a>
            ) : (
                <Link to={url}>
                  {icon &&
                    <div style={{margin: 0, textAlign: 'center'}}>
                      <span style={{margin: 0}} title={title} className={`${icon} ${styles.icon}`} />
                      <p style={{ marginTop: -13, lineHeight: '10px', fontSize: 10 }}>{title}</p>
                    </div>
                  }
                  {isSubMenu &&
                    <>
                      <span className={styles.title}>
                        {/* <Trans>{title}</Trans> */}
                        {title}
                      </span>
                    </>
                  }
                  {pro && <span className="badge badge-primary ml-2">PRO</span>}
                </Link>
              )}
          </Menu.Item>
        )
      }
      return (
        <Menu.Item key={key} title={title} disabled={disabled}>
          {icon &&
            <>
              <span style={{margin: 0}} title={title} className={`${icon} ${styles.icon}`} />
              <p style={{ marginTop: -13, lineHeight: '10px', fontSize: 10 }}>{title}</p>
            </>
          }
          <>
            <span className={styles.title}>
              {/* <Trans>{title}</Trans> */}

            </span>
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
              <span className={styles.title}>
                {/* <Trans>{menuItem.title}</Trans> */}
                {menuItem.title}
              </span>
              {menuItem.icon && <span style={{margin: 0}} className={`${menuItem.icon} ${styles.icon}`} />}
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
          <p className={styles.menu} key={menuItem.key} style={{display: 'block'}}>
            {/* <span className={styles.title}>
              <Trans>{menuItem.title}</Trans>
            </span> */}
            {menuItem.icon &&
              <>
                <span style={{margin: 0}} title={menuItem.title} className={`${menuItem.icon} ${styles.icon}`} />
                <p style={{fontSize: 10, lineHeight: '13px', marginTop: -14, marginBottom: 3 }}>{menuItem.title}</p>
              </>
            }
          </p>
        )
        return (
          <SubMenu title={subMenuTitle} key={menuItem.key} style={{ padding: '0px 0px', textAlign: 'center', minWidth: 100 }}>

            {generateSubmenu(menuItem.children)}
          </SubMenu>
        )
      }
      return generateItem(menuItem, false)
    })
  }

  render() {
    const { selectedKeys } = this.state
    const {
      isLightTheme,
      history: { goBack },
    } = this.props
    const menu = (
      <Menu style={{ width: 300 }}>
        <Menu.Item
          key="1"
          style={{
            width: 300,
            textOverflow: 'inherit',
            wordWrap: 'break-word',
            whiteSpace: 'normal',
          }}
        >
          <Comment
            author={<a>New Task</a>}
            avatar={
              <Avatar
                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                alt="Han Solo"
              />
            }
            content={<p>You have assigned a new task.....</p>}
            datetime={<Moment fromNow>2020-07-17T11:17-0500</Moment>}
          />
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          key="2"
          style={{
            width: 300,
            textOverflow: 'inherit',
            wordWrap: 'break-word',
            whiteSpace: 'normal',
          }}
        >
          <Comment
            author={<a>New Task</a>}
            avatar={
              <Avatar
                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                alt="Han Solo"
              />
            }
            content={<p>You have assigned a new task.....</p>}
            datetime={<Moment fromNow>2020-07-16T12:10-0500</Moment>}
          />
        </Menu.Item>
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
          onClick={this.handleClick}
          selectedKeys={selectedKeys}
          mode="horizontal"
        >
          {this.generateMenuItems()}

          <Menu.Item style={{ padding: '8px 20px', textAlign: 'center', float: 'right', height: '58px' }}>
            <ProfileMenu />
          </Menu.Item>
          <Menu.Item style={{ padding: '8px 20px', textAlign: 'center', float: 'right', height: '58px' }} onClick={goBack}>
            <span className={styles.title}>Go Back</span>
          </Menu.Item>
          <Menu.Item style={{ padding: '8px 20px', textAlign: 'center', float: 'right', height: '58px' }}>
            <Dropdown overlay={menu} trigger={['click']} placement="topRight">
              <div className={styles.dropdown}>
                <Badge count={2}>
                  <BellOutlined />
                </Badge>
              </div>
            </Dropdown>
          </Menu.Item>
        </Menu>
      </div>
    )
  }
}

export default MenuTop

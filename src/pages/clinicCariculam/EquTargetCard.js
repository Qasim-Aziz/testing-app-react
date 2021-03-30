/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react'
import { Dropdown, Drawer, Layout, Typography, Tooltip, Icon, Modal, Menu } from 'antd'
import { connect } from 'react-redux'
import { gql } from 'apollo-boost'

const { Title, Text } = Typography
const { confirm } = Modal

@connect(({ user, sessionrecording }) => ({ user, sessionrecording }))
class StudentDrawer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      categoryList: [],
      selectedCategoryId: '',
    }
  }

  render() {
    const userRole = this.props.user.role
    const { node, showEditDrawer } = this.props

    const menu = (
      <Menu style={{ zIndex: 1001 }}>
        <Menu.Item
          onClick={() => {
            showEditDrawer(node)
          }}
        >
          <Tooltip placement="topRight" title="Edit">
            Edit
          </Tooltip>
        </Menu.Item>
      </Menu>
    )

    return (
      <div
        style={{
          display: 'flex',
          background: '#FFFFFF',
          border: '1px solid #E4E9F0',
          boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
          borderRadius: 0,
          paddingLeft: '20px',
        }}
      >
        <div style={{ width: 'calc(100% - 30px)' }}>
          <div
            style={{
              display: 'flex',
              paddingTop: 20,
            }}
          >
            <Title
              style={{
                fontSize: 15,
                lineHeight: '25px',
                margin: 0,
                width: '90%',
                marginBottom: 16,
                color: '#0c0c0cad',
              }}
            >
              {node.code} : {node.target.targetMain.targetName}
            </Title>
            {userRole === 'school_admin' || userRole === 'superUser' ? (
              <div style={{ marginLeft: 'auto', marginTop: 8 }}>
                <Dropdown overlay={menu}>
                  <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                    <Icon type="setting" /> <Icon type="caret-down" />
                  </a>
                </Dropdown>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    )
  }
}
export default StudentDrawer

/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect } from 'react'
import { Typography, Tooltip, notification, Dropdown, Icon, Menu, Modal } from 'antd'
import { useMutation } from 'react-apollo'
import { useSelector, useDispatch } from 'react-redux'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import targetImg1 from './images/motherChild.jpg'
import { DISABLE_TARGET, TARGET_QUERY } from './query'

const { Title } = Typography
const { confirm } = Modal

const TargetCard = ({
  style,
  title,
  setUpdateTargetId,
  id,
  setName,
  setUpdateTargetDrawer,
  setInstr,
  instr,
  targetArea,
}) => {
  const userRole = useSelector(state => state.user.role)
  const [toggleTargetActiveState, { data: toggleData, error: toggleError }] = useMutation(
    DISABLE_TARGET,
    {
      update(cache) {
        const cacheData = cache.readQuery({
          query: TARGET_QUERY,
          variables: {
            id: targetArea,
          },
        })

        cache.writeQuery({
          query: TARGET_QUERY,
          variables: {
            id: targetArea,
          },
          data: {
            target: {
              edges: cacheData.target.edges.filter(({ node }) => {
                return node.id !== id
              }),
              __typename: 'TargetsTypeConnection',
            },
          },
        })
      },
    },
  )

  useEffect(() => {
    if (toggleData) {
      notification.success({
        message: toggleData.disableTarget.msg,
      })
    }
  }, [toggleData])

  useEffect(() => {
    if (toggleError) {
      notification.error({
        message: 'Failed to toggle the program area disable state',
      })
    }
  }, [toggleError])

  const onCopyClick = () => {
    setInstr(instr)
    setName(title)
  }

  const confirmDeleteTarget = () => {
    confirm({
      title: 'Are you sure you want to delete this?',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        toggleTargetActiveState({
          variables: {
            id,
          },
        })
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  const menu = (
    <Menu style={{ zIndex: 1001 }}>
      <Menu.Item
        onClick={() => {
          setUpdateTargetId(id)
          setUpdateTargetDrawer(true)
        }}
      >
        <Tooltip placement="topRight" title="Edit">
          Edit
        </Tooltip>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={onCopyClick}>Copy</Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={() => confirmDeleteTarget()}>Deactivate</Menu.Item>
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
        ...style,
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
            {title}
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

export default TargetCard

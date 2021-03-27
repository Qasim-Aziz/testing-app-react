/* eslint-disable no-underscore-dangle */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react'
import { Button, Card, Typography, Input, notification, Dropdown, Icon, Menu, Modal } from 'antd'
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'
import { COLORS } from 'assets/styles/globalStyles'
import { DISABLE_TARTET_AREA, GET_TARGET_AREAS } from './query'

const { Title, Text } = Typography
const { confirm } = Modal

const UPDATE_TARGET_AREA = gql`
  mutation updateTargetArea($pk: ID!, $name: String!) {
    updateTargetArea(input: { pk: $pk, name: $name }) {
      status
      message
      details {
        id
        Area
      }
    }
  }
`

const submitButton = {
  width: 100,
  height: 40,
  background: '#0B35B3',
  boxShadow: '0px 2px 4px rgba(96, 97, 112, 0.16), 0px 0px 1px rgba(40, 41, 61, 0.04)',
  borderRadius: 0,
  fontSize: 16,
  // fontWeight: 600,
  margin: '0 5px',
  color: 'white',
}

const TargetAreaCard = ({
  style,
  name,
  targetAreaId,
  handelNewTargetDrawer,
  isActive,
  domainId,
}) => {
  const userRole = useSelector(state => state.user.role)
  const [editMode, setEditMode] = useState(false)
  const [newName, setNewName] = useState(name)

  const [toggleTargetAreaActiveState, { data: toggleData, error: disableError }] = useMutation(
    DISABLE_TARTET_AREA,
    {
      update(cache, { data }) {
        if (data.disableTargetArea.status) {
          const cacheData = cache.readQuery({
            query: GET_TARGET_AREAS,
            variables: {
              domainId: [domainId],
            },
          })

          cache.writeQuery({
            query: GET_TARGET_AREAS,
            variables: {
              domainId: [domainId],
            },
            data: {
              targetArea: {
                edges: cacheData.targetArea.edges.filter(({ node }) => node.id !== targetAreaId),
                __typename: cacheData.targetArea.__typename,
              },
            },
          })
        }
      },
    },
  )

  useEffect(() => {
    if (toggleData) {
      notification.success({
        message: toggleData.disableTargetArea.msg,
      })
    }
  }, [toggleData])

  useEffect(() => {
    if (disableError) {
      notification.error({
        message: 'Failed to disable the target area',
      })
    }
  }, [disableError])

  const [
    updateTargetName,
    { data: updateTargetNameData, loading: updateTargetNameLoading, error: updateTargetNameError },
  ] = useMutation(UPDATE_TARGET_AREA, {
    variables: {
      pk: targetAreaId,
      name: newName,
    },
  })

  useEffect(() => {
    if (updateTargetNameData) {
      setEditMode(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateTargetNameData])

  useEffect(() => {
    if (updateTargetNameError) {
      notification.error({
        message: 'Filed to update target area name',
        description: updateTargetNameError,
      })
    }
  }, [updateTargetNameError])

  const confirmDeleteTargetArea = () => {
    confirm({
      title: 'Are you sure you want to delete this?',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        toggleTargetAreaActiveState({
          variables: {
            id: targetAreaId,
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
      <Menu.Item onClick={() => setEditMode(true)}>
        {/* <Tooltip placement="topRight" title="Edit"> */}
        Edit
        {/* </Tooltip> */}
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={() => confirmDeleteTargetArea()} disabled={!isActive}>
        Deactivate
      </Menu.Item>
    </Menu>
  )

  return (
    <Card
      style={{
        background: '#FFFFFF',
        // border: '1px solid #E4E9F0',
        boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
        borderRadius: 10,
        ...style,
        border: '2px solid #1c94fd',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Title
          style={{
            fontSize: 18,
            lineHeight: '25px',
            margin: 0,
            marginRight: 15,
          }}
        >
          TARGET AREA :
        </Title>
        {editMode ? (
          <Input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            autoFocus
            style={{
              display: 'block',
              width: '50%',
            }}
            disabled={updateTargetNameLoading}
          />
        ) : (
          <Text
            style={{
              fontSize: 18,
              color: '#000',
              lineHeight: '25px',
            }}
          >
            {name}
          </Text>
        )}

        {userRole === 'school_admin' || userRole === 'superUser' ? (
          <>
            {!editMode && (
              <Button
                onClick={handelNewTargetDrawer}
                style={{
                  width: 210,
                  height: 40,
                  background: isActive && 'rgb(24, 144, 255)',
                  border: '1px solid #E4E9F0',
                  boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
                  borderRadius: 6,
                  marginLeft: 'auto',
                }}
                disabled={!isActive}
              >
                <PlusOutlined style={{ fontSize: 20, color: 'rgb(238, 241, 249)' }} />
                <Text
                  style={{
                    fontSize: 16,
                    lineHeight: '22px',
                    color: isActive && 'rgb(238, 241, 249)',
                  }}
                >
                  New Target
                </Text>
              </Button>
            )}

            {!editMode && (
              // <Button type="link" onClick={() => setEditMode(true)}>
              //   <FormOutlined style={{ fontSize: 28, color: '#e9e9e9' }} />
              // </Button>
              <div style={{ marginLeft: '10px' }}>
                <Dropdown overlay={menu}>
                  <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                    <Icon type="setting" /> <Icon type="caret-down" />
                  </a>
                </Dropdown>
              </div>
            )}
          </>
        ) : (
          ''
        )}

        {editMode && (
          <div style={{ marginLeft: 'auto' }}>
            <Button
              style={submitButton}
              type="primary"
              onClick={() => {
                if (newName) {
                  if (newName !== name) {
                    updateTargetName()
                  } else {
                    setEditMode(false)
                  }
                } else {
                  // eslint-disable-next-line no-alert
                  alert('Input cant be empty')
                }
              }}
              loading={updateTargetNameLoading}
            >
              Save
            </Button>
            <Button
              style={{ ...submitButton, backgroundColor: COLORS.danger }}
              type="danger"
              disabled={updateTargetNameLoading}
              onClick={() => {
                setNewName(null)
                setEditMode(false)
              }}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}

export default TargetAreaCard

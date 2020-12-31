/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react'
import { Typography, Button, Input, Modal, notification, Tooltip, Dropdown, Icon, Menu } from 'antd'
import { useMutation } from 'react-apollo'
import { useSelector } from 'react-redux'
import gql from 'graphql-tag'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { DISABLE_DOMAIN, DOMAIN } from './query'

const { Title } = Typography
const { confirm } = Modal

const UPDATE_DOMAIN = gql`
  mutation updateDomain($domainId: ID!, $domainName: String!) {
    updateDomain(input: { pk: $domainId, domainName: $domainName }) {
      details {
        id
        domain
      }
    }
  }
`

const DoaminCard = ({
  title,
  selected,
  style,
  handleSelectDomain,
  id,
  targetAreas,
  setUpdateDomain,
  programArea,
}) => {
  const userRole = useSelector(state => state.user.role)
  const [updateModel, setUpdateModel] = useState(false)
  const [updateTitle, setUpdateTitle] = useState(title)

  const [toggleDomainActiveState, { data: toggleData, error: toggleError }] = useMutation(
    DISABLE_DOMAIN,
    {
      update(cache, { data }) {
        if (data.disableDomain.status) {
          const cacheData = cache.readQuery({
            query: DOMAIN,
            variables: {
              programArea,
            },
          })

          cache.writeQuery({
            query: DOMAIN,
            variables: {
              programArea,
            },
            data: {
              programDetails: {
                domain: {
                  edges: cacheData.programDetails.domain.edges.filter(({ node }) => {
                    return node.id !== id
                  }),
                  __typename: 'DomainTypeConnection',
                },
                __typename: 'ProgramAreaType',
              },
            },
          })
        }
      },
    },
  )

  const [
    updateDomain,
    { data: updateDomianData, error: updateDomainError, loading: updateDomainLoading },
  ] = useMutation(UPDATE_DOMAIN, {
    variables: {
      domainId: id,
      domainName: updateTitle,
      targetAreas,
    },
  })

  useEffect(() => {
    if (toggleData) {
      notification.success({
        message: toggleData.disableDomain.msg,
      })
    }
  }, [toggleData])

  useEffect(() => {
    if (toggleError) {
      notification.error({
        message: 'Failed to deactivate the domain',
      })
    }
  }, [toggleError])

  useEffect(() => {
    if (updateDomianData) {
      notification.success({
        message: 'Update Domain Successfully',
      })
      setUpdateModel(false)
      setUpdateDomain(updateDomianData.updateDomain.details)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateDomianData])

  useEffect(() => {
    if (updateDomainError) {
      notification.error({
        message: 'Update Domain Error',
      })
    }
  }, [updateDomainError])

  const confirmDeleteDomain = () => {
    confirm({
      title: 'Are you sure you want to delete this?',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        toggleDomainActiveState({
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
      <Menu.Item onClick={() => setUpdateModel(true)}>
        <Tooltip placement="topRight" title="Edit">
          Edit
        </Tooltip>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={() => confirmDeleteDomain()}>Deactivate</Menu.Item>
    </Menu>
  )

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      onClick={handleSelectDomain}
      style={{
        background: selected ? '#a7a6a6' : '#FFF',
        borderBottom: '1px solid #bcbcbc',
        cursor: 'pointer',
        padding: 18,
        borderRadius: 0,
        width: '100%',
        height: 50,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Title
        style={{
          color: selected ? '#000' : '#000',
          fontSize: 16,
          lineHeight: '25px',
          display: 'inline',
          margin: 0,
          fontWeight: '500',
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
      <Modal
        visible={updateModel}
        onCancel={() => setUpdateModel(false)}
        title="Update Domain"
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              updateDomain()
            }}
            loading={updateDomainLoading}
          >
            Update
          </Button>,
        ]}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#fff',
          }}
        >
          <Input value={updateTitle} onChange={e => setUpdateTitle(e.target.value)} size="large" />
        </div>
      </Modal>
    </div>
  )
}

export default DoaminCard

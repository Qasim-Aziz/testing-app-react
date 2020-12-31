/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react'
import { Button, Select, Modal, Input, notification, Typography, Tooltip } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import gql from 'graphql-tag'
import { useMutation, useQuery } from 'react-apollo'
import TargetAreaContent from './TargetAreaContent'
import { GET_TARGET_AREAS } from './query'

const { Option } = Select
const { Text } = Typography

const CREATE_TARGET_AREA = gql`
  mutation($domainId: ID!, $name: String!) {
    addTargetArea(input: { domainId: $domainId, name: $name }) {
      status
      message
      details {
        id
        Area
        isActive
      }
    }
  }
`

const DomainContent = ({ domainId, programArea }) => {
  const userRole = useSelector(state => state.user.role)
  const [open, setOpen] = useState(false)
  const [selectTargetArea, setSelectTargetArea] = useState()
  const [name, setName] = useState()

  const { data: targetArreas, error: targetArreasError, loading: targetArreasLoading } = useQuery(
    GET_TARGET_AREAS,
    {
      variables: {
        domainId: [domainId],
      },
    },
  )

  const [
    createTargetArea,
    { data: createTargetAreaData, error: createTargetAreaError, loading: createTargetAreaLoading },
  ] = useMutation(CREATE_TARGET_AREA, {
    variables: {
      domainId,
      name,
    },
    update(cache, { data }) {
      if (data.addTargetArea.details.isActive) {
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
              edges: [
                {
                  node: data.addTargetArea.details,
                  __typename: data.addTargetArea.__typename,
                },
                ...cacheData.targetArea.edges,
              ],
              __typename: cacheData.targetArea.__typename,
            },
          },
        })
      }
    },
  })

  const handelCreateTargetAreaModel = () => {
    setOpen(state => !state)
  }

  const handleSelectChange = value => {
    setSelectTargetArea(value)
  }

  const handelCreateTargetArea = () => {
    createTargetArea()
  }

  useEffect(() => {
    if (createTargetAreaData) {
      if (createTargetAreaData.addTargetArea.details.isActive) {
        if (createTargetAreaData.addTargetArea.status) {
          notification.success({
            message: 'Clinic Cariculam',
            description: 'Create New Target Area Data Sucessfully',
          })
        } else {
          notification.info({
            message: createTargetAreaData.addTargetArea.message,
          })
        }
      } else {
        notification.info({
          message:
            'A target area with same name allready exist at disable mode. Go to the profile setting to unable that',
        })
      }
      setName('')
      setOpen(false)
    }
  }, [createTargetAreaData])

  useEffect(() => {
    if (createTargetAreaError) {
      notification.error({
        message: 'Something went wrong',
        description: createTargetAreaError,
      })
    }
  }, [createTargetAreaError])

  useEffect(() => {
    if (targetArreas) {
      setSelectTargetArea(
        targetArreas.targetArea.edges[0] ? targetArreas.targetArea.edges[0].node.id : null,
      )
    }
  }, [targetArreas])

  if (targetArreasError) {
    return <h4 style={{ color: 'red' }}>Opps their are something wrong</h4>
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip placement="topRight" title="Click here to select target area">
          <Select
            placeholder="Target Area"
            style={{
              width: 300,
              borderRadius: 4,
              marginRight: 38,
            }}
            value={selectTargetArea}
            onChange={handleSelectChange}
            size="large"
            showSearch
            optionFilterProp="name"
            loading={targetArreasLoading}
          >
            {targetArreas &&
              targetArreas.targetArea.edges.map(({ node }) => {
                return (
                  <Option key={node.id} value={node.id} name={node.Area}>
                    {node.Area}
                  </Option>
                )
              })}
          </Select>
        </Tooltip>
        {userRole === 'school_admin' || userRole === 'superUser' ? (
          <Tooltip placement="topRight" title="Click here to add new target area">
            <Button
              onClick={handelCreateTargetAreaModel}
              style={{
                width: 210,
                height: 40,
                background: '#F9F9F9',
                border: '1px solid #E4E9F0',
                boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
                borderRadius: 6,
                marginLeft: 'auto',
              }}
            >
              <PlusOutlined style={{ fontSize: 20, color: '#000' }} />
              <Text style={{ fontSize: 16, lineHeight: '22px', color: '#000' }}>
                Add Target Area
              </Text>
            </Button>
          </Tooltip>
        ) : (
          ''
        )}
      </div>
      <div style={{ marginTop: 20 }}>
        {targetArreas && selectTargetArea && (
          <TargetAreaContent
            domainId={domainId}
            targetArea={targetArreas.targetArea.edges.find(
              ({ node }) => node.id === selectTargetArea,
            )}
            programArea={programArea}
          />
        )}
      </div>
      <Modal
        visible={open}
        title="Title"
        onCancel={handelCreateTargetAreaModel}
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={handelCreateTargetArea}
            loading={createTargetAreaLoading}
          >
            Create
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
          <Input
            placeholder="Type the target area name"
            value={name}
            onChange={e => setName(e.target.value)}
            size="large"
          />
        </div>
      </Modal>
    </>
  )
}

export default DomainContent

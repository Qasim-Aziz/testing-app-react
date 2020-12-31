/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react'
import {
  Layout,
  Tabs,
  Button,
  Row,
  Col,
  Modal,
  Input,
  notification,
  Tooltip,
  Dropdown,
  Icon,
  Menu,
} from 'antd'
import { PlusOutlined, SyncOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import './index.scss'
import TabContent from './TabContent'
import EquivalenceContent from './EquivalenceContent'
import { DISABLE_PROGRAM_AREA, UPDATE_TARGET_AREA, TARGET_AREA_NAME } from './query'


const { Content } = Layout
const { TabPane } = Tabs
const { confirm } = Modal

const AREAS = gql`
  query {
    programArea(isActive: true) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`

const CREATE_AREA = gql`
  mutation programArea($name: String!) {
    programArea(input: { name: $name }) {
      ProgramArea {
        id
        name
      }
    }
  }
`

const COPY_PROGRAM_AREA = gql`
  mutation copyProgramArea($programAreaId: ID!, $copyName: String!) {
    copyProgram(input: { pk: $programAreaId, name: $copyName }) {
      status
      msg
      details {
        id
        name
      }
    }
  }
`

const SYNC_PROGRAM = gql`
  mutation {
    SyncProgram(input: {}) {
      message
    }
  }
`

// const userRole = useSelector(state => state.user.role)
// const userRole = ''

export default () => {
  const userRole = useSelector(state => state.user.role)

  const [addNewAreaModel, setAddNewAreaModel] = useState(false)
  const { data: areasData, error: areasError, loading: areasLooding } = useQuery(AREAS)
  const [newAreaName, setNewAreaName] = useState('')
  const [updateAreaName, setUpdateAreaName] = useState('')
  const [selectProgramArea, setSelectProgramArea] = useState('1')
  const [updateAreaModel, setUpdateAreaModel] = useState()
  const [copyProgramAreaModel, setCopyProgramAreaModel] = useState(false)
  const [copyProgramAreaName, setCopyProgramAreaName] = useState('')

  const [mutate, newAreaData] = useMutation(CREATE_AREA, {
    update(cache, { data }) {
      const cacheData = cache.readQuery({
        query: AREAS,
      })

      console.log(cacheData)
      console.log('area', data)
      cache.writeQuery({
        query: AREAS,
        data: {
          programArea: {
            edges: [
              ...cacheData.programArea.edges,

              {
                node: data.programArea.ProgramArea,
                __typename: 'ProgramAreaTypeEdge',
              },
            ],
            __typename: 'ProgramAreaTypeConnection',
          },
        },
      })

      console.log(
        cache.readQuery({
          query: AREAS,
        }),
      )
    },
  })

  const [CopyMutate, copyAreaData] = useMutation(COPY_PROGRAM_AREA, {
    update(cache, { data }) {
      const cacheData = cache.readQuery({
        query: AREAS,
      })

      console.log(cacheData)
      console.log('area', data)
      cache.writeQuery({
        query: AREAS,
        data: {
          programArea: {
            edges: [
              ...cacheData.programArea.edges,

              {
                node: data.copyProgram.details,
                __typename: 'ProgramAreaTypeEdge',
              },
            ],
            __typename: 'ProgramAreaTypeConnection',
          },
        },
      })

      console.log(
        cache.readQuery({
          query: AREAS,
        }),
      )
    },
  })

  const [sync_pro, sync_program] = useMutation(SYNC_PROGRAM)

  const [getProgramAreaName, { data: selectProgramName }] = useLazyQuery(TARGET_AREA_NAME, {
    variables: {
      programArea: selectProgramArea,
    },
  })

  const [
    updateArea,
    { data: updateAreaData, error: updateAreaError, loading: updateAreaLoading },
  ] = useMutation(UPDATE_TARGET_AREA, {
    variables: {
      id: selectProgramArea,
    },
  })

  const [toggleProgramAreaActiveState, { data: toggleData, error: toggleError }] = useMutation(
    DISABLE_PROGRAM_AREA,
    {
      update(cache, { data }) {
        if (data.disableProgramArea.status) {
          const cacheData = cache.readQuery({
            query: AREAS,
          })
          console.log(cacheData)
          cache.writeQuery({
            query: AREAS,
            data: {
              programArea: {
                edges: cacheData.programArea.edges.filter(({ node }) => {
                  return node.id !== selectProgramArea
                }),
                __typename: 'ProgramAreaTypeConnection',
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
        message: toggleData.disableProgramArea.msg,
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

  useEffect(() => {
    if (updateAreaModel) {
      getProgramAreaName()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateAreaModel])

  useEffect(() => {
    if (selectProgramName) {
      setUpdateAreaName(selectProgramName.programDetails.name)
    }
  }, [selectProgramName])

  useEffect(() => {
    if (sync_program.data) {
      notification.success({
        message: sync_program.data.SyncProgram.message,
      })
      setAddNewAreaModel(false)
    }
  }, [sync_program.data])

  useEffect(() => {
    if (areasData) {
      setSelectProgramArea(areasData.programArea.edges[0].node.id)
    }
  }, [areasData])

  useEffect(() => {
    if (newAreaData.data) {
      notification.success({
        message: 'New Area Created Succesfully',
      })
      setAddNewAreaModel(false)
    }

    if (newAreaData.error) {
      notification.error({
        message: 'New Area Created Error',
      })
    }
  }, [newAreaData.data, newAreaData.error])

  useEffect(() => {
    if (copyAreaData.data) {
      notification.success({
        message: 'Program Area Copied Succesfully',
      })
      setCopyProgramAreaName('')
      setCopyProgramAreaModel(false)
    }

    if (copyAreaData.error) {
      notification.error({
        message: 'Program Area Copy Error',
      })
    }
  }, [copyAreaData.data, copyAreaData.error])

  useEffect(() => {
    if (updateAreaData) {
      notification.success({
        message: 'Update area name Succesfully',
      })
      setUpdateAreaModel(false)
    }

    if (updateAreaError) {
      notification.error({
        message: 'Failed to update area name',
      })
    }
  }, [updateAreaData, updateAreaError])

  const handelAddNewAreaModel = () => {
    setAddNewAreaModel(state => !state)
  }

  const handelUpdateAreaModel = () => {
    setUpdateAreaModel(state => !state)
  }

  const SyncProgram = () => {
    sync_pro()
  }

  const handelCreateNewArea = () => {
    if (newAreaName) {
      mutate({ variables: { name: newAreaName } })
      setNewAreaName('')
    } else {
      notification.info({
        message: 'Please give a name',
      })
    }
  }

  const handelUpdateArea = () => {
    if (updateAreaName) {
      updateArea({ variables: { name: updateAreaName } })
      setUpdateAreaName('')
    } else {
      notification.info({
        message: 'Please give a name',
      })
    }
  }

  const handelNewAreaName = e => {
    setNewAreaName(e.target.value)
  }

  const confirmDeleteProgramArea = () => {
    confirm({
      title: 'Are you sure you want to delete this?',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        toggleProgramAreaActiveState({
          variables: {
            id: selectProgramArea,
          },
        })
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  const handelCopyProgramArea = () => {
    if (copyProgramAreaName) {
      CopyMutate({ variables: { copyName: copyProgramAreaName, programAreaId: selectProgramArea } })
    } else {
      notification.info({
        message: 'Please give a name',
      })
    }
  }

  const handelCopyProgramAreaModel = () => {
    setCopyProgramAreaModel(state => !state)
  }

  const handelCopyProgramAreaName = e => {
    setCopyProgramAreaName(e.target.value)
  }

  const copyProgramArea = area => {
    console.log('copy', area)
  }

  if (areasLooding) {
    return 'Loading...'
  }

  if (areasError) {
    return <pre>{JSON.stringify(areasError, null, 2)}</pre>
  }

  const menu = (
    <Menu style={{ zIndex: 1001 }}>
      <Menu.Item onClick={() => setUpdateAreaModel(selectProgramArea)}>
        <Tooltip placement="topRight" title="Edit">
          Edit
        </Tooltip>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={() => confirmDeleteProgramArea()}>Deactivate</Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={() => handelCopyProgramAreaModel(selectProgramArea)}>Copy</Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={SyncProgram}>
        <Tooltip placement="topRight" title="Update your Whole Program">
          <SyncOutlined style={{ fontSize: 18, color: '#000' }} />
          Sync Program
        </Tooltip>
      </Menu.Item>
    </Menu>
  )

  const operations = (
    <div style={{ marginLeft: '10px' }}>
      {selectProgramArea !== 'EquivalenceTargets' && (
        <>
          <Tooltip placement="topRight" title="Click here to add new area">
            <Button onClick={handelAddNewAreaModel} style={{ marginRight: 5, border: 'none' }}>
              <PlusOutlined style={{ fontSize: 18 }} />
            </Button>
          </Tooltip>
          <Dropdown overlay={menu}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              <Icon type="setting" /> <Icon type="caret-down" />
            </a>
          </Dropdown>
        </>
      )}
    </div>
  )

  return (
    <div>
      <Layout style={{ padding: '0px' }}>
        <Layout>
          <Content
            style={{
              padding: '0px 20px',
              maxWidth: '100%',
              margin: '0px auto',
              width: '100%',
            }}
          >
            <Row style={{ width: '100%' }}>
              <Col span={24}>
                <Tabs
                  activeKey={selectProgramArea}
                  tabBarExtraContent={
                    userRole === 'school_admin' || userRole === 'superUser' ? operations : ''
                  }
                  style={{ position: 'relative' }}
                  onChange={key => {
                    setSelectProgramArea(key)
                  }}
                >
                  {areasData &&
                    areasData.programArea.edges.map(({ node }) => {
                      return (
                        <TabPane style={{ marginTop: 27 }} tab={node.name} key={node.id}>
                          <TabContent programArea={node.id} />
                        </TabPane>
                      )
                    })}

                  {userRole === 'superUser' && (
                    <TabPane style={{ marginTop: 27 }} tab="Equivalence" key="EquivalenceTargets">
                      <EquivalenceContent />
                    </TabPane>
                  )}



                </Tabs>
              </Col>
            </Row>

            <Modal
              visible={addNewAreaModel}
              title="Create New Area"
              onCancel={handelAddNewAreaModel}
              footer={[
                <Button
                  key="submit"
                  type="primary"
                  onClick={handelCreateNewArea}
                  loading={newAreaData.loading}
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
                  placeholder="Area Name"
                  value={newAreaName}
                  onChange={handelNewAreaName}
                  autoFocus
                  size="large"
                />
              </div>
            </Modal>

            <Modal
              visible={copyProgramAreaModel}
              title="Copy Program Area"
              onCancel={handelCopyProgramAreaModel}
              footer={[
                <Button
                  key="submit"
                  type="primary"
                  onClick={handelCopyProgramArea}
                  loading={copyAreaData.loading}
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
                  placeholder="Area Name"
                  value={copyProgramAreaName}
                  onChange={handelCopyProgramAreaName}
                  autoFocus
                  size="large"
                />
              </div>
            </Modal>

            <Modal
              visible={updateAreaModel}
              title="Update New Area"
              onCancel={handelUpdateAreaModel}
              footer={[
                <Button
                  key="submit"
                  type="primary"
                  onClick={handelUpdateArea}
                  loading={updateAreaLoading}
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
                {/* {selectProgramNameLoading && "Loading..."} */}
                <Input
                  placeholder="Area Name"
                  value={updateAreaName}
                  onChange={e => setUpdateAreaName(e.target.value)}
                  autoFocus
                  size="large"
                />
              </div>
            </Modal>
          </Content>
        </Layout>
      </Layout>
    </div>
  )
}

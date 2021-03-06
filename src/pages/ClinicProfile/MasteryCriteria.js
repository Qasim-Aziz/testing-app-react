/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable */

import React, { useState, useEffect } from 'react'
import { Table, Drawer, Tag, Button, Input, Form, notification } from 'antd'
import { useQuery, useMutation } from '@apollo/react-hooks'
import moment from 'moment'
import gql from 'graphql-tag'
import { PlusOutlined } from '@ant-design/icons'
import MasteryCriteriaForm from './Mastery/CreateChildForm'
import UpdateMasterChildForm from './Mastery/UpdateMasterChildForm'
import LoadingComponent from '../staffProfile/LoadingComponent'
import './masteryCriteria.scss'

const MASTER_TARGET = gql`
  query {
    masteryCriteria {
      id
      name
      createdAt
      isDefault
      statuscriteriaSet {
        edges {
          node {
            id
            responsePercentage
            consecutiveDays
            minTrial
            fromStatus {
              id
              statusName
            }
            toStatus {
              id
              statusName
            }
          }
        }
      }
    }
  }
`

const CREATE_MASTERY = gql`
  mutation masteryCriteria($name: String!) {
    masteryCriteria(input: { name: $name }) {
      masteryCriteria {
        id
        name
        createdAt
        isDefault
        statuscriteriaSet {
          edges {
            node {
              id
              responsePercentage
              consecutiveDays
              minTrial
              fromStatus {
                id
                statusName
              }
              toStatus {
                id
                statusName
              }
            }
          }
        }
      }
    }
  }
`

const UPDATE_MASTERY = gql`
  mutation($id: ID!, $name: String!) {
    masteryCriteria(input: { id: $id, name: $name }) {
      masteryCriteria {
        id
        name
        createdAt
        isDefault
        statuscriteriaSet {
          edges {
            node {
              id
              responsePercentage
              consecutiveDays
              minTrial
              fromStatus {
                id
                statusName
              }
              toStatus {
                id
                statusName
              }
            }
          }
        }
      }
    }
  }
`

const MasteryCriteria = () => {
  const [visible, setVisible] = useState(false)
  const [newMasterDrawer, setNewMasterDrawer] = useState(false)
  const [criteriaid, setCriteria] = useState('')
  const [tableData, setTableData] = useState()
  const [updateMaster, setUpdateMaster] = useState()
  const [updateChildFormDrawer, setUpdateChildFormDrawer] = useState(false)
  const [updateChildId, setUpdatechildId] = useState()

  const { loading, error, data } = useQuery(MASTER_TARGET, { suspend: true })

  useEffect(() => {
    if (data) {
      setTableData(data.masteryCriteria)
    }
  }, [data])

  const showDrawer = (e, crId) => {
    setVisible(true)
    setCriteria(crId)
  }

  const onClose = () => {
    setVisible(false)
  }

  const onNewMasterDrawerClose = () => {
    setNewMasterDrawer(false)
  }

  if (loading) {
    return <LoadingComponent />
  }
  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>
  }

  const columns = [
    {
      title: 'Mastery Criteria Name',
      dataIndex: 'name',
      key: 'masterycriterianame',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: obj => <div>{moment(obj).format('YYYY-MM-DD')}</div>,
    },
    {
      title: 'Action',
      key: 'operation',
      render: obj => (
        <span>
          <Tag
            onClick={() => {
              setUpdateMaster(obj)
            }}
          >
            <a>Edit</a>
          </Tag>
          <Tag>
            <a onClick={e => showDrawer(e, obj.id)}>Add Criteria</a>
          </Tag>
        </span>
      ),
    },
  ]

  const expandedRowRender = record => {
    const columns = [
      {
        title: 'From Status',
        dataIndex: 'node.fromStatus.statusName',
        key: 'fromStatus',
      },
      {
        title: 'To Status',
        dataIndex: 'node.toStatus.statusName',
        key: 'toStatus',
        width: '160px',
      },
      {
        title: 'Response Percentage',
        dataIndex: 'node.responsePercentage',
        key: 'responsePercentage',
        width: '160px',
      },
      {
        title: 'Consecutive Days',
        dataIndex: 'node.consecutiveDays',
        key: 'consecutiveDays',
        width: '160px',
      },
      { title: 'Mininum Trials', dataIndex: 'node.minTrial', key: 'minTrial', width: '160px' },
      {
        title: 'Actions',
        render(obj) {
          return (
            <Tag
              style={{ cursor: 'pointer' }}
              onClick={() => {
                // if (obj.node && obj.node.id && obj.node.fromStatus && obj.node.toStatus) {
                if (obj.node && obj.node.id) {
                  setUpdatechildId(obj.node.id)
                  setUpdateChildFormDrawer(true)
                } else {
                  notification.error({
                    message: 'Sorry, Item does not exist',
                  })
                }
              }}
            >
              Edit
            </Tag>
          )
        },
      },
    ]
    return (
      <Table
        width="100%"
        columns={columns}
        dataSource={record.statuscriteriaSet.edges}
        bordered
        rowKey={record => record.node.id}
        showHeader
        size="small"
        pagination={false}
      />
    )
  }

  console.log(visible, newMasterDrawer, updateChildFormDrawer, updateMaster, 'visible')
  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Button
            type="primary"
            style={{ marginBottom: 10 }}
            onClick={() => setNewMasterDrawer(true)}
          >
            <PlusOutlined />
            ADD MASTERY CRITERIA
          </Button>
        </div>
      </div>
      <div className="mastery-criteria-table">
        {tableData && (
          <Table
            bordered
            dataSource={tableData}
            columns={columns}
            rowKey={record => record.id}
            expandedRowRender={expandedRowRender}
            expandRowByClick
          />
        )}
      </div>

      <Drawer
        title="Create Child Mastery"
        placement="right"
        width={550}
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        <MasteryCriteriaForm
          criteriaid={criteriaid}
          setOpen={setVisible}
          MASTER_TARGET={MASTER_TARGET}
        />
      </Drawer>
      <Drawer
        title="Create Mastery Criteria Target"
        placement="right"
        width={400}
        closable={false}
        onClose={onNewMasterDrawerClose}
        visible={newMasterDrawer}
      >
        <div
          style={{
            padding: '5px 30px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <NewMasteryForm setOpen={setNewMasterDrawer} />
        </div>
      </Drawer>
      <Drawer
        title="Update Mastery Criteria Target"
        placement="right"
        width={550}
        closable={false}
        onClose={() => setUpdateChildFormDrawer(false)}
        visible={updateChildFormDrawer}
      >
        <div
          style={{
            padding: '5px 30px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <UpdateMasterChildForm setOpen={setUpdateChildFormDrawer} id={updateChildId} />
        </div>
      </Drawer>
      <Drawer
        title="Update Mastery Criteria"
        placement="right"
        width={400}
        closable={false}
        onClose={() => setUpdateMaster(null)}
        visible={updateMaster ? true : false}
      >
        <div
          style={{
            padding: '5px 30px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <UpdateMasteryForm setOpen={setUpdateMaster} master={updateMaster} />
        </div>
      </Drawer>
    </div>
  )
}

const NewMasteryFormBasic = ({ form, setOpen }) => {
  const [
    createMastery,
    { data: createMasteryData, error: createMasteryError, loading: createMasteryLoading },
  ] = useMutation(CREATE_MASTERY, {
    update(cache, { data }) {
      console.log('data', data.masteryCriteria.masteryCriteria)
      const masteryCriteria = cache.readQuery({ query: MASTER_TARGET })
      console.log(masteryCriteria)
      cache.writeQuery({
        query: MASTER_TARGET,
        data: {
          masteryCriteria: [
            data.masteryCriteria.masteryCriteria,
            ...masteryCriteria.masteryCriteria,
          ],
        },
      })
    },
  })

  useEffect(() => {
    if (createMasteryError) {
      notification.error({
        message: 'Opps their something is wrong',
      })
    }
    if (createMasteryData) {
      notification.success({
        message: 'New master criteria created sucessfully',
      })
      setOpen(null)
      form.resetFields()
    }
  }, [createMasteryData, createMasteryError])

  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error) {
        createMastery({
          variables: {
            name: values.name,
          },
        })
      }
    })
  }

  return (
    <Form name="targetForm" onSubmit={handleSubmit}>
      <Form.Item label="Criteria Name" style={{ display: 'inline-block', width: '100%' }}>
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: 'Please enter From Status' }],
        })(<Input placeholder="Give the master criteria name" size="large" />)}
      </Form.Item>
      <Button
        type="primary"
        htmlType="submit"
        style={{ marginTop: 0, fontSize: 16, width: '100%', height: 40 }}
        loading={createMasteryLoading}
      >
        Create Criteria
      </Button>
    </Form>
  )
}

const NewMasteryForm = Form.create()(NewMasteryFormBasic)

const UpdateMasteryFormBasic = ({ form, setOpen, master }) => {
  const [
    updateMastery,
    { data: updateMasteryData, error: updateMasteryError, loading: updateMasteryLoading },
  ] = useMutation(UPDATE_MASTERY)

  useEffect(() => {
    if (updateMasteryError) {
      notification.error({
        message: 'Opps their something is wrong',
      })
    }
    if (updateMasteryData) {
      notification.success({
        message: 'New master criteria created sucessfully',
      })
      setOpen(false)
      form.resetFields()
    }
  }, [updateMasteryData, updateMasteryError])

  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error) {
        updateMastery({
          variables: {
            id: master.id,
            name: values.name,
          },
        })
      }
    })
  }

  return (
    <Form name="targetForm" onSubmit={handleSubmit}>
      <Form.Item label="Criteria Name" style={{ display: 'inline-block', width: '100%' }}>
        {form.getFieldDecorator('name', {
          initialValue: master?.name,
          rules: [{ required: true, message: 'Please enter From Status' }],
        })(<Input placeholder="Give the master criteria name" size="large" />)}
      </Form.Item>
      <Button
        type="primary"
        htmlType="submit"
        style={{ marginTop: 0, fontSize: 16, width: '100%', height: 40 }}
        loading={updateMasteryLoading}
      >
        Update Criteria
      </Button>
    </Form>
  )
}

const UpdateMasteryForm = Form.create()(UpdateMasteryFormBasic)

export default MasteryCriteria

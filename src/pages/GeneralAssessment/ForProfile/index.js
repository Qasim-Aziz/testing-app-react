/* eslint-disable */

import React, { useEffect, useState } from 'react'
import {
  CheckSquareFilled,
  DeleteOutlined,
  PauseOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  FilterOutlined,
} from '@ant-design/icons'
import {
  Badge,
  Button,
  Drawer,
  Dropdown,
  Icon,
  Input,
  Layout,
  Tag,
  Menu,
  notification,
  Popconfirm,
  Radio,
  Table,
  Tabs,
  Tooltip,
  Typography,
} from 'antd'
import {
  GET_GENERAL_ASSESSMENT,
  UPDATE_GENERAL_ASSESSMENT,
  DELETE_GENERAL_ASSESSMENT,
} from '../query'
import client from '../../../apollo/config'
import { useQuery, useLazyQuery, useMutation } from 'react-apollo'
import CreateGenAssessForm from './CreateGenAssessForm'

const { TabPane } = Tabs

const { Content } = Layout
const { Text } = Typography

function Assessment() {
  const [createAssessDrawer, setCreateAssessDrawer] = useState(false)
  const [update, setUpdate] = useState(false)
  const [currentRow, setCurrentRow] = useState(null)
  const [tableData, setTableData] = useState(null)

  const {
    data: genAssessData,
    loading: genAssessLoading,
    error: genAssessError,
    refetch,
  } = useQuery(GET_GENERAL_ASSESSMENT)

  useEffect(() => {
    if (genAssessData) {
      const temp = []
      console.log(genAssessData.getGeneralAssessment.edges)
      genAssessData.getGeneralAssessment.edges.map(item => {
        const tempSubmodules = []
        for (let i = 0; i < item.node.submodules?.edges.length; i++) {
          tempSubmodules.push(item.node.submodules.edges[i].node)
        }
        temp.push({ ...item.node, submodules: tempSubmodules })
      })
      setTableData(temp)
    }
    if (genAssessError) {
      notification.error({
        message: 'Something went wrong',
        description: 'Unable to fetch assessments',
      })
    }
  }, [genAssessData, genAssessError])

  const handleDelete = row => {
    if (row.id) {
      client
        .mutate({
          mutation: DELETE_GENERAL_ASSESSMENT,
          variables: {
            pk: row.id,
          },
        })
        .then(res => {
          notification.success({
            message: 'Assessment deleted successfully',
          })
          refetch()
        })
        .catch(err => {
          notification.error({
            message: 'Something went wrong',
            description: 'Unable to delete assessment',
          })
        })
    }
  }
  const columns = [
    {
      title: 'Sr No.',
      width: '80px',
      render: (text, row) => tableData.indexOf(row) + 1,
    },
    {
      title: 'Assessment',
      dataIndex: 'name',
      render: (text, row) => {
        return (
          <span>
            <Button
              type="link"
              onClick={() => {
                setUpdate(true)
                setCurrentRow(row)
                setCreateAssessDrawer(true)
              }}
            >
              {text}
            </Button>
            {row.submodules.map(tag => {
              return (
                <Tag className="edit-tag" key={tag.name}>
                  <span>{tag.name.length > 15 ? `${tag.slice(0, 15)}...` : tag.name}</span>
                </Tag>
              )
            })}
          </span>
        )
      },
    },
    {
      title: 'Actions',
      render: (text, row) => {
        return (
          <>
            <Popconfirm
              title="Are you sure you don't want this record?"
              onConfirm={() => handleDelete(text)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" style={{ color: 'red' }}>
                <DeleteOutlined /> Delete
              </Button>
            </Popconfirm>
          </>
        )
      },
    },
  ]

  return (
    <div className="profileTab-container">
      <div className="profileTab-heading">
        <p>Assessment</p>
      </div>
      <Content
        style={{
          maxWidth: '95%',
          width: '100%',
          paddingTop: '2em',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', gap: '16px' }}>
            <Button
              type="primary"
              onClick={() => {
                setUpdate(false)
                setCurrentRow(null)
                setCreateAssessDrawer(true)
              }}
            >
              <PlusOutlined />
              Create New Assessment
            </Button>
          </div>
        </div>
        <Table
          dataSource={tableData}
          loading={genAssessLoading}
          columns={columns}
          bordered
          rowKey={record => record.id}
          pagination={false}
          style={{ marginTop: '1em', backgroundColor: 'white' }}
        />
      </Content>

      <Drawer
        visible={createAssessDrawer}
        onClose={() => {
          setCreateAssessDrawer(false)
        }}
        width={500}
        destroyOnClose
        title="Create New Assessment"
      >
        <div
          style={{
            padding: '0px 30px',
          }}
        >
          <CreateGenAssessForm
            update={update}
            refetchAssess={refetch}
            currentRow={currentRow}
            setCreateAssessDrawer={setCreateAssessDrawer}
          />
        </div>
      </Drawer>
    </div>
  )
}

export default Assessment

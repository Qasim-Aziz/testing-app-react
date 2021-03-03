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
import { useQuery, useLazyQuery, useMutation } from 'react-apollo'
import CreateGenAssessForm from './CreateGenAssessForm'

const { TabPane } = Tabs

const { Content } = Layout
const { Text } = Typography

function Assessment() {
  const clinicId = JSON.parse(localStorage.getItem('userId'))

  const [createAssessDrawer, setCreateAssessDrawer] = useState(false)
  const [update, setUpdate] = useState(false)
  const [currentRow, setCurrentRow] = useState(null)
  const [tableData, setTableData] = useState(null)

  const [
    getGenAssess,
    { data: genAssessData, loading: genAssessLoading, error: genAssessError, refetch },
  ] = useLazyQuery(GET_GENERAL_ASSESSMENT)

  const [
    deleteGenAssess,
    { data: deleteAssessData, loading: deleteAssessLoading, error: deleteAssessError },
  ] = useMutation(DELETE_GENERAL_ASSESSMENT)

  useEffect(() => {
    getGenAssess()
  }, [])

  useEffect(() => {
    if (deleteAssessData) {
      notification.success({
        message: 'Assessment deleted successfully',
      })
      refetch()
    }
    if (deleteAssessError) {
      notification.error({
        message: 'Something went wrong',
        description: 'Unable to delete assessment',
      })
    }
  }, [deleteAssessData, deleteAssessError])

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
  }, [genAssessData])

  const handleDelete = row => {
    if (row.id) {
      deleteGenAssess({
        variables: {
          pk: row.id,
        },
      })
    }
  }

  console.log(tableData, 'tb')
  const columns = [
    {
      title: 'Sr No.',
      width: '80px',
      render: (text, row) => tableData.indexOf(row) + 1,
    },
    {
      title: 'Title',
      dataIndex: 'name',
      render: (text, row) => {
        return (
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
        )
      },
    },
    {
      title: 'Actions',
      render: (text, row) => {
        return (
          <div>
            <Button>More</Button>
            <Button
              onClick={() => {
                handleDelete(row)
              }}
            >
              Delete
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div>
      <Content
        style={{
          padding: '0px 20px',
          maxWidth: '95%',
          width: '100%',
          margin: '0px auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              marginBottom: 20,
              fontSize: 24,
              marginTop: 15,
              marginLeft: 5,
              color: '#000',
            }}
          >
            Assessment
          </Text>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Button
              type="primary"
              onClick={() => {
                setUpdate(false)
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

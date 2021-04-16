/* eslint-disable */

import React, { useEffect, useState } from 'react'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import {
  Button,
  Drawer,
  Layout,
  Tag,
  notification,
  Popconfirm,
  Tooltip,
  Radio,
  Table,
  Icon,
  Tabs,
  Typography,
} from 'antd'
import { GET_GENERAL_ASSESSMENT, DELETE_GENERAL_ASSESSMENT } from '../query'
import client from '../../../apollo/config'
import { useQuery, useLazyQuery, useMutation } from 'react-apollo'
import CreateGenAssessForm from './CreateGenAssessForm'
import { COLORS, DRAWER } from 'assets/styles/globalStyles'
import '../index.scss'

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
        temp.push({ ...item.node, key: item.node.id, submodules: tempSubmodules })
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
              style={{ padding: '0 8px 0 0' }}
              type="link"
              onClick={() => {
                setUpdate(true)
                setCurrentRow(row)
                setCreateAssessDrawer(true)
              }}
            >
              {text}
            </Button>
            {row.hasSubmodule &&
              row.submodules.map(tag => {
                return (
                  <Tag id={tag.id} className="edit-tag" key={tag.name}>
                    {tag.name.length > 15 ? (
                      <Tooltip title={tag.name}>{tag.name.slice(0, 15)}...</Tooltip>
                    ) : (
                      <span>{tag.name}</span>
                    )}
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
              <Button type="link" style={{ color: COLORS.danger }}>
                <DeleteOutlined /> Delete
              </Button>
            </Popconfirm>
            {/* <span style={{ borderRight: '1px solid #ccc', margin: '0 8px' }} />
            <Button
              type="link"
              onClick={() => {
                setUpdate(true)
                setCurrentRow(row)
                setCreateAssessDrawer(true)
              }}
            >
              <Icon type="edit" />
              Edit
            </Button> */}
          </>
        )
      },
    },
  ]

  return (
    <div className="profileTab-container">
      <div className="profileTab-heading">
        <p>Record Assessment Score</p>
      </div>
      <div>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 5 }}>
          This Section allows you to digitize and record assessments scores for any paper-based
          assessments with three simple steps
        </div>
        <div style={{ marginBottom: 5 }}>
          <b>1.</b> Create Main assessments in this section.
        </div>
        <div style={{ marginBottom: 5 }}>
          <b>2.</b> Create Sub assessments in this section.
        </div>
        <div style={{ marginBottom: 5 }}>
          <b>3.</b> Record assessment scores for each child from the Main menu -
          <b> Intervention &gt; Assessment &gt; Record Assessment score</b>.
        </div>
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

        <div
          style={{ width: '100%', marginTop: '1em', backgroundColor: 'white' }}
          className="gen-assess-table"
        >
          <Table
            dataSource={tableData}
            loading={genAssessLoading}
            columns={columns}
            bordered
            rowKey={record => record.id}
            pagination={false}
          />
        </div>
      </Content>

      <Drawer
        visible={createAssessDrawer}
        onClose={() => {
          setCreateAssessDrawer(false)
        }}
        width={DRAWER.widthL2}
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

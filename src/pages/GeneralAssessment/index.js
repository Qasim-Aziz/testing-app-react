/* eslint-disable no-else-return */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
import { DeleteOutlined, PlusOutlined, FilterOutlined } from '@ant-design/icons'
import {
  Button,
  Drawer,
  Icon,
  Input,
  Layout,
  notification,
  Popconfirm,
  Table,
  Tooltip,
  Typography,
} from 'antd'
import React, { useEffect, useState } from 'react'
import { useMutation, useQuery, useLazyQuery } from 'react-apollo'
import { useDispatch, useSelector } from 'react-redux'
import LearnerSelect from 'components/LearnerSelect'
import { DRAWER } from 'assets/styles/globalStyles'
import moment from 'moment'
import client from '../../apollo/config'
import RecordAssessmentForm from './recordAssessmentForm'
import { STUDNET_INFO, GET_GENERAL_DATA, DELETE_GENERAL_DATA } from './query'
import './index.scss'

const { Content } = Layout
const { Text } = Typography

export default () => {
  const [open, setOpen] = useState(false)
  const studentId = localStorage.getItem('studentId')
  const [originalData, setOriginalData] = useState([])
  const [tableData, setTableData] = useState([])
  const [update, setUpdate] = useState(false)
  const [currentRow, setCurrentRow] = useState(null)
  const dispatch = useDispatch()
  const [filterAssessment, setFilterAssessment] = useState('')
  const [filterSubmodule, setFilterSubmodule] = useState('')
  const [filterNote, setFilterNote] = useState('')
  const [visibleFilter, setVisibleFilter] = useState(false)

  const [fetchAssessmentRecords, { data, loading, error, refetch }] = useLazyQuery(
    GET_GENERAL_DATA,
    {
      variables: {
        student: studentId,
      },
      fetchPolicy: 'network-only',
    },
  )

  const [loadStudentData, { data: studnetInfo }] = useLazyQuery(STUDNET_INFO, {
    variables: {
      studentId,
    },
  })

  const user = useSelector(state => state.user)

  useEffect(() => {
    updateTableData()
    dispatch({
      type: 'learnersprogram/LOAD_DATA',
    })
  }, [])

  useEffect(() => {
    if (studentId) {
      fetchAssessmentRecords({
        variables: {
          student: studentId,
        },
      })
    }
  }, [studentId])

  useEffect(() => {
    updateTableData()
  }, [data])

  const updateTableData = () => {
    if (data) {
      try {
        const tempTable = []
        data.getGeneralData.edges.map(item => {
          if (item.node.modules && item.node.modules.edges.length > 0) {
            tempTable.push({
              id: item.node.id,
              key: Math.random(),
              date: item.node.time,
              module: {
                isParent: true,
                pk: item.node.modules.edges[0].node.id,
                id: item.node.modules.edges[0].node.module.id,
                name: item.node.modules.edges[0].node.module.name,
                score: item.node.modules.edges[0].node.score,
              },
              submodules: item.node.submodules.edges.map(sbm => ({
                pk: sbm.node.id,
                id: sbm.node.submodule.id,
                name: sbm.node.submodule.name,
                score: sbm.node.score,
              })),
              note: item.node.note,
              children: item.node.submodules.edges.map(sbm => ({
                module: {
                  pk: sbm.node.id,
                  id: sbm.node.submodule.id,
                  name: sbm.node.submodule.name,
                  score: sbm.node.score,
                },
                id: sbm.node.submodule.id,
                key: Math.random(),
              })),
            })
          }
        })
        console.log(tempTable, 'tempTable')
        setOriginalData(tempTable)
        setTableData(tempTable)
      } catch (e) {
        console.log(e)
        notification.error({
          message: 'Something went wrong',
          description: e.message,
        })
      }
    }
  }

  useEffect(() => {
    if (studentId) {
      loadStudentData()
    }
  }, [studentId])

  console.log(currentRow)
  useEffect(() => {
    let tempList = originalData
    if (filterAssessment) {
      tempList =
        tempList &&
        tempList.filter(
          item => item.module.name && item.module.name.toLowerCase().includes(filterAssessment),
        )
    }
    if (filterNote) {
      tempList =
        tempList &&
        tempList.filter(item => item.note && item.note.toLowerCase().includes(filterNote))
    }
    if (filterSubmodule) {
      tempList =
        tempList &&
        tempList.filter(
          item => item.submodule && item.submodule.name.toLowerCase().includes(filterSubmodule),
        )
    }
    setTableData(tempList)
  }, [originalData, filterAssessment, filterSubmodule, filterNote])

  const handleDelete = row => {
    if (row && row.id) {
      client
        .mutate({
          mutation: DELETE_GENERAL_DATA,
          variables: {
            pk: row.id,
          },
        })
        .then(() => {
          refetch()
          notification.success({
            message: 'Record deleted successfully',
          })
        })
        .catch(() => {
          notification.error({
            message: 'Something went wrong',
            description: 'Unable to delete record',
          })
        })
    }
  }

  const [sortOrderInfo, setSortOrderInfo] = useState(null)

  const handleSortChange = (pagination, filters, sorter) => {
    setSortOrderInfo(sorter)
  }
  const sortedInfo = sortOrderInfo || {}

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 140,
      sorter: (a, b) => {
        if (a.date !== 'None' && b.date !== 'None') {
          return new Date(a.date) - new Date(b.date)
        }
        return false
      },
      sortOrder: sortedInfo.columnKey === 'date' && sortedInfo.order,
      sortDirections: ['ascend', 'descend'],
      render: (text, row) => (row.module.isParent ? moment(text).format('YYYY-MM-DD') : null),
    },
    {
      title: 'Assessment',
      dataIndex: 'module.name',
    },
    {
      title: 'Score',
      dataIndex: 'module.score',
      key: 'score',
      sorter: (a, b) => a.score - b.score,
      sortOrder: sortedInfo.columnKey === 'score' && sortedInfo.order,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Note',
      dataIndex: 'note',
    },
    {
      title: 'Actions',
      width: '250px',
      render: text => {
        if (text.module.isParent) {
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
              <span style={{ borderRight: '1px solid #ccc', margin: '0 8px' }} />
              <Button
                type="link"
                onClick={() => {
                  setCurrentRow(text)
                  setUpdate(true)
                  setOpen(true)
                }}
              >
                <Icon type="edit" />
                Edit
              </Button>
            </>
          )
        }
        return null
      },
    },
  ]

  const filterHeader = (
    <div
      style={{
        minHeight: '40px',
        height: 'fit-content',
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <div style={{ margin: 'auto 35px auto 0', display: 'flex' }}>
        <span style={{ marginRight: '6px', marginTop: '2px', fontSize: 14 }}>Assessment: </span>
        <Input
          size="small"
          placeholder="Search Assessment"
          value={filterAssessment}
          onChange={e => setFilterAssessment(e.target.value)}
          style={{ width: 140, marginRight: 8, display: 'block' }}
        />
      </div>

      <div style={{ margin: 'auto 35px', display: 'flex' }}>
        <span style={{ marginRight: '6px', marginTop: '2px', fontSize: 14 }}>Sub-Module: </span>
        <Input
          size="small"
          placeholder="Search Sub-Module"
          value={filterSubmodule}
          onChange={e => setFilterSubmodule(e.target.value)}
          style={{ width: 140, marginRight: 8, display: 'block' }}
        />
      </div>
      <div style={{ margin: 'auto 35px', display: 'flex' }}>
        <span style={{ marginRight: '6px', marginTop: '2px', fontSize: 14 }}>Note: </span>
        <Input
          size="small"
          placeholder="Search Note"
          value={filterNote}
          onChange={e => setFilterNote(e.target.value)}
          style={{ width: 140, marginRight: 8, display: 'block' }}
        />
      </div>
    </div>
  )

  const showDrawerFilter = () => {
    setVisibleFilter(true)
  }

  const onCloseFilter = () => {
    setVisibleFilter(false)
  }

  return (
    <Layout style={{ padding: '0px' }}>
      <Content className="gen-assess-content">
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
            {`${studnetInfo?.student.firstname || ''}`} - General Assessment
          </Text>
          <div style={{ display: 'flex', gap: '16px' }}>
            {user?.role !== 'parents' && (
              <Button onClick={showDrawerFilter} size="large">
                <FilterOutlined />
              </Button>
            )}

            <Drawer
              visible={visibleFilter}
              onClose={onCloseFilter}
              width={DRAWER.widthL4}
              title="Select Learner"
              placement="right"
            >
              <LearnerSelect />
            </Drawer>
            <Button
              type="primary"
              size="large"
              onClick={() => {
                setUpdate(false)
                setCurrentRow(null)
                setOpen(true)
              }}
            >
              <PlusOutlined />
              Record Assessment
            </Button>
          </div>
        </div>
        <div className="gen-assess-table">
          <Table
            columns={columns}
            onChange={handleSortChange}
            bordered
            rowKey="key"
            dataSource={tableData}
            title={() => {
              return filterHeader
            }}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '30', '50'],
              position: 'bottom',
            }}
            loading={loading}
          />
        </div>
        <div>
          <Drawer
            visible={open}
            onClose={() => setOpen(false)}
            placement="right"
            width={DRAWER.widthL2}
            title="Record Assessmet"
            destroyOnClose
          >
            <RecordAssessmentForm
              update={update}
              currentRow={currentRow}
              setUpdate={setUpdate}
              setCurrentRow={setCurrentRow}
              setOpen={setOpen}
              refetch={refetch}
            />
          </Drawer>
        </div>
      </Content>
    </Layout>
  )
}

/* eslint-disable no-else-return */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
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
import gql from 'graphql-tag'
import React, { useEffect, useState } from 'react'
import { useMutation, useQuery, useLazyQuery } from 'react-apollo'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import LearnerSelect from 'components/LearnerSelect'
import { STUDNET_INFO } from './query'
// import './index.scss'

const { TabPane } = Tabs

const { Content } = Layout
const { Text } = Typography

export default () => {
  const [open, setOpen] = useState(false)
  const [suggestTarget, setSuggestTarget] = useState()
  const [selectedTarget, setSelectedTarget] = useState()
  const [suggestEquiTarget, setSuggestEquiTarget] = useState()
  const studentId = localStorage.getItem('studentId')
  const [originalData, setOriginalData] = useState([])
  const [tableData, setTableData] = useState([])
  const history = useHistory()
  const dispatch = useDispatch()
  const [filterNote, setFilterNote] = useState('')
  const [filterTitle, setFilterTitle] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [visibleFilter, setVisibleFilter] = useState(false)

  const [selectedIdForDelete, setSelectedIdForDelete] = useState(null)

  const [loadStudentData, { data: studnetInfo }] = useLazyQuery(STUDNET_INFO, {
    variables: {
      studentId,
    },
  })

  const user = useSelector(state => state.user)
  const student = useSelector(state => state.student)

  useEffect(() => {
    console.log(studnetInfo)
  }, [studnetInfo])

  useEffect(() => {
    if (studentId) {
      loadStudentData()
    }
  }, [studentId])

  useEffect(() => {
    dispatch({
      type: 'learnersprogram/LOAD_DATA',
    })
  }, [])

  useEffect(() => {
    let tempList = originalData
    if (filterTitle) {
      tempList =
        tempList &&
        tempList.filter(
          item => item.node.title && item.node.title.toLowerCase().includes(filterTitle),
        )
    }
    if (filterNote) {
      tempList =
        tempList &&
        tempList.filter(
          item => item.node.notes && item.node.notes.toLowerCase().includes(filterNote),
        )
    }
    if (filterCategory) {
      tempList =
        tempList &&
        tempList.filter(
          item => item.node.category && item.node.category.toLowerCase().includes(filterCategory),
        )
    }
    if (filterStatus) {
      tempList =
        tempList &&
        tempList.filter(
          item => item.node.status && item.node.status.toLowerCase().includes(filterStatus),
        )
    }
    setTableData(tempList)
  }, [filterTitle, filterNote, filterCategory, filterStatus])

  const startPeakEquivalence = node => {
    dispatch({
      type: 'peakequivalence/SET_STATE',
      payload: {
        ProgramId: node.id,
      },
    })
    window.location.href = '/#/peakEqvi'
  }

  const makeInactive = id => {
    console.log('selected id ======> ', id)
    const newData = tableData?.filter(item => item.node.id !== id)
    setTableData(newData)

    // write make assessment inActive code below
    setSelectedIdForDelete(id)
  }
  const columns = [
    {
      title: 'Date',
      dataIndex: 'node.date',
    },

    {
      title: 'Title',
      dataIndex: 'node.title',
    },
    {
      title: 'Note',
      dataIndex: 'node.notes',
    },

    {
      title: 'Status',
      align: 'center',
      render: (text, obj) => (
        <Badge
          count={obj.node.status.charAt(0).toUpperCase() + obj.node.status.slice(1).toLowerCase()}
          style={{ background: obj.node.status === 'PROGRESS' ? '#52c41a' : '#faad14' }}
        />
      ),
    },
    {
      title: 'Action',
      align: 'center',
      minWidth: '100px',
      maxWidth: '100px',
      render: (text, obj) => {
        if (obj.node.category === 'TRANSFORMATION') {
          return <p>Under development</p>
        } else {
          const seeAssesmentMenu = (
            <Menu.Item key="seeAssesment">
              <CheckSquareFilled /> See Assesment
            </Menu.Item>
          )

          const seeReportMenu = (
            <Menu.Item key="seeReport">
              <Icon type="snippets" /> See Report
            </Menu.Item>
          )

          const suggestTargetMenu = (
            <Menu.Item key="suggestTarget">
              <Icon type="diff" /> Suggest Target
            </Menu.Item>
          )

          const resumeAssesmentMenu = (
            <Menu.Item key="resumeAssesment">
              <PauseOutlined /> Resume Assesment
            </Menu.Item>
          )

          const startAssesmentMenu = (
            <Menu.Item key="startAssesment">
              <PlayCircleOutlined /> Start Assesment
            </Menu.Item>
          )

          const menuItems = []

          if (obj.node.status === 'COMPLETED') {
            menuItems.push(seeAssesmentMenu)
            menuItems.push(seeReportMenu)
            menuItems.push(<Menu.Divider />)
            menuItems.push(suggestTargetMenu)
          } else if (obj.node.submitpeakresponsesSet.totalAttended > 0) {
            menuItems.push(resumeAssesmentMenu)
            menuItems.push(seeReportMenu)
            menuItems.push(<Menu.Divider />)
            menuItems.push(suggestTargetMenu)
          } else {
            menuItems.push(startAssesmentMenu)
            menuItems.push(<Menu.Divider />)
            menuItems.push(suggestTargetMenu)
          }

          //   const menu = <Menu onClick={e => handleMenuActions(e, obj)}>{menuItems}</Menu>

          return (
            <>
              <Tooltip placement="topRight" title="Delete Assessment">
                <Popconfirm
                  title="Are you sure you don't want this assessment?"
                  onConfirm={() => makeInactive(obj.node.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" style={{ color: 'red' }}>
                    <DeleteOutlined /> Delete
                  </Button>
                </Popconfirm>
              </Tooltip>
              <span style={{ borderRight: '1px solid #ccc', margin: '0 8px' }} />
              <Dropdown>
                <a
                  role="presentation"
                  className="ant-dropdown-link"
                  onClick={e => e.preventDefault()}
                  style={{ color: '#1890ff' }}
                >
                  More <Icon type="down" />
                </a>
              </Dropdown>
            </>
          )
        }
      },
    },
  ]

  const filterHeader = (
    <div
      style={{
        minHeight: '45px',
        height: 'fit-content',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ margin: 'auto', display: 'flex' }}>
        <span style={{ marginRight: '6px', marginTop: '2px' }}>Title: </span>
        <Input
          size="small"
          placeholder="Search Title"
          value={filterTitle}
          onChange={e => setFilterTitle(e.target.value)}
          style={{ width: 140, marginRight: 8, display: 'block' }}
        />
      </div>
      <div style={{ margin: 'auto', display: 'flex' }}>
        <span style={{ marginRight: '6px', marginTop: '2px' }}>Note: </span>
        <Input
          size="small"
          placeholder="Search Note"
          value={filterNote}
          onChange={e => setFilterNote(e.target.value)}
          style={{ width: 140, marginRight: 8, display: 'block' }}
        />
      </div>
      <div style={{ margin: 'auto' }}>
        <span style={{ marginRight: '6px' }}>Status: </span>
        <Radio.Group
          size="small"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          buttonStyle="solid"
        >
          <Radio.Button value="">All</Radio.Button>
          <Radio.Button value="progress">In Progress</Radio.Button>
          <Radio.Button value="completed">Completed</Radio.Button>
        </Radio.Group>
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
      <Content
        style={{
          padding: '0px 20px',
          maxWidth: '86%',
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
              width={350}
              title="Select Learner"
              placement="right"
            >
              <LearnerSelect />
            </Drawer>
            <Button type="primary" size="large" onClick={() => setOpen(true)}>
              <PlusOutlined />
              Record Assessment
            </Button>
          </div>
        </div>
        <div className="modify-peak-22-table">
          <Table
            columns={columns}
            size="small"
            bordered
            dataSource={null}
            title={() => {
              return filterHeader
            }}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '30', '50'],
              position: 'top',
            }}
            // loading={true}
          />
        </div>
      </Content>
    </Layout>
  )
}

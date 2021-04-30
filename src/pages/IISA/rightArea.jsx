/* eslint-disable react/no-unused-state */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-underscore-dangle */
/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-useless-concat */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-var */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-else-return */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-expressions */

import React from 'react'
import {
  Button,
  Typography,
  Drawer,
  Tabs,
  Popconfirm,
  Icon,
  notification,
  Radio,
  Modal,
  Layout,
  Table,
  Tooltip,
  Badge,
  Menu,
  Dropdown,
} from 'antd'
import {
  CheckSquareFilled,
  DeleteOutlined,
  PauseOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  FilterOutlined,
} from '@ant-design/icons'
import { connect } from 'react-redux'
import { gql } from 'apollo-boost'
import LearnerSelect from 'components/LearnerSelect'
import actions from 'redux/iisaassessment/actions'
import AssessmentForm from './AssessmentForm'
import AssessmentReport from './StartAssessment/report'
import apolloClient from '../../apollo/config'

const { Title, Text } = Typography
const { Content } = Layout
const { TabPane } = Tabs
const { confirm } = Modal

@connect(({ user, iisaassessment, student }) => ({ user, iisaassessment, student }))
class RightArea extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      newAssessment: false,
      suggestTarget: false,
      selectedAssessment: '',
      open: false,
      key: Math.random(),
      studentID: '',
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    if (localStorage.getItem('studentId')) {
      const studentID = JSON.parse(localStorage.getItem('studentId'))
      if (studentID) {
        dispatch({
          type: 'student/STUDENT_DETAILS',
        })
        dispatch({
          type: actions.LOAD_DATA,
          payload: {
            studentId: studentID,
          },
        })
      }
      this.setState({ studentID })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const studentID = JSON.parse(localStorage.getItem('studentId'))
    if (this.props.student.StudentName !== prevProps.student.StudentName) {
      this.getAssessmentData(studentID)
    }
    console.log('prev props')
    console.log(prevProps)
    console.log(this.props)
  }

  getAssessmentData = id => {
    this.setState({ studentID: id })
    const { dispatch } = this.props
    dispatch({
      type: actions.LOAD_DATA,
      payload: {
        studentId: id,
      },
    })
  }

  toggleForm = val => {
    const { dispatch } = this.props
    dispatch({
      type: 'iisaassessment/SET_STATE',
      payload: {
        NewAssessmentForm: val,
      },
    })
  }

  loadAssessment = id => {
    const { dispatch } = this.props
    dispatch({
      type: 'iisaassessment/LOAD_ASSESSMENT_OBJECT',
      payload: {
        objectId: id,
      },
    })
  }

  makeInactive = id => {
    const { dispatch } = this.props
    dispatch({
      type: 'iisaassessment/MAKE_INACTIVE',
      payload: {
        assessmentId: id,
      },
    })
  }

  onCloseFilter = () => {
    this.setState({
      visibleFilter: false,
    })
  }

  showDrawerFilter = () => {
    this.setState({
      visibleFilter: true,
    })
  }

  closeReportDrawer = () => {
    const { dispatch } = this.props
    dispatch({
      type: actions.SET_STATE,
      payload: {
        ReportDrawer: false,
      },
    })
  }

  openReportDrawer = () => {
    const { dispatch } = this.props
    dispatch({
      type: actions.SET_STATE,
      payload: {
        ReportDrawer: true,
      },
    })
  }

  handleMenuActions = (e, obj) => {
    const { dispatch } = this.props

    switch (e.key) {
      case 'seeAssesment': {
        localStorage.setItem('peakId', obj.node.id)
        localStorage.setItem('peakType', obj.node.category)
        history.push('/peakReport')
        break
      }

      case 'seeReport': {
        dispatch({
          type: actions.SET_STATE,
          payload: {
            SelectedAssessmentId: obj.node.id,
            ReportDrawer: true,
          },
        })
        break
      }

      // case 'resumeAssesment': {
      //   localStorage.setItem('peakId', obj.node.id)
      //   localStorage.setItem('peakType', obj.node.category)
      //   if (obj.node.category === 'TRANSFORMATION') {
      //     history.push('/classPage')
      //   } else {
      //     history.push('/peakAssign')
      //   }
      //   break
      // }

      case 'startAssesment': {
        dispatch({
          type: actions.SET_STATE,
          payload: {
            SelectedAssessmentId: obj.node.id,
          },
        })
        window.location.href = '/#/startIISA'

        break
      }

      default: {
        console.log(`Unknown menuitem - ${e.key}`)
      }
    }
  }

  render() {
    console.log('props inside rightArea')
    console.log(this.props)
    const { newAssessment, suggestTarget, open } = this.state
    const {
      student: { StudentName },
      iisaassessment: { AssessmentList, ReportDrawer, NewAssessmentForm, loading },
      user,
    } = this.props
    console.log('check heereee')
    console.log(this.props)
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
            <Menu.Item key="startAssesment">
              <PauseOutlined /> Resume Assesment
            </Menu.Item>
          )

          const startAssesmentMenu = (
            <Menu.Item key="startAssesment">
              <PlayCircleOutlined /> Start Assesment
            </Menu.Item>
          )

          const menuItems = []
          console.log(obj.node, 'object in node')
          // eslint-disable-next-line no-use-before-define
          if (obj.node.percentage === undefined) {
            menuItems.push(startAssesmentMenu)
            menuItems.push(seeReportMenu)
          } else if (obj.node.percentage === 100) {
            // menuItems.push(seeAssesmentMenu)
            menuItems.push(seeReportMenu)
            // menuItems.push(<Menu.Divider />)
            // menuItems.push(suggestTargetMenu)
          } else if (obj.node.percentage !== 0) {
            menuItems.push(resumeAssesmentMenu)
            menuItems.push(seeReportMenu)
          } else {
            menuItems.push(startAssesmentMenu)
            menuItems.push(seeReportMenu)
          }

          const menu = <Menu onClick={e => this.handleMenuActions(e, obj)}>{menuItems}</Menu>
          console.log('hrer')
          console.log(obj.node)
          return (
            <>
              <Tooltip placement="topRight" title="Delete Assessment">
                <Popconfirm
                  title="Are you sure you don't want this assessment?"
                  onConfirm={() => this.makeInactive(obj.node.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" style={{ color: 'red' }}>
                    <DeleteOutlined /> Delete
                  </Button>
                </Popconfirm>
              </Tooltip>
              <span style={{ borderRight: '1px solid #ccc', margin: '0 8px' }} />
              <Dropdown overlay={menu}>
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
        },
      },
    ]

    return (
      <>
        <Layout style={{ padding: '0px' }}>
          <Content
            style={{
              padding: '0px 20px',
              width: '100%',
              margin: '0px auto',
            }}
          >
            <iframe id="my_iframe" title="s" style={{ display: 'none' }} />
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
                {StudentName}&apos;s - IISA Assessment
              </Text>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                {user?.role !== 'parents' && (
                  <Button onClick={this.showDrawerFilter} size="large">
                    <FilterOutlined />
                  </Button>
                )}

                <Drawer
                  visible={this.state.visibleFilter}
                  onClose={this.onCloseFilter}
                  width={350}
                  title="Select Learner"
                  placement="right"
                >
                  <LearnerSelect />
                </Drawer>
                <Button
                  type="primary"
                  style={{ border: 'none', background: '#3f72af' }}
                  size="large"
                  onClick={() => this.setState({ open: true })}
                >
                  <PlusOutlined />
                  New Assessment
                </Button>
              </div>
            </div>

            <div className="modify-peak-22-table">
              <Table
                columns={columns}
                size="small"
                dataSource={AssessmentList}
                bordered
                pagination={{
                  defaultPageSize: 10,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20', '30', '50'],
                  position: 'top',
                }}
                loading={loading}
              />
            </div>

            <Drawer
              visible={open}
              onClose={() => {
                this.setState({ open: false })
              }}
              width="80%"
              title="Create New Assessment"
            >
              <div
                style={{
                  padding: '0px 30px',
                }}
              >
                <AssessmentForm
                  onClose={() => {
                    this.setState({ open: false })
                  }}
                />
              </div>
            </Drawer>

            <Drawer
              visible={ReportDrawer}
              onClose={() => {
                this.closeReportDrawer()
              }}
              width="80%"
              title="Assessment Report"
            >
              <div
                style={{
                  padding: '0px 30px',
                }}
              >
                <AssessmentReport
                  onClose={() => {
                    this.closeReportDrawer()
                  }}
                />
              </div>
            </Drawer>
          </Content>
        </Layout>
      </>
    )
  }
}

export default RightArea

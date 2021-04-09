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
/* eslint-disable object-shorthand */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/no-array-index-key */
/* eslint-disable array-callback-return */
/* eslint-disable */
import React from 'react'
import { Helmet } from 'react-helmet'
import { Layout, Row, Col, Card, Button, Typography, Drawer, Form, Menu, Select, Icon } from 'antd'
import html2canvas from 'html2canvas'
import { FilterOutlined } from '@ant-design/icons'
import JsPDF from 'jspdf'
import { connect } from 'react-redux'
import { gql } from 'apollo-boost'

import Moment from 'moment'

import LearnerSelect from 'components/LearnerSelect'
import StaffSelect from 'components/StaffSelect'
import VBMappReport from 'components/VBMappReport'

import DailyResponseRate from './dailyResponseRate'
import ProgressOverview from './progressOverview'
import Sessions from './sessions'
import Behavior from './behavior'
import Attendance from './attendance'
import Timesheet from './timesheet'
import Goals from './goals'
import Mand from './mand'
import MonthlyReport from './monthlyReport'
import CelerationChartPanel from './celeration-chart-panel.container'
import PeakBlockReport from './peakBlockReport'
import Appointments from './appointments'
import TargetResponseReport from './targetResponseReport'
import NetworkSankey from './networkSankey'
import client from '../../apollo/config'

import './padding.scss'
import { COLORS } from 'assets/styles/globalStyles'
import { BiReplyAll } from 'react-icons/bi'

const { Title, Text } = Typography
const { Content } = Layout
const { Option } = Select
const { SubMenu } = Menu

const STAFF_LIST = gql`
  query {
    staffs {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`

const parentCardStyle = {
  background: COLORS.palleteLight,
  borderRadius: 10,
  padding: '10px',
  margin: '7px 0 0 10px',
  height: 300,
  overflow: 'hidden',
}

const REPORT_MAPPING = {
  '/reports/progress_overview': 'Progress Overview',
  '/reports/daily_res_rate': 'Daily Response Rate',
  '/reports/behavior': 'Behavior',
  '/reports/mand': 'Mand',
  '/reports/sessions': 'Sessions',
  '/reports/goals': 'Goals',
  '/reports/celer_chart': 'Celeration Chart',
  '/reports/appointment_report': 'Appointment Report',
  '/reports/staff_activity': 'Staff Activity',
  '/reports/attendance': 'Attendance',
  '/reports/timesheet': 'Timesheet',
  '/reports/monthly_report': 'Monthly Report',
  '/reports/vbmapp': 'VBMAPP',
  '/reports/peak_block_report': 'Peak Block Report',
  '/reports/target_res_report': 'Target Response Report',
  '/reports/network_graph': 'Network & Sankey Graph',
}

// list to exclude learner's names from report title
const EXCLUDE_NAMES = ['Attendance', 'Timesheet']

@connect(({ user, student, learnersprogram, menu }) => ({ user, student, learnersprogram, menu }))
class Reports extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      current: 0,
      graphstartdate: Moment(Date.now())
        .subtract(14, 'days')
        .format('YYYY-MM-DD')
        .toString(),
      graphenddate: Moment(Date.now())
        .format('YYYY-MM-DD')
        .toString(),
      targetStatus: [],
      selectTargetArea: 0,
      programArea: [],
      defaultprogram: '',
      domainObj: [],
      key: 0,
      selectedprogram: null,
      statusselected: null,
      domainSelected: null,
      barKey: 20,
      visibleFilter: false,
      selectedStudentId: localStorage.getItem('studentId'),
      TabCheck: 'Progress Overview',
      windowWidth: window.innerWidth,
      staffs: [],
      selectedStaff: { id: '', name: '' },

      openKeys: ['sub1'],
      rootSubmenuKeys: ['sub1', 'sub2', 'sub4'],
    }

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
  }

  componentDidMount() {
    const { dispatch, user } = this.props
    dispatch({
      type: 'learnersprogram/LOAD_DATA',
    })

    dispatch({
      type: 'student/STUDENT_DETAILS',
    })

    let std = localStorage.getItem('studentId')
    if (std) {
      std = JSON.parse(std)
      dispatch({
        type: 'learnersprogram/SET_STATE',
        payload: {
          SelectedLearnerId: std,
        },
      })
    } else {
      dispatch({
        type: 'student/SET_STATE',
        payload: {
          StudentName: '',
        },
      })
    }
    window.addEventListener('resize', this.updateWindowDimensions)
    if (this.props.match.path !== '/reports')
      this.setState({ TabCheck: REPORT_MAPPING[this.props.match.path] })

    if (user.role === 'school_admin') {
      client.query({ query: STAFF_LIST }).then(res =>
        this.setState({
          staffs: res.data.staffs.edges,
          selectedStaff: res.data.staffs.edges[0].node,
        }),
      )
    } else {
      this.setState({
        selectedStaff: { id: user.staffId, name: user.staffName },
      })
    }
  }

  componentDidUpdate(prevProps) {
    const { user } = this.props
    console.log('user====>>>', user)
    if (user.staffName !== prevProps.user.staffName)
      this.setState({
        selectedStaff: { id: user.staffId, name: user.staffName },
      })
    if (this.props.match.path !== prevProps.match.path) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ TabCheck: REPORT_MAPPING[this.props.match.path] })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions)
  }

  onChange = current => {
    this.setState({ current })
  }

  noLearnerSelected = () => {
    return (
      <>
        <Row>
          <Col sm={24}>
            <div style={parentCardStyle}>
              <Title style={{ fontSize: 20, lineHeight: '27px', textAlign: 'center' }}>
                Select any learner from the list
              </Title>
            </div>
          </Col>
        </Row>
      </>
    )
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

  SetTabFunction = val => {
    this.setState({
      TabCheck: val,
    })
  }

  changeReportRoute = route => {
    this.props.match.path !== `/${route}` && this.props.history.push(`/${route}`)
  }

  updateWindowDimensions() {
    this.setState({
      windowWidth: window.innerWidth,
    })
  }

  selectStaff = staff => {
    this.setState({ selectedStaff: staff })
  }

  setRoute = e => {
    switch (e) {
      case 'Progress Overview':
        this.changeReportRoute('reports/progress_overview')
        break
      case 'Daily Response Rate':
        this.changeReportRoute('reports/daily_res_rate')
        break
      case 'Behavior':
        this.changeReportRoute('reports/behavior')
        break
      case 'Mand':
        this.changeReportRoute('reports/mand')
        break
      case 'Sessions':
        this.changeReportRoute('reports/sessions')
        break
      case 'Goals':
        this.changeReportRoute('reports/goals')
        break
      case 'Celeration Chart':
        this.changeReportRoute('reports/celer_chart')
        break
      case 'Appointment Report':
        this.changeReportRoute('reports/appointment_report')
        break
      case 'Attendance':
        this.changeReportRoute('reports/attendance')
        break
      case 'Timesheet':
        this.changeReportRoute('reports/timesheet')
        break
      case 'Monthly Report':
        this.changeReportRoute('reports/monthly_report')
        break
      case 'VBMAPP':
        this.changeReportRoute('reports/vbmapp')
        break
      case 'Peak Block Report':
        this.changeReportRoute('reports/peak_block_report')
        break
      case 'Target Response Report':
        this.changeReportRoute('reports/target_res_report')
      case 'Network & Sankey Graph':
        this.changeReportRoute('reports/network_graph')
        break
      default:
        this.changeReportRoute('reports/progress_overview')
    }
  }

  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1)
    if (this.state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys })
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      })
    }
  }

  render() {
    const {
      form,
      student: { StudentName },
      user,
      match: { path },
      history,
      learnersprogram: { Loading, ProgramAreas, Learners, SelectedLearnerId },
    } = this.props
    const { TabCheck, visibleFilter, selectedStaff } = this.state

    const std = localStorage.getItem('studentId')

    const pxToMm = px => {
      return Math.floor(px / document.getElementById('capture').offsetHeight)
    }

    const exportPDF = () => {
      const input = document.getElementById('capture')
      const inputHeightMm = pxToMm(input.offsetHeight)
      const a4WidthMm = 210
      const a4HeightMm = 297
      const numPages = inputHeightMm <= a4HeightMm ? 1 : Math.floor(inputHeightMm / a4HeightMm) + 1
      html2canvas(input).then(canvas => {
        const imgData = canvas.toDataURL('image/png')
        if (inputHeightMm > a4HeightMm) {
          // elongated a4 (system print dialog will handle page breaks)
          const pdf = new JsPDF('p', 'mm', [inputHeightMm + 16, a4WidthMm])
          pdf.addImage(imgData, 'PNG', 0, 0)
          pdf.save(`test.pdf`)
        } else {
          // standard a4
          const pdf = new JsPDF()
          pdf.addImage(imgData, 'PNG', 0, 0)
          pdf.save(`test.pdf`)
        }
      })
    }

    const exportToCSV = () => {}

    const menu = (
      <Menu>
        <Menu.Item key="0">
          <Button onClick={() => exportPDF()} type="link" size="small">
            PDF
          </Button>
        </Menu.Item>
        <Menu.Item key="1">
          <Button onClick={() => exportToCSV()} type="link" size="small">
            CSV/Excel
          </Button>
        </Menu.Item>
      </Menu>
    )

    if (!std && Learners.length < 1) {
      return <p>No learners to display reports</p>
    }

    const BlockStyle = {
      background: '#FFF',
      borderBottom: '1px solid #bcbcbc',
      cursor: 'pointer',
      padding: '30px 20px',
      borderRadius: 0,
      width: '85%',
      margin: '0 auto',
      height: 50,
      display: 'flex',
      alignItems: 'center',
      minWidth: '200px',
    }

    const ActiveStyle = {
      ...BlockStyle,
      background: COLORS.palleteLightBlue,
    }

    const HeadStyle = {
      color: '#000',
      fontSize: 16,
      lineHeight: '25px',
      display: 'inline',
      margin: 0,
      fontWeight: '500',
    }

    const SideBarHeading = {
      fontSize: '24px',
      width: '85%',
      fontWeight: 'bold',
      minWidth: '200px',
      lineHeight: '33px',
      margin: '24px auto 25px ',
    }

    if (TabCheck === 'Staff Activity' && user?.role === 'parents') {
      this.setState({
        TabCheck: 'Progress Overview',
      })
    }
    console.log(TabCheck, 'tabCheck')
    return (
      <>
        <Helmet title="Reports" />
        <Layout style={{ padding: '0px', marginBottom: '100px' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0px 10px',
              backgroundColor: '#FFF',
              boxShadow: '0 1px 6px rgba(0,0,0,.12), 0 1px 4px rgba(0,0,0,.12)',
            }}
          >
            <Content
              style={{
                padding: '0px',
                width: '100%',
                margin: '0px auto',
              }}
            >
              <div style={{ padding: '5px 0px', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ paddingTop: '5px' }}>&nbsp;</div>

                <div>
                  <div
                    style={{
                      fontSize: 25,
                      marginRight: '9px',
                    }}
                  >
                    {EXCLUDE_NAMES.indexOf(TabCheck) > -1
                      ? TabCheck === 'Timesheet'
                        ? selectedStaff.name !== '' && `${selectedStaff.name}'s Timesheet`
                        : TabCheck
                      : StudentName !== '' && `${StudentName}'s ${TabCheck}`}
                  </div>
                </div>

                <div>
                  {user?.role !== 'parents' &&
                    !(user?.role === 'therapist' && TabCheck === 'Timesheet') && (
                      <Button onClick={this.showDrawerFilter} size="large">
                        <FilterOutlined />
                      </Button>
                    )}

                  <Drawer
                    visible={visibleFilter}
                    onClose={this.onCloseFilter}
                    width={350}
                    title={`Select ${TabCheck === 'Timesheet' ? 'Staff' : 'Learner'}`}
                    placement="right"
                  >
                    {TabCheck === 'Timesheet' ? (
                      <StaffSelect Staffs={this.state.staffs} selectStaff={this.selectStaff} />
                    ) : (
                      <LearnerSelect />
                    )}
                  </Drawer>
                </div>
              </div>
            </Content>
          </div>

          <Col style={{ paddingRight: 0 }}>
            {this.state.windowWidth <= 1050 && (
              <Select
                style={{ width: 200, margin: '20px 0' }}
                defaultValue={this.state.TabCheck}
                onSelect={e => {
                  this.setRoute(e)
                  this.SetTabFunction(e)
                }}
              >
                <Option key="1" value="Progress Overview">
                  Progress Overview
                </Option>
                <Option key="2" value="Daily Response Rate">
                  Daily Response Rate
                </Option>
                <Option key="3" value="Behavior">
                  Behavior
                </Option>
                <Option key="4" value="Mand">
                  Mand
                </Option>
                <Option key="5" value="Session">
                  Session
                </Option>
                <Option key="6" value="Goals">
                  Goals
                </Option>
                <Option key="7" value="Celeration Chart">
                  Celeration Chart
                </Option>
                <Option key="8" value="Appointment Report">
                  Appointment Report
                </Option>
                <Option key="9" value="Monthly Report">
                  Monthly Report
                </Option>
                {user?.role !== 'parents' && (
                  <Option key="10" value="Staff Activity">
                    Staff Activity
                  </Option>
                )}
                {user?.role !== 'parents' && (
                  <Option key="11" value="Timesheet">
                    Timesheet
                  </Option>
                )}
                {user?.role !== 'parents' && (
                  <Option key="12" value="Attendance">
                    Attendance
                  </Option>
                )}
                <Option key="13" value="VBMAPP">
                  VBMAPP
                </Option>
                <Option key="14" value="Peak Block Report">
                  Peak Block Report
                </Option>
                <Option key="15" value="Target Response Report">
                  Target Response Report
                </Option>
              </Select>
            )}
            <Row gutter={[0, 0]}>
              {this.state.windowWidth > 1050 && (
                <Col sm={5}>
                  <div style={{ display: 'flex' }}>
                    <div
                      style={{
                        background: COLORS.palleteLight,
                        borderRadius: 0,
                        minHeight: '100vh',
                        width: '100%',
                        paddingBottom: '24px',
                      }}
                    >
                      <div style={SideBarHeading}>Reports</div>
                      <div
                        style={TabCheck === 'Progress Overview' ? ActiveStyle : BlockStyle}
                        onClick={() => {
                          this.SetTabFunction('Progress Overview')
                          this.changeReportRoute('reports/progress_overview')
                        }}
                      >
                        <span style={HeadStyle}>Progress Overview</span>
                      </div>
                      <div
                        style={TabCheck === 'Daily Response Rate' ? ActiveStyle : BlockStyle}
                        onClick={() => {
                          this.SetTabFunction('Daily Response Rate')
                          this.changeReportRoute('reports/daily_res_rate')
                        }}
                      >
                        <span style={HeadStyle}>Daily Response Rate</span>
                      </div>
                      <div
                        style={TabCheck === 'Behavior' ? ActiveStyle : BlockStyle}
                        onClick={() => {
                          this.SetTabFunction('Behavior')
                          this.changeReportRoute('reports/behavior')
                        }}
                      >
                        <span style={HeadStyle}>Behavior</span>
                      </div>
                      <div
                        style={TabCheck === 'Mand' ? ActiveStyle : BlockStyle}
                        onClick={() => {
                          this.SetTabFunction('Mand')
                          this.changeReportRoute('reports/mand')
                        }}
                      >
                        <span style={HeadStyle}>Mand</span>
                      </div>
                      <div
                        style={TabCheck === 'Sessions' ? ActiveStyle : BlockStyle}
                        onClick={() => {
                          this.SetTabFunction('Sessions')
                          this.changeReportRoute('reports/sessions')
                        }}
                      >
                        <span style={HeadStyle}>Sessions</span>
                      </div>
                      <div
                        style={TabCheck === 'Goals' ? ActiveStyle : BlockStyle}
                        onClick={() => {
                          this.SetTabFunction('Goals')
                          this.changeReportRoute('reports/goals')
                        }}
                      >
                        <span style={HeadStyle}>Goals</span>
                      </div>

                      <div
                        style={TabCheck === 'Celeration Chart' ? ActiveStyle : BlockStyle}
                        onClick={() => {
                          this.SetTabFunction('Celeration Chart')
                          this.changeReportRoute('reports/celer_chart')
                        }}
                      >
                        <span style={HeadStyle}>Celeration Chart</span>
                      </div>

                      <div
                        style={TabCheck === 'Appointment Report' ? ActiveStyle : BlockStyle}
                        onClick={() => {
                          this.SetTabFunction('Appointment Report')
                          this.changeReportRoute('reports/appointment_report')
                        }}
                      >
                        <span style={HeadStyle}>Appointment Report</span>
                      </div>

                      {user?.role !== 'parents' && (
                        <>
                          <div
                            style={TabCheck === 'Attendance' ? ActiveStyle : BlockStyle}
                            onClick={() => {
                              this.SetTabFunction('Attendance')
                              this.changeReportRoute('reports/attendance')
                            }}
                          >
                            <span style={HeadStyle}>Attendance</span>
                          </div>
                          <div
                            style={TabCheck === 'Timesheet' ? ActiveStyle : BlockStyle}
                            onClick={() => {
                              this.SetTabFunction('Timesheet')
                              this.changeReportRoute('reports/timesheet')
                            }}
                          >
                            <span style={HeadStyle}>Timesheet</span>
                          </div>
                        </>
                      )}
                      <div
                        style={TabCheck === 'Monthly Report' ? ActiveStyle : BlockStyle}
                        onClick={() => {
                          this.SetTabFunction('Monthly Report')
                          this.changeReportRoute('reports/monthly_report')
                        }}
                      >
                        <span style={HeadStyle}>Monthly Report</span>
                      </div>
                      <div
                        style={TabCheck === 'VBMAPP' ? ActiveStyle : BlockStyle}
                        onClick={() => {
                          this.SetTabFunction('VBMAPP')
                          this.changeReportRoute('reports/vbmapp')
                        }}
                      >
                        <span style={HeadStyle}>VBMAPP</span>
                      </div>
                      <div
                        style={TabCheck === 'Peak Block Report' ? ActiveStyle : BlockStyle}
                        onClick={() => {
                          this.SetTabFunction('Peak Block Report')
                          this.changeReportRoute('reports/peak_block_report')
                        }}
                      >
                        <span style={HeadStyle}>Peak Block Report</span>
                      </div>
                      <div
                        style={TabCheck === 'Target Response Report' ? ActiveStyle : BlockStyle}
                        onClick={() => {
                          this.SetTabFunction('Target Response Report')
                          this.changeReportRoute('reports/target_res_report')
                        }}
                      >
                        <span style={HeadStyle}>Target Response Report</span>
                      </div>
                      <div
                        style={TabCheck === 'Network & Sankey Graph' ? ActiveStyle : BlockStyle}
                        onClick={() => {
                          this.SetTabFunction('Response Time Report')
                          this.changeReportRoute('reports/network_graph')
                        }}
                      >
                        <span style={HeadStyle}>Network & Sankey Graph</span>
                      </div>
                    </div>
                  </div>
                </Col>
              )}

              <Col sm={this.state.windowWidth > 1050 ? 19 : 24} style={{ margin: 'auto' }}>
                <div>
                  {(path === '/reports/progress_overview' || path === '/reports') && (
                    <ProgressOverview
                      showDrawerFilter={this.showDrawerFilter}
                      selectedStudentId={SelectedLearnerId}
                    />
                  )}
                  {path === '/reports/daily_res_rate' && (
                    <DailyResponseRate
                      studentName={StudentName}
                      showDrawerFilter={this.showDrawerFilter}
                    />
                  )}
                  {path === '/reports/behavior' && (
                    <Behavior
                      studentName={StudentName}
                      showDrawerFilter={this.showDrawerFilter}
                      selectedStudentId={SelectedLearnerId}
                    />
                  )}
                  {path === '/reports/mand' && (
                    <Mand
                      showDrawerFilter={this.showDrawerFilter}
                      selectedStudentId={SelectedLearnerId}
                    />
                  )}
                  {path === '/reports/sessions' && (
                    <Sessions studentName={StudentName} showDrawerFilter={this.showDrawerFilter} />
                  )}
                  {path === '/reports/goals' && (
                    <Goals
                      showDrawerFilter={this.showDrawerFilter}
                      selectedStudentId={SelectedLearnerId}
                    />
                  )}
                  {path === '/reports/staff_activity' && (
                    <div>
                      <p>Under Development</p>
                    </div>
                  )}
                  {path === '/reports/celer_chart' && (
                    <CelerationChartPanel
                      studentName={StudentName}
                      showDrawerFilter={this.showDrawerFilter}
                      selectedStudentId={SelectedLearnerId}
                    />
                  )}
                  {path === '/reports/appointment_report' && (
                    <Appointments
                      studentName={StudentName}
                      showDrawerFilter={this.showDrawerFilter}
                      selectedStudentId={SelectedLearnerId}
                    />
                  )}
                  {path === '/reports/attendance' && (
                    <Attendance
                      studentName={StudentName}
                      showDrawerFilter={this.showDrawerFilter}
                      selectedStudentId={SelectedLearnerId}
                    />
                  )}
                  {path === '/reports/timesheet' && (
                    <Timesheet
                      studentName={StudentName}
                      showDrawerFilter={this.showDrawerFilter}
                      selectedStaff={selectedStaff}
                    />
                  )}
                  {path === '/reports/vbmapp' && (
                    <VBMappReport
                      selectedStudentId={SelectedLearnerId}
                      studentName={StudentName}
                      showDrawerFilter={this.showDrawerFilter}
                    />
                  )}
                  {path === '/reports/monthly_report' && (
                    <MonthlyReport
                      showDrawerFilter={this.showDrawerFilter}
                      studentName={StudentName}
                      selectedStudentId={SelectedLearnerId}
                    />
                  )}
                  {path === '/reports/peak_block_report' && (
                    <PeakBlockReport
                      showDrawerFilter={this.showDrawerFilter}
                      studentName={StudentName}
                      selectedStudentId={SelectedLearnerId}
                    />
                  )}
                  {path === '/reports/target_res_report' && (
                    <TargetResponseReport
                      showDrawerFilter={this.showDrawerFilter}
                      studentName={StudentName}
                      selectedStudentId={SelectedLearnerId}
                    />
                  )}
                  {path === '/reports/network_graph' && (
                    <NetworkSankey
                      showDrawerFilter={this.showDrawerFilter}
                      studentName={StudentName}
                      selectedStudentId={SelectedLearnerId}
                    />
                  )}
                </div>
              </Col>
            </Row>
          </Col>
        </Layout>
      </>
    )
  }
}

export default Form.create()(Reports)

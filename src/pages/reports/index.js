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

import React from 'react'
import { Helmet } from 'react-helmet'
import {
  Layout,
  Row,
  Col,
  Card,
  Button,
  Typography,

  Drawer,
  Form,

  Menu,
} from 'antd'
import html2canvas from 'html2canvas'
import { FilterOutlined } from '@ant-design/icons'
import JsPDF from 'jspdf'
import { connect } from 'react-redux'

import Moment from 'moment'

import LearnerSelect from 'components/LearnerSelect'

import DailyResponseRate from './dailyResponseRate'
import ProgressOverview from './progressOverview'
import Sessions from './sessions'
import Behavior from './behavior'
import Attendance from './attendance'
import Timesheet from './timesheet'
import Goals from './goals'
import MonthlyReport from './monthlyReport'
import CelerationChartPanel from './celeration-chart-panel.container'
import './padding.scss'

const { Title, Text } = Typography
const { Content } = Layout

const parentCardStyle = {
  background: '#F9F9F9',
  borderRadius: 10,
  padding: '10px',
  margin: '7px 0 0 10px',
  height: 300,
  overflow: 'hidden',
}

@connect(({ user, student, learnersprogram }) => ({ user, student, learnersprogram }))
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
      TabCheck: 'Progress Overview'
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
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

  render() {
    const {
      form,
      student: { StudentName },
      user,
      learnersprogram: { Loading, ProgramAreas, Learners, SelectedLearnerId },
    } = this.props
    const { TabCheck, visibleFilter } = this.state


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

    const exportToCSV = () => { }

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
      width: '100%',
      height: 50,
      display: 'flex',
      alignItems: 'center',
      minWidth: '200px',
    }

    const ActiveStyle = {
      ...BlockStyle,
      background: '#a7a6a6',
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
      fontWeight: 'bold',
      lineHeight: '33px',
      marginBottom: '25px',
    }

    if (TabCheck === 'Staff Activity' && user?.role === 'parents') {
      this.setState({
        TabCheck: 'Progress Overview'
      })
    }


    return (
      <>
        <Helmet title="Reports" />
        <Layout style={{ padding: '0px' }}>
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
                <div style={{ paddingTop: '5px' }}>
                  &nbsp;
                </div>


                <div>
                  <div
                    style={{
                      fontSize: 25,
                      marginRight: '9px',
                      marginTop: '2px',
                    }}
                  >
                    {StudentName !== '' && `${StudentName}'s ${TabCheck}`}
                  </div>
                </div>

                <div>
                  {user?.role !== 'parents' && (
                    <Button onClick={this.showDrawerFilter} size="large">
                      <FilterOutlined />
                    </Button>
                  )}

                  <Drawer
                    visible={visibleFilter}
                    onClose={this.onCloseFilter}
                    width={350}
                    title="Select Learner"
                    placement="right"
                  >
                    <LearnerSelect />
                  </Drawer>
                </div>

              </div>

            </Content>
          </div>

          <Col style={{ paddingRight: 0 }}>
            <Row gutter={[0, 0]}>
              <Col sm={5}>
                <div style={{ display: 'flex' }}>
                  <Card
                    style={{
                      background: '#F1F1F1',
                      borderRadius: 0,
                      minHeight: '100vh',
                      width: '100%',

                      // minWidth: '290px',
                      // maxWidth: '350px',
                    }}
                  >
                    <div style={SideBarHeading}>Reports</div>
                    <div
                      style={TabCheck === 'Progress Overview' ? ActiveStyle : BlockStyle}
                      onClick={() => this.SetTabFunction('Progress Overview')}
                    >
                      <span style={HeadStyle}>Progress Overview</span>
                    </div>
                    <div
                      style={TabCheck === 'Daily Response Rate' ? ActiveStyle : BlockStyle}
                      onClick={() => this.SetTabFunction('Daily Response Rate')}
                    >
                      <span style={HeadStyle}>Daily Response Rate</span>
                    </div>
                    <div
                      style={TabCheck === 'Behavior' ? ActiveStyle : BlockStyle}
                      onClick={() => this.SetTabFunction('Behavior')}
                    >
                      <span style={HeadStyle}>Behavior</span>
                    </div>
                    <div
                      style={TabCheck === 'Sessions' ? ActiveStyle : BlockStyle}
                      onClick={() => this.SetTabFunction('Sessions')}
                    >
                      <span style={HeadStyle}>Sessions</span>
                    </div>
                    <div
                      style={TabCheck === 'Goals' ? ActiveStyle : BlockStyle}
                      onClick={() => this.SetTabFunction('Goals')}
                    >
                      <span style={HeadStyle}>Goals</span>
                    </div>
                    {user?.role !== 'parents' && (
                      <div
                        style={TabCheck === 'Staff Activity' ? ActiveStyle : BlockStyle}
                        onClick={() => this.SetTabFunction('Staff Activity')}
                      >
                        <span style={HeadStyle}>Staff Activity</span>
                      </div>
                    )}

                    <div
                      style={TabCheck === 'Celeration Chart' ? ActiveStyle : BlockStyle}
                      onClick={() => this.SetTabFunction('Celeration Chart')}
                    >
                      <span style={HeadStyle}>Celeration Chart</span>
                    </div>

                    <div
                      style={TabCheck === 'Attendance' ? ActiveStyle : BlockStyle}
                      onClick={() => this.SetTabFunction('Attendance')}
                    >
                      <span style={HeadStyle}>Attendance</span>
                    </div>

                    <div
                      style={TabCheck === 'Timesheet' ? ActiveStyle : BlockStyle}
                      onClick={() => this.SetTabFunction('Timesheet')}
                    >
                      <span style={HeadStyle}>Timesheet</span>
                    </div>
                    <div
                      style={TabCheck === 'Monthly Report' ? ActiveStyle : BlockStyle}
                      onClick={() => this.SetTabFunction('Monthly Report')}
                    >
                      <span style={HeadStyle}>Monthly Report</span>
                    </div>

                  </Card>

                </div>
              </Col>

              <Col sm={19}>
                <div style={{ marginTop: '1px' }}>
                  {TabCheck === 'Progress Overview' && (
                    <ProgressOverview
                      showDrawerFilter={this.showDrawerFilter}
                      selectedStudentId={SelectedLearnerId}
                    />
                  )}
                  {TabCheck === 'Daily Response Rate' && (
                    <DailyResponseRate
                      studentName={StudentName}
                      showDrawerFilter={this.showDrawerFilter}
                    />
                  )}
                  {TabCheck === 'Behavior' && (
                    <Behavior
                      studentName={StudentName}
                      showDrawerFilter={this.showDrawerFilter}
                      selectedStudentId={SelectedLearnerId}
                    />
                  )}
                  {TabCheck === 'Sessions' && (
                    <Sessions
                      studentName={StudentName}
                      showDrawerFilter={this.showDrawerFilter}
                    />
                  )}
                  {TabCheck === 'Goals' && (
                    <Goals
                      showDrawerFilter={this.showDrawerFilter}
                      selectedStudentId={SelectedLearnerId}
                    />
                  )}
                  {TabCheck === 'Staff Activity' && (
                    <div>
                      <p>Under Development</p>
                    </div>
                  )}
                  {TabCheck === 'Celeration Chart' && (
                    <CelerationChartPanel
                      studentName={StudentName}
                      showDrawerFilter={this.showDrawerFilter}
                      selectedStudentId={SelectedLearnerId}
                    />
                  )}
                  {TabCheck === 'Attendance' && (
                    <Attendance
                      studentName={StudentName}
                      showDrawerFilter={this.showDrawerFilter}
                      selectedStudentId={SelectedLearnerId}
                    />
                  )}
                  {TabCheck === 'Timesheet' && (
                    <Timesheet
                      studentName={StudentName}
                      showDrawerFilter={this.showDrawerFilter}
                      selectedStudentId={SelectedLearnerId}
                    />
                  )}
                  {TabCheck === 'Monthly Report' && (
                    <MonthlyReport
                      showDrawerFilter={this.showDrawerFilter}
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

/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-loop-func */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable react/self-closing-comp */
import React, { Component } from 'react'
import { gql } from 'apollo-boost'
import { Link } from 'react-router-dom'
import {
  Button,
  Drawer,
  Progress,
  Tabs,
  Layout,
  Row,
  Col,
  Popconfirm,
  Tooltip,
  notification,
} from 'antd'
import { connect } from 'react-redux'
import { DeleteOutlined, FilterOutlined } from '@ant-design/icons'
import Scrollbars from 'react-custom-scrollbars'
import moment from 'moment'
import LearnerSelect from 'components/LearnerSelect'
import client from '../../apollo/config'
import VbMappsTargets from './VbMappsTargets'
import PageHeader from './PageHeader'
import { leftDivStyle, rightDivStyle } from './customStyle'

const { Content } = Layout

const { TabPane } = Tabs
@connect(({ user, student, learnersprogram }) => ({ user, student, learnersprogram }))
class AssessmentsList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      assessments: [],
      areas: [],
      selected: 0,
      target: null,
      master: '',
      studentID: JSON.parse(localStorage.getItem('studentId')),
      deleteLoading: false,
    }
  }

  componentDidMount() {
    const { studentID } = this.state
    const { dispatch } = this.props
    dispatch({
      type: 'learnersprogram/LOAD_DATA',
    })
    this.getVbmappData(studentID)
  }

  componentDidUpdate(prevProps, prevState) {
    const studentID = JSON.parse(localStorage.getItem('studentId'))
    if (studentID !== prevState.studentID) {
      this.getVbmappData(studentID)
    }
  }

  getVbmappData(id) {
    this.setState({ studentID: id })
    client
      .query({
        fetchPolicy: 'no-cache',
        query: gql`
        query{
          vbmappGetAssessments(student:"${id}"){
              edges{
                  total
                  milestone
                  barriers
                  transition
                  eesa
                  node{
                      id
                      date
                      testNo
                      color
                      student{
                          id,
                          firstname
                      }
                  }
              }
          }
        }
        `,
      })
      .then(result => {
        if (result.data.vbmappGetAssessments.edges.length > 0) {
          const selectAssignmentIndex = result.data.vbmappGetAssessments.edges.length - 1
          this.setState({
            assessments: result.data.vbmappGetAssessments.edges,
            selectedAssignment: result.data.vbmappGetAssessments.edges[selectAssignmentIndex],
            selected:
              result.data.vbmappGetAssessments.edges[
                result.data.vbmappGetAssessments.edges.length - 1
              ].node.testNo,
            master:
              result.data.vbmappGetAssessments.edges[
                result.data.vbmappGetAssessments.edges.length - 1
              ].node.id,
          })
        }
      })
    client
      .query({
        query: gql`
          query {
            vbmappAreas {
              id
              apiArea
              areaName
              description
            }
          }
        `,
      })
      .then(result => {
        this.setState({
          areas: result.data.vbmappAreas,
        })
      })
  }

  handleKeyDown = () => {}

  deleteAssessment = id => {
    this.setState({ deleteLoading: true })
    console.log(`deleting assessment ${id}`)
    client
      .mutate({
        mutation: gql`
        mutation {
          vbmappDeleteAssessment (input: {pk: "${id}"}) {
            status
            message
          }
        }
                `,
      })
      .then(result => {
        if (result?.data?.vbmappDeleteAssessment?.status === true) {
          this.setState(state => ({
            assessments: state.assessments.filter(item => item.node.id !== id),
          }))
          notification.success(result?.data?.vbmappDeleteAssessment?.message)
        } else notification.error(result?.data?.vbmappDeleteAssessment?.message)
      })

    this.setState({ deleteLoading: false })
  }

  assessmentCard = ({
    testNo,
    id,
    bg,
    textColor,
    outputDate,
    milestoneScore,
    barrierScore,
    eesaScore,
    transitionScore,
    onClick,
  }) => {
    return (
      <div
        role="button"
        onClick={onClick}
        style={{
          backgroundColor: bg,
          color: textColor,
          cursor: 'pointer',
          boxShadow:
            '0px 0px 1px rgba(0, 0, 0, 0.08), 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 4px 8px rgba(0, 0, 0, 0.08)',
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 20,
          paddingRight: 20,
          borderRadius: 10,
          flex: 1,
          margin: '10px 10px 0px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 18, fontWeight: '700', marginBottom: 0 }}>Assessment {testNo}</p>
            <p>
              <span>{outputDate}</span>
            </p>
          </div>
          <div onClick={() => console.log({ id, testNo })}>
            <Tooltip placement="top" title="Delete Assessment">
              <Popconfirm
                title="Are you sure ?"
                onConfirm={() => this.deleteAssessment(id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="link" style={{ color: textColor }} loading={this.state.deleteLoading}>
                  <DeleteOutlined />
                </Button>
              </Popconfirm>
            </Tooltip>
          </div>
        </div>
        <div
          style={{
            paddingBottom: 5,
            borderBottom: '0.5px solid rgba(0, 0, 0, 0.1)',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            display: 'flex',
          }}
        >
          <p style={{ fontSize: 12 }}>Milestones: {milestoneScore}</p>
          <p style={{ fontSize: 12 }}>Barriers: {barrierScore}</p>
          <p style={{ fontSize: 12 }}>EESA: {eesaScore}</p>
          <p style={{ fontSize: 12 }}>Transitions: {transitionScore}</p>
        </div>
        <div
          style={{
            flexDirection: 'row',
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 10,
          }}
        >
          <Button
            style={{
              marginRight: 10,
              color: textColor,
              padding: 0,
            }}
            type="link"
            onClick={() => {
              client
                .mutate({
                  mutation: gql`
                  mutation {
                    vbmappIepReport(input: { pk: "${id}" }) {
                      status
                      data
                      file
                    }
                  }
                `,
                })
                .then(result => {
                  console.log(result)
                  window.open(result.data.vbmappIepReport.file)
                })
            }}
          >
            IEP Report
          </Button>
          <Button type="link" style={{ marginTop: 5, color: textColor }}>
            Notes
          </Button>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Button
            onClick={() => {
              this.setState({
                target: id,
              })
            }}
            style={{
              width: '100%',
            }}
          >
            Suggested Targets
          </Button>
        </div>
      </div>
    )
  }

  getActiveAssessment = () => {
    const { assessments, selected } = this.state
    const AssignmentCard = this.assessmentCard
    let bg = '#FFF'
    let textColor = '#000'
    const completed =
      assessments[assessments.length - 1].milestone +
      assessments[assessments.length - 1].barriers +
      assessments[assessments.length - 1].eesa +
      assessments[assessments.length - 1].transition
    let percentage = 0
    if (completed > 0 && assessments[assessments.length - 1].total > 0) {
      percentage = (completed / assessments[assessments.length - 1].total) * 100
      percentage = Math.round(percentage * 10) / 10
    }
    const outputDate = moment(assessments[assessments.length - 1].node.date).format('MMMM DD, YYYY')
    if (selected === assessments[assessments.length - 1].node.testNo) {
      bg = '#3E7BFA'
      textColor = '#FFF'
    }
    const index = assessments.length - 1
    return (
      <AssignmentCard
        onClick={() =>
          this.setState({
            selected: assessments[assessments.length - 1].node.testNo,
            master: assessments[assessments.length - 1].node.id,
            selectedAssignment: assessments[index],
          })
        }
        id={assessments[assessments.length - 1].node.id}
        test={assessments[assessments.length - 1].node.testNo}
        bg={bg}
        textColor={textColor}
        outputDate={outputDate}
        milestoneScore={assessments[assessments.length - 1].milestone}
        barrierScore={assessments[assessments.length - 1].barriers}
        eesaScore={assessments[assessments.length - 1].eesa}
        transitionScore={assessments[assessments.length - 1].transition}
        testNo={assessments[assessments.length - 1].node.testNo}
      />
    )
  }

  getPreviousAssessments = () => {
    const { assessments, selected } = this.state
    const pa = []
    let bg = '#FFF'
    let textColor = '#000'
    const AssignmentCard = this.assessmentCard
    for (let x = assessments.length - 2; x >= 0; x -= 1) {
      if (selected === assessments[x].node.testNo) {
        bg = '#3E7BFA'
        textColor = '#FFF'
      } else {
        bg = '#FFF'
        textColor = '#000'
      }
      const outputDate = moment(assessments[x].node.date).format('MMMM DD, YYYY')
      pa.push(
        <AssignmentCard
          onClick={() =>
            this.setState({
              selected: assessments[x].node.testNo,
              master: assessments[x].node.id,
              selectedAssignment: assessments[x],
            })
          }
          id={assessments[x].node.id}
          test={assessments[x].node.testNo}
          bg={bg}
          textColor={textColor}
          outputDate={outputDate}
          milestoneScore={assessments[x].milestone}
          barrierScore={assessments[x].barriers}
          eesaScore={assessments[x].eesa}
          transitionScore={assessments[x].transition}
          testNo={assessments[x].node.testNo}
        />,
      )
    }
    return pa
  }

  AreaCard = ({ id, pathname, name, description, lineColor, completedPer }) => {
    const { studentID, selected, master, selectedAssignment } = this.state
    return (
      <div className="col-sm-12">
        <Link
          to={{
            pathname,
            areaID: id,
            student: studentID,
            test: selected,
            masterID: master,
          }}
          onClick={() => {
            localStorage.setItem('vbMappAreaId', id)
            localStorage.setItem('vbMappMasterId', master)
            localStorage.setItem('vbMappsTestId', selected)
          }}
        >
          <div
            style={{
              marginTop: 20,
              paddingBottom: 2,
              boxShadow:
                '0px 0px 1px rgba(0, 0, 0, 0.08), 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.08)',
            }}
          >
            <div
              style={{
                cursor: 'pointer',
                paddingTop: 1,
                paddingBottom: 1,
                paddingLeft: 20,
                paddingRight: 20,
                flex: 1,
                position: 'relative',
              }}
            >
              {completedPer !== undefined && (
                <span
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    fontSize: 20,
                    color: '#777',
                    fontWeight: 600,
                  }}
                >
                  {completedPer}%
                </span>
              )}
              <p style={{ fontSize: 18, fontWeight: '700' }}>{name}</p>
              <p>{description}</p>
            </div>
            <Progress
              percent={completedPer}
              strokeColor={lineColor}
              showInfo={false}
              style={{ padding: 10 }}
            />
          </div>
        </Link>
      </div>
    )
  }

  getAreas = () => {
    const { areas, selectedAssignment } = this.state
    const areass = []
    const { AreaCard } = this
    let milestoneCounter = 0
    console.log(selectedAssignment)
    for (let x = 0; x < areas.length; x += 1) {
      let pathname = ''
      let lineColor = ''
      let completedPer
      switch (areas[x].areaName) {
        case 'Milestones':
          milestoneCounter = x
          pathname = '/therapy/vbmapps/milestonesGroups'
          lineColor = '#623bb2'
          completedPer = selectedAssignment?.milestone
          break
        case 'Barriers':
          pathname = '/therapy/vbmapps/barriersGroups'
          lineColor = '#f04a3d'
          completedPer = selectedAssignment?.barriers
          break
        case 'Transition Assessment':
          pathname = '/therapy/vbmapps/transitionGroups'
          lineColor = '#4eb151'
          completedPer = selectedAssignment?.transition
          break
        case 'EESA':
          pathname = '/therapy/vbmapps/eesaGroups'
          lineColor = '#ed5f32'
          completedPer = selectedAssignment?.eesa
          break
        case 'Task Analysis':
          pathname = '/therapy/vbmapps/taskGroups'
          lineColor = 'red'
          break
        default:
          break
      }
      areass.push(
        <AreaCard
          id={areas[x].id}
          name={areas[x].areaName}
          description={areas[x].description}
          pathname={pathname}
          lineColor={lineColor}
          completedPer={completedPer}
        />,
      )
    }
    return areass
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

  render() {
    const { assessments, areas, studentID } = this.state
    const { user } = this.props
    return (
      <Layout style={{ padding: '0px' }}>
        <Content
          style={{
            padding: '0px 20px',
            maxWidth: 1300,
            width: '100%',
            margin: '0px auto',
          }}
        >
          <Row>
            <Col sm={6}>
              <div style={leftDivStyle}>
                {assessments && assessments.length > 0 && (
                  <Link
                    to={{
                      pathname: '/therapy/vbmapps/new',
                      test: assessments[assessments.length - 1].node.testNo + 1,
                      student: studentID,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#3E7BFA',
                        color: '#FFFFFF',
                        cursor: 'pointer',
                        boxShadow:
                          '0px 0px 1px rgba(0, 0, 0, 0.08), 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 4px 8px rgba(0, 0, 0, 0.08)',
                        paddingTop: 10,
                        paddingBottom: 10,
                        paddingLeft: 20,
                        paddingRight: 20,
                        borderRadius: 10,
                        flex: 1,
                        margin: '20px 10px',
                      }}
                    >
                      <p style={{ marginBottom: 0 }}>New Assessment</p>
                    </div>
                  </Link>
                )}
                <Tabs type="card">
                  <TabPane tab="Active" key="1">
                    {assessments && assessments.length === 0 && (
                      <Link
                        to={{
                          pathname: '/therapy/vbmapps/new',
                          test: 1,
                          student: studentID,
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#3E7BFA',
                            color: '#FFFFFF',
                            cursor: 'pointer',
                            boxShadow:
                              '0px 0px 1px rgba(0, 0, 0, 0.08), 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 4px 8px rgba(0, 0, 0, 0.08)',
                            paddingTop: 10,
                            paddingBottom: 10,
                            paddingLeft: 20,
                            paddingRight: 20,
                            borderRadius: 10,
                            flex: 1,
                            marginTop: 20,
                            marginBottom: 20,
                          }}
                        >
                          <p style={{ marginBottom: 0 }}>New Assessment</p>
                        </div>
                      </Link>
                    )}
                    <p
                      style={{
                        fontWeight: '700',
                        letterSpacing: 0.8,
                        fontSize: 16,
                        marginLeft: 10,
                      }}
                    >
                      Active Assessment
                    </p>
                    {assessments && assessments.length > 0 && this.getActiveAssessment()}
                  </TabPane>
                  <TabPane tab="Previous" key="2">
                    <Scrollbars
                      style={{
                        height: 'calc(100vh - 180px)',
                      }}
                      // autoHide
                    >
                      {assessments && assessments.length === 0 && (
                        <Link
                          to={{
                            pathname: '/therapy/vbmapps/new',
                            test: 1,
                            student: studentID,
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: '#3E7BFA',
                              color: '#FFFFFF',
                              cursor: 'pointer',
                              boxShadow:
                                '0px 0px 1px rgba(0, 0, 0, 0.08), 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 4px 8px rgba(0, 0, 0, 0.08)',
                              paddingTop: 10,
                              paddingBottom: 10,
                              paddingLeft: 20,
                              paddingRight: 20,
                              borderRadius: 10,
                              flex: 1,
                              marginTop: 20,
                              marginBottom: 20,
                            }}
                          >
                            <p style={{ marginBottom: 0 }}>New Assessment</p>
                          </div>
                        </Link>
                      )}

                      <p
                        style={{
                          fontWeight: '700',
                          letterSpacing: 0.8,
                          fontSize: 16,
                          marginLeft: 10,
                        }}
                      >
                        Previous Assessments
                      </p>
                      {assessments && assessments.length > 0 && (
                        <div>
                          {this.getPreviousAssessments()}
                          <div style={{ height: 10 }}></div>
                        </div>
                      )}
                    </Scrollbars>
                  </TabPane>
                </Tabs>
              </div>
            </Col>
            <Col sm={18}>
              <div style={rightDivStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <PageHeader pageTitle="VB-MAPP Assessment" style={{ marginTop: 20 }} />
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
                  </div>
                </div>
                <div className="row" style={{ position: 'relative' }}>
                  {this.state.selected < 1 && (
                    <div
                      style={{
                        height: 'calc(100% + 22px)',
                        background: '#31303021',
                        zIndex: 1000,
                      }}
                    ></div>
                  )}
                  {areas && areas.length > 0 && this.getAreas()}
                </div>
              </div>
            </Col>
          </Row>
          <Drawer
            visible={this.state.target}
            onClose={() => this.setState({ target: null })}
            width={600}
            title="Target Allocation from VB Mapps"
          >
            {this.state.target && (
              <VbMappsTargets target={this.state.target} milestoneId={this.state.areas[0]?.id} />
            )}
          </Drawer>
        </Content>
      </Layout>
    )
  }
}

export default AssessmentsList

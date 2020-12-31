/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
import React, { Component } from 'react'
import { Button, Progress, Drawer, Card, Layout, Row, Col, Typography, Switch, Icon, notification } from 'antd'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import { connect } from 'react-redux'
import { gql } from 'apollo-boost'
import apolloClient from '../../apollo/config'
import SessionInstruction from './SessionInstructions'
import LearnerCard from './LearnerProgramCard'
// import SessionCard from '../parent/ParentDashboard/SessionCard'
import SessionCardForProgram from '../parent/ParentDashboard/SessionCardForProgram'

const { Content } = Layout
const { Title, Text } = Typography

const assessmentCardStyle = {
  background: '#FFFFFF',
  border: '1px solid #E4E9F0',
  boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
  borderRadius: 10,
  width: '300px',
  marginRight: '20px',
  padding: '12px 12px',
  alignItems: 'center',
  display: 'inline-block',
  marginTop: '20px'
}

const assessmentCardSelectedStyle = {
  background: '#FFFFFF',
  border: '1px solid #E4E9F0',
  boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
  borderRadius: 10,
  width: '100%',
  marginRight: '20px',
  padding: '12px 12px',
  alignItems: 'center',
  display: 'inline-block',
  marginTop: '20px'
}

const customDivStyle = {
  marginLeft: '20px',
  background: '#F9F9F9',
  borderRadius: 10,
  minHeight: '700px',
  padding: '28px 27px 20px',
}

@connect(({ user, sessionrecording }) => ({ user, sessionrecording }))
class StudentDrawer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sessions: [],
      visible: false,
      // isSubdrawerOper: false,
      sessionName: '',
      programAreaStatus: [],
      isSelected: false,

      // vb-mapp-isActive,
      isVBMAPPActive: false,
      studentDetails: null
    }
    this.onClose = this.onClose.bind(this)
  }

  componentDidMount() {
    // const propData = this.props
    const { areas } = this.props
    const std = JSON.parse(localStorage.getItem('studentId'))
    apolloClient.query({
      query: gql`{
      GetStudentSession(studentId: "${std}") {
        edges {
          node {
            id
            itemRequired
            duration
            sessionName {
              id
              name
            }
            instruction {
              edges {
                node {
                  id
                  instruction
                }
              }
            }
            sessionHost {
              edges {
                node {
                  id
                  memberName
                  timeSpent {
                    edges {
                      node {
                        id
                        sessionName {
                          id
                          name
                        }
                        duration
                      }
                    }
                  }
                  relationship {
                    id
                    name
                  }
                }
              }
            }
            targets {
              edges {
                node {
                  id
                  time
                  targetInstr
                  date
                  targetAllcatedDetails {
                    id
                    targetName
                  }
                }
              }
            }
          }
        }
      }
      student(id: "${std}"){
        id
        firstname
        isCogActive
        isPeakActive
      }
    }`,
    })
      .then(result => {
        this.setState({
          sessions: result.data.GetStudentSession.edges,
          programAreaStatus: areas,
          studentDetails: result.data.student,
        })
      })
      .catch(error => {
        console.log(error)
      })

    apolloClient
      .mutate({
        mutation: gql`
          mutation{
            vbmappIsActive(input:{
              student: "${std}"
            }){
              status
              msg
            }
          }
        `,
      })
      .then(result => {
        this.setState({
          isVBMAPPActive: result.data.vbmappIsActive.status
        })
        // console.log("vb-mapp ====> ", result)
      })
      .catch(error => {
        console.log(error)
      })

  }

  close = () => {
    const propData = this.props
    propData.closeDrawer(true)
  }

  handleClick = () => {
    // bind the event from here or after setState()
    this.setState({
      isSelected: true,
    })
  }

  renderProgramArea = () => {
    const stateData = this.state
    const propData = this.props
    const array = []
    if (stateData.programAreaStatus !== undefined) {
      for (let i = 0; i < stateData.programAreaStatus.length; i += 1) {
        array.push(
          <div
            role="presentation"
            tabIndex={`-${i}`}
            style={
              propData.selectedArea.toUpperCase() ===
                stateData.programAreaStatus[i].node.name.toUpperCase() && !stateData.isSelected
                ? assessmentCardSelectedStyle
                : assessmentCardStyle
            }
            onClick={() => {
              this.handleClick()
            }}
            key={i}
          >

            <div>
              <Title style={{ fontSize: '18px' }}>{stateData.programAreaStatus[i].node.name}</Title>

              <Progress percent={stateData.programAreaStatus[i].node.percentageLong ? stateData.programAreaStatus[i].node.percentageLong : 0} strokeColor="#0059b3" />
            </div>
          </div>,
        )
      }
    }
    return array
  }

  renderSessionCards = () => {
    const stateData = this.state
    const array = []
    if (stateData.sessions !== undefined) {
      for (let i = 0; i < stateData.sessions.length; i += 1) {
        if (stateData.sessions[i].node.targets.edges.length > 0) {
          array.push(
            <SessionCardForProgram
              id={stateData.sessions[i].node.id}
              sessionName={stateData.sessions[i].node.sessionName.name}
              duration={stateData.sessions[i].node.duration}
              hostList={stateData.sessions[i].node.sessionHost.edges}
              session={stateData.sessions[i].node}
            />,
          )
        }
      }
    }
    return array
  }

  openSubDrawer = node => {
    const { dispatch } = this.props

    dispatch({
      type: 'sessionrecording/SET_STATE',
      payload: {
        SessionId: node.id,
      },
    })

    this.setState({
      // isSubdrawerOper: true,
      sessionName: node.sessionName.name,
      visible: true,
    })
  }

  onClose = () => {
    this.setState({
      visible: false,
      // isSubdrawerOper: false,
    })
  }

  getFilteredArray = () => {
    const stateData = this.state
    for (let i = 0; i < stateData.sessions.length; i += 1) {
      if (stateData.sessions[i].node.sessionName.name === stateData.sessionName) {
        return stateData.sessions[i].node
      }
    }
    return {}
  }

  generateNotification = (text) => {
    notification.warning({
      message: 'Warning',
      description: text,
    })
  }

  redirectToAssessment = (text) => {
    if (text === 'VB-MAPP') {
      window.location.href = '/#/therapy/vbmapps/list'
    }
    if (text === 'CogniAble') {
      window.location.href = '/#/cogniableAssessment'
    }
    if (text === 'PEAK') {
      window.location.href = '/#/peak'
    }
  }

  activeInactiveVbMapp = isActive => {
    const std = JSON.parse(localStorage.getItem('studentId'))
    if (isActive) {
      apolloClient
        .mutate({
          mutation: gql`
          mutation{
            vbmappActivateStudent(input:{
                student: "${std}"
            }){
                status
                msg
            }
          }
          `,
        })
        .then(result => {
          this.setState({
            isVBMAPPActive: true
          })
          console.log("vb-mapp ====> ", result)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }

  activeInactivePEAK = isActive => {
    const std = JSON.parse(localStorage.getItem('studentId'))
    apolloClient
      .mutate({
        mutation: gql`mutation {
          updateStudent(input:{
            studentData:{
              id:"${std}", 
              isPeakActive: ${isActive}
            }
          })
          { 
            student {
              id,
              firstname
              isPeakActive
              isCogActive 
            }
          }
        }`,
      })
      .then(result => {
        this.setState({
          studentDetails: result.data.updateStudent.student
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  activeInactiveCogniAble = isActive => {
    const std = JSON.parse(localStorage.getItem('studentId'))
    apolloClient
      .mutate({
        mutation: gql`
        mutation {
          updateStudent(input:{
            studentData:{
              id:"${std}", 
              isCogActive: ${isActive}
            }
          })
          { 
            student {
              id,
              firstname
              isPeakActive
              isCogActive 
            }
          }
        }`,
      })
      .then(result => {
        this.setState({
          studentDetails: result.data.updateStudent.student
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  render() {
    const propData = this.props
    // console.log('areas: ', propData.areas)
    const stateData = this.state
    const { isVBMAPPActive, programAreaStatus, studentDetails } = this.state
    const filteredArray = this.getFilteredArray()

    return (
      <>
        <Authorize roles={['therapist', 'school_admin']} redirect to="/dashboard/beta">
          <Helmet title="Program" />
          <Layout style={{ padding: '0px' }}>
            <Content
              style={{
                padding: '0px',
                maxWidth: 1300,
                width: '100%',
                margin: '0px auto',
              }}
            >
              <Row style={customDivStyle} gutter={[41, 0]}>
                <Col span={16}>
                  <Row>
                    <Col span={24}>
                      <LearnerCard
                        key={propData.student.id}
                        node={propData.student}
                        name={propData.student.firstname}
                        style={{ backgroundColor: 'white' }}
                        leaveRequest={propData.student.leaveRequest}
                        selectedProgramArea={propData.selectedArea}
                      />
                    </Col>

                    {/* <Col span={24}>
                      <Title style={{ fontSize: 20, lineHeight: '27px', marginTop: '20px' }}>
                        Active Program Areas
                      </Title>
                      <div
                        style={{
                          overflowX: 'scroll',
                          overflowY: 'hidden',
                          whiteSpace: 'nowrap',
                          flexWrap: 'nowrap',

                        }}
                      >
                        {this.renderProgramArea()}
                      </div>
                    </Col> */}




                  </Row>
                </Col>

                {/* <Col span={8}>
                  <Card style={{ borderRadius: '10px', cursor: 'pointer' }}>
                    <a href="/#/target/allocation">
                      <Title style={{ fontSize: '18px' }}>Build {propData.student.firstname}&apos;s Goals</Title>
                      <p style={{ display: 'block', marginTop: '5px', marginBottom: '0px' }}><i>Click here to build LTG & STG </i></p>
                    </a>
                  </Card>
                </Col> */}

                <Col span={24}>
                  <Title style={{ fontSize: 20, lineHeight: '27px', marginTop: '20px' }}>
                    Assessments
                  </Title>
                  <div
                    style={{
                      overflowX: 'scroll',
                      overflowY: 'hidden',
                      whiteSpace: 'nowrap',
                      flexWrap: 'nowrap',

                    }}
                  >
                    <div role="presentation" style={assessmentCardStyle}>
                      <div>
                        <Title style={{ fontSize: '18px' }}>PEAK</Title>
                        <div>
                          <Switch
                            checkedChildren={<Icon type="check" />}
                            checked={studentDetails?.isPeakActive}
                            unCheckedChildren={<Icon type="close" />}
                            onChange={(event) => {
                              this.activeInactivePEAK(event)
                            }}
                          />
                        </div>
                        <Button type="link" onClick={studentDetails?.isPeakActive ? () => { this.redirectToAssessment('PEAK') } : () => { this.generateNotification('PEAK assessment is not activated') }}><p style={{ display: 'block', marginTop: '5px', marginBottom: '-5px' }}><i>Click here start PEAK Assessment </i></p></Button>
                      </div>
                    </div>

                    <div role="presentation" style={assessmentCardStyle}>
                      <div>
                        <Title style={{ fontSize: '18px' }}>VB-MAPP</Title>
                        <div>
                          <Switch
                            checkedChildren={<Icon type="check" />}
                            unCheckedChildren={<Icon type="close" />}
                            checked={isVBMAPPActive}
                            onChange={(event) => {
                              this.activeInactiveVbMapp(event)
                            }}
                          />
                        </div>
                        <Button type="link" onClick={isVBMAPPActive ? () => { this.redirectToAssessment('VB-MAPP') } : () => { this.generateNotification('VB-MAPP assessment is not activated') }}><p style={{ display: 'block', marginTop: '5px', marginBottom: '-5px' }}><i>Click here start VB-Mapp Assessment </i></p></Button>
                      </div>
                    </div>

                    <div role="presentation" style={assessmentCardStyle}>
                      <div>
                        <Title style={{ fontSize: '18px' }}>CogniAble</Title>
                        <div>
                          <Switch
                            checkedChildren={<Icon type="check" />}
                            checked={studentDetails?.isCogActive}
                            unCheckedChildren={<Icon type="close" />}
                            onChange={(event) => {
                              this.activeInactiveCogniAble(event)
                            }}
                          />
                        </div>
                        <Button type="link" onClick={studentDetails?.isCogActive ? () => { this.redirectToAssessment('CogniAble') } : () => { this.generateNotification('CogniAble assessment is not activated') }}><p style={{ display: 'block', marginTop: '5px', marginBottom: '-5px' }}><i>Click here start CogniAble Assessment </i></p></Button>
                      </div>
                    </div>

                  </div>
                </Col>

                <Col span={24}>
                  <Title style={{ fontSize: 20, lineHeight: '27px', marginTop: '20px' }}>
                    Sessions Status
                      </Title>
                  <div
                    style={{
                      overflowX: 'scroll',
                      overflowY: 'hidden',
                      whiteSpace: 'nowrap',
                      flexWrap: 'nowrap',

                    }}
                  >
                    {this.renderSessionCards()}
                  </div>
                </Col>


              </Row>
            </Content>
            <Drawer
              placement="right"
              closable={false}
              maskStyle={{ display: 'flex' }}
              visible={stateData.visible}
              width={500}
            >
              <SessionInstruction
                session={filteredArray}
                closeModal={() => {
                  this.onClose()
                }}
              />
            </Drawer>
          </Layout>
        </Authorize>
      </>
    )
  }
}
export default StudentDrawer

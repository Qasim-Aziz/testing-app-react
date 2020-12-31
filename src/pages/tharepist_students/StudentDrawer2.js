/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react'
import { Button, Progress, Drawer, Card, Layout, Row, Col, Typography, Switch, Icon, notification } from 'antd'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import { connect } from 'react-redux'
import { HeartOutlined, CloseOutlined } from '@ant-design/icons'
import { gql } from 'apollo-boost'
import apolloClient from '../../apollo/config'
import styles from './style.module.scss'
import student from '../../images/student.jpg'
import childMother from '../../images/childMother.jpg'
import SessionInstruction from './SessionInstructions'
import LearnerCard from './LearnerCard'
import SessionCard from '../parent/ParentDashboard/SessionCard'

const { Content } = Layout
const { Title, Text } = Typography

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
        isCogActive
        isPeakActive
      }
    }`,
      })
      .then(result => {
        console.log("assessQuery===>", result)
        this.setState({
          sessions: result.data.GetStudentSession.edges,
          programAreaStatus: areas,
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
        console.log("vb-mapp ====> " ,result)
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
            className={
              propData.selectedArea.toUpperCase() ===
                stateData.programAreaStatus[i].node.name.toUpperCase() && !stateData.isSelected
                ? styles.drawerCardItemSelected
                : styles.drawerCardItem
            }
            onClick={() => {
              this.handleClick()
            }}
            key={i}
          >
            <Card>
              <div className={styles.drawercardHeading}>
                <p>{stateData.programAreaStatus[i].node.name}</p>
              </div>
              {/* <div className={styles.drawerProgress}> */}
              <Progress percent={stateData.programAreaStatus[i].node.percentageLong ? stateData.programAreaStatus[i].node.percentageLong : 0} strokeColor="#0059b3" />
              {/* </div> */}
            </Card>
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
            <SessionCard
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
    if(text === 'VB-MAPP'){
      window.location.href = '/#/therapy/vbmapps/list'
    }
    if(text === 'CogniAble'){
      window.location.href = '/#/cogniableAssessment'
    }
  }

  activeInactiveVbMapp = isActive => {
    if (isActive){
      const std = JSON.parse(localStorage.getItem('studentId'))
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
          console.log("vb-mapp ====> " ,result)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }

  render() {
    const propData = this.props
    // console.log('areas: ', propData.areas)
    const stateData = this.state
    const {isVBMAPPActive} = this.state
    const filteredArray = this.getFilteredArray()
    const checked = false
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
    return (
      <>
        <Authorize roles={['therapist', 'school_admin']} redirect to="/dashboard/beta">
          <Helmet title="Dashboard Alpha" />
          <Layout style={{ padding: '0px' }}>
            <Content
              style={{
                padding: '0px',
                maxWidth: 1300,
                width: '100%',
                margin: '0px auto',
              }}
            >
              <Row style={{ width: '100%', margin: 0 }} gutter={[41, 0]}>
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
                <Col span={8}>
                  <div
                    style={{
                      marginLeft: '20px',
                      background: '#F9F9F9',
                      borderRadius: 10,
                      padding: '28px 27px 20px',
                    }}
                  >
                    <LearnerCard
                      key={propData.student.id}
                      node={propData.student}
                      name={propData.student.firstname}
                      style={{ backgroundColor: 'white' }}
                      leaveRequest={propData.student.leaveRequest}
                    />
                    <div style={{ height: '620px', overflow: 'auto' }}>
                      <div className={styles.drawerShell}>
                        <div className={styles.drawerCard}>{this.renderProgramArea()}</div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div
                    style={{
                      background: '#F9F9F9',
                      borderRadius: 10,
                      padding: '28px 27px 28px 27px',
                    }}
                  >
                    <Title style={{ fontSize: 20, lineHeight: '27px' }}>Goals</Title>

                    <Card style={{ borderRadius: '10px', cursor: 'pointer' }}>
                      <a href="/#/target/allocation">
                        <Title style={{ fontSize: '18px' }}>Build {propData.student.firstname}&apos;s Goals</Title>
                        <p style={{display: 'block', marginTop: '5px', marginBottom: '0px'}}><i>Click here to build LTG & STG </i></p>
                        {/* <Progress
                          percent={40}
                          showInfo={false}
                          strokeColor="#0059b3"
                          strokeWidth={10}
                        /> */}
                      </a>
                    </Card>

                    {/* <Card style={{ borderRadius: '10px', cursor: 'pointer', marginTop: '10px' }}>
                      <a href="/#/target/allocation">
                        <Title style={{ fontSize: '18px' }}>Short Term Goal</Title>
                        <Progress
                          percent={40}
                          showInfo={false}
                          strokeColor="#0059b3"
                          strokeWidth={10}
                        />
                      </a>
                    </Card> */}

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

                      <div
                        role="presentation"
                        style={assessmentCardStyle}
                      > 
                        <div>
                          <Title style={{ fontSize: '18px' }}>PEAK</Title>
                          <div>
                            <Switch
                              checkedChildren={<Icon type="check" />}
                              unCheckedChildren={<Icon type="close" />}
                            />
                          </div>
                          <Button type="link" onClick={checked ? () => {this.redirectToAssessment('PEAK')} : () => {this.generateNotification('PEAK assessment is not activated')}}><p style={{display: 'block', marginTop: '5px', marginBottom: '-5px'}}><i>Click here start PEAK Assessment </i></p></Button>
                        </div>
                      </div>

                      <div
                        role="presentation"
                        style={assessmentCardStyle}
                      >
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
                          <Button type="link" onClick={isVBMAPPActive ? () => {this.redirectToAssessment('VB-MAPP')} : () => {this.generateNotification('VB-MAPP assessment is not activated')}}><p style={{display: 'block', marginTop: '5px', marginBottom: '-5px'}}><i>Click here start VB-Mapp Assessment </i></p></Button>
                        </div>
                      </div>

                      <div
                        role="presentation"
                        style={assessmentCardStyle}
                      >
                        <div>
                          <Title style={{ fontSize: '18px' }}>CogniAble</Title>
                          <div>
                            <Switch
                              checkedChildren={<Icon type="check" />}
                              checked
                              unCheckedChildren={<Icon type="close" />}
                            />
                          </div>
                          <Button type="link" onClick={checked ? () => {this.redirectToAssessment('CogniAble')} : () => {this.redirectToAssessment('CogniAble')}}><p style={{display: 'block', marginTop: '5px', marginBottom: '-5px'}}><i>Click here start CogniAble Assessment </i></p></Button>
                        </div>
                      </div>


                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div
                    role="presentation"
                    onClick={() => {
                      this.close()
                    }}
                    style={{ float: 'right' }}
                  >
                    <CloseOutlined
                      style={{ fontSize: '20px', color: 'black', cursor: 'pointer' }}
                    />
                  </div>
                  <Title style={{ fontSize: 20, lineHeight: '27px' }}>Sessions</Title>
                  <div style={{ height: '650px', overflow: 'auto' }}>
                    {this.renderSessionCards()}
                  </div>
                </Col>
              </Row>
            </Content>
          </Layout>
        </Authorize>
      </>
    )
  }
}
export default StudentDrawer

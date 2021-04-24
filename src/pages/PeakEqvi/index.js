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
  Tabs,
  Icon,
  Affix,
  Drawer,
  Form,
  DatePicker,
  Collapse,
  Steps,
} from 'antd'
import { Redirect } from 'react-router-dom'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'
import { connect } from 'react-redux'
import { COLORS, DRAWER } from 'assets/styles/globalStyles'
import LoadingComponent from 'components/LoadingComponent'
import moment from 'moment'
// import DurationGraph from './duration'
// import FrequencyGraph from './frequency'
import EquivalenceTargets from '../PEAK/EquivalenceTarget'
import client from '../../apollo/config'

const { Title, Text } = Typography
const { Content } = Layout
const { RangePicker } = DatePicker
const { TabPane } = Tabs
const { Panel } = Collapse
const { Step } = Steps

const stepStyle = {
  marginBottom: 10,
  boxShadow: '0px -1px 0 0 #e8e8e8 inset',
}

const cardStyle = {
  background: '#FFFFFF',
  border: '1px solid #E4E9F0',
  boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
  borderRadius: 10,
  padding: '16px 12px',
  alignItems: 'center',
  display: 'block',
  width: '100%',
  marginBottom: '20px',
  lineHeight: '27px',
  cursor: 'pointer',
  // minHeight: '130px',
}

const selectedCardStyle = {
  background: COLORS.palleteBlue,
  border: '1px solid #E4E9F0',
  color: '#fff',
  boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
  borderRadius: 10,
  padding: '16px 12px',
  alignItems: 'center',
  display: 'block',
  width: '100%',
  marginBottom: '20px',
  lineHeight: '27px',
  cursor: 'pointer',
  // minHeight: '130px',
}

const textStyle = {
  fontSize: '14px',
  lineHeight: '19px',
  fontWeight: 600,
  display: 'block',
}

const titleStyle = {
  fontSize: '20px',
  lineHeight: '24px',
  display: 'block',
  width: '100%',
}
const titleStyle1 = {
  fontSize: '18px',
  lineHeight: '24px',
  display: 'block',
  width: '100%',
  textAlign: 'center',
}

const selectedTextStyle = {
  fontSize: '14px',
  lineHeight: '19px',
  fontWeight: 600,
  color: '#fff',
}

const selectedTitleStyle = {
  fontSize: '20px',
  lineHeight: '24px',
  display: 'block',
  width: '100%',
  color: '#fff',
}

@connect(({ user, student, peakequivalence }) => ({ user, student, peakequivalence }))
class PeakEqvi extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      behaviorList: [],
      loading: false,
      selectedBehavior: '',
      startDate: moment().subtract(30, 'days'),
      endDate: moment(),
      componentsKey: Math.random(),
      visible: false,
      visibleModal: true,
      current: 0,
      buttonState: true,
      suggestTarget: false,
    }
  }

  componentDidMount() {
    const {
      dispatch,
      peakequivalence: { ProgramId },
    } = this.props
    const programId = localStorage.getItem('peakId')

    if (!programId) window.location.href = '/#/'

    if (!ProgramId) {
      dispatch({
        type: 'peakequivalence/SET_STATE',
        payload: {
          ProgramId: programId,
        },
      })
    }

    dispatch({
      type: 'student/STUDENT_DETAILS',
    })
    dispatch({
      type: 'peakequivalence/LOAD_DATA',
    })

    this.LoadAssessment('Basic')
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    })
  }

  onClose = () => {
    this.setState({
      visible: false,
    })
  }

  showAssessmentTypeModal = () => {
    this.setState({
      visibleModal: true,
    })
  }

  // meeting and appointment

  LoadAssessment = assType => {
    const { dispatch } = this.props

    dispatch({
      type: 'peakequivalence/START_ASSESSMENT',
      payload: {
        assessmentType: assType,
      },
    })
    dispatch({
      type: 'peakequivalence/START_ASSESSMENT',
      payload: {
        assessmentType: 'Intermediate',
      },
    })
    dispatch({
      type: 'peakequivalence/START_ASSESSMENT',
      payload: {
        assessmentType: 'Advanced',
      },
    })

    this.setState({
      visibleModal: false,
    })
  }

  goToPreviousTrial = () => {
    const {
      dispatch,
      peakequivalence: {
        SelectedQuestionIndex,
        AssessmentObject,
        PEQuestionsListObject,
        SelectedDomainId,
        SelectedTestIndex,
      },
    } = this.props

    dispatch({
      type: 'peakequivalence/SET_STATE',
      payload: {
        SelectedTestIndex: SelectedTestIndex - 1,
        SelectedTestId:
          PEQuestionsListObject[SelectedDomainId][SelectedQuestionIndex]?.node.test.edges[
            SelectedTestIndex - 1
          ]?.node.id,
      },
    })
  }

  goToNextTrial = () => {
    const {
      dispatch,
      peakequivalence: {
        SelectedQuestionIndex,
        AssessmentObject,
        PEQuestionsListObject,
        SelectedDomainId,
        SelectedTestIndex,
      },
    } = this.props

    dispatch({
      type: 'peakequivalence/SET_STATE',
      payload: {
        SelectedTestIndex: SelectedTestIndex + 1,
        SelectedTestId:
          PEQuestionsListObject[SelectedDomainId][SelectedQuestionIndex]?.node.test.edges[
            SelectedTestIndex + 1
          ]?.node.id,
      },
    })
  }

  goToPreviousQuestion = () => {
    const {
      dispatch,
      peakequivalence: {
        SelectedQuestionIndex,
        AssessmentObject,
        PEQuestionsListObject,
        SelectedDomainId,
        SelectedTestIndex,
      },
    } = this.props

    dispatch({
      type: 'peakequivalence/SET_STATE',
      payload: {
        SelectedQuestionIndex: SelectedQuestionIndex - 1,
        SelectedQuestionId:
          PEQuestionsListObject[SelectedDomainId][SelectedQuestionIndex - 1]?.node.id,
        SelectedTestIndex: 0,
        SelectedTestId:
          PEQuestionsListObject[SelectedDomainId][SelectedQuestionIndex - 1]?.node.test.edges[0]
            ?.node.id,
      },
    })
  }

  goToNextQuestion = () => {
    const {
      dispatch,
      peakequivalence: {
        SelectedQuestionIndex,
        AssessmentObject,
        PEQuestionsListObject,
        SelectedDomainId,
        SelectedTestIndex,
      },
    } = this.props

    dispatch({
      type: 'peakequivalence/SET_STATE',
      payload: {
        SelectedQuestionIndex: SelectedQuestionIndex + 1,
        SelectedQuestionId:
          PEQuestionsListObject[SelectedDomainId][SelectedQuestionIndex + 1]?.node.id,
        SelectedTestIndex: 0,
        SelectedTestId:
          PEQuestionsListObject[SelectedDomainId][SelectedQuestionIndex + 1]?.node.test.edges[0]
            ?.node.id,
      },
    })
  }

  recordResponse = response => {
    const {
      dispatch,
      peakequivalence: {
        SelectedQuestionIndex,
        AssessmentObject,
        PEQuestionsListObject,
        SelectedDomainId,
        SelectedTestIndex,
      },
    } = this.props

    this.setState({
      buttonState: response,
    })

    dispatch({
      type: 'peakequivalence/RECORD_RESPONSE',
      payload: {
        assessmentId: AssessmentObject.id,
        questionId: PEQuestionsListObject[SelectedDomainId][SelectedQuestionIndex]?.node.id,
        testId:
          PEQuestionsListObject[SelectedDomainId][SelectedQuestionIndex]?.node.test.edges[
            SelectedTestIndex
          ]?.node.id,
        response: response,
      },
    })
  }

  finishAssessment = pg => {
    const { dispatch } = this.props

    dispatch({
      type: 'peakequivalence/FINISH_ASSESSMENT',
      payload: {
        programId: pg,
      },
    })
  }

  showReport = () => {
    window.location.href = '/#/peakEquivalenceReport'
  }

  changeActiveDomian = domainId => {
    if (domainId === 'report') {
      window.location.href = '/#/peakEquivalenceReport'
    } else if (domainId && domainId !== 'report') {
      const {
        dispatch,
        peakequivalence: {
          SelectedQuestionIndex,
          AssessmentObject,
          PEQuestionsListObject,
          SelectedDomainId,
          SelectedTestIndex,
        },
      } = this.props

      dispatch({
        type: 'peakequivalence/SET_STATE',
        payload: {
          SelectedDomainId: domainId,
          SelectedQuestionIndex: 0,
          SelectedQuestionId: PEQuestionsListObject[domainId][0]?.node.id,
          SelectedTestIndex: 0,
          SelectedTestId: PEQuestionsListObject[domainId][0]?.node.test.edges[0]?.node.id,
        },
      })
    }
  }

  changeQuestion = index => {
    const {
      dispatch,
      peakequivalence: {
        SelectedQuestionIndex,
        AssessmentObject,
        PEQuestionsListObject,
        SelectedDomainId,
        SelectedTestIndex,
      },
    } = this.props

    dispatch({
      type: 'peakequivalence/SET_STATE',
      payload: {
        SelectedQuestionIndex: index,
        SelectedQuestionId: PEQuestionsListObject[SelectedDomainId][index]?.node.id,
        SelectedTestIndex: 0,
        SelectedTestId: PEQuestionsListObject[SelectedDomainId][index]?.node.test.edges[0]?.node.id,
      },
    })
  }

  checkDomainStatus = domainId => {
    const {
      peakequivalence: { PEQuestionsListObject, ResponseObject },
    } = this.props

    let started = false
    let recorded = true
    let status = ''

    PEQuestionsListObject[domainId].map(questionItem => {
      questionItem.node.test.edges?.map(testItem => {
        if (ResponseObject[questionItem.node.id][testItem.node.id].recorded === true) started = true
        else recorded = false
      })
    })

    if (!started) status = 'Pending'
    else if (started && !recorded) status = 'In-Progress'
    else if (recorded) status = 'Completed'

    return status
  }

  onChange = current => {
    let aType = 'Basic'
    if (current === 0) aType = 'Basic'
    if (current === 1) aType = 'Intermediate'
    if (current === 2) aType = 'Advanced'
    this.setState({ current })
    this.LoadAssessment(aType)
  }

  render() {
    const {
      form,
      student: { StudentName },
      peakequivalence: {
        PeakTypeList,
        Loading,
        ObjectLoaded,
        PEDomainList,
        PEQuestionsList,
        ProgramId,
        SelectedDomainId,
        SelectedQuestionIndex,
        SelectedQuestionId,
        PEQuestionsListObject,
        SelectedTestIndex,
        ResponseObject,
        ResponseLoading,
        SelectedTestId,
        SelectedPeakType,
      },
    } = this.props

    const { loading, visibleModal, current } = this.state

    const studId = localStorage.getItem('studentId')
    if (!studId) {
      return <Redirect to="/" />
    }

    const buttonDefaultStyle = {
      padding: '20px auto',
      width: '350px',
      height: '50px',
      marginRight: '20px',
      fontSize: '15px',
      border: '1px solid #4BAEA0',
      color: '#4BAEA0',
    }
    const buttonDefaultFalseStyle = {
      padding: '20px auto',
      width: '350px',
      height: '50px',
      marginRight: '20px',
      fontSize: '15px',
      border: '1px solid #FF8080',
      color: '#FF8080',
      marginTop: '15px',
    }
    const buttonTrueStyle = {
      padding: '20px auto',
      width: '350px',
      height: '50px',
      marginRight: '20px',
      fontSize: '15px',
      border: '1px solid #bbb',
      color: 'white',
      backgroundColor: '#4BAEA0',
    }
    const buttonFalseStyle = {
      padding: '20px auto',
      width: '350px',
      height: '50px',
      marginRight: '20px',
      fontSize: '15px',
      border: '1px solid #bbb',
      color: 'white',
      backgroundColor: '#FF8080',
      marginTop: '15px',
    }

    return (
      <>
        <Helmet title="Peak Eqvi" />
        <Layout style={{ padding: '0px' }}>
          <Content
            style={{
              padding: '0px 20px',
              maxWidth: 1300,
              width: '100%',
              margin: '0px auto',
            }}
          >
            {ObjectLoaded ? (
              <Row>
                <Col sm={16}>
                  <Steps
                    type="navigation"
                    size="small"
                    current={current}
                    onChange={this.onChange}
                    style={stepStyle}
                  >
                    <Step
                      title="Step 1"
                      subTitle="Basic"
                      status="process"
                      // description="This is a description."
                    />
                    <Step
                      title="Step 2"
                      subTitle="Intermediate"
                      status="process"
                      // description="This is a description."
                    />
                    <Step
                      title="Step 3"
                      subTitle="Advanced"
                      status="process"
                      // description="This is a description."
                    />
                  </Steps>

                  <div
                    role="presentation"
                    style={{
                      borderRadius: 10,
                      border: '2px solid #F9F9F9',
                      padding: '20px 27px 20px',
                      marginBottom: '2%',
                      display: 'block',

                      width: '100%',
                      marginRight: '10px',
                      minHeight: '595px',
                      overflow: 'auto',
                    }}
                  >
                    <Title style={{ fontSize: '20px', lineHeight: '20px' }}>
                      {StudentName}&apos;s Assessment
                    </Title>

                    {Loading ? (
                      <p>Loading...</p>
                    ) : (
                      <>
                        <div>
                          <Text style={{ fontSize: '18px', lineHeight: '24px' }}>
                            {
                              PEQuestionsListObject[SelectedDomainId][SelectedQuestionIndex]?.node
                                .questionText
                            }
                          </Text>

                          <span style={{ float: 'right' }}>
                            {SelectedQuestionIndex === 0 ? (
                              <Button disabled>
                                <Icon type="left" />
                              </Button>
                            ) : (
                              <Button onClick={this.goToPreviousQuestion}>
                                <Icon type="left" />
                              </Button>
                            )}
                            &nbsp; Question {SelectedQuestionIndex + 1} /{' '}
                            {PEQuestionsListObject[SelectedDomainId]?.length} &nbsp;
                            {SelectedQuestionIndex + 1 ===
                            PEQuestionsListObject[SelectedDomainId]?.length ? (
                              <Button disabled>
                                <Icon type="right" />
                              </Button>
                            ) : (
                              <Button onClick={this.goToNextQuestion}>
                                <Icon type="right" />
                              </Button>
                            )}
                          </span>
                        </div>

                        {PEQuestionsListObject[SelectedDomainId][SelectedQuestionIndex]?.node.test
                          .edges.length > 0 && (
                          <div
                            style={{
                              background: '#FFFFFF',
                              border: '1px solid #E4E9F0',
                              boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
                              borderRadius: 10,
                              padding: '16px 12px',
                              alignItems: 'center',
                              display: 'block',
                              width: '100%',
                              marginBottom: '20px',
                              lineHeight: '27px',
                              marginTop: '40px',
                              minHeight: '140px',
                            }}
                          >
                            {/* <Title style={{ textAlign: 'center', fontSize: '15px' }}>Test 1</Title> */}
                            <Title style={titleStyle1}>
                              {
                                PEQuestionsListObject[SelectedDomainId][SelectedQuestionIndex]?.node
                                  .test.edges[SelectedTestIndex]?.node.name
                              }
                            </Title>
                            <div style={{ textAlign: 'right', marginTop: '20px' }}>
                              <Button
                                onClick={() => this.recordResponse(true)}
                                loading={this.state.buttonState && ResponseLoading}
                                style={
                                  ResponseObject[SelectedQuestionId][SelectedTestId].recorded &&
                                  ResponseObject[SelectedQuestionId][SelectedTestId].response ===
                                    true
                                    ? buttonTrueStyle
                                    : buttonDefaultStyle
                                }
                              >
                                {StudentName} gave an expected response
                              </Button>
                              <br style={{ marginTop: 20 }} />
                              <Button
                                onClick={() => this.recordResponse(false)}
                                loading={!this.state.buttonState && ResponseLoading}
                                style={
                                  ResponseObject[SelectedQuestionId][SelectedTestId].recorded &&
                                  ResponseObject[SelectedQuestionId][SelectedTestId].response ===
                                    false
                                    ? buttonFalseStyle
                                    : buttonDefaultFalseStyle
                                }
                              >
                                {StudentName} gave an unexpected response
                              </Button>
                            </div>
                          </div>
                        )}

                        <div
                          style={{
                            textAlign: 'right',
                            marginTop: '50px',
                            display: 'flex',
                            justifyContent: 'flex-end',
                          }}
                        >
                          <span style={{ float: 'right' }}>
                            {SelectedTestIndex === 0 ? (
                              <Button disabled>
                                <Icon type="left" />
                              </Button>
                            ) : (
                              <Button onClick={this.goToPreviousTrial}>
                                <Icon type="left" />
                              </Button>
                            )}
                            &nbsp;Test {SelectedTestIndex + 1} /{' '}
                            {
                              PEQuestionsListObject[SelectedDomainId][SelectedQuestionIndex]?.node
                                .test.edges.length
                            }
                            &nbsp;
                            {SelectedTestIndex + 1 ===
                            PEQuestionsListObject[SelectedDomainId][SelectedQuestionIndex]?.node
                              .test.edges.length ? (
                              <Button disabled>
                                <Icon type="right" />
                              </Button>
                            ) : (
                              <Button onClick={this.goToNextTrial}>
                                <Icon type="right" />
                              </Button>
                            )}
                          </span>
                          <Button
                            type="danger"
                            style={{
                              marginLeft: 6,
                              height: 35,
                              width: 100,
                              fontSize: 14,
                              fontWeight: 'bold',
                              backgroundColor: COLORS.danger,
                            }}
                            onClick={() => this.showReport(ProgramId)}
                          >
                            Quit
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </Col>
                <Col sm={8}>
                  <div
                    style={{
                      background: COLORS.palleteLight,
                      borderRadius: 10,
                      padding: '28px 27px 20px',
                      display: 'block',
                      width: '100%',
                      minHeight: '650px',
                      marginLeft: '10px',
                    }}
                  >
                    <div style={{ height: '600px', overflow: 'auto' }}>
                      {Loading ? (
                        <p>Loading...</p>
                      ) : (
                        <Collapse
                          accordion
                          bordered={false}
                          onChange={e => this.changeActiveDomian(e)}
                          activeKey={SelectedDomainId}
                          key={SelectedDomainId}
                        >
                          {PEDomainList.map((item, index) => (
                            <Panel
                              header={`${item.name} (${this.checkDomainStatus(item.id)}) `}
                              key={item.id}
                            >
                              {PEQuestionsListObject[item.id].map((node, nodeIndex) => (
                                <>
                                  <div
                                    onClick={() => this.changeQuestion(nodeIndex)}
                                    style={
                                      node.node.id === SelectedQuestionId
                                        ? selectedCardStyle
                                        : cardStyle
                                    }
                                  >
                                    <Title
                                      style={
                                        node.node.id === SelectedQuestionId
                                          ? selectedTitleStyle
                                          : titleStyle
                                      }
                                    >
                                      {node.node.questionText}
                                    </Title>
                                  </div>
                                </>
                              ))}
                            </Panel>
                          ))}
                          <Button
                            onClick={() => this.showReport()}
                            style={{
                              width: '100%',
                              marginTop: '20px',
                              padding: '8px',
                              backgroundColor: COLORS.palleteBlue,
                              color: 'white',
                            }}
                          >
                            View Report
                          </Button>
                          <Button
                            onClick={() => this.setState({ suggestTarget: true })}
                            style={{
                              width: '100%',
                              marginTop: '10px',
                              padding: '8px',
                              backgroundColor: COLORS.palleteBlue,
                              color: 'white',
                            }}
                          >
                            Suggest Target
                          </Button>
                        </Collapse>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            ) : (
              <LoadingComponent />
            )}
          </Content>
        </Layout>
        <Drawer
          title="Use Me"
          placement="right"
          width={450}
          closable={true}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          3
        </Drawer>
        <Drawer
          visible={this.state.suggestTarget}
          onClose={() => {
            this.setState({
              suggestTarget: false,
            })
          }}
          width={DRAWER.widthL2}
          title="Target Allocation from PEAK Assessment"
        >
          <EquivalenceTargets suggestTarget={ProgramId} />
        </Drawer>
      </>
    )
  }
}

export default Form.create()(PeakEqvi)

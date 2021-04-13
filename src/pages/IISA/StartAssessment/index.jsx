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
/* eslint-disable no-self-compare */
/* eslint-disable yoda */

import React from 'react'
import { Helmet } from 'react-helmet'
import { Layout, Row, Col, Typography, Button, Icon, Collapse, Drawer } from 'antd'
import { connect } from 'react-redux'
import LoadingComponent from 'components/LoadingComponent'
import actions from 'redux/iisaassessment/actions'
import AssessmentReport from './report'

const { Content } = Layout
const { Title, Text } = Typography
const { Panel } = Collapse

const cardStyle = {
  background: '#FFFFFF',
  boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
  borderRadius: 7,
  padding: '5px 12px',
  alignItems: 'center',
  display: 'block',
  width: '100%',
  marginBottom: '10px',
  lineHeight: '27px',
  cursor: 'pointer',
  // minHeight: '130px',
}

const selectedCardStyle = {
  background: '#3f72af',
  color: '#fff',
  boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
  borderRadius: 7,
  padding: '5px 12px',
  alignItems: 'center',
  display: 'block',
  width: '100%',
  marginBottom: '10px',
  lineHeight: '27px',
  cursor: 'pointer',
  // minHeight: '130px',
}

const titleStyle = {
  fontSize: '14px',
  lineHeight: '24px',
  display: 'block',
  width: '100%',
}

const selectedTitleStyle = {
  fontSize: '14px',
  lineHeight: '24px',
  display: 'block',
  width: '100%',
  color: '#fff',
}

const buttonDefaultStyle = {
  padding: '20px auto',
  width: '220px',
  height: '50px',
  marginRight: '20px',
  fontSize: '15px',
  color: '#3f72af',
  margin: 5,
}
const buttonTrueStyle = {
  padding: '20px auto',
  width: '220px',
  height: '50px',
  marginRight: '20px',
  fontSize: '15px',
  color: 'white',
  backgroundColor: '#3f72af',
  margin: 5,
}

@connect(({ iisaassessment, student }) => ({
  iisaassessment,
  student,
}))
class Screeing extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    this.onRenderWithoutID()
  }

  onRenderWithoutID = () => {
    const {
      dispatch,
      iisaassessment: { SelectedAssessmentId },
    } = this.props
    if (!SelectedAssessmentId) {
      window.location.href = '/#/iisaAssessment'
    } else {
      dispatch({
        type: actions.LOAD_ASSESSMENT_OBJECT,
        payload: {
          objectId: SelectedAssessmentId,
        },
      })
    }
  }

  changeActiveDomian = domainId => {
    console.log(domainId)
    if (domainId === 'report') {
      window.location.href = '/#/iisaReport'
    } else if (domainId && domainId !== 'report') {
      const {
        dispatch,
        iisaassessment: { IISAQuestionsListObject },
      } = this.props

      dispatch({
        type: actions.SET_STATE,
        payload: {
          SelectedDomainId: domainId,
          SelectedQuestionIndex: 0,
          SelectedQuestionId: IISAQuestionsListObject[domainId][0]?.question.node.id,
        },
      })
    }
  }

  changeQuestion = index => {
    const {
      dispatch,
      iisaassessment: { IISAQuestionsListObject, SelectedDomainId },
    } = this.props

    dispatch({
      type: actions.SET_STATE,
      payload: {
        SelectedQuestionIndex: index,
        SelectedQuestionId: IISAQuestionsListObject[SelectedDomainId][index]?.question.node.id,
      },
    })
  }

  goToPreviousQuestion = () => {
    const {
      dispatch,
      iisaassessment: { SelectedQuestionIndex, IISAQuestionsListObject, SelectedDomainId },
    } = this.props

    dispatch({
      type: actions.SET_STATE,
      payload: {
        SelectedQuestionIndex: SelectedQuestionIndex - 1,
        SelectedQuestionId:
          IISAQuestionsListObject[SelectedDomainId][SelectedQuestionIndex - 1]?.question.node.id,
      },
    })
  }

  goToNextQuestion = () => {
    const {
      dispatch,
      iisaassessment: { SelectedQuestionIndex, IISAQuestionsListObject, SelectedDomainId },
    } = this.props

    dispatch({
      type: actions.SET_STATE,
      payload: {
        SelectedQuestionIndex: SelectedQuestionIndex + 1,
        SelectedQuestionId:
          IISAQuestionsListObject[SelectedDomainId][SelectedQuestionIndex + 1]?.question.node.id,
      },
    })
  }

  recordResponse = optionObj => {
    const {
      dispatch,
      iisaassessment: {
        SelectedQuestionIndex,
        AssessmentObject,
        IISAQuestionsListObject,
        SelectedDomainId,
      },
    } = this.props

    dispatch({
      type: actions.RECORD_RESPONSE,
      payload: {
        assessmentId: AssessmentObject.id,
        questionId:
          IISAQuestionsListObject[SelectedDomainId][SelectedQuestionIndex]?.question.node.id,
        optionId: optionObj.node.id,
      },
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

  showReport = () => {
    const { dispatch } = this.props
    dispatch({
      type: actions.SET_STATE,
      payload: {
        ReportDrawer: true,
      },
    })
  }

  render() {
    const {
      student: { StudentName },
      iisaassessment: {
        AssessmentLoading,
        SelectedAssessmentId,
        AssessmentObject,
        IISADomains,
        SelectedQuestionId,
        SelectedDomainId,
        IISAQuestionsListObject,
        SelectedQuestionIndex,
        IISAOptions,
        responseLoading,
        ReportDrawer,
      },
    } = this.props

    if (!SelectedAssessmentId) {
      window.location.href = '/#/iisaAssessment'
    }

    if (AssessmentLoading) {
      return <LoadingComponent />
    }

    console.log(IISAQuestionsListObject, IISADomains, 'iisa domain')

    return (
      <>
        <Helmet title="IISA Assessment" />
        <Layout style={{ padding: '0px' }}>
          <Content
            style={{
              padding: '0px 20px',
              maxWidth: 1300,
              width: '100%',
              margin: '0px auto',
            }}
          >
            {AssessmentObject ? (
              <Row>
                <Col sm={16}>
                  <div
                    role="presentation"
                    style={{
                      borderRadius: 10,
                      border: '2px solid #dbe2ef',
                      padding: '20px 27px 20px',
                      marginBottom: '2%',
                      display: 'block',
                      width: '100%',
                      marginRight: '10px',
                      minHeight: '650px',
                      overflow: 'auto',
                    }}
                  >
                    <Title style={{ fontSize: '20px', lineHeight: '20px' }}>
                      {StudentName}&apos;s Assessment
                    </Title>

                    <div>
                      <Text style={{ fontSize: '18px', lineHeight: '24px' }}>
                        Domain:{' '}
                        {
                          IISAQuestionsListObject[SelectedDomainId][SelectedQuestionIndex]?.question
                            .node.domain?.name
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
                        {IISAQuestionsListObject[SelectedDomainId]?.length} &nbsp;
                        {SelectedQuestionIndex + 1 ===
                        IISAQuestionsListObject[SelectedDomainId]?.length ? (
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

                    <br />
                    <div style={{ textAlign: 'center', marginTop: 45 }}>
                      <Title level={3}>
                        Q:{' '}
                        {
                          IISAQuestionsListObject[SelectedDomainId][SelectedQuestionIndex]?.question
                            .node.question
                        }
                      </Title>
                    </div>

                    <div
                      style={{
                        padding: '16px 12px',
                        alignItems: 'center',
                        textAlign: 'center',
                        display: 'block',
                        width: '100%',
                        marginBottom: '20px',
                        lineHeight: '27px',
                        marginTop: '80px',
                        minHeight: '140px',
                      }}
                    >
                      {IISAQuestionsListObject[SelectedDomainId][SelectedQuestionIndex]
                        ?.recorded === false ? (
                        <>
                          {IISAOptions.map((item, index) => (
                            <Button
                              disabled={responseLoading}
                              onClick={() => this.recordResponse(item)}
                              style={buttonDefaultStyle}
                            >
                              {' '}
                              {item.node.name}
                            </Button>
                          ))}
                        </>
                      ) : (
                        <>
                          {IISAOptions.map((item, index) => (
                            <Button
                              disabled={responseLoading}
                              onClick={() => this.recordResponse(item)}
                              style={
                                IISAQuestionsListObject[SelectedDomainId][SelectedQuestionIndex]
                                  ?.response?.answer.id === item.node.id
                                  ? buttonTrueStyle
                                  : buttonDefaultStyle
                              }
                            >
                              {' '}
                              {item.node.name}
                            </Button>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </Col>
                <Col sm={8}>
                  <div
                    style={{
                      background: '#dbe2ef',
                      borderRadius: 10,
                      padding: '28px 27px 20px',
                      display: 'block',
                      width: '100%',
                      minHeight: '650px',
                      marginLeft: '10px',
                    }}
                  >
                    <div style={{ height: '600px', overflow: 'auto' }}>
                      <Collapse
                        accordion
                        bordered={false}
                        onChange={e => this.changeActiveDomian(e)}
                        activeKey={SelectedDomainId}
                        key={SelectedDomainId}
                      >
                        {IISADomains.map((item, index) => (
                          <Panel header={`${item.node.name}`} key={item.node.id}>
                            {IISAQuestionsListObject[item.node.id].map((objectItem, nodeIndex) => (
                              <>
                                <div
                                  onClick={() => this.changeQuestion(nodeIndex)}
                                  style={
                                    objectItem.question.node.id === SelectedQuestionId
                                      ? selectedCardStyle
                                      : cardStyle
                                  }
                                >
                                  <Title
                                    style={
                                      objectItem.question.node.id === SelectedQuestionId
                                        ? selectedTitleStyle
                                        : titleStyle
                                    }
                                  >
                                    {objectItem.question.node.question}
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
                            backgroundColor: '#007acc',
                            color: 'white',
                          }}
                        >
                          View Report
                        </Button>
                      </Collapse>
                    </div>
                  </div>
                </Col>
              </Row>
            ) : (
              <>
                <p>Loading Assessment Object..</p>
              </>
            )}
          </Content>
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
        </Layout>
      </>
    )
  }
}

export default Screeing

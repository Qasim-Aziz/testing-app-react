/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable consistent-return */
import React, { Component } from 'react'
import { Button, Input, Slider, Upload, Layout, Row, Col, Typography, notification } from 'antd'
import { Helmet } from 'react-helmet'
import { Redirect } from 'react-router-dom'
import Authorize from 'components/LayoutComponents/Authorize'
import { connect } from 'react-redux'
import moment from 'moment'
import { gql } from 'apollo-boost'
import CustomCards from './cards'
import Graph from './graph'
import styles from './style.module.scss'
import apolloClient from '../../apollo/config'

const { Content } = Layout
const { TextArea } = Input
const { Text } = Typography
const peakId = 'VGFyZ2V0RGV0YWlsVHlwZTo4'
const equivalence = 'EQUIVALENCE'

const marks = {
  0: '0',
  10: '1',
  20: '2',
  30: '3',
  40: '4',
  50: '5',
  60: '6',
  70: '7',
  80: '8',
  90: '9',
  100: '10',
}

@connect(({ sessionrecording }) => ({ sessionrecording }))
class SessionSummary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sessionEdges: [],
      feedbackText: '',
      sliderVal: 0,
    }
  }

  componentDidMount() {
    const {
      sessionrecording: { ChildSession },
    } = this.props
    if (!ChildSession) {
      return <Redirect to="/" />
    }
    this.callInitialData()
  }

  callInitialData = () => {
    const {
      sessionrecording: { ChildSession },
    } = this.props
    const date = moment(ChildSession.sessionDate).format('YYYY-MM-DD')
    apolloClient
      .query({
        query: gql`
          query { 
            summary: getSessionDataRecording(ChildSession:"${ChildSession.id}"){
              totalTarget
              mandCount
              behCount
              toiletData {
                id
                date
                time
                bowel
                urination
                prompted
              }
              edges{
                node{
                  id
                  targets{
                    id
                    targetAllcatedDetails {
                      id
                      DailyTrials
                      targetType {
                        id
                        typeTar
                      }
                    }
                  }
                  sessionRecord{
                    totalTrial,
                    totalCorrect
                    totalError
                    totalPrompt
                    totalIncorrect
                    totalNr

                    physical
                    verbal
                    gestural
                    textual
                  }
                  peak{
                    totalCorrect
                    totalError
                    totalPrompt
                  }
                }
              }
            }
            childSessionDetails(id:"${ChildSession.id}"){
              id
              feedback
              rating
            }
          }
        `,
        fetchPolicy: 'network-only',
      })
      .then(presult => {
        this.setState({
          sessionEdges: presult.data.summary,
          feedbackText: presult.data.childSessionDetails?.feedback,
          sliderVal: presult.data.childSessionDetails.rating
            ? presult.data.childSessionDetails.rating
            : 0,
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  getPerc = (total, correct) => {
    const percentage = (correct / total) * 100
    return Math.round(percentage)
  }

  renderCards = () => {
    const cardArray = []
    const data = this.state
    const item = data.sessionEdges.edges
    const Mand = data.sessionEdges.mandCount
    const Behaviours = data.sessionEdges.behCount

    const sessionArray = []
    let No = 0
    let Prompted = 0
    let Correct = 0
    let Incorrect = 0
    let totalTrial = 0
    const cardStyle = { padding: 5 }

    if (item !== undefined) {
      for (let i = 0; i < item.length; i += 1) {
        if (item[i].node.targets.targetAllcatedDetails.targetType.id === peakId) {
          const obj = item[i].node.peak
          sessionArray.push({
            ...obj,
            totalTrial: obj.totalPrompt + obj.totalError + obj.totalCorrect,
            totalIncorrect: obj.totalError,
            totalNr: 0,

          })
        } else sessionArray.push(item[i].node.sessionRecord)
      }
      sessionArray.forEach(entry => {
        totalTrial += entry.totalTrial
        Prompted += entry.totalPrompt
        Correct += entry.totalCorrect
        No += entry.totalNr
        Incorrect += entry.totalIncorrect

      })
      cardArray.push(
        <>
          <Row>
            <Col span={12} style={cardStyle}>
              <CustomCards
                label="Trials Completed"
                percentage={this.getPerc(totalTrial, Correct)}
                targetCount={data.sessionEdges.totalTarget}
                trails={totalTrial}
              />
            </Col>
            <Col span={6} style={cardStyle}>
              <CustomCards label="Mand" trails={Mand} />
            </Col>
            <Col span={6} style={cardStyle}>
              <CustomCards label="Behaviours" trails={Behaviours} />
            </Col>
          </Row>
          <Row>
            <Col span={6} style={cardStyle}>
              <CustomCards label="No" trails={No} />
            </Col>
            <Col span={6} style={cardStyle}>
              <CustomCards label="Prompted" trails={Prompted} />
            </Col>
            <Col span={6} style={cardStyle}>
              <CustomCards label="Correct" trails={Correct} />
            </Col>
            <Col span={6} style={cardStyle}>
              <CustomCards label="Incorrect" trails={Incorrect} />
            </Col>
          </Row>
        </>,
      )
    }
    return cardArray
  }

  // callToday = () => {
  //   const today = new Date()
  //   // const date = moment(today).format('YYYY-MM-DD')
  //   const {
  //     sessionrecording: { ChildSession },
  //   } = this.props

  //   const date = moment(ChildSession.sessionDate).format('YYYY-MM-DD')

  //   apolloClient
  //     .query({
  //       query: gql`
  //       query {
  //         summary:getSessionRecordings(ChildSession:"${ChildSession.id}"){
  //             totalTarget
  //             edges{
  //                 node{
  //                     id,
  //                     sessionRecord{
  //                         totalTrial,
  //                         totalCorrect,
  //                         totalError,
  //                         totalPrompt
  //                     }
  //                 }
  //             }
  //         }
  //     }
  //     `,
  //     fetchPolicy: 'network-only'
  //     })
  //     .then(presult => {
  //       this.setState({
  //         sessionEdges: presult.data.summary,
  //       })
  //     })
  //     .catch(error => {
  //       console.log(error)
  //     })
  // }

  callWeekly = () => {
    const dateLte = moment().format('YYYY-MM-DD')
    const dateGte = moment()
      .subtract(7, 'days')
      .format('YYYY-MM-DD')
    const {
      sessionrecording: { ChildSession },
    } = this.props

    apolloClient
      .query({
        query: gql`query {
        summary :getSessionRecordings(ChildSession:"${ChildSession.id}",date_Gte:"${dateGte}", date_Lte:"${dateLte}"){
          totalTarget
          edges{
            node{
              id,
              sessionRecord{
                totalTrial,
                totalCorrect, 
                totalError,
                totalPrompt,
                totalIncorrect,
              }
            }
          }
        }
      }`,
        fetchPolicy: 'network-only',
      })
      .then(presult => {
        this.setState({
          sessionEdges: presult.data.summary,
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  submitFeedBack = () => {
    const feedBack = this.state
    const {
      sessionrecording: { ChildSession },
    } = this.props

    apolloClient
      .mutate({
        mutation: gql`
          mutation UpdateSessionFeedback($childId: ID!, $feedbackText: String, $rating: Int) {
            updateSessionFeedbacks(
              input: { pk: $childId, feedback: $feedbackText, rating: $rating }
            ) {
              details {
                id
                feedback
                rating
              }
            }
          }
        `,
        variables: {
          childId: ChildSession.id,
          feedbackText: feedBack.feedbackText,
          rating: feedBack.sliderVal,
        },
        fetchPolicy: 'no-cache',
      })
      .then(presult => {
        notification.success({
          message: 'Success',
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  setFeedback = e => {
    this.setState({
      feedbackText: e.target.value,
    })
  }

  setValue = e => {
    this.setState({
      sliderVal: e,
    })
  }

  render() {
    const colDefaultStyle = { padding: 0, minHeight: '700px' }
    const data = this.state
    const {
      sessionrecording: { ChildSession },
    } = this.props

    if (!ChildSession) {
      return <Redirect to="/" />
    }

    return (
      <>
        <Authorize roles={['school_admin', 'parents', 'therapist']} redirect to="/dashboard/beta">
          <Helmet title="Dashboard Alpha" />
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
                <Col sm={16} style={colDefaultStyle}>
                  <div style={{ padding: 5, minHeight: '650px' }}>
                    <div style={{ padding: 5 }}>
                      <Button onClick={() => this.callInitialData()}>
                        {ChildSession.sessions.sessionName.name}
                      </Button>
                      {/* <Button onClick={() => this.callWeekly()}>This Week</Button> */}
                    </div>
                    <div
                      style={{
                        margin: '10px',
                        height: '270px',
                        border: '2px solid #f9f9f9',
                        borderRadius: '10px',
                        padding: 5,
                      }}
                    >
                      <Graph data={data} peakId />
                    </div>
                    <div style={{ marginTop: '10px', padding: 5 }}>{this.renderCards()}</div>
                  </div>
                </Col>
                <Col sm={8} style={colDefaultStyle}>
                  <div style={{ marginLeft: '20px', minHeight: '650px' }}>
                    <div style={{ padding: '5px' }}>
                      <Text
                        style={{
                          fontSize: 18,
                          lineHeight: '33px',
                          color: '#2E2E2E',
                          marginTop: 19,
                          marginRight: 19,
                        }}
                      >
                        Feedback
                      </Text>

                      <TextArea
                        rows={6}
                        style={{
                          fontSize: '12px',
                        }}
                        value={data.feedbackText}
                        onChange={e => {
                          this.setFeedback(e)
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 18,
                          lineHeight: '33px',
                          color: '#2E2E2E',
                          marginTop: 19,
                          marginRight: 19,
                        }}
                      >
                        Rate this session
                      </Text>

                      <Slider
                        tooltipVisible={false}
                        marks={marks}
                        step={1}
                        value={data.sliderVal}
                        onChange={e => {
                          this.setValue(e)
                        }}
                      />
                      <Button
                        type="primary"
                        onClick={() => this.submitFeedBack()}
                        className={styles.btnSub}
                      >
                        Submit feedback
                      </Button>
                    </div>
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
export default SessionSummary

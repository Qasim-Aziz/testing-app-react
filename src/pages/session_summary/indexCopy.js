import React, { Component } from 'react'
import { Button, Progress, Input, Slider, Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import moment from 'moment'
import { gql } from 'apollo-boost'
import apolloClient from '../../apollo/config'

import styles from './style.module.scss'
import upload from '../../icons/upload.png'

const { Dragger } = Upload
const { TextArea } = Input

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

const propsData = {
  name: 'file',
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList)
    }
    // if (info.file.status === 'done') {
    // } else if (info.file.status === 'error') {
    // }
  },
}
const propsDrag = {
  name: 'file',
  multiple: true,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  onChange(info) {
    const { status } = info.file
    if (status !== 'uploading') {
      console.log(info.file, info.fileList)
    }
    // if (status === 'done') {
    //   message.success(`${info.file.name} file uploaded successfully.`);
    // } else if (status === 'error') {
    //   message.error(`${info.file.name} file upload failed.`);
    // }
  },
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
    this.callInitialData()
  }

  callInitialData = () => {
    const {
      sessionrecording: { ChildSession },
    } = this.props
    apolloClient
      .query({
        query: gql`
          query {
            summary: getSessionRecordings(ChildSession: "Q2hpbGRTZXNzaW9uVHlwZTozNzU5") {
              totalTarget
              edges {
                node {
                  id
                  sessionRecord {
                    totalTrial
                    totalCorrect
                    totalError
                    totalPrompt
                  }
                }
              }
            }
          }
        `,
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

  getPerc = (total, correct) => {
    const percentage = (correct / total) * 100
    return Math.round(percentage)
  }

  renderCards = () => {
    const cardArray = []
    const data = this.state
    const item = data.sessionEdges.edges
    const sessionArray = []
    let totalTrial = 0
    const Mand = 0
    const Behaviours = 0
    let No = 0
    let Prompted = 0
    let Correct = 0
    const Incorrect = 0
    if (item !== undefined) {
      for (let i = 0; i < item.length; i += 1) {
        sessionArray.push(item[i].node.sessionRecord)
      }
      sessionArray.forEach(entry => {
        totalTrial += entry.totalTrial
        Prompted += entry.totalPrompt
        Correct += entry.totalCorrect
        No += entry.totalError
      })
      cardArray.push(
        <>
          <div className={styles.card}>
            <div className={styles.cardData}>
              <h1>{totalTrial}</h1>
              <p>Trial Completed</p>
              <p>+{this.getPerc(totalTrial, Correct)}%</p>
            </div>
            <div className={styles.postCardData}>
              <p>For {data.sessionEdges.totalTarget} Targets</p>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardData}>
              <h1>{Mand}</h1>
              <p>Mand</p>
            </div>
            <div className={styles.postCardData}>
              <p>Recorded</p>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardData}>
              <h1>{Behaviours}</h1>
              <p>Behaviours</p>
            </div>
            <div className={styles.postCardData}>
              <p>Recorded</p>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardData}>
              <h1>{No}</h1>
              <p>No</p>
            </div>
            <div className={styles.postCardData}>
              <p>Recorded</p>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardData}>
              <h1>{Prompted}</h1>
              <p>Prompted</p>
            </div>
            <div className={styles.postCardData}>
              <p>Recorded</p>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardData}>
              <h1>{Correct}</h1>
              <p>Correct</p>
            </div>
            <div className={styles.postCardData}>
              <p>Recorded</p>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardData}>
              <h1>{No + Prompted}</h1>
              <p>Incorrect</p>
            </div>
            <div className={styles.postCardData}>
              <p>Recorded</p>
            </div>
          </div>
        </>,
      )
    }
    return cardArray
  }

  callToday = () => {
    const today = new Date()
    const date = moment(today).format('YYYY-MM-DD')
    const {
      sessionrecording: { ChildSession },
    } = this.props

    apolloClient
      .query({
        query: gql`
        query {
          summary:getSessionRecordings(ChildSession:"Q2hpbGRTZXNzaW9uVHlwZTozNzU5",date:"${date}"){
              totalTarget
              edges{
                  node{
                      id,
                      sessionRecord{
                          totalTrial,
                          totalCorrect,
                          totalError,
                          totalPrompt
                      }
                  }
              }
          }
      }
      `,
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

  callWeekly = () => {
    const today = new Date()
    const dateLte = moment(today).format('YYYY-MM-DD')

    const last = new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000)
    const day = last.getDate()
    const month = last.getMonth()
    const year = last.getFullYear()

    const gtDate = new Date(year, month, day)
    const dateGte = moment(new Date(gtDate)).format('YYYY-MM-DD')

    const {
      sessionrecording: { ChildSession },
    } = this.props

    apolloClient
      .query({
        query: gql`
      query {
        summary:getSessionRecordings(ChildSession:"Q2hpbGRTZXNzaW9uVHlwZTozNzU5",date_Gte:"${dateGte}", date_Lte:"${dateLte}"){
            totalTarget
            edges{
                node{
                    id,
                    sessionRecord{
                        totalTrial,
                        totalCorrect, 
                        totalError,
                        totalPrompt
                    }
                }
            }
        }
      }
    `,
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

    apolloClient
      .mutate({
        mutation: gql`mutation {
        updateSessionFeedbacks(input:{
            pk:"Q2hpbGRTZXNzaW9uVHlwZTozNzU5",
            feedback:"${feedBack.feedbackText}",
            rating:${feedBack.sliderVal}
        })
           { 
               details{
                   id,
                   feedback,
                   rating
               }
           }
    }
    `,
      })
      .then(presult => {
        this.setState({
          feedbackText: '',
          sliderVal: 0,
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
    return (
      <>
        <div className={styles.wrapper}>
          <div className={styles.navbarSession}>
            <ul className={styles.sessions}>
              <li>
                <p
                  role="presentation"
                  onClick={() => {
                    this.callInitialData()
                  }}
                >
                  Morning session
                </p>
              </li>
              <li>
                <p
                  role="presentation"
                  onClick={() => {
                    this.callToday()
                  }}
                >
                  Today
                </p>
              </li>
              <li>
                <p
                  role="presentation"
                  onClick={() => {
                    this.callWeekly()
                  }}
                >
                  This week
                </p>
              </li>
            </ul>
          </div>
          <div className={styles.upload}>
            <div className={styles.videoHeading}>Upload Video for Evaluation</div>
          </div>
        </div>

        <div className={styles.graphcol}>
          <div className={styles.graphrow} />
          <div className={styles.videobox}>
            <div className={styles.uploadImg}>
              <Dragger {...propsDrag}>
                <p>
                  <img src={upload} alt="not-found" />
                </p>
              </Dragger>
              <Upload {...propsData}>
                <Button className={styles.btncls}>
                  <UploadOutlined />
                  Browse File
                </Button>
              </Upload>
              {/* <p>10MB of 100MB</p> */}
            </div>
            {/* <Progress percent={10} /> */}
          </div>
        </div>

        <div className={styles.lists}>
          <div className={styles.cards}>{this.renderCards()}</div>
          <div className={styles.feedModal}>
            <div className={styles.feedHeading}>
              <p>Session Feedback</p>
            </div>
          </div>
        </div>
        <div className={styles.feedback}>
          <p>Feedback</p>
          <div className={styles.txtbx}>
            <TextArea
              rows={10}
              style={{
                height: '100%',
                fontSize: '20px',
              }}
              onChange={e => {
                this.setFeedback(e)
              }}
            />
          </div>
          <div className={styles.sessionq}>
            <p>Did you like this session?</p>
          </div>
          <div className={styles.rating}>
            <Slider
              tooltipVisible={false}
              marks={marks}
              step={1}
              defaultValue={0}
              onChange={e => {
                this.setValue(e)
              }}
            />
          </div>
          <Button
            type="primary"
            className={styles.btnSub}
            onClick={() => {
              this.submitFeedBack()
            }}
          >
            Submit feedback
          </Button>
        </div>
      </>
    )
  }
}
export default SessionSummary

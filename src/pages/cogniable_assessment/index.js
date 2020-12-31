import React, { Component } from 'react'
import { Card } from 'antd'
import { CaretLeftFilled, CaretRightFilled } from '@ant-design/icons'
import { gql } from 'apollo-boost'
import apolloClient from '../../apollo/config'
import styles from './style.module.scss'
import assessment from '../../images/assessment.jpg'
import ResultAssessment from './ResultAssessment'

class CogniableAssessment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      assessmentQuestions: [],
      qIndex: 0,
      showResult: false,
    }
  }

  componentDidMount() {
    apolloClient
      .query({
        query: gql`
          query {
            cogniableAssessQuestions {
              id
              question
              options {
                edges {
                  node {
                    id
                    name
                    description
                  }
                }
              }
            }
          }
        `,
      })
      .then(presult => {
        this.setState({
          assessmentQuestions: presult.data.cogniableAssessQuestions,
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  recordAnswer = (qid, aid) => {
    const stateData = this.state
    apolloClient
      .mutate({
        mutation: gql`
          mutation {
            recordCogniableAssess(
              input: {
                pk: "Q29nbmlhYmxlQXNzZXNzbWVudFR5cGU6MQ=="
                questions: [
                  {
                    question: "${qid}"
                    answer: "${aid}"
                  }
                ]
              }
            ) {
              details {
                id
                date
                score
                assessmentQuestions {
                  edges {
                    node {
                      id
                      question {
                        id
                        question
                      }
                      answer {
                        id
                        name
                        description
                      }
                    }
                  }
                }
              }
            }
          }
        `,
      })
      .then(qresult => {
        if (stateData.qIndex + 1 === stateData.assessmentQuestions.length) {
          this.setState(prevState => ({
            qIndex: prevState.qIndex + 1,
            showResult: !prevState.showResult,
          }))
        } else {
          this.setState(prevState => ({
            qIndex: prevState.qIndex + 1,
          }))
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  renderOptions = qData => {
    const optionArray = []
    const opData = qData.options.edges
    if (opData.length > 0) {
      for (let i = 0; i < opData.length; i += 1) {
        optionArray.push(
          <div
            className={styles.questionItem}
            role="presentation"
            onClick={() => {
              this.recordAnswer(qData.id, opData[i].node.id)
            }}
          >
            <div className={styles.questionIndex}>
              <p>{i + 1}</p>
            </div>
            <div className={styles.questionContent}>
              <p className={styles.qName}>{opData[i].node.name}</p>
              <p className={styles.qDesc}>{opData[i].node.description}</p>
            </div>
          </div>,
        )
      }
    }
    return optionArray
  }

  renderAssessmentQuestions = () => {
    const stateData = this.state
    if (stateData.assessmentQuestions.length > 0) {
      const qData = stateData.assessmentQuestions[stateData.qIndex]
      return (
        <>
          <div className={styles.header}>
            <p>{qData.question}</p>
          </div>
          <div className={styles.questionGrid}>{this.renderOptions(qData)}</div>
        </>
      )
    }
    return null
  }

  renderUpcomingQuestions = () => {
    const stateData = this.state
    const upQueArray = []
    for (let i = stateData.qIndex + 1; i < stateData.assessmentQuestions.length; i += 1) {
      upQueArray.push(
        <div style={{ marginTop: '5%' }}>
          <Card style={{ borderRadius: '10px' }}>
            <div className={styles.upcomingShell}>
              <div className={styles.upcomingShellImage}>
                <img src={assessment} alt="not_found" />
              </div>
              <div className={styles.upcomingContent}>
                <p className={styles.upcomingHeader}>{stateData.assessmentQuestions[i].question}</p>
                <p className={styles.upcomingHeaderDesc}>Critical Reascring</p>
              </div>
            </div>
          </Card>
        </div>,
      )
    }
    return upQueArray
  }

  setIndex = identifier => {
    const stateData = this.state

    if (identifier === 'ADD') {
      if (stateData.qIndex < stateData.assessmentQuestions.length - 1) {
        this.setState(prevState => ({
          qIndex: prevState.qIndex + 1,
        }))
      }
    }
    if (identifier === 'SUB') {
      if (stateData.qIndex > 0) {
        this.setState(prevState => ({
          qIndex: prevState.qIndex - 1,
        }))
      }
    }
  }

  render() {
    const stateData = this.state
    if (!stateData.showResult) {
      return (
        <>
          <div className={styles.AssessmentWrapper}>
            <div className={styles.assessment}>
              <div className={styles.assessmentImage}>
                <img src={assessment} alt="not_found" />
              </div>
              <div className={styles.assessmentQuestions}>{this.renderAssessmentQuestions()}</div>
              <div className={styles.cogniAssessAction}>
                <div className={styles.leftArr}>
                  <CaretLeftFilled
                    className={styles.pinch}
                    style={{
                      fontSize: '50px',
                      color: 'darkblue',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      this.setIndex('SUB')
                    }}
                  />
                </div>
                <div className={styles.rightArr}>
                  <CaretRightFilled
                    className={styles.pinch}
                    style={{
                      fontSize: '50px',
                      color: 'darkblue',
                      cursor: 'pointer',
                      marginLeft: '10%',
                    }}
                    onClick={() => {
                      this.setIndex('ADD')
                    }}
                  />
                </div>
              </div>
            </div>
            <div className={styles.upcommingQuestions}>
              <p>Upcoming Questions</p>
              <div className={styles.upcomingWrapper}>
                <div className={styles.upcomingSubShell}>{this.renderUpcomingQuestions()}</div>
              </div>
            </div>
          </div>
        </>
      )
    }
    return <ResultAssessment />
  }
}
export default CogniableAssessment

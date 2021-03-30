/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-useless-concat */
/* eslint-disable react/jsx-boolean-value */
import React, { Component } from 'react'
import { Icon, Layout, Row, Col, Typography, Popover, Spin } from 'antd'
import { gql } from 'apollo-boost'
import Scrollbars from 'react-custom-scrollbars'
import { COLORS } from 'assets/styles/globalStyles'
import LoadingComponent from 'components/LoadingComponent'
import client from '../../apollo/config'
import PageHeader from './PageHeader'
import LastAssignmentsResult from './LastAssignmentsResult'
import { GET_VBMAPP_QUESTIONS } from './query'
import { leftDivStyle, rightDivStyle } from './customStyle'

const { Content } = Layout
const { Title, Text } = Typography

class MilestonesGroups extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentIndex: 0,
      completed: 0,
      questions: [],
      currentQuestion: {},
      scoreboard: [],
      totalScore: 0.0,
      dbQuestionNumber: 1,
      loadingQuestion: true,
      groups: [],
      selected: '',
      selectedName: '',
      previous: 0,
      next: 0,
    }
  }

  componentDidMount() {
    let selected = ''
    const areaID = localStorage.getItem('vbMappAreaId')
    client
      .query({
        query: gql`
        query{
          vbmappGroups(area:"${areaID}"){
              edges{
                  node{
                      id,
                      apiGroup,
                      groupName,
                      noQuestion,
                  }
              }
          }
        }
        `,
      })
      .then(result => {
        console.log(result.data.vbmappGroups.edges)
        selected = result.data.vbmappGroups.edges[0].node.id
        this.setState({
          groups: result.data.vbmappGroups.edges,
          selected: result.data.vbmappGroups.edges[0].node.id,
          selectedName: result.data.vbmappGroups.edges[0].node.groupName,
        })
        this.getQuestion(selected)
      })
  }

  getGroups = () => {
    let bg = '#FFF'
    let textColor = '#000'
    const { groups, selected } = this.state
    const gr = []
    for (let x = 0; x < groups.length; x += 1) {
      if (selected === groups[x].node.id) {
        bg = COLORS.palleteLightBlue
        textColor = '#000'
      } else {
        bg = '#FFF'
        textColor = '#000'
      }
      gr.push(
        <div
          role="button"
          onKeyDown={this.handleKeyDown}
          tabIndex="0"
          onClick={() => this.handleGroupChange(groups[x].node.id, groups[x].node.groupName)}
          style={{
            backgroundColor: bg,
            color: textColor,
            cursor: 'pointer',
            boxShadow:
              '0px 0px 1px rgba(0, 0, 0, 0.08), 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 4px 8px rgba(0, 0, 0, 0.08)',
            padding: '5px 20px',
            borderRadius: 0,
            flex: 1,
            margin: '5px 0px',
          }}
        >
          <p
            style={{
              fontSize: 18,
              fontWeight: '700',
              marginBottom: 0,
              textTransform: 'capitalize',
            }}
          >
            {groups[x].node.groupName}
          </p>
          <p style={{ marginBottom: 0 }}>Questions: {groups[x].node.noQuestion}</p>
        </div>,
      )
    }
    return gr
  }

  getPrevious = quesNum => {
    this.setState({
      loadingQuestion: true,
    })
    const student = JSON.parse(localStorage.getItem('studentId'))
    const areaID = localStorage.getItem('vbMappAreaId')
    const masterID = localStorage.getItem('vbMappMasterId')
    const { selected } = this.state

    client
      .mutate({
        mutation: GET_VBMAPP_QUESTIONS,
        variables: {
          student,
          areaID,
          masterID,
          group: selected,
        },
      })
      .then(result => {
        const questionss = JSON.parse(result.data.vbmappGetQuestions.questions)
        console.log(JSON.stringify(questionss))
        let x = 0
        let complete = 0
        // Looping through all questions
        for (x = 0; x < questionss.length; x += 1) {
          if (questionss[x].questionNum === quesNum - 1) {
            this.setState({
              currentQuestion: questionss[x],
              currentIndex: x,
              dbQuestionNumber: questionss[x].questionNum,
              loadingQuestion: false,
            })
            break
          }
        }
        this.setState({
          questions: questionss,
        })

        if (x === 0) {
          this.setState({
            previous: 0,
            next: 1,
          })
        }

        if (x > 0 && x < questionss.length) {
          this.setState({
            previous: 1,
            next: 1,
          })
        }

        if (x === questionss.length) {
          // console.log("Done");
          complete = 1
          this.setState({
            loadingQuestion: false,
            previous: 1,
            next: 0,
          })
        }
        this.getScoreboard(complete, questionss, quesNum - 1)
      })
      .catch(err => console.log(JSON.stringify(err)))
  }

  getNext = quesNum => {
    this.setState({
      loadingQuestion: true,
    })
    const student = JSON.parse(localStorage.getItem('studentId'))
    const areaID = localStorage.getItem('vbMappAreaId')
    const masterID = localStorage.getItem('vbMappMasterId')
    const { selected } = this.state
    client
      .mutate({
        mutation: GET_VBMAPP_QUESTIONS,
        variables: {
          student,
          areaID,
          masterID,
          group: selected,
        },
      })
      .then(result => {
        const questionss = JSON.parse(result.data.vbmappGetQuestions.questions)
        console.log(JSON.stringify(questionss))
        let x = 0
        let complete = 0
        // Looping through all questions
        for (x = 0; x < questionss.length; x += 1) {
          if (questionss[x].questionNum === quesNum + 1) {
            this.setState({
              currentQuestion: questionss[x],
              currentIndex: x,
              dbQuestionNumber: questionss[x].questionNum,
              loadingQuestion: false,
            })
            break
          }
        }
        this.setState({
          questions: questionss,
        })

        if (x === 0) {
          this.setState({
            previous: 0,
            next: 1,
          })
        }

        if (x > 0 && x < questionss.length) {
          this.setState({
            previous: 1,
            next: 1,
          })
        }

        if (x === questionss.length) {
          // console.log("Done");
          complete = 1
          this.setState({
            loadingQuestion: false,
            previous: 1,
            next: 0,
          })
        }
        this.getScoreboard(complete, questionss, quesNum + 1)
      })
      .catch(err => console.log(JSON.stringify(err)))
  }

  getQuestionByNumber = quesNum => {
    this.setState({
      loadingQuestion: true,
    })
    const student = JSON.parse(localStorage.getItem('studentId'))
    const areaID = localStorage.getItem('vbMappAreaId')
    const masterID = localStorage.getItem('vbMappMasterId')
    const { selected } = this.state
    client
      .mutate({
        mutation: GET_VBMAPP_QUESTIONS,
        variables: {
          student,
          areaID,
          masterID,
          group: selected,
        },
      })
      .then(result => {
        const questionss = JSON.parse(result.data.vbmappGetQuestions.questions)
        console.log(JSON.stringify(questionss))
        let x = 0
        let complete = 0
        // Looping through all questions
        for (x = 0; x < questionss.length; x += 1) {
          if (questionss[x].questionNum === quesNum) {
            this.setState({
              currentQuestion: questionss[x],
              currentIndex: x,
              dbQuestionNumber: questionss[x].questionNum,
              loadingQuestion: false,
            })
            break
          }
        }
        this.setState({
          questions: questionss,
        })

        if (x === 0) {
          this.setState({
            previous: 0,
            next: 1,
          })
        }

        if (x > 0 && x < questionss.length) {
          this.setState({
            previous: 1,
            next: 1,
          })
        }

        if (x === questionss.length) {
          // console.log("Done");
          complete = 1
          this.setState({
            loadingQuestion: false,
            previous: 1,
            next: 0,
          })
        }
        this.getScoreboard(complete, questionss, quesNum)
      })
      .catch(err => console.log(JSON.stringify(err)))
  }

  getQuestion = selected => {
    const student = JSON.parse(localStorage.getItem('studentId'))
    const areaID = localStorage.getItem('vbMappAreaId')
    const masterID = localStorage.getItem('vbMappMasterId')
    const test = parseInt(localStorage.getItem('vbMappsTestId'), 10)
    let quesNum = 0
    client
      .mutate({
        mutation: GET_VBMAPP_QUESTIONS,
        variables: {
          student,
          areaID,
          masterID,
          group: selected,
        },
      })
      .then(result => {
        const questionss = JSON.parse(result.data.vbmappGetQuestions.questions)
        console.log(questionss)
        let x = 0
        let complete = 0
        // Looping through all questions
        for (x = 0; x < questionss.length; x += 1) {
          // Getting previous assessments for this question
          const pa = questionss[x].previous_assess
          let alreadyAssessed = false
          // Looping through all the previous assessments for a question
          for (let y = 0; y < pa.length; y += 1) {
            // If there exists an assessment for this question and this test
            if (pa[y].test === test) {
              // If a score was given earlier
              if (pa[y].score !== '') {
                // Set flag to true
                alreadyAssessed = true
                break
              }
            }
          }
          if (!alreadyAssessed) {
            quesNum = questionss[x].questionNum
            this.setState({
              currentQuestion: questionss[x],
              currentIndex: x,
              dbQuestionNumber: questionss[x].questionNum,
              loadingQuestion: false,
            })
            break
          }
          this.setState({
            questions: questionss,
          })
        }
        if (x === 0) {
          this.setState({
            previous: 0,
            next: 1,
          })
        }

        if (x > 0 && x < questionss.length) {
          this.setState({
            previous: 1,
            next: 1,
          })
        }

        if (x === questionss.length) {
          // console.log("Done");
          complete = 1
          this.setState({
            loadingQuestion: false,
            previous: 1,
            next: 0,
          })
        }
        this.getScoreboard(complete, questionss, quesNum)
      })
      .catch(err => console.log(JSON.stringify(err)))
  }

  getScoreboard = (complete, questions, quesNum) => {
    const test = parseInt(localStorage.getItem('vbMappsTestId'), 10)
    let currentLevel = 0
    const levels = []
    let totalScores = 0
    for (let i = 0; i < questions.length; i += 1) {
      if (questions[i].level !== currentLevel) {
        currentLevel = questions[i].level
        levels.push(questions[i].level)
      }
    }
    const scoreboards = []
    for (let x = 0; x < levels.length; x += 1) {
      const answers = []
      for (let y = 0; y < questions.length; y += 1) {
        // console.log('questions ===> ',questions)
        if (questions[y].level === levels[x]) {
          const pa = questions[y].previous_assess
          for (let z = 0; z < pa.length; z += 1) {
            if (pa[z].test === test) {
              switch (pa[z].score) {
                case '':
                  if (quesNum === questions[y].questionNum) {
                    answers.push(
                      <Popover
                        content={<div style={{ maxWidth: '350px' }}>{questions[y]?.objective}</div>}
                        title={`Question: ` + `${questions[y].questionNum}`}
                      >
                        <div
                          style={{
                            marginVertical: 10,
                            display: 'flex',
                            backgroundColor: '#FFFFFF',
                            border: '2px solid #000',
                            width: 40,
                            height: 40,
                            padding: 5,
                            borderRadius: 10,
                            marginRight: 5,
                            marginTop: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          role="button"
                          onKeyDown={this.handleKeyDown}
                          tabIndex="0"
                          onClick={() => this.getQuestionByNumber(questions[y].questionNum)}
                        >
                          <p style={{ marginBottom: 0, color: '#FFF' }}>&nbsp;</p>
                        </div>
                      </Popover>,
                    )
                  } else {
                    answers.push(
                      <Popover
                        content={<div style={{ maxWidth: '350px' }}>{questions[y]?.objective}</div>}
                        title={`Question: ` + `${questions[y].questionNum}`}
                      >
                        <div
                          style={{
                            marginVertical: 10,
                            display: 'flex',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #DDD',
                            width: 40,
                            height: 40,
                            padding: 5,
                            borderRadius: 10,
                            marginRight: 5,
                            marginTop: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          role="button"
                          onKeyDown={this.handleKeyDown}
                          tabIndex="0"
                          onClick={() => this.getQuestionByNumber(questions[y].questionNum)}
                        >
                          <p style={{ marginBottom: 0, color: '#FFF' }}>&nbsp;</p>
                        </div>
                      </Popover>,
                    )
                  }

                  break

                case '0.0':
                  if (quesNum === questions[y].questionNum) {
                    answers.push(
                      <Popover
                        content={<div style={{ maxWidth: '350px' }}>{questions[y]?.objective}</div>}
                        title={`Question: ` + `${questions[y].questionNum}`}
                      >
                        <div
                          style={{
                            marginVertical: 10,
                            display: 'flex',
                            backgroundColor: '#FF8080',
                            border: '2px solid #000',
                            width: 40,
                            height: 40,
                            padding: 5,
                            borderRadius: 10,
                            marginRight: 5,
                            marginTop: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          role="button"
                          onKeyDown={this.handleKeyDown}
                          tabIndex="0"
                          onClick={() => this.getQuestionByNumber(questions[y].questionNum)}
                        >
                          <p style={{ marginBottom: 0, color: '#FFF' }}>0</p>
                        </div>
                      </Popover>,
                    )
                  } else {
                    answers.push(
                      <Popover
                        content={<div style={{ maxWidth: '350px' }}>{questions[y]?.objective}</div>}
                        title={`Question: ` + `${questions[y].questionNum}`}
                      >
                        <div
                          key={`Question: ` + `${questions[y].questionNum}`}
                          style={{
                            marginVertical: 10,
                            display: 'flex',
                            backgroundColor: '#FF8080',
                            border: '1px solid #FF8080',
                            width: 40,
                            height: 40,
                            padding: 5,
                            borderRadius: 10,
                            marginRight: 5,
                            marginTop: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          role="button"
                          onKeyDown={this.handleKeyDown}
                          tabIndex="0"
                          onClick={() => this.getQuestionByNumber(questions[y].questionNum)}
                        >
                          <p style={{ marginBottom: 0, color: '#FFF' }}>0</p>
                        </div>
                      </Popover>,
                    )
                  }
                  break

                case '0.5':
                  totalScores += 0.5
                  if (quesNum === questions[y].questionNum) {
                    answers.push(
                      <Popover
                        content={<div style={{ maxWidth: '350px' }}>{questions[y]?.objective}</div>}
                        title={`Question: ` + `${questions[y].questionNum}`}
                      >
                        <div
                          style={{
                            marginVertical: 10,
                            display: 'flex',
                            backgroundColor: '#FF9C52',
                            border: '2px solid #000',
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            marginRight: 5,
                            marginTop: 10,
                            padding: 5,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          role="button"
                          onKeyDown={this.handleKeyDown}
                          tabIndex="0"
                          onClick={() => this.getQuestionByNumber(questions[y].questionNum)}
                        >
                          <p style={{ marginBottom: 0, color: '#FFF' }}>0.5</p>
                        </div>
                      </Popover>,
                    )
                  } else {
                    answers.push(
                      <Popover
                        content={<div style={{ maxWidth: '350px' }}>{questions[y]?.objective}</div>}
                        title={`Question: ` + `${questions[y].questionNum}`}
                      >
                        <div
                          style={{
                            marginVertical: 10,
                            display: 'flex',
                            backgroundColor: '#FF9C52',
                            border: '1px solid #FF9C52',
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            marginRight: 5,
                            marginTop: 10,
                            padding: 5,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          role="button"
                          onKeyDown={this.handleKeyDown}
                          tabIndex="0"
                          onClick={() => this.getQuestionByNumber(questions[y].questionNum)}
                        >
                          <p style={{ marginBottom: 0, color: '#FFF' }}>0.5</p>
                        </div>
                      </Popover>,
                    )
                  }
                  break

                case '1.0':
                  totalScores += 1.0
                  if (quesNum === questions[y].questionNum) {
                    answers.push(
                      <Popover
                        content={<div style={{ maxWidth: '350px' }}>{questions[y]?.objective}</div>}
                        title={`Question: ` + `${questions[y].questionNum}`}
                      >
                        <div
                          style={{
                            marginVertical: 10,
                            display: 'flex',
                            backgroundColor: '#4BAEA0',
                            border: '2px solid #000',
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            marginRight: 5,
                            marginTop: 10,
                            padding: 5,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          role="button"
                          onKeyDown={this.handleKeyDown}
                          tabIndex="0"
                          onClick={() => this.getQuestionByNumber(questions[y].questionNum)}
                        >
                          <p style={{ marginBottom: 0, color: '#FFF' }}>1</p>
                        </div>
                      </Popover>,
                    )
                  } else {
                    answers.push(
                      <Popover
                        content={<div style={{ maxWidth: '350px' }}>{questions[y]?.objective}</div>}
                        title={`Question: ` + `${questions[y].questionNum}`}
                      >
                        <div
                          style={{
                            marginVertical: 10,
                            display: 'flex',
                            backgroundColor: '#4BAEA0',
                            border: '1px solid #4BAEA0',
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            marginRight: 5,
                            marginTop: 10,
                            padding: 5,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          role="button"
                          onKeyDown={this.handleKeyDown}
                          tabIndex="0"
                          onClick={() => this.getQuestionByNumber(questions[y].questionNum)}
                        >
                          <p style={{ marginBottom: 0, color: '#FFF' }}>1</p>
                        </div>
                      </Popover>,
                    )
                  }
                  break

                default:
                  break
              }
            }
          }
        }
      }

      scoreboards.push(
        <div style={{ display: 'flex', flexDirection: 'row', height: 50, marginTop: 5 }}>
          <div
            style={{
              border: '1px solid #DDD',
              borderRadius: 4,
              padding: 10,
              marginTop: 10,
              // marginBottom: 10,
              marginRight: 20,
            }}
          >
            <p style={{ marginBottom: 0 }}>L - {levels[x]}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>{answers}</div>
        </div>,
      )
    }
    this.setState({
      scoreboard: scoreboards,
      totalScore: totalScores,
    })
    if (complete === 1) {
      this.setState({
        completed: 1,
      })
    }
  }

  handleGroupChange = (groupID, groupName) => {
    this.setState({
      loadingQuestion: true,
      completed: 0,
      selected: groupID,
      selectedName: groupName,
      scoreboard: [],
      currentIndex: 0,
      questions: [],
      currentQuestion: {},
      totalScore: 0.0,
      dbQuestionNumber: 1,
    })
    this.getQuestion(groupID)
  }

  handleKeyDown = () => {}

  handleAnswer(score) {
    const { selected } = this.state
    this.setState({
      loadingQuestion: true,
    })
    const { dbQuestionNumber } = this.state
    const areaID = localStorage.getItem('vbMappAreaId')
    const masterID = localStorage.getItem('vbMappMasterId')

    client
      .mutate({
        mutation: gql`
      mutation{
        vbmappSubmitResponse(input:{
            master:"${masterID}",
            area:"${areaID}",
            group:"${selected}",
            question:${dbQuestionNumber},
            score:${score}
            
        }){
            total
            details{
                id
                questionNum
                score
                date
                groups{
                    id
                    groupName
                }
            }
        }
    }`,
      })
      .then(() => {
        this.getQuestion(selected)
      })
      .catch(err => console.log(JSON.stringify(err)))
  }

  render() {
    const {
      groups,
      selectedName,
      questions,
      currentQuestion,
      completed,
      scoreboard,
      loadingQuestion,
      totalScore,
      previous,
      next,
    } = this.state
    let number = 0
    const d = groups?.forEach(e => {
      if (selectedName === e.node.groupName) {
        number = e.node.noQuestion
      }
    })
    return (
      <Layout style={{ padding: '0px', marginTop: '20px' }}>
        <Content
          style={{
            padding: '0px 20px',
            width: 1360,
            margin: '0px auto',
          }}
        >
          <Row>
            <Col sm={6}>
              <div style={leftDivStyle}>
                <Scrollbars autoHide style={{ height: 'calc(100vh - 120px)' }}>
                  {groups && groups.length > 0 && this.getGroups()}
                  <div style={{ height: 20 }}></div>
                </Scrollbars>
              </div>
            </Col>

            <Col sm={18}>
              <div style={rightDivStyle}>
                <PageHeader
                  pageTitle="VB-MAPP Milestone Assessment"
                  questions={questions}
                  lastAssessment={true}
                />
                {/* {questions && <LastAssignmentsResult questions={questions} />} */}
                {completed === 1 && (
                  <div
                    style={{
                      boxShadow:
                        '0px 0px 1px rgba(0, 0, 0, 0.08), 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.08)',
                      paddingTop: 10,
                      paddingBottom: 10,
                      paddingLeft: 20,
                      paddingRight: 20,
                      borderRadius: 2,
                      flex: 1,
                      marginTop: 10,
                      backgroundColor: '#21af16',
                      color: 'white',
                      textAlign: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 14, marginBottom: 0, color: 'white' }}>
                      Assessment completed, now you can edit assessment by selecting question from
                      the scoreboard
                    </Text>
                  </div>
                )}
                {loadingQuestion && (
                  <div style={{ width: '100%', margin: '20px auto', textAlign: 'center' }}>
                    <Spin size="small" />
                  </div>
                )}
                {loadingQuestion === false &&
                  currentQuestion &&
                  Object.keys(currentQuestion).length > 0 && (
                    <div
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid #E4E9F0',
                        boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
                        borderRadius: 2,
                        padding: '16px 12px',
                        alignItems: 'center',
                        display: 'block',
                        width: '100%',
                        marginBottom: '20px',
                        lineHeight: '27px',
                        marginTop: '10px',
                        minHeight: '140px',
                      }}
                    >
                      <div style={{}}>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span style={{ textTransform: 'uppercase' }}>
                            {selectedName} . Level {currentQuestion.level}
                          </span>
                          <span style={{ float: 'right' }}>
                            {previous === 1 && (
                              <span
                                style={{ cursor: 'pointer', marginLeft: 10, marginRight: 10 }}
                                role="button"
                                onKeyDown={this.handleKeyDown}
                                tabIndex="0"
                                onClick={() => this.getPrevious(currentQuestion.questionNum)}
                              >
                                <Icon type="left" />
                              </span>
                            )}

                            {questions && questions.length > 0 && (
                              <span>
                                Question {currentQuestion.questionNum} / {number}
                              </span>
                            )}

                            {next === 1 && (
                              <span
                                style={{ cursor: 'pointer', marginLeft: 10, marginRight: 10 }}
                                role="button"
                                onKeyDown={this.handleKeyDown}
                                tabIndex="0"
                                onClick={() => this.getNext(currentQuestion.questionNum)}
                              >
                                <Icon type="right" />
                              </span>
                            )}
                          </span>
                        </div>

                        <Text
                          style={{
                            marginTop: 0,
                            fontSize: 15,
                            fontWeight: 700,
                            lineHeight: '20px',
                          }}
                        >
                          Question: {currentQuestion.objective}
                        </Text>
                        <div
                          style={{
                            marginTop: 20,
                            marginBottom: 20,
                            display: 'flex',
                            flexDirection: 'row',
                          }}
                        >
                          {currentQuestion.responses.map(option => (
                            <div
                              style={{
                                cursor: 'pointer',
                                display: 'flex',
                                height: 50,
                                width: 70,
                                marginLeft: 10,
                                marginRight: 10,
                                border: '1px solid #555',
                                borderRadius: 4,
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontSize: 20,
                              }}
                              role="button"
                              onKeyDown={this.handleKeyDown}
                              tabIndex="0"
                              onClick={() => this.handleAnswer(option.score)}
                            >
                              <p style={{ marginBottom: 0 }}>{option.score}</p>
                            </div>
                          ))}
                        </div>
                        <div
                          style={{
                            marginLeft: 10,
                          }}
                        >
                          <Popover
                            content={
                              <div style={{ maxWidth: '350px' }}>
                                {currentQuestion.responses.map(option => (
                                  <p style={{}}>{option.text}</p>
                                ))}
                              </div>
                            }
                            title="Scoring Criteria"
                          >
                            Scoring Criteria <Icon style={{ fontSize: 16 }} type="info-circle" />
                          </Popover>
                        </div>
                      </div>
                    </div>
                  )}
                <div
                  style={{
                    cursor: 'pointer',
                    boxShadow:
                      '0px 0px 1px rgba(0, 0, 0, 0.08), 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.08)',
                    padding: '10px 20px',
                    borderRadius: 2,
                    flex: 1,
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                    }}
                  >
                    <Text style={{ fontSize: 18, fontWeight: 600, lineHeight: '20px' }}>
                      Scoreboard
                    </Text>
                    &nbsp;
                    <Text style={{ fontSize: 18, fontWeight: 600, lineHeight: '20px' }}>
                      {loadingQuestion === false && totalScore}
                    </Text>
                  </div>

                  <div style={{}}>
                    {loadingQuestion && (
                      <div style={{ width: '100%', margin: '20px auto', textAlign: 'center' }}>
                        <Spin size="medium" />
                      </div>
                    )}
                    {loadingQuestion === false && scoreboard.length > 0 && scoreboard}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Content>
      </Layout>
    )
  }
}

export default MilestonesGroups

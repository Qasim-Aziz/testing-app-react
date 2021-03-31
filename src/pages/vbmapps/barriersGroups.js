/* eslint-disable react/self-closing-comp */
/* eslint-disable import/named */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-useless-concat */
/* eslint-disable react/jsx-boolean-value */
import React, { Component } from 'react'
import Authorize from 'components/LayoutComponents/Authorize'
import { gql } from 'apollo-boost'
import { Icon, Layout, Row, Col, Typography, Popover } from 'antd'
import Scrollbars from 'react-custom-scrollbars'
import ReactHtmlParser from 'react-html-parser'
import client from '../../apollo/config'
import PageHeader from './PageHeader'
import LastAssignmentsResult from './LastAssignmentsResult'
import { GET_VBMAPP_QUESTIONS } from './query'
import { leftDivStyle, rightDivStyle, assessmentCompletedBlockStyle, defaultDivStyle, leftListBoxStyle } from './customStyle'

const { Content } = Layout
const { Title, Text } = Typography

class BarriersGroups extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentIndex: 0,
      completed: 0,
      questions: [],
      currentQuestion: {},
      scoreboard: [],
      totalScore: 0.0,
      levels: [],
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
        bg = '#3E7BFA'
        textColor = '#FFF'
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
            ...leftListBoxStyle,
            backgroundColor: bg,
            color: textColor,
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
          <p>Questions: {groups[x].node.noQuestion}</p>
        </div>,
      )
    }
    return gr
  }

  getPrevious = quesNum => {
    this.setState({
      loadingQuestion: true,
    })
    const student = localStorage.getItem('studentId')
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
    const student = localStorage.getItem('studentId')
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
    const student = localStorage.getItem('studentId')
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
    const student = localStorage.getItem('studentId')
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
        console.log(JSON.stringify(questionss))
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
    let totalScores = 0
    const scoreboards = []
    const sbrows = []
    let answers = []
    const breakpoint1 = questions.length / 3
    const breakpoint2 = (questions.length / 3) * 2
    for (let y = 0; y < questions.length; y += 1) {
      const pa = questions[y].previous_assess
      for (let z = 0; z < pa.length; z += 1) {
        if (pa[z].test === test) {
          switch (pa[z].score) {
            case '':
              if (quesNum === questions[y].questionNum) {
                answers.push(
                  <Popover content={<div style={{ maxWidth: '350px' }}>{questions[y]?.objective}</div>} title={`Question: `+`${questions[y].questionNum}`}>
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
                  <Popover content={<div style={{ maxWidth: '350px' }}>{questions[y]?.objective}</div>} title={`Question: `+`${questions[y].questionNum}`}>
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
                  <Popover content={<div style={{ maxWidth: '350px' }}>{questions[y]?.objective}</div>} title={`Question: `+`${questions[y].questionNum}`}>
                  <div
                    style={{
                      marginVertical: 10,
                      display: 'flex',
                      backgroundColor: '#4BAEA0',
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
                  <Popover content={<div style={{ maxWidth: '350px' }}>{questions[y]?.objective}</div>} title={`Question: `+`${questions[y].questionNum}`}>
                  <div
                    style={{
                      marginVertical: 10,
                      display: 'flex',
                      backgroundColor: '#4BAEA0',
                      border: '1px solid #4BAEA0',
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

            case '1.0':
              totalScores += 1.0
              if (quesNum === questions[y].questionNum) {
                answers.push(
                  <Popover content={<div style={{ maxWidth: '350px' }}>{questions[y]?.objective}</div>} title={`Question: `+`${questions[y].questionNum}`}>
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
                    <p style={{ marginBottom: 0, color: '#FFF' }}>1</p>
                  </div>
                  </Popover>,
                )
              } else {
                answers.push(
                  <Popover content={<div style={{ maxWidth: '350px' }}>{questions[y]?.objective}</div>} title={`Question: `+`${questions[y].questionNum}`}>
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
                    <p style={{ marginBottom: 0, color: '#FFF' }}>1</p>
                  </div>
                  </Popover>,
                )
              }
              break

            case '2.0':
              totalScores += 2.0
              if (quesNum === questions[y].questionNum) {
                answers.push(
                  <Popover content={<div style={{ maxWidth: '350px' }}>{questions[y]?.objective}</div>} title={`Question: `+`${questions[y].questionNum}`}>
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
                    <p style={{ marginBottom: 0, color: '#FFF' }}>2</p>
                  </div>
                  </Popover>,
                )
              } else {
                answers.push(
                  <Popover content={<div style={{ maxWidth: '350px' }}>{questions[y]?.objective}</div>} title={`Question: `+`${questions[y].questionNum}`}>
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
                    <p style={{ marginBottom: 0, color: '#FFF' }}>2</p>
                  </div>
                  </Popover>,
                )
              }
              break

            case '3.0':
              totalScores += 3.0
              if (quesNum === questions[y].questionNum) {
                answers.push(
                  <Popover content={<div style={{ maxWidth: '350px' }}>{questions[y]?.objective}</div>} title={`Question: `+`${questions[y].questionNum}`}>
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
                    <p style={{ marginBottom: 0, color: '#FFF' }}>3</p>
                  </div>
                  </Popover>,
                )
              } else {
                answers.push(
                  <Popover content={<div style={{ maxWidth: '350px' }}>{questions[y]?.objective}</div>} title={`Question: `+`${questions[y].questionNum}`}>
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
                    <p style={{ marginBottom: 0, color: '#FFF' }}>3</p>
                  </div>
                  </Popover>,
                )
              }
              break

            case '4.0':
              totalScores += 4.0
              if (quesNum === questions[y].questionNum) {
                answers.push(
                  <Popover content={<div style={{ maxWidth: '350px' }}>{questions[y]?.objective}</div>} title={`Question: `+`${questions[y].questionNum}`}>
                  <div
                    style={{
                      marginVertical: 10,
                      display: 'flex',
                      backgroundColor: '#FF8080',
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
                    <p style={{ marginBottom: 0, color: '#FFF' }}>4</p>
                  </div>
                  </Popover>,
                )
              } else {
                answers.push(
                  <Popover content={<div style={{ maxWidth: '350px' }}>{questions[y]?.objective}</div>} title={`Question: `+`${questions[y].questionNum}`}>
                  <div
                    style={{
                      marginVertical: 10,
                      display: 'flex',
                      backgroundColor: '#FF8080',
                      border: '1px solid #FF8080',
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
                    <p style={{ marginBottom: 0, color: '#FFF' }}>4</p>
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
      if (y === breakpoint1 - 1 || y === breakpoint2 - 1 || y === questions.length - 1) {
        sbrows.push(
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>{answers}</div>,
        )
        answers = []
      }
    }

    scoreboards.push(<div style={{}}>{sbrows}</div>)
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
      levels: [],
      dbQuestionNumber: 1,
    })
    this.getQuestion(groupID)
  }

  handleKeyDown = () => { }

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
      .then(result => {
        this.getQuestion(selected)
      })
      .catch(err => console.log(JSON.stringify(err)))
  }

  render() {
    const {
      groups,
      selected,
      selectedName,
      questions,
      currentQuestion,
      completed,
      scoreboard,
      loadingQuestion,
      levels,
      totalScore,
      previous,
      next,
    } = this.state
    const { currentIndex, dbQuestionNumber } = this.state
    // console.log(currentQuestion);
    return (
      <Authorize roles={['parents', 'therapist', 'school_admin']} redirect to="/dashboard/beta">
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
              <Col sm={5}>
                <div style={leftDivStyle}>
                  <Scrollbars style={{ height: 'calc(100vh - 120px)' }}>
                    {groups && groups.length > 0 && this.getGroups()}
                    <div style={{ height: 20 }}></div>
                  </Scrollbars>
                </div>
              </Col>
              <Col sm={19}>
                <div style={rightDivStyle}>
                  <PageHeader pageTitle="VB-MAPP Barrier Assessment" questions={questions} lastAssessment={true} />
                  {/* {questions && <LastAssignmentsResult questions={questions} />} */}
                  {completed === 1 && (
                    <div style={assessmentCompletedBlockStyle}>
                      <Text style={{ fontSize: 14, marginBottom: 0, color: 'white' }}>Assessment completed, now you can edit assessment by selecting question from the scoreboard</Text>
                    </div>
                  )}
                  {loadingQuestion && <p>Loading Question...</p>}
                  {loadingQuestion === false &&
                    currentQuestion &&
                    Object.keys(currentQuestion).length > 0 && (
                      <div style={defaultDivStyle}>
                        <div style={{}}>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}
                          >
                            <span style={{ textTransform: 'uppercase' }}>
                              {ReactHtmlParser(currentQuestion.text)}
                            </span>
                            <span style={{ display: 'flex', flexDirection: 'row' }}>
                              {previous === 1 && (
                                <div
                                  style={{ cursor: 'pointer', marginLeft: 10, marginRight: 10 }}
                                  role="button"
                                  onKeyDown={this.handleKeyDown}
                                  tabIndex="0"
                                  onClick={() => this.getPrevious(currentQuestion.questionNum)}
                                >
                                  <Icon type="left" />
                                </div>
                              )}
                              {next === 1 && (
                                <div
                                  style={{ cursor: 'pointer', marginLeft: 10, marginRight: 10 }}
                                  role="button"
                                  onKeyDown={this.handleKeyDown}
                                  tabIndex="0"
                                  onClick={() => this.getNext(currentQuestion.questionNum)}
                                >
                                  <Icon type="right" />
                                </div>
                              )}
                            </span>
                          </div>
                          {questions && questions.length > 0 && (
                            <p style={{ textTransform: 'uppercase' }}>
                              Question {currentQuestion.questionNum} of {questions.length}
                            </p>
                          )}
                          <p style={{ fontSize: 18, textAlign: 'justify', fontWeight: '700' }}>
                            {currentQuestion.title}
                          </p>
                          <div style={{}}>
                            {currentQuestion.responses.map(option => (
                              <p style={{}}>
                                {option.score} - {option.text}
                              </p>
                            ))}
                          </div>
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
                                  width: 50,
                                  marginLeft: 10,
                                  marginRight: 10,
                                  border: '1px solid #555',
                                  borderRadius: 2,
                                  justifyContent: 'center',
                                  alignItems: 'center',
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
                        </div>
                      </div>
                    )}
                  <div
                    style={{...defaultDivStyle, marginBottom: 10}}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                      }}
                    >
                      <p style={{ fontSize: 16, fontWeight: '700', flex: 4 }}>Scoreboard</p>
                      <p style={{ fontSize: 16, fontWeight: '700', flex: 1, textAlign: 'right' }}>
                        {loadingQuestion === false && totalScore}
                      </p>
                    </div>
                    <div style={{}}>
                      {loadingQuestion && <p>Loading Scoreboard...</p>}
                      {loadingQuestion === false && scoreboard.length > 0 && scoreboard}
                      {loadingQuestion === false && scoreboard.length === 0 && (
                        <p>Start answering questions to see the scoreboard</p>
                      )}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Authorize>
    )
  }
}

export default BarriersGroups

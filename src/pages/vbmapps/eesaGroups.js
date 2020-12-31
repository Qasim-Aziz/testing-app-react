/* eslint-disable react/self-closing-comp */
/* eslint-disable react/jsx-boolean-value */
import React, { Component } from 'react'
import Authorize from 'components/LayoutComponents/Authorize'
import { Icon, Layout, Row, Col, Typography, Popover, Button } from 'antd'
import { gql } from 'apollo-boost'
import Scrollbars from 'react-custom-scrollbars'
import ReactHtmlParser from 'react-html-parser'
import client from '../../apollo/config'
import PageHeader from './PageHeader'
import LastAssignmentsResult from './LastAssignmentsResult'
import { GET_VBMAPP_QUESTIONS } from './query'
import { leftDivStyle, rightDivStyle, assessmentCompletedBlockStyle, defaultDivStyle, leftListBoxStyle, recordResponseButtonStyle } from './customStyle'

const { Content } = Layout
const { Title, Text } = Typography

class EESAGroups extends Component {
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

  getQuestion = selected => {
    const student = localStorage.getItem('studentId')
    const areaID = localStorage.getItem('vbMappAreaId')
    const masterID = localStorage.getItem('vbMappMasterId')
    const test = parseInt(localStorage.getItem('vbMappsTestId'), 10)
    let totalScore = 0
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
        const ques = []
        // Looping through all questions
        for (let x = 0; x < questionss.length; x += 1) {
          const options = []
          // Getting previous assessments for this question
          const pa = questionss[x].previous_assess
          // Looping through all the previous assessments for a question
          for (let y = 0; y < pa.length; y += 1) {
            // If there exists an assessment for this question and this test
            if (pa[y].test === test) {
              switch (pa[y].score) {
                case '0.0':
                  options.push(
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <div
                        role="button"
                        onKeyDown={this.handleKeyDown}
                        tabIndex="0"
                        style={{
                          backgroundColor: '#FF8080',
                          width: 40,
                          height: 40,
                          marginLeft: 5,
                          marginRight: 5,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: '1px solid #FF8080',
                          borderRadius: 10,
                        }}
                        onClick={() =>
                          this.handleAnswer(
                            questionss[x].responses[0].score,
                            questionss[x].questionNum,
                          )
                        }
                      >
                        <p style={{ fontSize: 18, color: '#FFFFFF', marginBottom: 0 }}>0</p>
                      </div>
                      <div
                        role="button"
                        onKeyDown={this.handleKeyDown}
                        tabIndex="0"
                        style={{
                          backgroundColor: '#FFF',
                          width: 40,
                          height: 40,
                          marginLeft: 5,
                          marginRight: 5,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: '1px solid #DDD',
                          borderRadius: 10,
                        }}
                        onClick={() =>
                          this.handleAnswer(
                            questionss[x].responses[1].score,
                            questionss[x].questionNum,
                          )
                        }
                      >
                        <p style={{ fontSize: 18, marginBottom: 0 }}>/</p>
                      </div>
                      <div
                        role="button"
                        onKeyDown={this.handleKeyDown}
                        tabIndex="0"
                        style={{
                          backgroundColor: '#FFF',
                          width: 40,
                          height: 40,
                          marginLeft: 5,
                          marginRight: 5,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: '1px solid #DDD',
                          borderRadius: 10,
                        }}
                        onClick={() =>
                          this.handleAnswer(
                            questionss[x].responses[2].score,
                            questionss[x].questionNum,
                          )
                        }
                      >
                        <p style={{ fontSize: 18, marginBottom: 0 }}>x</p>
                      </div>
                    </div>,
                  )
                  break

                case '0.5':
                  totalScore += 0.5
                  options.push(
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <div
                        role="button"
                        onKeyDown={this.handleKeyDown}
                        tabIndex="0"
                        style={{
                          backgroundColor: '#FFF',
                          width: 40,
                          height: 40,
                          marginLeft: 5,
                          marginRight: 5,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: '1px solid #DDD',
                          borderRadius: 10,
                        }}
                        onClick={() =>
                          this.handleAnswer(
                            questionss[x].responses[0].score,
                            questionss[x].questionNum,
                          )
                        }
                      >
                        <p style={{ fontSize: 18, marginBottom: 0 }}>0</p>
                      </div>
                      <div
                        role="button"
                        onKeyDown={this.handleKeyDown}
                        tabIndex="0"
                        style={{
                          backgroundColor: '#FF9C52',
                          width: 40,
                          height: 40,
                          marginLeft: 5,
                          marginRight: 5,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: '1px solid #FF9C52',
                          borderRadius: 10,
                        }}
                        onClick={() =>
                          this.handleAnswer(
                            questionss[x].responses[1].score,
                            questionss[x].questionNum,
                          )
                        }
                      >
                        <p style={{ fontSize: 18, color: '#FFFFFF', marginBottom: 0 }}>/</p>
                      </div>
                      <div
                        role="button"
                        onKeyDown={this.handleKeyDown}
                        tabIndex="0"
                        style={{
                          backgroundColor: '#FFF',
                          width: 40,
                          height: 40,
                          marginLeft: 5,
                          marginRight: 5,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: '1px solid #DDD',
                          borderRadius: 10,
                        }}
                        onClick={() =>
                          this.handleAnswer(
                            questionss[x].responses[2].score,
                            questionss[x].questionNum,
                          )
                        }
                      >
                        <p style={{ fontSize: 18, marginBottom: 0 }}>x</p>
                      </div>
                    </div>,
                  )
                  break

                case '1.0':
                  totalScore += 1.0
                  options.push(
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <div
                        role="button"
                        onKeyDown={this.handleKeyDown}
                        tabIndex="0"
                        style={{
                          backgroundColor: '#FFF',
                          width: 40,
                          height: 40,
                          marginLeft: 5,
                          marginRight: 5,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: '1px solid #DDD',
                          borderRadius: 10,
                        }}
                        onClick={() =>
                          this.handleAnswer(
                            questionss[x].responses[0].score,
                            questionss[x].questionNum,
                          )
                        }
                      >
                        <p style={{ fontSize: 18, marginBottom: 0 }}>0</p>
                      </div>
                      <div
                        role="button"
                        onKeyDown={this.handleKeyDown}
                        tabIndex="0"
                        style={{
                          backgroundColor: '#FFF',
                          width: 40,
                          height: 40,
                          marginLeft: 5,
                          marginRight: 5,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: '1px solid #DDD',
                          borderRadius: 10,
                        }}
                        onClick={() =>
                          this.handleAnswer(
                            questionss[x].responses[1].score,
                            questionss[x].questionNum,
                          )
                        }
                      >
                        <p style={{ fontSize: 18, marginBottom: 0 }}>/</p>
                      </div>
                      <div
                        role="button"
                        onKeyDown={this.handleKeyDown}
                        tabIndex="0"
                        style={{
                          backgroundColor: '#4BAEA0',
                          width: 40,
                          height: 40,
                          marginLeft: 5,
                          marginRight: 5,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: '1px solid #4BAEA0',
                          borderRadius: 10,
                        }}
                        onClick={() =>
                          this.handleAnswer(
                            questionss[x].responses[2].score,
                            questionss[x].questionNum,
                          )
                        }
                      >
                        <p style={{ fontSize: 18, color: '#FFFFFF', marginBottom: 0 }}>x</p>
                      </div>
                    </div>,
                  )
                  break

                default:
                  options.push(
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <div
                        role="button"
                        onKeyDown={this.handleKeyDown}
                        tabIndex="0"
                        style={{
                          backgroundColor: '#FFF',
                          width: 40,
                          height: 40,
                          marginLeft: 5,
                          marginRight: 5,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: '1px solid #DDD',
                          borderRadius: 10,
                        }}
                        onClick={() =>
                          this.handleAnswer(
                            questionss[x].responses[0].score,
                            questionss[x].questionNum,
                          )
                        }
                      >
                        <p style={{ fontSize: 18, marginBottom: 0 }}>0</p>
                      </div>
                      <div
                        role="button"
                        onKeyDown={this.handleKeyDown}
                        tabIndex="0"
                        style={{
                          backgroundColor: '#FFF',
                          width: 40,
                          height: 40,
                          marginLeft: 5,
                          marginRight: 5,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: '1px solid #DDD',
                          borderRadius: 10,
                        }}
                        onClick={() =>
                          this.handleAnswer(
                            questionss[x].responses[1].score,
                            questionss[x].questionNum,
                          )
                        }
                      >
                        <p style={{ fontSize: 18, marginBottom: 0 }}>/</p>
                      </div>
                      <Button
                        type="link"
                        role="button"
                        onKeyDown={this.handleKeyDown}
                        tabIndex="0"
                        style={{
                          backgroundColor: '#FFF',
                          width: 40,
                          height: 40,
                          marginLeft: 5,
                          marginRight: 5,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: '1px solid #DDD',
                          borderRadius: 10,
                          color: '#000',
                        }}
                        onClick={() => {
                          console.log(questionss[x])
                          this.handleAnswer(
                            questionss[x].responses[2].score,
                            questionss[x].questionNum,
                          )
                        }}
                      >
                        <p style={{ fontSize: 18, marginBottom: 0 }}>x</p>
                      </Button>
                    </div>,
                  )
                  break
              }
            }
          }
          ques.push(
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 10,
                marginBottom: 10,
                borderTop: '1px solid #DDD',
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 20,
                paddingBottom: 10,
              }}
            >
              <p style={{ fontSize: 18, color: '#777', flex: 1 }}>
                {ReactHtmlParser(questionss[x].text)}
              </p>
              {options}
            </div>,
          )
        }

        this.setState({
          questions: ques,
          loadingQuestion: false,
          totalScore,
        })
      })
      .catch(err => console.log(JSON.stringify(err)))
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

  handleAnswer(score, quesNum) {
    const { selected } = this.state
    this.setState({
      loadingQuestion: true,
    })
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
            question:${quesNum},
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
    } = this.state
    const { currentIndex, dbQuestionNumber } = this.state
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
                  <PageHeader pageTitle="VB-MAPP Eesa Assessment" />
                  <div
                    style={{...defaultDivStyle, marginBottom: 10}}
                  >
                    <h5
                      style={{ paddingLeft: 20, paddingRight: 20, textAlign: 'right', display: 'flex' }}
                    >
                      Score: {totalScore}
                    </h5>
                    {loadingQuestion && <p>Loading Question...</p>}
                    <Scrollbars style={{ height: 'calc(100vh - 250px)' }}>
                      {loadingQuestion === false && questions.length > 0 && questions}
                    </Scrollbars>
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

export default EESAGroups

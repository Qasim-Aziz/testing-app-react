
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
/* eslint-disable no-var */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */

import React from 'react'
import { Helmet } from 'react-helmet'
import {
    Row,
    Col,
    Card,
    Button,
    Typography,
    Icon,
} from 'antd'
import { connect } from 'react-redux'


const { Title, Text } = Typography

@connect(({ cogniableassessment }) => ({ cogniableassessment }))
class Questions extends React.Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    movePrev = () => {
        // reseting previous button style
        // const x = document.getElementsByClassName("responseButtons")
        // for (let i=0;i < x.length; i++){
        //     x[i].style.backgroundColor = 'white'
        // }
        const {dispatch, cogniableassessment: {Question, AssessmentObject, QuestionCounter}} = this.props

        dispatch({
            type: 'cogniableassessment/CHANGE_QUESTION',
            payload: {
                index: QuestionCounter - 1
            }
        })




        if(QuestionCounter > 0){
            dispatch({
                type: 'cogniableassessment/SET_STATE',
                payload: {
                    QuestionCounter: QuestionCounter - 1
                }
            })
        }

        

    }

    moveNext = () => {
        const {dispatch, cogniableassessment: {Question, AssessmentObject, QuestionCounter}} = this.props
        if(QuestionCounter > 0){

            dispatch({
                type: 'cogniableassessment/CHANGE_QUESTION',
                payload: {
                    index: QuestionCounter + 1
                }
            })

            dispatch({
                type: 'cogniableassessment/SET_STATE',
                payload: {
                    QuestionCounter: QuestionCounter + 1
                }
            })
        }
        
    }

    recordResponse = id => {
        const {dispatch, cogniableassessment: {Question, AssessmentObject, QuestionCounter, ResponseObject}} = this.props
        if(ResponseObject[Question.id]?.recorded){
            // reseting previous button style
            // const x = document.getElementsByClassName("responseButtons")
            // for (let i=0;i < x.length; i++){
            //     x[i].style.backgroundColor = 'white'
            // }
            // // highliting clicked button
            // document.getElementById(id).style.backgroundColor = '#FF9C52'

            dispatch({
                type: 'cogniableassessment/UPDATE_QUESTION_RESPONSE',
                payload: {
                    resultId: id,
                    qusId: Question.id,
                    resObjectId: AssessmentObject.id,
                }
            })
            // alert('write update query')
        }
        else {
            // highliting clicked button
            // document.getElementById(id).style.backgroundColor = '#FF9C52'

            document.getElementsByClassName('responseButtons').forEach(ele => {
                ele.style.border = '1px solid #d9d9d9'
            })


            dispatch({
                type: 'cogniableassessment/RECORD_RESPONSE',
                payload: {
                    answerId: id,
                    questionId: Question.id,
                    objectId: AssessmentObject.id
                }
            })
        }
    }

    saveQuestionAnswer = () => {
        const {dispatch, cogniableassessment: {Question, AssessmentObject, QuestionCounter}} = this.props
        dispatch({
            type: 'cogniableassessment/END_QUESTIONS',
            payload: {
                objectId: AssessmentObject.id,
                status: 'QuestionsCompleted'
            }
        })
    }

    continueAssessment = () => {
        const {dispatch, cogniableassessment: {Question, AssessmentObject, QuestionCounter, cloneQuestion, isEdit}} = this.props
        dispatch({
            type: 'cogniableassessment/SET_STATE',
            payload: {
                Question: cloneQuestion,
                QuestionCounter: AssessmentObject.assessmentQuestions.edges.length,
                isEdit: false
            }
        })
    }

    enableEdit = () => {
        const {dispatch, cogniableassessment: {Question, AssessmentObject, QuestionCounter, cloneQuestion, isEdit}} = this.props
        dispatch({
            type: 'cogniableassessment/SET_STATE',
            payload: {
                Question: AssessmentObject.assessmentQuestions.edges[AssessmentObject.assessmentQuestions.edges.length -1].node.question,
                isEdit: true
                // QuestionCounter: AssessmentObject.assessmentQuestions.edges.length 
            }
        })
    }


    render() {
        const textStyle = {
            fontSize: '16px',
            lineHeight: '19px',
        }
        const titleStyle = {
            fontSize: '20px',
            lineHeight: '27px',
            marginTop: '5px',
        }
        const buttonStyle = {
            width: '300px',
            boxShadow: 'rgba(53, 53, 53, 0.1) 0px 0px 4px !important',
            minHeight: '120px',
            marginTop: '10px',
            marginLeft: '20px',
            whiteSpace: 'normal',
            display: 'inline-block',
            // position: 'fixed'
        }
        const selectedButtonStyle = {
            width: '300px',
            boxShadow: 'rgba(53, 53, 53, 0.1) 0px 0px 4px !important',
            minHeight: '120px',
            marginTop: '10px',
            marginLeft: '20px',
            backgroundColor: '#FF9C52',
            whiteSpace: 'normal',
            // position: 'fixed'
        }

        const { cogniableassessment: { Question, AssessmentObject, QuestionCounter, responseLoading, ResponseObject, cloneQuestion , isEdit} } = this.props

        if (!Question) {
            return (
                <>
                    
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
                            marginTop: '10px',
                            minHeight: '170px',
                            textAlign: 'center',
                        }}
                    >
                        <Title style={titleStyle}>Congratulations!!</Title> <br />
                        <Text style={titleStyle}>You answered all the cogniAble assessment questions</Text> <br />
                        <Button style={{height: 50, marginTop: '20px'}} onClick={this.saveQuestionAnswer}>Move to the next seagment</Button> <br />
                        <Button style={{marginTop: '20px'}} type="link" onClick={this.enableEdit}>click here to edit responses</Button>

                    </div>
                    
                </>
            )
        }

        return (
            <>
                <Text style={titleStyle}>{AssessmentObject.student.firstname}&apos;s CogniAble Assessment</Text>
                <span style={{ float: 'right' }}>Answered {QuestionCounter}</span>
                <span style={{ float: 'right', marginRight: '50px' }}>Age Group: {Question.age}</span>
                <span style={{ float: 'right', marginRight: '50px' }}>Area: {Question.area.name}</span>
                <br />
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
                        marginTop: '10px',
                        minHeight: '140px'
                    }}
                >
                    <Title style={titleStyle}>Question: {Question.question}</Title>

                </div>


                <div style={{ width: '700px', float: 'right' }}>
                    <Row>
                    {Question.options.edges.map((item, index) =>
                        <>
                            {ResponseObject[Question.id] ?
                                <>
                                    {ResponseObject[Question.id]?.response?.answer.id === item.node.id ? 
                                        <Col span={12}>
                                            <Button style={selectedButtonStyle} id={item.node.id} className="responseButtons" onClick={() => this.recordResponse(item.node.id)}><Text style={{ fontSize: '16px' }}>{index+1}. {item.node.name}</Text></Button>
                                        </Col>
                                    :
                                        <Col span={12}>
                                            <Button style={buttonStyle} id={item.node.id} className="responseButtons" onClick={() => this.recordResponse(item.node.id)}><Text style={{ fontSize: '16px' }}>{index+1}. {item.node.name}</Text></Button>
                                        </Col>
                                    }
                                </>
                            :
                                <Col span={12}>
                                    <Button style={buttonStyle} id={item.node.id} className="responseButtons" onClick={() => this.recordResponse(item.node.id)}><Text style={{ fontSize: '16px' }}>{index+1}. {item.node.name}</Text></Button>
                                </Col>
                            } 
                        </>
                    )}
                    </Row>

                    {responseLoading ? <p>Loading new question...</p> : ''}
                    
                    {isEdit ? 
                        <div style={{ textAlign: 'right', marginTop: '40px', marginRight: '20px' }}>
                            { QuestionCounter > 1 ? 
                                <>
                                    <Button onClick={this.movePrev}><Icon type="left" /></Button>&nbsp;&nbsp;
                                </>
                                :
                                <>
                                    <Button disabled onClick={this.movePrev}><Icon type="left" /></Button>&nbsp;&nbsp;
                                </>
                            }
                            {QuestionCounter < AssessmentObject.assessmentQuestions.edges.length ? 
                                <>
                                    <Button onClick={this.moveNext}><Icon type="right" /></Button>
                                </>
                                :
                                <>
                                    <Button disabled onClick={this.moveNext}><Icon type="right" /></Button>
                                </>
                            }
                            &nbsp;&nbsp;<Button onClick={this.continueAssessment}>Continue Assessment</Button>
                        </div>
                    :
                        <>
                            <div style={{ textAlign: 'right', marginTop: '40px', marginRight: '20px' }}>
                                <Button onClick={this.enableEdit}>Edit</Button>
                            </div>
                        </>

                    }
                    {/* <div style={{ textAlign: 'right', marginTop: '10px', marginRight: '20px' }}>
                        { ResponseObject[cloneQuestion?.id]?.recorded === false ? 
                            <>
                                {QuestionCounter > AssessmentObject.assessmentQuestions.edges.length ? 
                                    <>
                                    </>  
                                :
                                    <Button onClick={this.continueAssessment}>Continue Assessment</Button>    
                                }
                                
                            </>
                            :
                            ''
                        }
                    </div> */}
                    {/* {QuestionsResponse[QuestionsList[QuestionsList.length -1].id].recorded === true ? 
                        <div style={{ textAlign: 'right', marginTop: '20px', marginRight: '20px' }}>
                            <Button onClick={this.moveToNextStep} style={{backgroundColor: 'green', color: 'white'}}>Step 2</Button>
                        </div>
                    :
                        ''
                    } */}
                </div>
                

            </>
        )
    }
}

export default Questions

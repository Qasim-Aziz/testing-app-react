
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

@connect(({ screening }) => ({ screening }))
class Questions extends React.Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    movePrev = () => {
        // reseting previous button style
        const x = document.getElementsByClassName("responseButtons")
        for (let i=0;i < x.length; i++){
            x[i].style.backgroundColor = 'white'
        }
        const {dispatch, screening: {ActiveIndex, QuestionsList, RecordedObject}} = this.props
        if(ActiveIndex > 0){
            dispatch({
                type: 'screening/SET_STATE',
                payload: {
                    ActiveIndex: ActiveIndex - 1
                }
            })
        }

        

    }

    moveNext = () => {
        // reseting previous button style
        const x = document.getElementsByClassName("responseButtons")
        for (let i=0;i < x.length; i++){
            x[i].style.backgroundColor = 'white'
        }
        const {dispatch, screening: {ActiveIndex, QuestionsList}} = this.props
        if((ActiveIndex + 1) < QuestionsList.length){
            dispatch({
                type: 'screening/SET_STATE',
                payload: {
                    ActiveIndex: ActiveIndex + 1
                }
            })
        }

        

    }

    moveToNextStep = () => {
        const {dispatch, screening: {RecordedObject } } = this.props
        if(RecordedObject.status === 'PROGRESS'){
            dispatch({
                type: 'screening/UPDATE_STATUS',
                payload: {
                    status: 'QuestionsCompleted'
                }
            })
        }
        else{
            dispatch({
                type: 'screening/SET_STATE',
                payload: {
                    SelectedStep: 'step2'
                }
            }) 
        }

    }

    recordResponse = id => {
        const {dispatch, screening: {ActiveIndex, QuestionsList, QuestionsResponse}} = this.props
        if(QuestionsResponse[QuestionsList[ActiveIndex].id].recorded){
            // reseting previous button style
            const x = document.getElementsByClassName("responseButtons")
            for (let i=0;i < x.length; i++){
                x[i].style.backgroundColor = 'white'
            }
            // highliting clicked button
            document.getElementById(id).style.backgroundColor = '#FF9C52'
            dispatch({
                type: 'screening/UPDATE_RESPONSE',
                payload: {
                    resultId: id,
                    qusId: QuestionsList[ActiveIndex].id,
                    resObjectId: QuestionsResponse[QuestionsList[ActiveIndex].id].response.id,
                }
            })
        }
        else {
            // highliting clicked button
            document.getElementById(id).style.backgroundColor = '#FF9C52'
            dispatch({
                type: 'screening/RECORD_RESPONSE',
                payload: {
                    resultId: id,
                    activeIndex: ActiveIndex,
                }
            })
        }
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
            width: '220px',
            boxShadow: 'rgba(53, 53, 53, 0.1) 0px 0px 4px !important',
            height: '70px',
            marginTop: '10px',
            marginLeft: '20px',
        }
        const selectedButtonStyle = {
            width: '220px',
            boxShadow: 'rgba(53, 53, 53, 0.1) 0px 0px 4px !important',
            height: '70px',
            marginTop: '10px',
            marginLeft: '20px',
            backgroundColor: '#FF9C52'
        }

        const { screening: { SelectedStep, QuestionsList, ActiveIndex, QuestionsResponse, RecordedObject } } = this.props

        if (QuestionsList.length === 0) {
            return "No Questions"
        }

        return (
            <>
                <Text style={titleStyle}>{RecordedObject.name}&apos;s Preliminary Assessment</Text>
                <span style={{ float: 'right' }}>Question {ActiveIndex + 1} / {QuestionsList.length}</span>
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
                        minHeight: '200px'
                    }}
                >
                    <Title style={titleStyle}>Question: {QuestionsList[ActiveIndex].question}</Title>

                </div>


                <div style={{ width: '500px', float: 'right' }}>
                    {QuestionsList[ActiveIndex].options.edges.map((item) =>
                        <>
                            {QuestionsResponse[QuestionsList[ActiveIndex].id].recorded === true ?
                                <>
                                    {QuestionsResponse[QuestionsList[ActiveIndex].id].response.answer.id === item.node.id ? 
                                        <Button style={selectedButtonStyle} id={item.node.id} className="responseButtons" onClick={() => this.recordResponse(item.node.id)}><Text style={{ fontSize: '16px' }}>{item.node.name}</Text></Button>
                                    :
                                        <Button style={buttonStyle} id={item.node.id} className="responseButtons" onClick={() => this.recordResponse(item.node.id)}><Text style={{ fontSize: '16px' }}>{item.node.name}</Text></Button>
                                    }
                                </>
                            :
                            <Button style={buttonStyle} id={item.node.id} className="responseButtons" onClick={() => this.recordResponse(item.node.id)}><Text style={{ fontSize: '16px' }}>{item.node.name}</Text></Button>
                            }
                        </>
                    )}

                    <div style={{ textAlign: 'right', marginTop: '40px', marginRight: '20px' }}>
                        <Button onClick={this.movePrev}><Icon type="left" /></Button>&nbsp;&nbsp;
                        <Button onClick={this.moveNext}><Icon type="right" /></Button>
                    </div>
                    {QuestionsResponse[QuestionsList[QuestionsList.length -1].id].recorded === true ? 
                        <div style={{ textAlign: 'right', marginTop: '20px', marginRight: '20px' }}>
                            <Button onClick={this.moveToNextStep} style={{backgroundColor: 'green', color: 'white'}}>Step 2</Button>
                        </div>
                    :
                        ''
                    }
                </div>
                

            </>
        )
    }
}

export default Questions

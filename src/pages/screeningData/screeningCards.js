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
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-expressions */

import React from 'react'
import {
    Row,
    Col,
    Card,
    Button,
    Typography,
} from 'antd'
import { connect } from 'react-redux'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'


const { Title, Text } = Typography

@connect(({ screening }) => ({ screening }))
class ScreeingCards extends React.Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    changeStep = step => {
        const {dispatch, screening: {SelectedStep, RecordedObject}} = this.props

        if(step === 'step2'){
            if(RecordedObject && RecordedObject.status === 'PROGRESS'){
                dispatch({
                    type: 'screening/SET_STATE',
                    payload: {
                        SelectedStep: step,
                    }
                })
            }
        }
        else if(step === 'step3'){
            if(RecordedObject && RecordedObject.status === 'QUESTIONSCOMPLETED'){
                dispatch({
                    type: 'screening/SET_STATE',
                    payload: {
                        SelectedStep: step,
                    }
                })
            }
        }
        else if(step === 'step4'){
            if(RecordedObject && RecordedObject.status === 'VIDEOSUPLOADED'){
                dispatch({
                    type: 'screening/SET_STATE',
                    payload: {
                        SelectedStep: step,
                    }
                })
            }
        }
        else if(step === 'step1'){
            if (RecordedObject.status !== 'VIDEOSUPLOADED'){
                dispatch({
                    type: 'screening/SET_STATE',
                    payload: {
                        SelectedStep: step,
                    }
                })
            }
        }

        
    }

    startNewAssessment = () => {
        const { dispatch } = this.props
        dispatch({
            type: 'screening/START_NEW_ASSESSMENT',
        })
    }

render() {

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
        curser: 'pointer',
    }

    const selectedCardStyle = {
        background: '#E58425',
        border: '1px solid #E4E9F0',
        color: '#fff',
        boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
        borderRadius: 10,
        padding: '16px 12px',
        alignItems: 'center',
        display: 'block',
        width: '100%',
        marginBottom: '20px',
        lineHeight: '27px'
    }

    const textStyle = {
        fontSize: '14px',
        lineHeight: '19px',
        fontWeight: 600,
    }

    const titleStyle = {
        fontSize: '20px',
        lineHeight: '27px',
        marginTop: '5px',
    }

    const selectedTextStyle = {
        fontSize: '14px',
        lineHeight: '19px',
        fontWeight: 600,
        color: '#fff'
    }

    const selectedTitleStyle = {
        fontSize: '20px',
        lineHeight: '27px',
        marginTop: '5px',
        color: '#fff'
    }

    const { screening: {SelectedStep}} = this.props

    return (
        <>
            <div
                role="presentation"
                style={{
                    background: '#F9F9F9',
                    borderRadius: 10,
                    padding: '28px 27px 20px',
                    marginBottom: '2%',
                    display: 'block',
                    width: '100%',
                    minHeight: '650px',
                }}
            >
                <div
                    style={cardStyle}
                    onClick={this.startNewAssessment}
                >
                    <Text style={textStyle}>Start New Assessment</Text>
                </div>
                <div
                    style={SelectedStep === 'step1' ? selectedCardStyle : cardStyle}
                    onClick={() => this.changeStep('step1')}
                >
                    <Text style={SelectedStep === 'step1' ? selectedTextStyle : textStyle}>Step 1. 8-10 mins</Text>
                    <Title style={SelectedStep === 'step1' ? selectedTitleStyle : titleStyle}>Preliminary Assessment</Title>
                </div>
                <div
                    style={SelectedStep === 'step2' ? selectedCardStyle : cardStyle}
                    onClick={() => this.changeStep('step2')}
                >
                    <Text style={SelectedStep === 'step2' ? selectedTextStyle : textStyle}>Step 2. 8-10 mins</Text>
                    <Title style={SelectedStep === 'step2' ? selectedTitleStyle : titleStyle}>Screening Instructions</Title>
                </div>
                <div
                    style={SelectedStep === 'step3' ? selectedCardStyle : cardStyle}
                    onClick={() => this.changeStep('step3')}
                >
                    <Text style={SelectedStep === 'step3' ? selectedTextStyle : textStyle}>Step 3. 8-10 mins</Text>
                    <Title style={SelectedStep === 'step3' ? selectedTitleStyle : titleStyle}>Record a Video</Title>
                </div>
                <div
                    style={SelectedStep === 'step4' ? selectedCardStyle : cardStyle}
                    onClick={() => this.changeStep('step4')}
                >
                    <Text style={SelectedStep === 'step4' ? selectedTextStyle : textStyle}>Step 4. 8-10 mins</Text>
                    <Title style={SelectedStep === 'step4' ? selectedTitleStyle : titleStyle}>Screening Result</Title>
                </div>
            </div>
        </>
    )
}
}

export default ScreeingCards

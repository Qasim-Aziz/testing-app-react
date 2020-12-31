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
import { Helmet } from 'react-helmet'
import {
    Row,
    Col,
    Card,
    Button,
    Typography,
    Layout,
} from 'antd'
import { connect } from 'react-redux'
import Questions from './Questions'
import Result from './Result'


const { Title, Text } = Typography
const { Content } = Layout

@connect(({ user, cogniableassessment }) => ({ user, cogniableassessment }))
class LeftArea extends React.Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    componentDidMount() {
        const { dispatch } = this.props
        const studentId = JSON.parse(localStorage.getItem('studentId'))
        dispatch({
            type: 'cogniableassessment/LOAD_DATA',
            payload: {
                studentId
            }
        })
        const id = localStorage.getItem('cogniAbleId')
        if (id) {
            dispatch({
                type: 'cogniableassessment/LOAD_ASSESSMENT_OBJECT',
                payload: {
                    objectId: id
                },
            })
        }
        else {
            window.location.href = '/#/cogniableAssessment'
        }
    }


    render() {
        const textStyle = {
            fontSize: '16px',
            lineHeight: '19px',
        }

        const { cogniableassessment: { Question, AssessmentObject, QuestionCounter, AssessmentLoading, AssessmentStatus, responseLoading, ResponseObject, cloneQuestion, isEdit } } = this.props
        return (
            <>
                <Helmet title="CogniAble Assessment" />
                <Layout style={{ padding: '0px' }}>
                    <Content
                        style={{
                            padding: '0px 20px',
                            maxWidth: 900,
                            width: '100%',
                            margin: '0px auto',
                        }}
                    >
                        <Row>
                            <Col sm={24}>
                                <div
                                    role="presentation"
                                    style={{
                                        borderRadius: 10,
                                        border: '2px solid #F9F9F9',
                                        padding: '28px 27px 20px',
                                        marginBottom: '2%',
                                        display: 'block',
                                        // marginLeft: '10px',
                                        width: '100%',
                                        height: '650px',
                                        overflow: 'auto'
                                    }}
                                >
                                    {AssessmentLoading ?

                                        <p>Loading...</p>
                                        :
                                        <>
                                            {AssessmentObject ?
                                                <>
                                                    {AssessmentStatus === 'QUESTIONSCOMPLETED' || AssessmentStatus === 'COMPLETED' ?
                                                        <>
                                                            <Result />
                                                        </>
                                                        :
                                                        <Questions />
                                                    }
                                                </>
                                                :
                                                'Please Select Assessment'
                                            }
                                        </>
                                    }

                                </div>

                            </Col>
                            {/* <Col sm={6}>
                                <div
                                    role="presentation"
                                    style={{
                                        borderRadius: 10,
                                        border: '2px solid #F9F9F9',
                                        padding: '28px 27px 20px',
                                        marginBottom: '2%',
                                        display: 'block',
                                        marginLeft: '10px',
                                        width: '100%',
                                        height: '650px',
                                        overflow: 'auto'
                                    }}
                                >
                                    <span style={{ float: 'right' }}>Answered {QuestionCounter}</span>
                                    <span style={{ float: 'right', marginRight: '50px' }}>Age Group: {Question?.age}</span>
                                    <span style={{ float: 'right', marginRight: '50px' }}>Area: {Question?.area.name}</span>
                                </div>
                            </Col> */}
                        </Row>
                    </Content>
                </Layout>
            </>
        )
    }
}

export default LeftArea

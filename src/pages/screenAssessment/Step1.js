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
import mother from '../../images/mother.jpg'
import AssessmentForm from './AssessmentForm'


const { Title, Text } = Typography

@connect(({ screening }) => ({ screening }))
class Step1 extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isAssesmentStarted: false
        }
    }

    componentDidMount(){
        const { screening: { SelectedStep, RecordedObject } } = this.props
        if(RecordedObject){
            this.setState({
                isAssesmentStarted: true
            })
        }
    }

    render() {
        const textStyle = {
            fontSize: '16px',
            lineHeight: '19px',
        }
        
        const { isAssesmentStarted } = this.state

        return (
            <>
                {isAssesmentStarted ?
                    <>
                        <AssessmentForm />
                    </>
                    :
                    <>
                        <Row>
                            <Col sm={12}>
                                
                                <img
                                    src={mother}
                                    alt=""
                                    style={{
                                        height: '250px',
                                        borderRadius: 10,
                                    }}
                                />
                            </Col>
                            <Col sm={12}>
                                <Text style={textStyle}>Diagnosing autism spectrum disorder (ASD) can be difficult because there is no medical test, like a blood test, to diagnose the disorder. Doctors look at the child’s developmental history and behavior to make a diagnosis. <br /> ASD can sometimes be detected at 18 months or younger. By age 2, a diagnosis by an experienced professional can be considered very reliable [1]. However, many children do not receive a final diagnosis until much older. Some people are not diagnosed until they are adolescents or adults. This delay means that children with ASD might not get the early help they need.</Text>
                            </Col>
                        </Row>

                        <Button style={{ float: 'right', marginTop: '80px' }} type="primary" size="large" onClick={() => this.setState({ isAssesmentStarted: true })}>Start Assessment</Button>
                    </>
                }

            </>
        )
    }
}

export default Step1

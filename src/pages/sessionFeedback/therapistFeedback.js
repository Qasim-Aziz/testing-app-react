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
/* eslint-disable array-callback-return */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/no-did-update-set-state */

import React from 'react'
import {
    Row,
    Col,
    Card,
    Drawer,
    Select,
    Form,
    Input,
    Switch,
    Radio,
    Slider,
    Upload,
    Rate,
    Checkbox,
    Collapse,
    Tree,
    Icon,
    DatePicker,
    notification,
    Empty,
    Button,
    Typography,
} from 'antd'
import { Redirect } from 'react-router-dom'
import Authorize from 'components/LayoutComponents/Authorize'
import { connect } from 'react-redux'
import moment from 'moment'
import './feedback.scss'

const { Title, Text } = Typography
const { Panel } = Collapse;
const { Option } = Select;
const {TextArea} = Input

const text = (
    <p style={{ paddingLeft: 24 }}>
        A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found
        as a welcome guest in many households across the world.
    </p>
);

@connect(({ user, feedback }) => ({ user, feedback }))
class TherapistFeedback extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false,
        }
    }

    componentDidMount() {
        console.log('ada')
    }

    handleSubmit = e => {
        e.preventDefault();
        const { feedback: { ParentQuestions, TherapistQuestions, Loading }, dispatch } = this.props
        const ansList = []
        let updateQuery = false
        this.props.form.validateFields((err, values) => {
            if (!err) {
                TherapistQuestions.map((item, index) => {
                    if (index === 0 && item.node.answers.length > 0) {
                        updateQuery = true
                    }
                    if (item.node.type === 'rating') {
                        ansList.push({ 'questionId': item.node.id, 'answerRating': values[item.node.id] })
                    }
                    if (item.node.type === 'text') {
                        ansList.push({ 'questionId': item.node.id, 'answerText': values[item.node.id] })
                    }
                })
                // console.log('Received values of form: ', values);
                // console.log('answer list: ', ansList);
                dispatch({
                    type: 'feedback/FEEDBACK_SUBMIT',
                    payload: {
                        answers: ansList,
                        update: updateQuery
                    }
                })
            }
        });
    };


    render() {
        const { loading } = this.state
        const { user, feedback: { ParentQuestions, TherapistQuestions, Loading } } = this.props
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };

        if (Loading) {
            return 'Loading data...'
        }

        return (
            <>
                {user.role === 'therapist' ?
                    <>
                        <Form style={{ marginLeft: 0, position: 'relative' }} onSubmit={this.handleSubmit}>
                            <p>1. Rate the session on a scale of 1 to 5 (1 = not good and 5 = excellent) </p>
                            {TherapistQuestions.map(item =>
                                <>
                                    {item.node.type === 'rating' && (
                                        <Form.Item>
                                            <span style={{ width: '300px', display: 'inline-block' }}>{item.node.question}    </span>
                                            {getFieldDecorator(`${item.node.id}`, {
                                                initialValue: item.node.answers.length > 0 ? item.node.answers[0].answerRating : 0,
                                            })(<Rate />)}
                                        </Form.Item>
                                    )}
                                    {item.node.type === 'text' && (
                                        <>
                                            <p>{item.node.question} </p>
                                            <Form.Item>
                                                {getFieldDecorator(`${item.node.id}`, {
                                                    initialValue: `${item.node.answers.length > 0 ? item.node.answers[0].answerText : ''}`,
                                                })(<TextArea rows={4} />)}
                                            </Form.Item>
                                        </>
                                    )}
                                </>
                            )}

                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </>
                    :
                    <>
                        <div>
                            {TherapistQuestions.map((item, index) =>
                                <>
                                    {index === 0 && (
                                        <Title style={{fontSize: 18}}>1. Rate the session on a scale of 1 to 5 (1 = not good and 5 = excellent)</Title>
                                    )}
                                    {item.node.type === 'rating' && (
                                        <Text style={{ fontSize: 16, display: 'block' }}>{item.node.question} {item.node.answers.length > 0 ? item.node.answers[0].answerRating : 0} </Text>
                                    )}
                                    {item.node.type === 'text' && (
                                        <>
                                            <br />
                                            <Title style={{ fontSize: 18 }}>{item.node.question}</Title>
                                            <Text style={{ fontSize: 16, display: 'block' }}>{item.node.answers.length > 0 ? item.node.answers[0].answerText : ''}</Text>                                            
                                        </>
                                    )}
                                </>
                            )}
                            {/* <Text style={{fontSize: 16, display: 'block'}}>Overall satisfaction: 3 </Text>
                            <Text style={{fontSize: 16, display: 'block'}}>Progress seen in the child: 3 </Text>
                            <Text style={{fontSize: 16, display: 'block'}}>Plan and programs implemented correctly: 3 </Text>
                            <Text style={{fontSize: 16, display: 'block'}}>Confidence and ease of implementation: 3 </Text>
                            <Text style={{fontSize: 16, display: 'block'}}>Compliance with the strategies outlined: 3 </Text>
                            <br />
                            <Title style={{fontSize: 18}}>2. Note the changes you need the parent to make in the next session? Why?</Title>
                            <Text style={{fontSize: 16, display: 'block'}}>{text}</Text>
                            <br />
                            <Title style={{fontSize: 18}}>3. Note the 2 good things that parents/child did during the session that indicate progress or improvement.</Title>
                            <Text style={{fontSize: 16, display: 'block'}}>{text}</Text> */}
                        </div>
                    </>
                }
            </>
        )
    }
}

export default Form.create()(TherapistFeedback)

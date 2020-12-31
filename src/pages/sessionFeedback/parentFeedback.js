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
import { Helmet } from 'react-helmet'
import {
    Select,
    Form,
    Input,
    Rate,
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
const { TextArea } = Input

const text = `A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.`;

@connect(({ user, feedback }) => ({ user, feedback }))
class ParentFeedback extends React.Component {
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
                ParentQuestions.map((item, index) => {
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
                {user.role === 'parents' ?
                    <>
                        <Form style={{ marginLeft: 0, position: 'relative' }} onSubmit={this.handleSubmit}>
                            <p>1. Rate the session on a scale of 1 to 5 (1 = not good and 5 = excellent) </p>
                            {ParentQuestions.map(item =>
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
                            {ParentQuestions.map((item, index) =>
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

                            {/* <Text style={{ fontSize: 16, display: 'block' }}>Overall satisfaction: 3 </Text>
                            <Text style={{ fontSize: 16, display: 'block' }}>Progress seen in the child: 3 </Text>
                            <Text style={{ fontSize: 16, display: 'block' }}>Plan and programs provided: 3 </Text>
                            <Text style={{ fontSize: 16, display: 'block' }}>Confidence and ease of implementation: 3 </Text>
                            <Text style={{ fontSize: 16, display: 'block' }}>Usefulness of the app during session: 3 </Text>
                            <br />
                            <Title style={{ fontSize: 18 }}>2. Note whether the session met your expectations? If not, what needs to be different?</Title>
                            <Text style={{ fontSize: 16, display: 'block' }}>{text}</Text>
                            <br />
                            <Title style={{ fontSize: 18 }}>3. Note down the most remarkable or important event that happened during the session.</Title>
                            <Text style={{ fontSize: 16, display: 'block' }}>{text}</Text> */}
                        </div>
                    </>
                }
            </>
        )
    }
}

export default Form.create()(ParentFeedback)

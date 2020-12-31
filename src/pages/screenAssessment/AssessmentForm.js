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
/* eslint-disable object-shorthand */
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
    Input,
    Form,
    Select,
    Button,
    Typography,
} from 'antd'
import { connect } from 'react-redux'
import Questions from './Questions'

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select
const layout = {
    labelCol: {
        span: 7,
    },
    wrapperCol: {
        span: 14,
    },
}
const tailLayout = {
    wrapperCol: {
        offset: 7,
        span: 14,
    },
}

@connect(({ screening }) => ({ screening }))
class AssessmentForm extends React.Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    onReset = () => {
        const { form } = this.props
        form.resetFields()
    }

    handleSubmit = e => {
        e.preventDefault()

        const { form, dispatch } = this.props

        form.validateFields((error, values) => {
            if (!error) {
                dispatch({
                    type: 'screening/CREATE_ASSESSMENT',
                    payload: {
                        values: values,
                    },
                })
                form.resetFields()
            }
        })
    }

    render() {
        const textStyle = {
            fontSize: '16px',
            lineHeight: '19px',
        }
        const { form, screening: { SelectedStep, showQuestions } } = this.props
        const { isAssesmentStarted } = this.state
        const itemStyle = { marginBottom: '10px' }

        if(showQuestions){
            return <Questions />
        }

        return (
            <>
                <Form {...layout} name="control-ref" onSubmit={e => this.handleSubmit(e)}>
                    <Form.Item label="Name" style={itemStyle}>
                        {form.getFieldDecorator('name', {
                            rules: [{ required: true, message: 'Please provide ClientId!' }],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="Age" style={itemStyle}>
                        {form.getFieldDecorator('age', {
                            rules: [{ required: true, message: 'Please provide age!' }],
                        })(<Input type="number" min={1} max={60} />)}
                    </Form.Item> 
                    <Form.Item label="Gender" style={itemStyle}>
                        {form.getFieldDecorator('gender', {
                            rules: [{ required: true, message: 'Please provide Date of Birth!' }],
                        })(
                            <Select placeholder="Who you are" allowClear>
                                <Option value="Male">Male</Option>
                                <Option value="Female">Female</Option>
                                <Option value="Other">Other</Option>
                            </Select>,
                        )}
                    </Form.Item>
                    <Form.Item label="Email" style={itemStyle}>
                        {form.getFieldDecorator('email', {
                            rules: [{ required: true, type: 'email', message: 'Please provide email!' }],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="Mobile no" style={itemStyle}>
                        {form.getFieldDecorator('mobileNo', {
                            rules: [{ message: 'Please provide Mobile No!' }],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="Address" style={itemStyle}>
                        {form.getFieldDecorator('address', { rules: [{ message: 'Please provide Address!' }] })(
                            <TextArea placeholder="Address" autoSize={{ minRows: 3 }} />,
                        )}
                    </Form.Item>
                                       
                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>

                        <Button htmlType="primary" onClick={this.onReset} className="ml-4">
                            cancel
                        </Button>
                    </Form.Item>
                </Form>
            </>
        )
    }
}

const Assessment = Form.create()(AssessmentForm)
export default Assessment

/* eslint-disable consistent-return */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/no-unused-state */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable array-callback-return */
import React from 'react'
import { Form, Input, Icon, Button, Select, message, InputNumber, notification, DatePicker, Checkbox } from 'antd'
import { Link, Redirect } from 'react-router-dom'
import { gql } from 'apollo-boost'
import './style.scss'
import apolloClient from '../../../../apollo/config'
import client from '../../../../config'
// import { GraphQLClient } from 'graphql-request'

const FormItem = Form.Item
const API_URL = process.env.REACT_APP_API_URL
const { Option } = Select
const blue = '#260fb6'
const orange = '#f17c00'

class RegisterFormComponent extends React.Component {
    state = {
        confirmDirty: false,
        languageList: [],
        LoginRedirect: false,
        loading: false
    }

    componentDidMount() {
        const query = `query {
            languages {
                id
                name
            }    
        }`

        client.request(query).then(data => {
            this.setState({
                languageList: data.languages,
            })
        })
    }

    LoginRedirectFun = e => {
        e.preventDefault()
        this.setState({
            LoginRedirect: true,
        })
    }

    handleSubmit = event => {
        event.preventDefault()
        const { form } = this.props
        form.validateFields((error, values) => {
            if (!error) {
                this.setState({
                    loading: true
                })
                console.log(values)
                apolloClient.mutate({
                    mutation: gql`mutation parentSignUp(
                        $email: String!
                        $firstname: String!
                        $lastname: String
                        $dob: Date!
                        $program: String
                        $language: ID!
                        $password: String!
                        $defaultProgram: Boolean
                        ) {
                        parentSignUp(input:{
                            email: $email
                            firstname: $firstname
                            lastname: $lastname
                            dob: $dob
                            level: $program
                            language: $language
                            password: $password
                            defaultProgram: $defaultProgram
                        }){
                            details{
                                id
                                firstname
                                lastname
                            }
                            message
                        }
                    }`,
                    variables: {
                        email: values.email,
                        firstname: values.firstname,
                        lastname: values.lastname,
                        dob: (values.dob).format('YYYY-MM-DD'),
                        program: values.program,
                        language: values.language,
                        password: values.password,
                        defaultProgram: values.defaultProgram,
                    },
                })
                .then(result => {
                    if (result.data.parentSignUp.details){
                        notification.success({
                            message: 'Sign Up Successful',
                            description: result.data.parentSignUp.message,
                        })
                    }
                    this.setState({
                        loading: false
                    })
                    form.resetFields()
                })
                .catch(errorGQL => {
                    errorGQL.graphQLErrors.map(item => {
                        notification.error({
                            message: 'Somthing want wrong',
                            description: item.message,
                        })
                    })
                    this.setState({
                        loading: false
                    })
                })
            }
        })
    }

    handleConfirmBlur = e => {
        const { value } = e.target
        const { confirmDirty } = this.state
        this.setState({
            confirmDirty: confirmDirty || !!value,
        })
    }

    compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!')
        } else {
            callback()
        }
    }

    validateToNextPassword = (rule, value, callback) => {
        const { form } = this.props
        const { confirmDirty } = this.state
        if (value && confirmDirty) {
            form.validateFields(['confirm'], { force: true })
        }
        callback()
    }

    render() {
        const { form } = this.props
        const { languageList, LoginRedirect, loading } = this.state
        const inputStyle = { paddingBottom: 0 }

        if (LoginRedirect) {
            return <Redirect to="/user/login" />
        }
        return (
            <Form onSubmit={this.handleSubmit} hideRequiredMark layout="vertical">
                <FormItem style={inputStyle}>
                    {form.getFieldDecorator('firstname', {
                        rules: [{ required: true, message: 'Please input your first name!' }],
                    })(
                        <Input
                            size="large"
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Please input your First Name"
                        />,
                    )}
                </FormItem>
                <FormItem style={inputStyle}>
                    {form.getFieldDecorator('lastname')(
                        <Input
                            size="large"
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Please input your Last Name"
                        />,
                    )}
                </FormItem>
                <FormItem style={inputStyle}>
                    {form.getFieldDecorator('email', {
                        rules: [{ type: 'email', required: true, message: 'Please input your email!' }],
                    })(
                        <Input
                            size="large"
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Please input your Email"
                        />,
                    )}
                </FormItem>
                <Form.Item style={inputStyle}>
                    {form.getFieldDecorator('dob', {
                        rules: [{ required: true, message: 'Please provide Date of Birth!' }],
                    })(<DatePicker size="large" placeholder="Date of Birth" style={{ borderRadius: 0, width: '100%' }} />)}
                </Form.Item>
                <Form.Item style={inputStyle}>
                    {form.getFieldDecorator('program')(
                        <Select placeholder="Program" allowClear size="large">
                            <Option value="Basic">Basic</Option>
                            <Option value="Intermediate">Intermediate</Option>
                            <Option value="Advanced">Advanced</Option>
                        </Select>,
                    )}
                </Form.Item>
                <Form.Item style={inputStyle}>
                    {form.getFieldDecorator('language', {
                        rules: [{ required: true, message: 'Please provide Default Language!' }],
                    })(
                        <Select placeholder="Select a default Language" allowClear size="large">
                            {languageList.map(item => (
                                <Option value={item.id}>{item.name}</Option>
                            ))}
                        </Select>,
                    )}
                </Form.Item>
                <FormItem style={inputStyle}>
                    {form.getFieldDecorator('password', {
                        rules: [{ required: true, }, { validator: this.validateToNextPassword, }]
                    })(
                        <Input
                            size="large"
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                            placeholder="Input your password"
                        />,
                    )}
                </FormItem>
                <FormItem style={inputStyle}>
                    {form.getFieldDecorator('confirm', {
                        rules: [{ required: true, }, { validator: this.compareToFirstPassword, },]
                    })(
                        <Input
                            size="large"
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                            onBlur={this.handleConfirmBlur}
                            placeholder="Confirm your password"
                        />,
                    )}
                </FormItem>
                <Form.Item style={inputStyle}>
                    {form.getFieldDecorator('defaultProgram', {
                        rules: [{ required: false, message: 'Please provide Default Program!' }],
                    })(<Checkbox size="large">Check to import Default Program</Checkbox>)}
                </Form.Item>
                <Form.Item>
                    <Button
                        htmlType="submit"
                        size="large"
                        loading={loading}
                        style={{
                            backgroundColor: orange,
                            borderColor: orange,
                            marginTop: '15px'
                        }}
                        onFocus={console.log('focus')}
                        block
                    >
                        Sign Up
            {/* <ArrowRightOutlined className="site-form-item-icon" /> */}
                    </Button>
                </Form.Item>

            </Form>
        )
    }
}

const RegisterForm = Form.create()(RegisterFormComponent)
export default RegisterForm

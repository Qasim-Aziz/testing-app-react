/* eslint-disable consistent-return */
import React from 'react'
import { Form, Input, Icon, Button, Select, message, InputNumber, notification } from 'antd'
import { Link, Redirect } from 'react-router-dom'
import './style.scss'
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
    CountryList: [],
    LoginRedirect: false,
    loading:false
  }

  componentDidMount() {
    const query = `query {
      country {
        edges {
          node {
            id
            name
          }
      }
    }
    }`

    client.request(query).then(data => {
      this.setState({
        CountryList: data.country.edges,
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
    const { timezone } = this.state
    form.validateFields((error, values) => {
      if (!error) {
        this.setState({
          loading:true
        })
        // console.log(values)
        values.timezone = timezone
          const signUpQuery = `mutation SignUp($name: String!, $password: String!, $email: String!, $country: String!, $learner: Int!) {
            signUp(input:{data:{
              name: $name,
              email: $email,
              country: $country,
              password: $password,
              noLearner: $learner
            }})
            {
              school{
                id,
                schoolName
              }
            }
          }`
          const variables = {
            name: values.school_name,
            password: values.password,
            email: values.email,
            country: values.country,
            learner: values.no_learner,
          }

          return client
            .request(signUpQuery, variables)
            .then(data => {
              notification.success({
                message: "You successfully Signup, Please check your mail for verification"
              })
              this.setState({
                LoginRedirect:true,
                loading:false
              })
            })
            .catch(err => {
              notification.error({
                message: err.response.errors[0].message,
                description: err.response.errors[0].message,
              })
              this.setState({
                loading:false
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
    const { CountryList, LoginRedirect, loading } = this.state
    const inputStyle = { paddingBottom: 0 }

    if (LoginRedirect) {
      return <Redirect to="/user/login" />
    }
    return (
      <Form onSubmit={this.handleSubmit} hideRequiredMark layout="vertical">
        <FormItem style={inputStyle}>
          {form.getFieldDecorator('school_name', {
            rules: [{ required: true, message: 'Please input your Clinic name!' }],
          })(
            <Input
              size="large"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Please input your Clinic name"
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
        <FormItem style={inputStyle}>
          {form.getFieldDecorator('country', {
            rules: [{ required: true, message: 'Please select your country' }],
          })(
            <Select
              size="large"
              type="select"
              id="user-country"
              showSearch
              style={{ width: '100%' }}
              placeholder="Select your country"
              optionFilterProp="children"
            >
              {CountryList.map(c => (
                <Option value={c.node.id}>{c.node.name}</Option>
              ))}
            </Select>,
          )}
        </FormItem>
        <FormItem style={inputStyle}>
          {form.getFieldDecorator('no_learner', {
            rules: [{ required: true, message: 'Please input your number of learner!' }],
          })(
            <Input
              type="number"
              size="large"
              min={1}
              style={{ width: '100%' }}
              placeholder="Please input your number learner"
            />,
          )}
        </FormItem>
        <FormItem style={inputStyle}>
          {form.getFieldDecorator('password', {
            rules: [
              {
                required: true,
              },
              {
                validator: this.validateToNextPassword,
              },
            ],
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
            rules: [
              {
                required: true,
              },
              {
                validator: this.compareToFirstPassword,
              },
            ],
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
          {/* <p style={{ marginTop: '10px' }}>
            <Link to="/user/login" className="utils__link--blue">
              {' '}
              Back to login
            </Link>
          </p> */}
        </Form.Item>
        {/* <div className="form-actions">
          <span className="ml-3 pull-right">
            <a
              href="javascript: void(0);"
              className="text-primary utils__link--underlined"
              onClick={this.LoginRedirectFun}
            >
              Login
            </a>{' '}
          </span>
        </div> */}
      </Form>
    )
  }
}

const RegisterForm = Form.create()(RegisterFormComponent)
export default RegisterForm

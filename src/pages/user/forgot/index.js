/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable consistent-return */
/* eslint-disable object-shorthand */
import React, { Component } from 'react'
import { Form, Input, Button, notification } from 'antd'
import { Helmet } from 'react-helmet'
import { Link, Redirect } from 'react-router-dom'
import { MailOutlined, KeyOutlined, ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import styles from './style.module.scss'
import client from '../../../config'

const API_URL = process.env.REACT_APP_API_URL
const blue = '#260fb6'
const orange = '#f17c00'

@Form.create()
class Forgot extends Component {
  state = {
    LoginRedirect: false,
    loading: false
  }

  handleSubmit = e => {
    e.preventDefault()
    const { form } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        this.setState({
          loading: true
        })
        const signUpQuery = `mutation {
                forgotPassword(input:{email:"${values.email}"})
                   {
                       status
                       message
                   }
            }`

        return client
          .request(signUpQuery)
          .then(data => {

            if (data.forgotPassword.status) {
              notification.success({
                message: data.forgotPassword.message,
                description: data.forgotPassword.message,
              })
              this.setState({
                loading: false,
                LoginRedirect: true
              })
            }
            else {
              notification.error({
                message: data.forgotPassword.message,
                description: data.forgotPassword.message,
              })
              this.setState({
                loading: false
              })
            }
          })
          .catch(err => {
            notification.error({
              message: err.response.errors[0].message,
              description: err.response.errors[0].message,
            })
            this.setState({
              loading: false
            })
          })
      }
    })
  }

  render() {
    const { form } = this.props
    const { LoginRedirect, loading } = this.state
    if (LoginRedirect) {
      return <Redirect to="/user/login" />
    }
    return (
      <div>
        <Helmet title="Forgot" />
        <div className={styles.block}>
          <div className="row">
            <div className="col-xl-12">
              <div className={styles.inner}>
                <div className={styles.form}>
                  <div align="center" className={styles.customLayout}>
                    <img
                      src="resources/images/HeaderLogo.png"
                      alt="HeaderLogo"
                      style={{
                        height: '70px',
                        borderRadius: '2px',
                        marginBottom: '60px',
                        marginTop: '50px'
                      }}
                    />
                  </div>
                  <h4 className="text-uppercase" align="center">
                    <strong>Forget Password</strong>
                  </h4>
                  <br />
                  <Form layout="vertical" hideRequiredMark onSubmit={this.handleSubmit}>
                    <Form.Item>
                      {form.getFieldDecorator('email', {
                        initialValue: '',
                        rules: [{ required: true, message: 'Please input your email' }],
                      })(
                        <Input
                          size="large"
                          placeholder="Enter your email"
                          prefix={<MailOutlined className="site-form-item-icon" />}
                        />,
                      )}
                    </Form.Item>
                    <div>
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
                        CONTINUE
                        <ArrowRightOutlined className="site-form-item-icon" />
                      </Button>
                    </div>
                    <div className="mb-2 mt-5">
                      <p align="center">
                        <Link
                          to="/user/login"
                          className="utils__link--blue"
                          style={{
                            width: '300px',
                            borderRadius: '5px',
                            display: 'inline-block',
                            padding: 6,
                            backgroundColor: blue,
                            color: '#fff',
                            marginTop: '20px'
                          }}
                        >
                          <ArrowLeftOutlined className="site-form-item-icon" />
                          {' '}
                          LOGIN
                        </Link>
                      </p>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Forgot

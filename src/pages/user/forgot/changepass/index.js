/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable prefer-destructuring */
/* eslint-disable consistent-return */
/* eslint-disable no-cond-assign */
import React, { Component } from 'react'
import { Form, Input, Button, notification } from 'antd'
import { Helmet } from 'react-helmet'
import { Link, Redirect } from 'react-router-dom'
import { MailOutlined, KeyOutlined, ArrowRightOutlined } from '@ant-design/icons'
import styles from '../style.module.scss'
import client from '../../../../config'

let token = null;

@Form.create()
class Forgot extends Component {
  state = {
    token:null,
    LoginRedirect: false,
    loading:false
  }

  componentDidMount() {
    if(this.props.location.search.split("=")[0] = '?token')
    {
      token = this.props.location.search.split("=")[1];
    }
    else
    {
      this.setState({
        LoginRedirect:true
      })
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    const { form } = this.props
    form.validateFields((error, values) => {
      if (!error) {
       
        this.setState({
          loading:true
        })

          const signUpQuery = `mutation {
              changePassword(input:{token:"${token}", password:"${values.password}"})
                 {
                     user
                     {
                         id
                     }
                 }
          }`

          return client
            .request(signUpQuery)
            .then(data => {
                notification.success({
                  message: "Your Password is Successfully Changed",
                  description: "Please login To continue",
                })
                this.setState({
                  loading:false,
                  LoginRedirect:true
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
                  <h4 className="text-uppercase" align="center">
                    <strong>Forget Password</strong>
                  </h4>
                  <br />
                  <Form layout="vertical" hideRequiredMark onSubmit={this.handleSubmit}>
                      <Form.Item>
                        {form.getFieldDecorator('password', {
                          initialValue: '',
                          rules: [{ required: true, message: 'Please password' },
                          {
                            validator: this.validateToNextPassword,
                          }],
                        })(
                          <Input
                            size="large"
                            placeholder="New Password"
                            prefix={<KeyOutlined className="site-form-item-icon" />}
                          />,
                        )}
                      </Form.Item>
                      <Form.Item>
                        {form.getFieldDecorator('re-password', {
                          initialValue: '',
                          rules: [{ required: true, message: 'Please re-type your password' },
                          {
                            validator: this.compareToFirstPassword,
                          }],
                        })(
                          <Input
                            size="large"
                            placeholder="Retype Password"
                            prefix={<KeyOutlined className="site-form-item-icon" />}
                          />,
                        )}
                      </Form.Item>
                    <div>
                      <Button type="primary" size="large" block htmlType="submit" loading={loading}>
                        CONTINUE
                        <ArrowRightOutlined className="site-form-item-icon" />
                      </Button>
                    </div>
                    <div className="mb-2 mt-5">
                      <Link to="/user/login" className="utils__link--blue utils__link--underlined">
                        Back to login
                      </Link>
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

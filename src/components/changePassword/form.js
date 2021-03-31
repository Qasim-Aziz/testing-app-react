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

import React from 'react'
import { Button, Switch, Form, Input, Icon, notification } from 'antd'
import gql from 'graphql-tag'
import apolloClient from '../../apollo/config'

class ChangePasswordForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      confirmDirty: false,
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);

        apolloClient
          .mutate({
            mutation: gql`
              mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
                changeUserPassword(input: { current: $oldPassword, new: $newPassword }) {
                  status
                  message
                  user {
                    id
                    username
                  }
                }
              }
            `,
            variables: {
              oldPassword: values.oldPassword,
              newPassword: values.password,
            },
          })
          .then(result => {
            notification.success({
              message: 'Success!',
              description: result.data.changeUserPassword.message,
            })
          })
          .catch(error => {
            notification.error({
              message: 'Somthing went wrong',
            })
          })
      }
    })
  }

  handleConfirmBlur = e => {
    const { value } = e.target
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
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
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props

    return (
      <div className="profileForm">
        <div className="profileTab-heading">
          <p>Change Password</p>
        </div>
        <Form onSubmit={this.handleSubmit} style={{ paddingTop: '2em' }}>
          <Form.Item
            label="Current Password"
            hasFeedback
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            className="form-label"
          >
            {getFieldDecorator('oldPassword', {
              rules: [
                {
                  required: true,
                  message: 'Please input your current password!',
                },
              ],
            })(<Input.Password />)}
          </Form.Item>
          <Form.Item
            label="New Password"
            hasFeedback
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            className="form-label"
          >
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: 'Please input your password!',
                },
                {
                  validator: this.validateToNextPassword,
                },
              ],
            })(<Input.Password />)}
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            hasFeedback
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            className="form-label"
          >
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                {
                  validator: this.compareToFirstPassword,
                },
              ],
            })(<Input.Password onBlur={this.handleConfirmBlur} />)}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Password
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default Form.create()(ChangePasswordForm)

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
/* eslint-disable object-shorthand */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */

import React from 'react'
import { Row, Col, Card, Button, DatePicker, Form, Input, Select, Typography } from 'antd'
import './assessment.scss'
import { connect } from 'react-redux'
import { FORM, SUBMITT_BUTTON, CANCEL_BUTTON } from 'assets/styles/globalStyles'

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select
const { layout, tailLayout } = FORM

@connect(({ user, cogniableassessment }) => ({ user, cogniableassessment }))
class Assessment extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  SubmitForm = e => {
    e.preventDefault()
    const { form, dispatch, onClose } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        console.log(values)
        dispatch({
          type: 'cogniableassessment/CREATE_ASSESSMENT',
          payload: {
            values: values,
            // studentId: values.student
            studentId: localStorage.getItem('studentId'),
          },
        })
        setTimeout(function() {
          onClose()
        }, 1000)
      }
    })
  }

  render() {
    const {
      form,
      cogniableassessment: { StudentsList, createFormLoading },
    } = this.props
    return (
      <>
        <Form
          {...layout}
          onSubmit={e => this.SubmitForm(e)}
          name="control-ref"
          style={{ marginLeft: 0, position: 'relative' }}
        >
          <Form.Item label="Title">
            {form.getFieldDecorator('title', {
              rules: [{ required: true, message: 'Please Select a title!' }],
            })(<Input placeholder="Enter Assessment Title" size="large" />)}
          </Form.Item>

          <Form.Item label="Note">
            {form.getFieldDecorator('note')(
              <TextArea
                style={{
                  resize: 'none',
                  width: '100%',
                  height: 100,
                }}
              />,
            )}
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button
              type="primary"
              htmlType="submit"
              style={SUBMITT_BUTTON}
              loading={createFormLoading}
            >
              Save Data
            </Button>
            {/* <Button
              type="ghost"
              style={CANCEL_BUTTON}
              onClick={() => this.props.closeAssessmentForm(false)}
            >
              Cancel
            </Button> */}
          </Form.Item>
        </Form>
      </>
    )
  }
}

export default Form.create()(Assessment)

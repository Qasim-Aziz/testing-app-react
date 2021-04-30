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
import { Row, Col, Divider, Button, DatePicker, Form, Input, Select, Typography } from 'antd'
import './assessment.scss'
import { connect } from 'react-redux'
import moment from 'moment'

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select

const layout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
}
const tailLayout = {
  wrapperCol: {
    offset: 5,
    span: 19,
  },
}

@connect(({ user, iisaassessment }) => ({ user, iisaassessment }))
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
          type: 'iisaassessment/CREATE_ASSESSMENT',
          payload: {
            values: values,
            studentId: localStorage.getItem('studentId'),
          },
        })
        // setTimeout(function(){ onClose(); }, 1000);
        this.props.onClose()
      }
    })
  }

  render() {
    const {
      form,
      iisaassessment: { createFormLoading },
    } = this.props
    const itemStyle = { marginBottom: '5px', fontWeight: 'bold' }
    const itemStyle1 = { textAlign: 'center', marginBottom: '5px', fontWeight: 'bold' }
    return (
      <>
        <Form {...layout} name="control-ref" onSubmit={e => this.SubmitForm(e)}>
          <Divider orientation="left">Mandatory Fields</Divider>

          <Form.Item label="Date" style={itemStyle}>
            {form.getFieldDecorator('date', {
              rules: [{ required: true, message: 'Please provide Date!' }],
            })(<DatePicker style={{ borderRadius: 0 }} />)}
          </Form.Item>

          <Form.Item label="Title" style={itemStyle}>
            {form.getFieldDecorator('title', {
              rules: [{ required: true, message: 'Please provide title!' }],
            })(<Input style={{ borderRadius: 0 }} />)}
          </Form.Item>
          <Divider orientation="left">Optional Fields</Divider>

          <Form.Item label="Note" style={itemStyle}>
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
            <Button type="primary" loading={createFormLoading} htmlType="submit" className="mt-4">
              Submit
            </Button>

            <Button type="default" onClick={this.onReset} className="ml-4">
              Reset
            </Button>
          </Form.Item>
        </Form>
      </>
    )
  }
}

export default Form.create()(Assessment)

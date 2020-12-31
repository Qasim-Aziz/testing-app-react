/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable object-shorthand */
import React from 'react'
import { Form, Input, Button, Select, DatePicker } from 'antd'
import moment from 'moment'
import { connect } from 'react-redux'

const { TextArea } = Input
const { Option } = Select
const tailLayout = {
  wrapperCol: {
    offset: 6,
    span: 14,
  },
}

// @connect(({ user, tickets }) => ({ user, tickets }))
class EditBasicInformation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
  //   const { form, tickets: { ticketDetails }} = this.props;

    form.setFieldsValue({
      subject: 'a',
      description: 'b'
    })
  }

  handleSubmit = e => {
    const {
      form,
      dispatch,
      staffs: { StaffProfile },
    } = this.props;
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'staffs/EDIT_STAFF',
          payload: {
            id: StaffProfile.id,
            values: values,
          },
        })
      }
    })
  }

  render() {
    const itemStyle = { marginBottom: '0' }
    const { form } = this.props

    return (
      <Form onSubmit={e => this.handleSubmit(e)}>
        <Form.Item label="Subject" style={itemStyle}>
          {form.getFieldDecorator('subject', {
            rules: [{ required: true, message: 'Please provide your Staff Id!' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Description" style={itemStyle}>
          {form.getFieldDecorator('description', {
            rules: [{ required: true, message: 'Please provide your Staff Id!' }],
          })(<Input />)}
        </Form.Item>

        <Form.Item>
          <Button style={{ width: '100%' }} type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

const EditBasicInformationForm = Form.create()(EditBasicInformation)

export default EditBasicInformationForm

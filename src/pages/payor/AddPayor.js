// export default AddPayor

/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable object-shorthand */
/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { Form, Input, Button, Select } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/payor/actions'

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 13,
  },
}
const tailLayout = {
  wrapperCol: {
    offset: 7,
    span: 14,
  },
}
const { TextArea } = Input

@connect(({ payor }) => ({ payor }))
class AddPayor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: actions.GET_PAYOR_CONTACT_TYPE,
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    const { form, dispatch } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        dispatch({
          type: actions.CREATE_PAYOR,
          payload: {
            values: values,
          },
        })
        this.props.closeDrawer()
        form.resetFields()
      }
    })
  }

  onReset = () => {
    const { form } = this.props
    form.resetFields()
  }

  render() {
    const { form, payors, contactTypes } = this.props
    const itemStyle = { marginBottom: '5px' }

    return (
      <Form {...layout} onSubmit={e => this.handleSubmit(e)}>
        <Form.Item label="First Name" style={itemStyle}>
          {form.getFieldDecorator('firstname', {
            rules: [{ required: true, message: 'Please provide your first name' }],
          })(<Input size="small" />)}
        </Form.Item>
        <Form.Item label="Last Name" style={itemStyle}>
          {form.getFieldDecorator('lastname', { initialValue: '' })(<Input size="small" />)}
        </Form.Item>
        <Form.Item label="Email" style={itemStyle}>
          {form.getFieldDecorator('email', {
            rules: [{ required: true, type: 'email', message: 'Please provide your email' }],
          })(<Input size="small" />)}
        </Form.Item>
        <Form.Item label="Description" style={itemStyle}>
          {form.getFieldDecorator('description', { initialValue: '' })(
            <TextArea placeholder="Description" autoSize={{ minRows: 3 }} size="small" />,
          )}
        </Form.Item>
        <Form.Item label="Contact Name." style={itemStyle}>
          {form.getFieldDecorator('contactType', {
            rules: [{ required: true, message: 'Please provide your Contact name' }],
          })(
            <Select size="small">
              {contactTypes.map(item => (
                <Select.Option value={item.id}>{item.name}</Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="City" style={itemStyle}>
          {form.getFieldDecorator('city', { initialValue: '' })(<Input size="small" />)}
        </Form.Item>
        <Form.Item label="State" style={itemStyle}>
          {form.getFieldDecorator('state', { initialValue: '' })(<Input size="small" />)}
        </Form.Item>
        <Form.Item label="Primary Location" style={itemStyle}>
          {form.getFieldDecorator('primaryLocation', { initialValue: '' })(<Input size="small" />)}
        </Form.Item>
        <Form.Item label="Home Phone" style={itemStyle}>
          {form.getFieldDecorator('homePhone', { initialValue: '' })(<Input size="small" />)}
        </Form.Item>
        <Form.Item label="Work Phone" style={itemStyle}>
          {form.getFieldDecorator('workPhone', { initialValue: '' })(<Input size="small" />)}
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
    )
  }
}

export default Form.create()(AddPayor)

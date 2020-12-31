/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable object-shorthand */
/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { Form, Input, Button, Select, DatePicker, notification } from 'antd'
import { connect } from 'react-redux'
import { gql } from 'apollo-boost'
import client from '../../apollo/config'

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

@connect(({ staffs, learners }) => ({ staffs, learners }))
class StaffBasicInfo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'staffs/GET_STAFF_DROPDOWNS',
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    const { form, dispatch } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        dispatch({
          type: 'staffs/CREATE_STAFF',
          payload: {
            values: values,
          },
        })
        this.props.CloseDrawer()
        form.resetFields()
      }
    })
  }

  onReset = () => {
    const { form } = this.props
    form.resetFields()
  }

  render() {
    const {
      form,
      staffs: { UserRole, clinicLocationList },
    } = this.props
    const itemStyle = { marginBottom: '5px' }

    return (
      <Form {...layout} onSubmit={e => this.handleSubmit(e)}>
        <Form.Item label="Staff ID" style={itemStyle}>
          {form.getFieldDecorator('staffId', {
            rules: [{ required: true, message: 'Please provide your Staff Id!' }],
          })(<Input size="small" />)}
        </Form.Item>
        <Form.Item label="Role" style={itemStyle}>
          {form.getFieldDecorator('role', {
            rules: [{ required: true, message: 'Please provide your Role' }],
          })(
            <Select size="small">
              {UserRole.map(item => (
                <Select.Option value={item.id}>{item.name}</Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Date of Joining" style={itemStyle}>
          {form.getFieldDecorator('dateOfJoining', {
            rules: [{ required: true, message: 'Please provide your Date of Joining!' }],
          })(<DatePicker size="small" />)}
        </Form.Item>

        <Form.Item label="Designation" style={itemStyle}>
          {form.getFieldDecorator('designation', { initialValue: '' })(<Input size="small" />)}
        </Form.Item>
        <Form.Item label="Clinic Location" style={itemStyle}>
          {form.getFieldDecorator('clinicLocation')(
            <Select size="small">
              {clinicLocationList.map(item => (
                <Select.Option value={item.node.id}>{item.node.location}</Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="First Name" style={itemStyle}>
          {form.getFieldDecorator('firstname', {
            rules: [{ required: true, message: 'Please provide your name' }],
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
        <Form.Item label="Gender" style={itemStyle}>
          {form.getFieldDecorator('gender', {
            rules: [{ required: true, message: 'Please select gender' }],
          })(
            <Select size="small">
              <Select.Option value="male">Male</Select.Option>
              <Select.Option value="female">Female</Select.Option>
              <Select.Option value="other">Other</Select.Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="D.O.B" style={itemStyle}>
          {form.getFieldDecorator('dob', {
            rules: [{ required: true, message: 'Please provide Date of Birth' }],
          })(<DatePicker />)}
        </Form.Item>
        <Form.Item label="Contact no." style={itemStyle}>
          {form.getFieldDecorator('contactNumber', { initialValue: '' })(<Input size="small" />)}
        </Form.Item>

        <Form.Item label="Address" style={itemStyle}>
          {form.getFieldDecorator('address', { initialValue: '' })(
            <TextArea placeholder="Address" autoSize={{ minRows: 3 }} size="small" />,
          )}
        </Form.Item>

        <Form.Item label="Street Address" style={itemStyle}>
          {form.getFieldDecorator('street', { rules: [{ message: 'Please provide Street Name' }] })(
            <Input placeholder="Street Address" size="small" />,
          )}
        </Form.Item>

        <Form.Item label="State" style={itemStyle}>
          {form.getFieldDecorator('state', { rules: [{ message: 'Please provide State' }] })(
            <Input placeholder="State" size="small" />,
          )}
        </Form.Item>

        <Form.Item label="City" style={itemStyle}>
          {form.getFieldDecorator('city', { rules: [{ message: 'Please provide City' }] })(
            <Input placeholder="City" size="small" />,
          )}
        </Form.Item>

        <Form.Item label="Country" style={itemStyle}>
          {form.getFieldDecorator('country', { rules: [{ message: 'Please provide Country' }] })(
            <Input placeholder="Country" size="small" />,
          )}
        </Form.Item>
        <Form.Item label="Pincode" style={itemStyle}>
          {form.getFieldDecorator('pincode', { rules: [{ message: 'Please provide pincode' }] })(
            <Input placeholder="Pincode" size="small" style={{ borderRadius: 0 }} />,
          )}
        </Form.Item>

        <Form.Item label="Marital Status" style={itemStyle}>
          {form.getFieldDecorator('meritalStatus', { initialValue: '' })(
            <Select size="small">
              <Select.Option value="Single">Single</Select.Option>
              <Select.Option value="Married">Married</Select.Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Emergency Contact Name" style={itemStyle}>
          {form.getFieldDecorator('emergencyName', { initialValue: '' })(<Input size="small" />)}
        </Form.Item>
        <Form.Item label="Emergency Contact Relation" style={itemStyle}>
          {form.getFieldDecorator('emergencyRelation', { initialValue: '' })(
            <Input size="small" />,
          )}
        </Form.Item>
        <Form.Item label="Emergency contact no." style={itemStyle}>
          {form.getFieldDecorator('emergencyContactNumber', { initialValue: '' })(
            <Input size="small" />,
          )}
        </Form.Item>
        <Form.Item label="Qualification" style={itemStyle}>
          {form.getFieldDecorator('qualification', { initialValue: '' })(<Input size="small" />)}
        </Form.Item>
        <Form.Item label="Work Exprience" style={itemStyle}>
          {form.getFieldDecorator('workExprience', { initialValue: '' })(<Input size="small" />)}
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

const StaffBasicInfoForm = Form.create()(StaffBasicInfo)
export default StaffBasicInfoForm

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

@connect(({ user, staffs }) => ({ user, staffs }))
class EditBasicInformation extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    const {
      form,
      staffs: { StaffProfile },
    } = this.props;

    form.setFieldsValue({
      staffId: StaffProfile.employeeId,
      dateOfJoining: moment(StaffProfile.dateOfJoining),
      designation: StaffProfile.designation,
      role: StaffProfile.userRole.id,
      clinicLocation: StaffProfile.clinicLocation ? StaffProfile.clinicLocation.id : null,
      firstname: StaffProfile.name,
      lastname: StaffProfile.surname,
      email: StaffProfile.email,
      gender: StaffProfile.gender,
      contactNumber: StaffProfile.contactNo,
      address: StaffProfile.localAddress,
      dob: moment(StaffProfile.dob),
      qualification: StaffProfile.qualification,
      emergencyName: StaffProfile.emergencyName,
      emergencyContactNumber: StaffProfile.emergencyContact,
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

  // onReset = () => {
  //   const { form, CloseDrawer } = this.props
  //   form.resetFields()
  // }

  render() {
    const itemStyle = { marginBottom: '0' }
    const {
      form,
      staffs: { UserRole, clinicLocationList },
    } = this.props

    return (
      <Form onSubmit={e => this.handleSubmit(e)}>
        <Form.Item label="Staff ID" style={itemStyle}>
          {form.getFieldDecorator('staffId', {
            rules: [{ required: true, message: 'Please provide your Staff Id!' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Role" style={itemStyle}>
          {form.getFieldDecorator('role', {
            rules: [{ required: true, message: 'Please provide your Role' }],
          })(
            <Select>
              {UserRole.map(item => (
                <Select.Option value={item.id}>{item.name}</Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Date of Joining" style={itemStyle}>
          {form.getFieldDecorator('dateOfJoining', {
            rules: [{ required: true, message: 'Please provide your Date of Joining!' }],
          })(<DatePicker />)}
        </Form.Item>

        <Form.Item label="Designation" style={itemStyle}>
          {form.getFieldDecorator('designation', { initialValue: '' })(<Input />)}
        </Form.Item>
        <Form.Item label="Clinic Location" style={itemStyle}>
          {form.getFieldDecorator('clinicLocation')(
            <Select>
              {clinicLocationList.map(item => (
                <Select.Option value={item.node.id}>{item.node.location}</Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="First Name" style={itemStyle}>
          {form.getFieldDecorator('firstname', {
            rules: [{ required: true, message: 'Please provide your name' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Last Name" style={itemStyle}>
          {form.getFieldDecorator('lastname', { initialValue: '' })(<Input />)}
        </Form.Item>
        <Form.Item label="Email" style={itemStyle}>
          {form.getFieldDecorator('email', {
            rules: [{ required: true, type: 'email', message: 'Please provide your email' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Gender" style={itemStyle}>
          {form.getFieldDecorator('gender', {
            rules: [{ required: true, message: 'Please select gender' }],
          })(
            <Select>
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
          {form.getFieldDecorator('contactNumber', { initialValue: '' })(<Input />)}
        </Form.Item>

        <Form.Item label="Address" style={itemStyle}>
          {form.getFieldDecorator('address', { initialValue: '' })(
            <TextArea placeholder="Address" autoSize={{ minRows: 3 }} />,
          )}
        </Form.Item>

        <Form.Item label="Street Address" style={itemStyle}>
          {form.getFieldDecorator('street', { rules: [{ message: 'Please provide Street Name' }] })(
            <Input placeholder="Street Address" size="small" style={{ borderRadius: 0 }} />,
          )}
        </Form.Item>

        <Form.Item label="State" style={itemStyle}>
          {form.getFieldDecorator('state', { rules: [{ message: 'Please provide State' }] })(
            <Input placeholder="State" size="small" style={{ borderRadius: 0 }} />,
          )}
        </Form.Item>

        <Form.Item label="City" style={itemStyle}>
          {form.getFieldDecorator('city', { rules: [{ message: 'Please provide City' }] })(
            <Input placeholder="City" size="small" style={{ borderRadius: 0 }} />,
          )}
        </Form.Item>

        <Form.Item label="Country" style={itemStyle}>
          {form.getFieldDecorator('country', { rules: [{ message: 'Please provide Country' }] })(
            <Input placeholder="Country" size="small" style={{ borderRadius: 0 }} />,
          )}
        </Form.Item>
        <Form.Item label="Pincode" style={itemStyle}>
          {form.getFieldDecorator('pincode', { rules: [{ message: 'Please provide pincode' }] })(
            <Input placeholder="Pincode" size="small" style={{ borderRadius: 0 }} />,
          )}
        </Form.Item>



        <Form.Item label="Marital Status" style={itemStyle}>
          {form.getFieldDecorator('meritalStatus', { initialValue: '' })(
            <Select>
              <Select.Option value="Single">Single</Select.Option>
              <Select.Option value="Married">Married</Select.Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Emergency Contact Name" style={itemStyle}>
          {form.getFieldDecorator('emergencyName', { initialValue: '' })(<Input />)}
        </Form.Item>
        <Form.Item label="Emergency Contact Relation" style={itemStyle}>
          {form.getFieldDecorator('emergencyRelation', { initialValue: '' })(<Input />)}
        </Form.Item>
        <Form.Item label="Emergency contact no." style={itemStyle}>
          {form.getFieldDecorator('emergencyContactNumber', { initialValue: '' })(<Input />)}
        </Form.Item>
        <Form.Item label="Qualification" style={itemStyle}>
          {form.getFieldDecorator('qualification', { initialValue: '' })(<Input />)}
        </Form.Item>
        <Form.Item label="Work Exprience" style={itemStyle}>
          {form.getFieldDecorator('workExprience', { initialValue: '' })(<Input />)}
        </Form.Item>

        <Form.Item>
          <Button style={{ width: '100%' }} type="primary" htmlType="submit">
            Save
          </Button>

          {/* <Button htmlType="primary" onClick={this.onReset} className="ml-4">
            cancel
          </Button> */}
        </Form.Item>
      </Form>
    )
  }
}

const EditBasicInformationForm = Form.create()(EditBasicInformation)

export default EditBasicInformationForm

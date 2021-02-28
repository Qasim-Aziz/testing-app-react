/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable object-shorthand */
import React from 'react'
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Divider,
  Tag,
  Checkbox,
  Icon,
  message,
} from 'antd'
import moment from 'moment'
import { connect } from 'react-redux'
import axios from 'axios'
import AntdTag from '../antdTag'

const { TextArea } = Input
const { Option } = Select
const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
}
const layout1 = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
}
const tailLayout = {
  wrapperCol: {
    offset: 6,
    span: 18,
  },
}

@connect(({ user, staffs }) => ({ user, staffs }))
class EditBasicInformation extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  state = {
    roleTag: null,
    designationTag: null,
    qualificationTag: null,
    clinicLocationTag: null,
    selectedFile: null,
    userProfileID: null,
    tagArray: [],
    defaultTags: [],
  }

  componentDidMount() {
    const {
      form,
      staffs: { StaffProfile },
    } = this.props
    console.log('staff profile', StaffProfile)
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
      tags: StaffProfile.tags,
    })

    this.setState({
      roleTag: StaffProfile.userRole.name,
      designationTag: StaffProfile.designation,
      qualificationTag: StaffProfile.qualification,
      clinicLocationTag: StaffProfile.clinicLocation
        ? StaffProfile.clinicLocation.location
        : 'No Location Set',
      userProfileID: StaffProfile.id,
      defaultTags: StaffProfile.tags,
      tagArray: StaffProfile.tags && StaffProfile.tags.length > 0 ? StaffProfile.tags : [],
    })
  }

  handleSubmit = e => {
    const {
      form,
      dispatch,
      staffs: { StaffProfile },
    } = this.props
    e.preventDefault()

    let token = ''
    if (!(localStorage.getItem('token') === null) && localStorage.getItem('token')) {
      token = JSON.parse(localStorage.getItem('token'))
    }
    const headers = {
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
      database: 'india',
      Authorization: token ? `JWT ${token}` : '',
    }
    const data = new FormData()
    data.append('resume', this.state.selectedFile)
    data.append('pk', this.state.userProfileID)
    form.validateFields((err, values) => {
      if (!err) {
        axios
          .post('https://application.cogniable.us/apis/staff-docs/', data, { headers: headers })
          .then(res => {
            // then print response status
            console.log(res.statusText)
            values = { ...values, tags: this.state.tagArray }
            console.log('values in edit', values)
            message.success('Upload Successfully.')
            dispatch({
              type: 'staffs/EDIT_STAFF',
              payload: {
                id: StaffProfile.id,
                values: values,
              },
            })
          })
          .catch(err1 => {
            console.error({ err1 })
            message.error('upload Failed.')
            return false
          })
      }
    })
  }

  onChangeHandler = event => {
    this.setState({
      selectedFile: event.target.files[0],
    })
  }

  tagArrayHandler = tags => {
    this.setState({
      tagArray: tags,
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
    const itemStyle1 = { textAlign: 'center', marginBottom: '5px', fontWeight: 'bold' }
    const { defaultTags } = this.state

    return (
      <Form {...layout} onSubmit={e => this.handleSubmit(e)}>
        <Form.Item {...layout1} label="Profile" style={itemStyle1}>
          <Tag>{this.state.roleTag}</Tag>
          <Tag>{this.state.designationTag}</Tag>
          <Tag>{this.state.qualificationTag}</Tag>
          <Tag>{this.state.clinicLocationTag}</Tag>
        </Form.Item>

        <Divider orientation="left">Mandatory Fields</Divider>
        <Form.Item label="Staff ID" style={itemStyle}>
          {form.getFieldDecorator('staffId', {
            rules: [{ required: true, message: 'Please provide your Staff Id!' }],
          })(<Input size="medium" />)}
        </Form.Item>
        <Form.Item label="Role" style={itemStyle}>
          {form.getFieldDecorator('role', {
            rules: [{ required: true, message: 'Please provide your Role' }],
          })(
            <Select size="medium">
              {UserRole.map(item => (
                <Select.Option value={item.id}>{item.name}</Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>

        <Form.Item label="First Name" style={itemStyle}>
          {form.getFieldDecorator('firstname', {
            rules: [{ required: true, message: 'Please provide your name' }],
          })(<Input size="medium" />)}
        </Form.Item>
        <Form.Item label="Last Name" style={itemStyle}>
          {form.getFieldDecorator('lastname', {
            rules: [{ required: true, message: 'Please provide your last name' }],
            initialValue: '',
          })(<Input size="medium" />)}
        </Form.Item>
        <Form.Item label="Email" style={itemStyle}>
          {form.getFieldDecorator('email', {
            rules: [{ required: true, type: 'email', message: 'Please provide your email' }],
          })(<Input size="medium" />)}
        </Form.Item>
        <Form.Item label="Gender" style={itemStyle}>
          {form.getFieldDecorator('gender', {
            rules: [{ required: true, message: 'Please select gender' }],
          })(
            <Select size="medium">
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
        <Form.Item label="Date of Joining" style={itemStyle}>
          {form.getFieldDecorator('dateOfJoining', {
            rules: [{ required: true, message: 'Please provide your Date of Joining!' }],
          })(<DatePicker size="medium" />)}
        </Form.Item>

        <Divider orientation="left">Personal Details</Divider>

        <Form.Item label="Designation" style={itemStyle}>
          {form.getFieldDecorator('designation', { initialValue: '' })(<Input size="medium" />)}
        </Form.Item>
        <Form.Item label="Marital Status" style={itemStyle}>
          {form.getFieldDecorator('meritalStatus', { initialValue: '' })(
            <Select size="medium">
              <Select.Option value="Single">Single</Select.Option>
              <Select.Option value="Married">Married</Select.Option>
            </Select>,
          )}
        </Form.Item>
        <Divider orientation="left">Contact Details</Divider>
        <Form.Item label="Emergency Contact Name" style={itemStyle}>
          {form.getFieldDecorator('emergencyName', {
            rules: [{ required: false, message: 'Please provide Emergency Contact Name' }],
            initialValue: '',
          })(<Input size="medium" />)}
        </Form.Item>
        <Form.Item label="Emergency Contact Relation" style={itemStyle}>
          {form.getFieldDecorator('emergencyRelation', {
            rules: [{ required: false, message: 'Please provide Emergency Contact Relation' }],
            initialValue: '',
          })(<Input size="medium" />)}
        </Form.Item>
        <Form.Item label="Emergency contact no." style={itemStyle}>
          {form.getFieldDecorator('emergencyContactNumber', {
            rules: [{ required: false, message: 'Please provide Emergency Contact Relation' }],
            initialValue: '',
          })(<Input size="medium" />)}
        </Form.Item>
        <Form.Item label="Contact no." style={itemStyle}>
          {form.getFieldDecorator('contactNumber', {
            rules: [{ required: false, message: 'Please provide your Contact no.!' }],
            initialValue: '',
          })(<Input size="medium" />)}
        </Form.Item>
        {/* <Form.Item label="Address" style={itemStyle}>
          {form.getFieldDecorator('address', {
            required: true,
            message: 'Please provide Address',
            initialValue: '',
          })(<TextArea placeholder="Address" autoSize={{ minRows: 3 }} size="medium" />)}
        </Form.Item> */}
        <Form.Item label="Street Address" style={itemStyle}>
          {form.getFieldDecorator('street', { rules: [{ message: 'Please provide Street Name' }] })(
            <Input placeholder="Street Address" size="medium" style={{ borderRadius: 0 }} />,
          )}
        </Form.Item>
        <Form.Item label="State" style={itemStyle}>
          {form.getFieldDecorator('state', { rules: [{ message: 'Please provide State' }] })(
            <Input placeholder="State" size="medium" style={{ borderRadius: 0 }} />,
          )}
        </Form.Item>
        <Form.Item label="City" style={itemStyle}>
          {form.getFieldDecorator('city', { rules: [{ message: 'Please provide City' }] })(
            <Input placeholder="City" size="medium" style={{ borderRadius: 0 }} />,
          )}
        </Form.Item>
        <Form.Item label="Country" style={itemStyle}>
          {form.getFieldDecorator('country', { rules: [{ message: 'Please provide Country' }] })(
            <Input placeholder="Country" size="medium" style={{ borderRadius: 0 }} />,
          )}
        </Form.Item>
        <Form.Item label="Pincode" style={itemStyle}>
          {form.getFieldDecorator('pincode', { rules: [{ message: 'Please provide pincode' }] })(
            <Input placeholder="Pincode" size="medium" style={{ borderRadius: 0 }} />,
          )}
        </Form.Item>
        <Form.Item label="Qualification" style={itemStyle}>
          {form.getFieldDecorator('qualification', {
            rules: [{ required: false, message: 'Please provide Qualification' }],
            initialValue: '',
          })(<Input size="medium" />)}
        </Form.Item>
        <Form.Item label="Work Exprience" style={itemStyle}>
          {form.getFieldDecorator('workExprience', {
            rules: [{ required: false, message: 'Please provide Work Experience' }],
            initialValue: '',
          })(<Input size="medium" />)}
        </Form.Item>

        <Divider orientation="left">Misc details</Divider>

        <Form.Item label="Tags" style={itemStyle}>
          {console.log('TAG ARRAY', defaultTags, this.state.tagArray)}
          {form.getFieldDecorator('tags')(
            <AntdTag
              style={itemStyle}
              changeTagsHandler={this.tagArrayHandler}
              closeable="true"
              tagArray={this.state.tagArray}
              defaultVal={defaultTags}
            />,
          )}
        </Form.Item>

        <Form.Item label="Clinic Location" style={itemStyle}>
          {form.getFieldDecorator('clinicLocation')(
            <Select size="medium">
              {clinicLocationList.map(item => (
                <Select.Option value={item.node.id}>{item.node.location}</Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>

        <Form.Item label="Upload Your Documents" style={itemStyle}>
          <input type="file" name="file" onChange={this.onChangeHandler} />
        </Form.Item>

        <Form.Item {...tailLayout} style={{ marginTop: '10px' }}>
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

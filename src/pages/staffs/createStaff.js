/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable object-shorthand */
/* eslint-disable react/destructuring-assignment */
import React from 'react'
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  notification,
  Divider,
  Upload,
  message,
  Tag,
} from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { gql } from 'apollo-boost'
import client from '../../apollo/config'
import AntdTag from './antdTag'

const { Dragger } = Upload

const props1 = {
  name: 'file',
  multiple: true,
  action: '#',
  onChange(info) {
    const { status } = info.file
    if (status !== 'uploading') {
      console.log(info.file, info.fileList)
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`)
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`)
    }
  },
}

const layout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 18,
  },
}
const layout1 = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 18,
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

    this.tagArrayHandler = this.tagArrayHandler.bind(this)
  }

  state = {
    selectedFile: null,
    tagArray: [],
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
    const data = new FormData()
    data.append('resume', this.state.selectedFile)
    data.append('tags', this.state.tagArray)
    form.validateFields((error, values) => {
      console.log('data', data)
      const newValues = {
        ...values,
        tags: this.state.tagArray,
      }
      console.log('values', newValues)
      if (!error) {
        dispatch({
          type: 'staffs/CREATE_STAFF',
          payload: {
            values: newValues,
            data: data,
          },
        })
        this.props.CloseDrawer()
        form.resetFields()
      }
    })
  }

  tagArrayHandler = tags => {
    this.setState({
      tagArray: tags,
    })
  }

  onChangeHandler = event => {
    console.log(event.target.files[0])
    this.setState({
      selectedFile: event.target.files[0],
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
    const itemStyle = { marginBottom: '5px', fontWeight: 'bold' }
    const itemStyle1 = { textAlign: 'center', marginBottom: '5px', fontWeight: 'bold' }
    return (
      <Form {...layout} onSubmit={e => this.handleSubmit(e)}>
        <Form.Item {...layout1} label="Profile" style={itemStyle1}>
          <div>
            <img
              src="https://www.thewodge.com/wp-content/uploads/2019/11/avatar-icon.png"
              alt="avatar"
              className="avatarlogo"
            />
          </div>
          <Tag>Role</Tag>
          <Tag>Designation</Tag>
          <Tag>Qualification</Tag>
          <Tag>Location</Tag>
        </Form.Item>

        <Form.Item label="Tags" style={itemStyle}>
          {console.log('TAG ARRAY', this.state.tagArray)}
          {form.getFieldDecorator('tags')(
            <AntdTag
              style={itemStyle}
              changeTagsHandler={this.tagArrayHandler}
              tagArray={this.state.tagArray}
              closeable="true"
              defaultVal={[]}
            />,
          )}
        </Form.Item>
        <Divider orientation="left">Mandatory Fields</Divider>
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
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
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
          {form.getFieldDecorator('lastname', {
            rules: [{ required: true, message: 'Please provide your last name' }],
            initialValue: '',
          })(<Input />)}
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
        <Form.Item label="Date of Joining" style={itemStyle}>
          {form.getFieldDecorator('dateOfJoining', {
            rules: [{ required: true, message: 'Please provide your Date of Joining!' }],
          })(<DatePicker />)}
        </Form.Item>

        <Divider orientation="left">Personal Details</Divider>

        <Form.Item label="Designation" style={itemStyle}>
          {form.getFieldDecorator('designation', { initialValue: '' })(<Input />)}
        </Form.Item>
        <Form.Item label="Marital Status" style={itemStyle}>
          {form.getFieldDecorator('meritalStatus', { initialValue: '' })(
            <Select>
              <Select.Option value="Single">Single</Select.Option>
              <Select.Option value="Married">Married</Select.Option>
            </Select>,
          )}
        </Form.Item>

        <Form.Item label="Qualification" style={itemStyle}>
          {form.getFieldDecorator('qualification', {
            rules: [{ required: false, message: 'Please provide Qualification' }],
            initialValue: '',
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Work Experience" style={itemStyle}>
          {form.getFieldDecorator('workExprience', {
            rules: [{ required: false, message: 'Please provide Work Experience' }],
            initialValue: '',
          })(<Input />)}
        </Form.Item>

        <Divider orientation="left">Contact Details</Divider>
        <Form.Item label="Emergency Contact Name" style={itemStyle}>
          {form.getFieldDecorator('emergencyName', {
            rules: [{ required: false, message: 'Please provide Emergency Contact Name' }],
            initialValue: '',
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Emergency Contact Relation" style={itemStyle}>
          {form.getFieldDecorator('emergencyRelation', {
            rules: [{ required: false, message: 'Please provide Emergency Contact Relation' }],
            initialValue: '',
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Emergency contact no." style={itemStyle}>
          {form.getFieldDecorator('emergencyContactNumber', {
            rules: [{ required: false, message: 'Please provide Emergency Contact Relation' }],
            initialValue: '',
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Contact no." style={itemStyle}>
          {form.getFieldDecorator('contactNumber', {
            rules: [{ required: false, message: 'Please provide your Contact no.!' }],
            initialValue: '',
          })(<Input />)}
        </Form.Item>
        {/* <Form.Item label="Address" style={itemStyle}>
          {form.getFieldDecorator('address', {
            required: false,
            message: 'Please provide Address',
            initialValue: '',
          })(<TextArea placeholder="Address" autoSize={{ minRows: 3 }}  />)}
        </Form.Item> */}

        <Form.Item label="Street Address" style={itemStyle}>
          {form.getFieldDecorator('street', { rules: [{ message: 'Please provide Street Name' }] })(
            <Input placeholder="Street Address" />,
          )}
        </Form.Item>

        <Form.Item label="State" style={itemStyle}>
          {form.getFieldDecorator('state', { rules: [{ message: 'Please provide State' }] })(
            <Input placeholder="State" />,
          )}
        </Form.Item>

        <Form.Item label="City" style={itemStyle}>
          {form.getFieldDecorator('city', { rules: [{ message: 'Please provide City' }] })(
            <Input placeholder="City" />,
          )}
        </Form.Item>
        <Form.Item label="Country" style={itemStyle}>
          {form.getFieldDecorator('country', { rules: [{ message: 'Please provide Country' }] })(
            <Input placeholder="Country" />,
          )}
        </Form.Item>
        <Form.Item label="Pincode" style={itemStyle}>
          {form.getFieldDecorator('pincode', { rules: [{ message: 'Please provide pincode' }] })(
            <Input placeholder="Pincode" style={{ borderRadius: 0 }} />,
          )}
        </Form.Item>

        <Divider orientation="left">Misc details</Divider>

        <Form.Item label="Clinic Location" style={itemStyle}>
          {form.getFieldDecorator('clinicLocation')(
            <Select>
              {clinicLocationList.map(item => (
                <Select.Option key={item.node.id} value={item.node.id}>
                  {item.node.location}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>

        <Form.Item label="Upload Your Documents" style={itemStyle}>
          <input type="file" name="file" onChange={this.onChangeHandler} />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" className="mt-4">
            Submit
          </Button>

          <Button type="primary" onClick={this.onReset} className="ml-4">
            cancel
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

const StaffBasicInfoForm = Form.create()(StaffBasicInfo)
export default StaffBasicInfoForm

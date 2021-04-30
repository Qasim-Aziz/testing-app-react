/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable object-shorthand */
/* eslint-disable */
import React from 'react'

import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Divider,
  Upload,
  Tag,
  Checkbox,
  Icon,
  message,
} from 'antd'
import moment from 'moment'
import { connect } from 'react-redux'
import axios from 'axios'
import AntdTag from '../../staffs/antdTag'

const { TextArea } = Input
const { Option } = Select
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
    offset: 5,
    span: 18,
  },
}

@connect(({ user, leaders }) => ({ user, leaders }))
class EditBasicInformation extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  state = {
    userProfileID: null,
    // tagArray: [],
  }

  componentDidMount() {
    console.log('THE PROPS ')
    const {
      form,
      leaders: { UserProfile },
    } = this.props

    console.log('THE IS USERPROFILE', UserProfile)
    console.log('THE IS US', this.props)
    form.setFieldsValue({
      email: UserProfile.user.email,
      firstName: UserProfile.user.firstName,
      lastName: UserProfile.user.lastName,
      mobileNo: UserProfile.phone,
      leadStatus: UserProfile.leadStatus,
      projectName: UserProfile.projectName,
    })

    this.setState({
      userProfileID: UserProfile.id,
    })
  }

  handleSubmit = e => {
    const {
      form,
      dispatch,
      leaders: { UserProfile },
    } = this.props
    e.preventDefault()
    const data = new FormData()
    // data.append('file', this.state.selectedFile)
    data.append('pk', this.state.userProfileID)
    console.log('THE DATA', data)
    form.validateFields((err, values) => {
      console.log('THE VALUES in edit form', err, values)
      // values = { ...values, tags: this.state.tagArray }
      message.success('Upload Successfully.')
      dispatch({
        type: 'leaders/EDIT_LEADER',
        payload: {
          id: UserProfile.id,
          user_id: UserProfile.user.id,
          values: values,
        },
      })
    })
    // this.props.onCloseEdit()
  }

  render() {
    console.log('THE PROPS in EDIT-BASIC-INFO====> initially in render \n', this.props)
    console.log('THE STATE in EDIT-BASIC-INFO====> initially in render \n', this.state)
    const itemStyle = { marginBottom: '5px', fontWeight: 'bold' }
    const {
      form,
      leaders: { clinicLocationList, categoryList, staffDropdownList, languageList },
    } = this.props
    const itemStyle1 = { marginBottom: '5px', fontWeight: 'bold' }
    // console.log(this.props.form, 'pppp')
    console.log('THE PROPS in EDIT-BASIC-INFO====> END of render \n', this.props)
    console.log('THE STATE in EDIT-BASIC-INFO====> END of render \n', this.state)
    return (
      <div>
        <Form {...layout} onSubmit={e => this.handleSubmit(e)}>
          <Divider orientation="left">Mandatory Fields</Divider>

          <Form.Item label="First Name" style={itemStyle}>
            {form.getFieldDecorator('firstName', {
              rules: [{ required: true, message: 'Please provide firstName!' }],
            })(<Input style={{ borderRadius: 0 }} />)}
          </Form.Item>
          <Form.Item label="Last Name" style={itemStyle}>
            {form.getFieldDecorator('lastName', {
              rules: [{ required: false, message: 'Please provide lastName!' }],
            })(<Input style={{ borderRadius: 0 }} />)}
          </Form.Item>
          <Form.Item label="Email" style={itemStyle}>
            {form.getFieldDecorator('email', {
              rules: [{ required: true, type: 'email', message: 'Please provide email!' }],
            })(<Input style={{ borderRadius: 0 }} />)}
          </Form.Item>

          <Form.Item label="Mobile no" style={itemStyle}>
            {form.getFieldDecorator('mobileNo', {
              rules: [{ required: true, message: 'Please provide Mobile No!' }],
            })(<Input style={{ borderRadius: 0 }} />)}
          </Form.Item>

          <Form.Item label="Status" style={itemStyle}>
            {form.getFieldDecorator('leadStatus', {
              rules: [{ required: true, message: 'Please provide Status of the user' }],
            })(
              <Select placeholder="Status" allowClear>
                <Select.Option value="NEW">NEW</Select.Option>
                <Select.Option value="CONTACTED">CONTACTED</Select.Option>
                <Select.Option value="INTRESTED">INTRESTED</Select.Option>
                <Select.Option value="UNDER_REVIEW">UNDER REVIEW</Select.Option>
                <Select.Option value="DEMO">DEMO</Select.Option>
                <Select.Option value="CONVERTED">CONVERTED</Select.Option>
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="Project Name" style={itemStyle}>
            {form.getFieldDecorator('projectName', {
              rules: [{ required: true, message: 'Please provide Project Name' }],
            })(
              <Select placeholder="Project Name" allowClear>
                <Option value="PROJECT_1">Project_1</Option>
                <Option value="PROJECT_2">Project_2</Option>
                <Option value="PROJECT_3">Project_3</Option>
              </Select>,
            )}
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button style={{ width: '100%' }} type="primary" htmlType="submit">
              Save
            </Button>
            {/* <Button htmlType="primary" onClick={this.onReset} className="ml-4">
            cancel
          </Button> */}
          </Form.Item>
        </Form>
      </div>
    )
  }
}

const EditBasicInformationForm = Form.create()(EditBasicInformation)

export default EditBasicInformationForm

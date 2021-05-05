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
import { CANCEL_BUTTON, SUBMITT_BUTTON } from 'assets/styles/globalStyles'

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

@connect(({ user, leaders, staffs }) => ({ user, leaders, staffs }))
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
    const {
      form,
      leaders: { UserProfile },
    } = this.props

    console.log(this.props, 'this props')
    const tempTherapist = UserProfile.therapist.edges.map(({ node }) => node.id)
    console.log(tempTherapist, 'temp Therpoa')
    form.setFieldsValue({
      email: UserProfile.email,
      firstName: UserProfile.name,
      lastName: UserProfile.surname,
      mobileNo: UserProfile.phone,
      leadStatus: UserProfile.leadStatus,
      therapist: tempTherapist,
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
    data.append('pk', this.state.userProfileID)
    form.validateFields((err, values) => {
      console.log(values, 'values')
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
    const itemStyle = { marginBottom: '5px', fontWeight: 'bold' }
    const {
      form,
      leaders: { clinicLocationList, categoryList, staffDropdownList, languageList },
      staffs: { StaffList },
    } = this.props
    const itemStyle1 = { marginBottom: '5px', fontWeight: 'bold' }

    console.log()
    console.log(StaffList, 'stafflisr')
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

          <Form.Item label="Therapist" style={itemStyle}>
            {form.getFieldDecorator('therapist', {
              rules: [{ required: true, message: 'Please provide Project Name' }],
            })(
              <Select placeholder="Select therapist" mode="multiple" allowClear>
                {StaffList.map(item => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  )
                })}
              </Select>,
            )}
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button style={SUBMITT_BUTTON} type="primary" htmlType="submit">
              Save
            </Button>
            <Button onClick={this.onReset} style={CANCEL_BUTTON}>
              cancel
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

const EditBasicInformationForm = Form.create()(EditBasicInformation)

export default EditBasicInformationForm

/* eslint-disable */
import React, { useState, useEffect } from 'react'
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
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import AntdTag from '../../staffs/antdTag'

const { TextArea } = Input
const { Option } = Select
const layout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 16,
  },
}

const submitButton = {
  width: '45%',
  height: 40,
  background: '#0B35B3',
  boxShadow: '0px 2px 4px rgba(96, 97, 112, 0.16), 0px 0px 1px rgba(40, 41, 61, 0.04) !importent',
  borderRadius: 0,
  fontSize: '17 !important',
  fontWeight: 'bold !important',
  marginTop: 20,
}

const itemStyle = { marginBottom: '5px', fontWeight: 'bold' }

function PersonalInfo(props) {
  const {
    form,
    userProfile,
    learners: { languageList },
  } = props
  console.log(props, languageList)
  const [tagArray, setTagArray] = useState(userProfile.tags)

  useEffect(() => {
    if (userProfile) {
      setTagArray(userProfile.tags)
    }
  }, [userProfile])

  const tagArrayHandler = tags => {
    setTagArray(tags)
  }

  console.log(userProfile, 'ser')
  return (
    <div>
      <Form {...layout} onSubmit={e => this.handleSubmit(e)}>
        <Form.Item label="Guardian Name" style={itemStyle}>
          {form.getFieldDecorator('parentFirstName', {
            rules: [{ required: false, message: 'Please provide Parent Name!' }],
          })(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="Guardian Mobile no" style={itemStyle}>
          {form.getFieldDecorator('parentMobileNumber', {
            rules: [{ message: 'Please provide Mobile No!' }],
          })(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="Father Name" style={itemStyle}>
          {form.getFieldDecorator('fatherName', {
            rules: [{ required: false, message: 'Please provide Father Name!' }],
          })(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="Father Mobile no" style={itemStyle}>
          {form.getFieldDecorator('fatherMobileNumber', {
            rules: [{ message: 'Please provide Mobile No!' }],
          })(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="Mother Name" style={itemStyle}>
          {form.getFieldDecorator('motherName', {
            rules: [{ required: false, message: 'Please provide Mother Name!' }],
          })(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="Mother Mobile no" style={itemStyle}>
          {form.getFieldDecorator('motherMobileNumber', {
            rules: [{ message: 'Please provide Mobile No!' }],
          })(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="Height" style={itemStyle}>
          {form.getFieldDecorator('height', {
            rules: [{ message: 'Please provide height!' }],
          })(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="Weight" style={itemStyle}>
          {form.getFieldDecorator('weight', {
            rules: [{ message: 'Please provide weight!' }],
          })(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>

        <Form.Item label="SSN/Adhaar card" style={itemStyle}>
          {form.getFieldDecorator('ssnCard', { rules: [{ message: 'Please provide Mobile No!' }] })(
            <Input style={{ borderRadius: 0 }} />,
          )}
        </Form.Item>
        <Form.Item label="Default Language" style={itemStyle}>
          {form.getFieldDecorator('learnerLanguage', {
            rules: [{ required: false, message: 'Please provide Default Language!' }],
          })(
            <Select placeholder="Select a default Language" allowClear>
              {languageList.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <Button type="primary" style={submitButton}>
            Submitt
          </Button>
          <Button
            type="default"
            style={{ ...submitButton, color: 'white', background: 'red', boxShadow: 'none' }}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  )
}

const mapStateToProps = ({ learners }) => ({
  learners,
})

export default withRouter(connect(mapStateToProps)(Form.create()(PersonalInfo)))

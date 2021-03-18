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

function ClinicInfo(props) {
  const {
    form,
    userProfile,
    learners: { clinicLocationList, categoryList, staffDropdownList },
  } = props

  useEffect(() => {
    if (userProfile) {
      console.log('abler')
    }
  }, [userProfile])

  console.log(userProfile, 'ser')
  return (
    <div>
      <Form {...layout} onSubmit={e => this.handleSubmit(e)}>
        <Form.Item label="Clinic Location" style={itemStyle}>
          {form.getFieldDecorator('clinicLocation', {
            rules: [{ required: true, message: 'Please provide Clinic Location!' }],
          })(
            <Select placeholder="Select a Clinic location" allowClear>
              {clinicLocationList.map(item => (
                <Option key={item.node.id} value={item.node.id}>
                  {item.node.location}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>

        <Form.Item label="Location Category" style={itemStyle}>
          {form.getFieldDecorator('category', {
            rules: [{ required: true, message: 'Please provide Location!' }],
          })(
            <Select placeholder="Select category" allowClear>
              {categoryList.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.category}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Case Manager" style={itemStyle}>
          {form.getFieldDecorator('caseManager')(
            <Select placeholder="Select Therapist" allowClear>
              {staffDropdownList.map(item => (
                <Option key={item.node.id} value={item.node.id}>
                  {item.node.name} {item.node.surname}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Authorized Staff" style={itemStyle}>
          {form.getFieldDecorator('authStaff')(
            <Select mode="multiple" placeholder="Select Therapist" allowClear maxTagCount={4}>
              {staffDropdownList.map(item => (
                <Option key={item.node.id} value={item.node.id}>
                  {item.node.name} {item.node.surname}
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

export default withRouter(connect(mapStateToProps)(Form.create()(ClinicInfo)))

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
  Switch,
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
    span: 9,
  },
  wrapperCol: {
    marginLeft: '10px',
    span: 12,
  },
}

const rightCol = {
  marginLeft: '20px',
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

function ProgramInfo(props) {
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

  const learnerActiveInactive = checked => {
    // const {
    //   dispatch,
    //   learners: { UserProfile },
    // } = this.props
    // console.log(UserProfile.id, checked)

    // dispatch({
    //   type: 'learners/LEARNER_ACTIVE_INACTIVE',
    //   payload: {
    //     id: UserProfile.id,
    //     checked: checked,
    //   },
    // })
    console.log('kgrkjgnrkjsrk srk srk srksr vksr vsrkj vser')
  }
  console.log(userProfile, 'ser')
  return (
    <div>
      <Form {...layout} onSubmit={e => this.handleSubmit(e)}>
        <Form.Item label="Default Active" style={itemStyle}>
          {form.getFieldDecorator('isDefaultActive', {
            rules: [{ required: false, message: 'Please Select parent activation if needed' }],
          })(
            <Switch
              style={rightCol}
              checkedChildren={<Icon type="check" />}
              unCheckedChildren={<Icon type="close" />}
              defaultChecked
              onChange={learnerActiveInactive}
            />,
          )}
        </Form.Item>
        <Form.Item label="Peak Active" style={itemStyle}>
          {form.getFieldDecorator('isPeakActive', {
            rules: [{ required: false, message: 'Please Select parent activation if needed' }],
          })(
            <Switch
              style={rightCol}
              checkedChildren={<Icon type="check" />}
              unCheckedChildren={<Icon type="close" />}
              defaultChecked
              onChange={learnerActiveInactive}
            />,
          )}
        </Form.Item>
        <Form.Item label="VBMAPP Active" style={itemStyle}>
          {form.getFieldDecorator('isVbmappActive', {
            rules: [{ required: false, message: 'Please Select parent activation if needed' }],
          })(
            <Switch
              style={rightCol}
              checkedChildren={<Icon type="check" />}
              unCheckedChildren={<Icon type="close" />}
              defaultChecked
              onChange={learnerActiveInactive}
            />,
          )}
        </Form.Item>
        <Form.Item label="Cogniable Active" style={itemStyle}>
          {form.getFieldDecorator('isCogActive', {
            rules: [{ required: false, message: 'Please Select parent activation if needed' }],
          })(
            <Switch
              style={rightCol}
              checkedChildren={<Icon type="check" />}
              unCheckedChildren={<Icon type="close" />}
              defaultChecked
              onChange={learnerActiveInactive}
            />,
          )}
        </Form.Item>
        <Form.Item label="Research Participant" style={itemStyle}>
          {form.getFieldDecorator('isresearchParticipant', {
            rules: [{ required: false, message: 'Please Select parent activation if needed' }],
          })(<Checkbox style={rightCol} />)}
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

export default withRouter(connect(mapStateToProps)(Form.create()(ProgramInfo)))

/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Select, DatePicker, Divider, Upload, notification } from 'antd'
import moment from 'moment'
import { Link, withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'
import { connect } from 'react-redux'
import axios from 'axios'
import AntdTag from '../../staffs/antdTag'
import LoadingComponent from 'components/LoadingComponent'
import { GEN_INFO } from './query'
import { COLORS, FORM, SUBMITT_BUTTON, CANCEL_BUTTON } from 'assets/styles/globalStyles'

const { TextArea } = Input
const { Option } = Select

const { layout } = FORM

const itemStyle = { marginBottom: '5px', fontWeight: 'bold' }

function GenDetails(props) {
  const { closeDrawer, form, dispatch, userProfile } = props
  const [tagArray, setTagArray] = useState(userProfile.tags)
  const [updateInfo, { data: updateData, loading: updateLoading }] = useMutation(GEN_INFO)

  useEffect(() => {
    if (userProfile && form) {
      setTagArray(userProfile.tags)
      form.setFieldsValue({
        clientId: userProfile.clientId,
        category: userProfile.category?.id,
        email: userProfile.email,
        gender: userProfile.gender,
        dob: moment(userProfile.dob),
        firstname: userProfile.firstname,
        lastname: userProfile.lastname,
        mobileno: userProfile.mobileno,
        tags: userProfile.tags,
        streetAddress: userProfile.streetAddress,
        city: userProfile.city,
        state: userProfile.state,
        country: userProfile.country,
        zipCode: userProfile.zipCode,
      })
    }
  }, [userProfile])

  const tagArrayHandler = tags => {
    setTagArray(tags)
  }

  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        const selectedStaffList = []
        userProfile.authStaff.edges.map(item => selectedStaffList.push(item.node.id))

        updateInfo({
          variables: {
            id: userProfile.id,

            firstname: values.firstname,
            lastname: values.lastname,
            email: values.email,
            mobileno: values.mobileno,
            dob: moment(values.dob).format('YYYY-MM-DD'),
            gender: values.gender,
            tags: tagArray,
            streetAddress: values.streetAddress,
            state: values.state,
            country: values.country,
            city: values.city,
            zipCode: values.zipCode,

            parentName: userProfile.parentName,
            parentMobile: userProfile.parentMobile,
            allergicTo: userProfile.allergicTo,
            // fatherName: userProfile.fatherName,
            // fatherPhone: userProfile.fatherPhone,
            // motherName: userProfile.motherName,
            // motherPhone: userProfile.motherPhone,
            // height: userProfile.height,
            // weight: userProfile.weight,
            ssnAadhar: userProfile.ssnAadhar,
            language: userProfile.language?.id,

            category: userProfile.category?.id,
            clinicLocation: userProfile.clinicLocation?.id,
            caseManager: userProfile.caseManager?.id,
            authStaff: selectedStaffList,

            isPeakActive: userProfile.isPeakActive,
            isCogActive: userProfile.isCogActive,
            researchParticipant: userProfile.researchParticipant,
          },
        })
          .then(result => {
            dispatch({
              type: 'learners/EDIT_GENERAL_INFO',
              payload: {
                id: userProfile.id,
                response: result,
              },
            })
            closeDrawer(false)
          })
          .catch(error => {
            notification.error({
              message: 'Something went wrong',
              description: 'Unable to update data',
            })
          })
      }
    })
  }

  console.log(userProfile, 'ser')
  if (!form || !userProfile) {
    return <LoadingComponent />
  }
  return (
    <div>
      <Form {...layout} onSubmit={handleSubmit}>
        <Form.Item label="Tags" style={itemStyle}>
          {form.getFieldDecorator('tags')(
            <AntdTag
              style={itemStyle}
              changeTagsHandler={tagArrayHandler}
              closeable="true"
              tagArray={tagArray}
            />,
          )}
        </Form.Item>

        <Form.Item label="Client Id" style={itemStyle}>
          {form.getFieldDecorator('clientId', {
            rules: [{ required: false, message: 'Please provide ClientId!' }],
          })(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="First Name" style={itemStyle}>
          {form.getFieldDecorator('firstname', {
            rules: [{ required: true, message: 'Please provide firstName!' }],
          })(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="Last Name" style={itemStyle}>
          {form.getFieldDecorator('lastname', {
            rules: [{ required: false, message: 'Please provide lastName!' }],
          })(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="Email" style={itemStyle}>
          {form.getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please provide email!' }],
          })(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>

        <Form.Item label="Mobile no" style={itemStyle}>
          {form.getFieldDecorator('mobileno', {
            rules: [{ required: true, message: 'Please provide Mobile No!' }],
          })(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="DOB" style={itemStyle}>
          {form.getFieldDecorator('dob', {
            rules: [{ required: true, message: 'Please provide Date of Birth!' }],
          })(<DatePicker style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="Gender" style={itemStyle}>
          {form.getFieldDecorator('gender', {
            rules: [{ required: true, message: 'Please provide Gender' }],
          })(
            <Select placeholder="Please provide Gender" allowClear>
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>,
          )}
        </Form.Item>

        <Divider orientation="left">Address</Divider>

        <Form.Item label="Street Address" style={itemStyle}>
          {form.getFieldDecorator('streetAddress', {
            rules: [{ message: 'Please provide Street Name' }],
          })(<Input placeholder="Street Address" style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="City" style={itemStyle}>
          {form.getFieldDecorator('city', { rules: [{ message: 'Please provide City' }] })(
            <Input placeholder="City" style={{ borderRadius: 0 }} />,
          )}
        </Form.Item>
        <Form.Item label="State" style={itemStyle}>
          {form.getFieldDecorator('state', { rules: [{ message: 'Please provide State' }] })(
            <Input placeholder="State" style={{ borderRadius: 0 }} />,
          )}
        </Form.Item>
        <Form.Item label="Country" style={itemStyle}>
          {form.getFieldDecorator('country', { rules: [{ message: 'Please provide Country' }] })(
            <Input placeholder="Country" style={{ borderRadius: 0 }} />,
          )}
        </Form.Item>
        <Form.Item label="Pincode" style={itemStyle}>
          {form.getFieldDecorator('zipCode', { rules: [{ message: 'Please provide zipCode' }] })(
            <Input placeholder="Pincode" style={{ borderRadius: 0 }} />,
          )}
        </Form.Item>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button type="primary" loading={updateLoading} htmlType="submit" style={SUBMITT_BUTTON}>
            Submitt
          </Button>
          <Button type="default" onClick={() => closeDrawer(false)} style={CANCEL_BUTTON}>
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

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Form.create()(GenDetails)))

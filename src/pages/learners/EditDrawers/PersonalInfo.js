/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Select, notification } from 'antd'
import moment from 'moment'
import { useMutation } from 'react-apollo'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import AntdTag from '../../staffs/antdTag'
import { GEN_INFO } from './query'
import { COLORS, FORM, SUBMITT_BUTTON, CANCEL_BUTTON } from 'assets/styles/globalStyles'

const { TextArea } = Input
const { Option } = Select
const { layout } = FORM

const itemStyle = { marginBottom: '5px', fontWeight: 'bold' }

function PersonalInfo(props) {
  const {
    form,
    dispatch,
    closeDrawer,
    userProfile,
    learners: { languageList },
  } = props

  const [updateInfo, { loading: updateLoading }] = useMutation(GEN_INFO)
  const [allergicArray, setAllergicArray] = useState(userProfile.allergicTo)

  useEffect(() => {
    if (userProfile) {
      setAllergicArray(userProfile.allergicTo)
      console.log(userProfile, 'userProfile')
      form.setFieldsValue({
        parentName: userProfile.parentName,
        parentMobile: userProfile.parentMobile,
        fatherName: userProfile.fatherName,
        motherName: userProfile.motherName,
        fatherPhone: userProfile.fatherPhone,
        motherPhone: userProfile.motherPhone,
        height: userProfile.height,
        weight: userProfile.weight,
        ssnAadhar: userProfile.ssnAadhar,
        language: userProfile.language?.id,
      })
    }
  }, [userProfile])

  const tagArrayHandler = tags => {
    setAllergicArray(tags)
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

            firstname: userProfile.firstname,
            lastname: userProfile.lastname,
            email: userProfile.email,
            mobileno: userProfile.mobileno,
            dob: moment(userProfile.dob).format('YYYY-MM-DD'),
            gender: userProfile.gender,
            tags: userProfile.tags,
            streetAddress: userProfile.streetAddress,
            state: userProfile.state,
            country: userProfile.country,
            city: userProfile.city,
            zipCode: userProfile.zipCode,

            parentName: values.parentName,
            parentMobile: values.parentMobile,
            // fatherName: values.fatherName,
            // fatherPhone: values.fatherPhone,
            // motherName: values.motherName,
            // motherPhone: values.motherPhone,
            // height: values.height,
            // weight: values.weight,
            allergicTo: allergicArray,
            ssnAadhar: values.ssnAadhar,
            language: values.language,

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
              description: 'Unable to update learner data',
            })
          })
      }
    })
  }

  return (
    <div>
      <Form {...layout} onSubmit={handleSubmit}>
        <Form.Item label="Guardian Name" style={itemStyle}>
          {form.getFieldDecorator('parentName', {
            rules: [{ required: false, message: 'Please provide Parent Name!' }],
          })(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="Guardian Mobile no" style={itemStyle}>
          {form.getFieldDecorator('parentMobile', {
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
        <Form.Item label="Allergic To" style={itemStyle}>
          {form.getFieldDecorator('allergicTo')(
            <AntdTag
              style={itemStyle}
              changeTagsHandler={tagArrayHandler}
              closeable="true"
              tagArray={allergicArray}
            />,
          )}
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
          {form.getFieldDecorator('ssnAadhar', {
            rules: [{ message: 'Please provide Mobile No!' }],
          })(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="Default Language" style={itemStyle}>
          {form.getFieldDecorator('language', {
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
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button type="primary" htmlType="submit" loading={updateLoading} style={SUBMITT_BUTTON}>
            Submit
          </Button>
          <Button onClick={() => closeDrawer(false)} type="default" style={CANCEL_BUTTON}>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Form.create()(PersonalInfo)))

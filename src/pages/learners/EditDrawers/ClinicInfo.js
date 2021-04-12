/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Select, notification } from 'antd'
import moment from 'moment'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { useMutation } from 'react-apollo'
import { GEN_INFO } from './query'
import { COLORS, FORM, SUBMITT_BUTTON, CANCEL_BUTTON } from 'assets/styles/globalStyles'

const { Option } = Select
const { layout } = FORM

const itemStyle = { marginBottom: '5px', fontWeight: 'bold' }

function ClinicInfo(props) {
  const {
    form,
    dispatch,
    closeDrawer,
    userProfile,
    learners: { clinicLocationList, categoryList, staffDropdownList },
  } = props

  const [updateInfo, { loading: updateLoading }] = useMutation(GEN_INFO)

  useEffect(() => {
    if (userProfile) {
      const selectedStaffList = []
      userProfile.authStaff.edges.map(item => selectedStaffList.push(item.node.id))
      form.setFieldsValue({
        category: userProfile.category?.id,
        clinicLocation: userProfile.clinicLocation?.id,
        caseManager: userProfile.caseManager?.id,
        authStaff: selectedStaffList,
      })
    }
  }, [userProfile])

  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
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

            category: values.category,
            clinicLocation: values.clinicLocation,
            caseManager: values.caseManager,
            authStaff: values.authStaff,

            isPeakActive: userProfile.isPeakActive,
            isCogActive: userProfile.isCogActive,
            researchParticipant: userProfile.researchParticipant,
          },
        })
          .then(res => {
            dispatch({
              type: 'learners/EDIT_GENERAL_INFO',
              payload: {
                id: userProfile.id,
                response: res,
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
            rules: [{ required: true, message: 'Please provide Location category!' }],
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
            <Select showSearch optionFilterProp="name" placeholder="Select Therapist" allowClear>
              {staffDropdownList.map(item => (
                <Option key={item.node.id} name={item.node.name} value={item.node.id}>
                  {item.node.name} {item.node.surname}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Authorized Staff" style={itemStyle}>
          {form.getFieldDecorator('authStaff')(
            <Select
              showSearch
              optionFilterProp="name"
              mode="multiple"
              placeholder="Select Therapist"
              allowClear
              maxTagCount={4}
            >
              {staffDropdownList.map(item => (
                <Option key={item.node.id} name={item.node.name} value={item.node.id}>
                  {item.node.name} {item.node.surname}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Form.create()(ClinicInfo)))

/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Select, notification } from 'antd'
import moment from 'moment'
import { useMutation } from 'react-apollo'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { UPDATE_STAFF } from './query'
import { COLORS } from 'assets/styles/globalStyles'

const layout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 16,
  },
}

const submitButton = {
  width: '40%',
  height: 40,
  background: '#0B35B3',
  boxShadow: '0px 2px 4px rgba(96, 97, 112, 0.16), 0px 0px 1px rgba(40, 41, 61, 0.04)',
  borderRadius: 0,
  fontSize: 16,
  color: 'white',
  // fontWeight: 600,
  margin: '20px 5px',
}

const itemStyle = { marginBottom: '5px', fontWeight: 'bold' }

function PersonalInfo(props) {
  const { form, dispatch, closeDrawer, staffProfile } = props

  const [updateInfo, { loading: updateLoading }] = useMutation(UPDATE_STAFF)

  useEffect(() => {
    if (staffProfile) {
      form.setFieldsValue({
        fatherName: staffProfile.fatherName,
        motherName: staffProfile.motherName,
        ssnAadhar: staffProfile.ssnAadhar,
        maritalStatus: staffProfile.maritalStatus,
      })
    }
  }, [staffProfile])

  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        updateInfo({
          variables: {
            id: staffProfile.id,

            firstname: staffProfile.firstname,
            surname: staffProfile.lastname,
            email: staffProfile.email,
            mobile: staffProfile.mobile,
            dob: moment(staffProfile.dob).format('YYYY-MM-DD'),
            gender: staffProfile.gender,
            designation: staffProfile.designation,
            qualification: staffProfile.qualification,
            role: staffProfile.userRole.id,
            streetAddress: staffProfile.streetAddress,
            state: staffProfile.state,
            country: staffProfile.country,
            city: staffProfile.city,
            zipCode: staffProfile.zipCode,
            isActive: staffProfile.isActive,
            tags: staffProfile.tags,

            fatherName: values.fatherName,
            motherName: values.motherName,
            ssnAadhar: values.ssnAadhar,
            maritalStatus: values.maritalStatus,

            emergencyName: staffProfile.emergencyName,
            emergencyContact: staffProfile.emergencyContact,
            contactRelation: staffProfile.contactRelation,

            clinicLocation: staffProfile.clinicLocation?.id,
            workExp: staffProfile.workExp,
            npi: staffProfile.npi,
            taxId: staffProfile.taxId,
            salutation: staffProfile.salutation,
            empId: staffProfile.empId,
          },
        })
          .then(result => {
            dispatch({
              type: 'staffs/UPDATE_STAFF_INFO',
              payload: {
                id: staffProfile.id,
                response: result,
              },
            })
            closeDrawer(false)
          })
          .catch(error => {
            console.log(error)
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
        <Form.Item label="Father Name" style={itemStyle}>
          {form.getFieldDecorator('fatherName', {
            rules: [{ required: false, message: 'Please provide Father Name!' }],
          })(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="Mother Name" style={itemStyle}>
          {form.getFieldDecorator('motherName', {
            rules: [{ required: false, message: 'Please provide Mother Name!' }],
          })(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>

        <Form.Item label="SSN/Adhaar card" style={itemStyle}>
          {form.getFieldDecorator('ssnAadhar', {
            rules: [{ message: 'Please provide Mobile No!' }],
          })(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="Marital Status" style={itemStyle}>
          {form.getFieldDecorator('maritalStatus', {
            rules: [{ required: false, message: 'Please provide Default Language!' }],
          })(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button type="primary" htmlType="submit" loading={updateLoading} style={submitButton}>
            Submitt
          </Button>
          <Button
            onClick={() => closeDrawer(false)}
            type="default"
            style={{ ...submitButton, backgroundColor: COLORS.danger }}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  )
}

const mapStateToProps = ({ staffs }) => ({
  staffs,
})

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Form.create()(PersonalInfo)))

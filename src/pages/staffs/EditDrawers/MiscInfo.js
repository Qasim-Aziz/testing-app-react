/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Select, notification } from 'antd'
import moment from 'moment'
import { useMutation } from 'react-apollo'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { UPDATE_STAFF } from './query'
import { COLORS, FORM, SUBMITT_BUTTON, CANCEL_BUTTON } from 'assets/styles/globalStyles'

const { layout } = FORM
const itemStyle = { marginBottom: '5px', fontWeight: 'bold' }

function MiscInfo(props) {
  const { form, dispatch, closeDrawer, staffProfile } = props

  const [updateInfo, { loading: updateLoading }] = useMutation(UPDATE_STAFF)

  useEffect(() => {
    if (staffProfile) {
      form.setFieldsValue({
        npi: staffProfile.npi,
        taxId: staffProfile.taxId,
        filename: staffProfile.filename,
        fileDescription: staffProfile.fileDescription,
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
            ssnAadhar: staffProfile.ssnAadhar,
            maritalStatus: staffProfile.maritalStatus,

            emergencyName: values.emergencyName,
            emergencyContact: values.emergencyContact,
            contactRelation: staffProfile.contactRelation,

            clinicLocation: staffProfile.clinicLocation?.id,
            workExp: staffProfile.workExp,
            salutation: staffProfile.salutation,

            npi: values.npi,
            taxId: values.taxId,
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
        <Form.Item label="NPI" style={itemStyle}>
          {form.getFieldDecorator('npi', {
            rules: [{ required: false, message: 'Please provide npi!' }],
          })(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="Tax ID" style={itemStyle}>
          {form.getFieldDecorator('taxId', {
            rules: [{ message: 'Please provide Mobile No!' }],
          })(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="File Name" style={itemStyle}>
          {form.getFieldDecorator('fileName', {
            rules: [{ required: false, message: 'Please provide tax Id!' }],
          })(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="File Description" style={itemStyle}>
          {form.getFieldDecorator('fileDescription', {
            rules: [{ required: false, message: 'Please provide description!' }],
          })(<Input style={{ borderRadius: 0 }} />)}
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

const mapStateToProps = ({ staffs }) => ({
  staffs,
})

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Form.create()(MiscInfo)))

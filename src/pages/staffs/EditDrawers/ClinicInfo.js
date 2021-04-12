/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Select, notification } from 'antd'
import moment from 'moment'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { useMutation } from 'react-apollo'
import { UPDATE_STAFF } from './query'
import { COLORS, FORM, SUBMITT_BUTTON, CANCEL_BUTTON } from 'assets/styles/globalStyles'

const { TextArea } = Input
const { Option } = Select

const itemStyle = { marginBottom: '5px', fontWeight: 'bold' }
const { layout } = FORM

function ClinicInfo(props) {
  const {
    form,
    dispatch,
    closeDrawer,
    staffProfile,
    staffs: { clinicLocationList },
  } = props

  const [updateInfo, { loading: updateLoading }] = useMutation(UPDATE_STAFF)

  useEffect(() => {
    if (staffProfile) {
      form.setFieldsValue({
        clinicLocation: staffProfile.clinicLocation?.id,
        workExp: staffProfile.workExp,
        salutation: staffProfile.salutation,
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

            fatherName: staffProfile.fatherName,
            motherName: staffProfile.motherName,
            ssnAadhar: staffProfile.ssnAadhar,
            maritalStatus: staffProfile.maritalStatus,

            emergencyName: staffProfile.emergencyName,
            emergencyContact: staffProfile.emergencyContact,
            contactRelation: staffProfile.emergencyRelation,

            clinicLocation: values.clinicLocation,
            workExp: values.workExp,
            salutation: values.salutation,

            npi: staffProfile.npi,
            taxId: staffProfile.taxId,
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
        <Form.Item label="Work Experience" style={itemStyle}>
          {form.getFieldDecorator('workExp', {
            rules: [{ required: false, message: 'Please provide work experience' }],
          })(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="Salutation" style={itemStyle}>
          {form.getFieldDecorator('salutation', {
            rules: [{ required: false, message: 'Please provide salutation' }],
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Form.create()(ClinicInfo)))

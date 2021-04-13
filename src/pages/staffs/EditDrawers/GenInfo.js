/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Select, DatePicker, Divider, Upload, notification } from 'antd'
import moment from 'moment'
import { Link, withRouter } from 'react-router-dom'
import { useMutation } from 'react-apollo'
import { connect } from 'react-redux'
import AntdTag from '../antdTag'
import LoadingComponent from 'components/LoadingComponent'
import { UPDATE_STAFF } from './query'
import '../style.scss'
import { COLORS, FORM, SUBMITT_BUTTON, CANCEL_BUTTON } from 'assets/styles/globalStyles'

const { Option } = Select
const { layout } = FORM

const itemStyle = { marginBottom: '5px', fontWeight: 'bold' }

function GenDetails(props) {
  const { closeDrawer, form, dispatch, staffProfile } = props
  const [tagArray, setTagArray] = useState(staffProfile.tags)
  const [updateInfo, { loading: updateLoading }] = useMutation(UPDATE_STAFF)

  useEffect(() => {
    if (staffProfile && form) {
      setTagArray(staffProfile.tags)
      form.setFieldsValue({
        // staffId: staffProfile.staffId,
        designation: staffProfile.designation,
        qualification: staffProfile.qualification,
        email: staffProfile.email,
        gender: staffProfile.gender,
        dob: moment(staffProfile.dob),
        firstname: staffProfile.name,
        lastname: staffProfile.surname,
        mobile: staffProfile.contactNo,
        tags: staffProfile.tags,
        streetAddress: staffProfile.streetAddress,
        city: staffProfile.city,
        state: staffProfile.state,
        country: staffProfile.country,
        zipCode: staffProfile.zipCode,
      })
    }
  }, [staffProfile])

  const tagArrayHandler = tags => {
    setTagArray(tags)
  }

  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        updateInfo({
          variables: {
            id: staffProfile.id,
            firstname: values.firstname,
            surname: values.lastname,
            email: values.email,
            mobile: values.mobile,
            dob: moment(values.dob).format('YYYY-MM-DD'),
            gender: values.gender,
            designation: values.designation,
            qualification: values.qualification,
            role: staffProfile.userRole.id,
            streetAddress: values.streetAddress,
            state: values.state,
            country: values.country,
            city: values.city,
            zipCode: values.zipCode,
            isActive: staffProfile.isActive,
            tags: tagArray,

            fatherName: staffProfile.fatherName,
            motherName: staffProfile.motherName,
            ssnAadhar: staffProfile.ssnAadhar,
            maritalStatus: staffProfile.maritalStatus,
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
            notification.error({
              message: 'Something went wrong',
              description: 'Unable to update data',
            })
          })
      }
    })
  }

  if (!form || !staffProfile) {
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

        {/* <Form.Item label="Staff Id" style={itemStyle}>
          {form.getFieldDecorator('staffId', {
            rules: [{ required: true, message: 'Please provide ClientId!' }],
          })(<Input type="number" style={{ borderRadius: 0 }} />)}
        </Form.Item> */}
        <Form.Item label="Designation" style={itemStyle}>
          {form.getFieldDecorator('designation', {
            rules: [{ required: false, message: 'Please provide Designation!' }],
          })(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="Qualification" style={itemStyle}>
          {form.getFieldDecorator('qualification', {
            rules: [{ required: false, message: 'Please provide Qualification!' }],
          })(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="First Name" style={itemStyle}>
          {form.getFieldDecorator('firstname', {
            rules: [{ required: true, message: 'Please provide First Name!' }],
          })(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="Last Name" style={itemStyle}>
          {form.getFieldDecorator('lastname', {
            rules: [{ required: false, message: 'Please provide Last Name!' }],
          })(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="Email" style={itemStyle}>
          {form.getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please provide Email!' }],
          })(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>

        <Form.Item label="Mobile no" style={itemStyle}>
          {form.getFieldDecorator('mobile', {
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
            Submit
          </Button>
          <Button type="default" onClick={() => closeDrawer(false)} style={CANCEL_BUTTON}>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Form.create()(GenDetails)))

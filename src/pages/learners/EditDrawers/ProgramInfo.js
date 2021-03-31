/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Select, Checkbox, Icon, Switch, notification } from 'antd'
import moment from 'moment'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { useMutation } from 'react-apollo'
import { GEN_INFO } from './query'
import { COLORS, FORM, SUBMITT_BUTTON, CANCEL_BUTTON } from 'assets/styles/globalStyles'

const { layout } = FORM
const rightCol = {
  marginLeft: '20px',
}

const itemStyle = { marginBottom: '5px', fontWeight: 'bold' }

function ProgramInfo(props) {
  const {
    form,
    userProfile,
    dispatch,
    closeDrawer,
    learners: { clinicLocationList, categoryList, staffDropdownList },
  } = props

  const [updateInfo, { loading: updateLoading }] = useMutation(GEN_INFO)

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

            isPeakActive: values.isPeakActive,
            isCogActive: values.isCogActive,
            researchParticipant: values.researchParticipant,
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
        <Form.Item label="Default Active" style={itemStyle}>
          {form.getFieldDecorator('defaultProgram', {
            initialValue: userProfile.defaultProgram,
            valuePropName: 'checked',
            rules: [{ required: false, message: 'Please Select parent activation if needed' }],
          })(
            <Switch
              style={rightCol}
              checkedChildren={<Icon type="check" />}
              unCheckedChildren={<Icon type="close" />}
            />,
          )}
        </Form.Item>
        <Form.Item label="VBMAPP Active" style={itemStyle}>
          {form.getFieldDecorator('isVbmappActive', {
            initialValue: userProfile.isVbmappActive,
            valuePropName: 'checked',
            rules: [{ required: false, message: 'Please Select parent activation if needed' }],
          })(
            <Switch
              style={rightCol}
              checkedChildren={<Icon type="check" />}
              unCheckedChildren={<Icon type="close" />}
            />,
          )}
        </Form.Item>
        <Form.Item label="Peak Active" style={itemStyle}>
          {form.getFieldDecorator('isPeakActive', {
            initialValue: userProfile.isPeakActive,
            valuePropName: 'checked',
            rules: [{ required: false, message: 'Please Select parent activation if needed' }],
          })(
            <Switch
              style={rightCol}
              checkedChildren={<Icon type="check" />}
              unCheckedChildren={<Icon type="close" />}
            />,
          )}
        </Form.Item>

        <Form.Item label="Cogniable Active" style={itemStyle}>
          {form.getFieldDecorator('isCogActive', {
            initialValue: userProfile.isCogActive,
            valuePropName: 'checked',
            rules: [{ required: false, message: 'Please Select parent activation if needed' }],
          })(
            <Switch
              style={rightCol}
              checkedChildren={<Icon type="check" />}
              unCheckedChildren={<Icon type="close" />}
            />,
          )}
        </Form.Item>
        <Form.Item label="Research Participant" style={itemStyle}>
          {form.getFieldDecorator('researchParticipant', {
            initialValue: userProfile.researchParticipant,
            valuePropName: 'checked',
            rules: [{ required: false, message: 'Please Select parent activation if needed' }],
          })(<Checkbox style={rightCol} />)}
        </Form.Item>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button type="primary" htmlType="submit" loading={updateLoading} style={SUBMITT_BUTTON}>
            Submitt
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Form.create()(ProgramInfo)))

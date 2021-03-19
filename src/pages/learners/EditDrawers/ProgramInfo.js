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
  notification,
  Descriptions,
} from 'antd'
import moment from 'moment'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { useMutation } from 'react-apollo'
import { GEN_INFO } from './query'
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
    dispatch,
    closeDrawer,
    learners: { clinicLocationList, categoryList, staffDropdownList },
  } = props

  const [updateInfo, { loading: updateLoading }] = useMutation(GEN_INFO)
  const [defaultProg, setDefaultProg] = useState(
    userProfile.defaultProgram ? userProfile.defaultProgram : false,
  )
  const [isVbmappActive, setIsVbmappActive] = useState(
    userProfile.isVbmappActive ? userProfile.isVbmappActive : false,
  )
  const [isPeakActive, setIsPeakActive] = useState(userProfile.isPeakActive)
  const [isCogActive, setIsCogActive] = useState(userProfile.isCogActive)
  const [researchPart, setResearchPart] = useState(userProfile.researchParticipant)

  useEffect(() => {
    if (userProfile) {
      form.setFieldsValue({
        defaultProgram: userProfile.defaultProgram ? userProfile.defaultProgram : false,
        isVbmappActive: userProfile.isVbmappActive ? userProfile.isVbmappActive : false,
        isPeakActive: userProfile.isPeakActive,
        isCogActive: userProfile.isCogActive,
        researchParticipant: userProfile.researchParticipant,
      })
    }
  }, [userProfile])

  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        console.log(values, 'values')
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

  console.log(userProfile, 'ser')
  return (
    <div>
      <Form {...layout} onSubmit={handleSubmit}>
        <Form.Item label="Default Active" style={itemStyle}>
          {form.getFieldDecorator('defaultProgram', {
            rules: [{ required: false, message: 'Please Select parent activation if needed' }],
          })(
            <Switch
              style={rightCol}
              checkedChildren={<Icon type="check" />}
              unCheckedChildren={<Icon type="close" />}
              defaultChecked={userProfile.defaultProgram}
              onChange={e => setDefaultProg(e)}
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
              defaultChecked={userProfile.isVbmappActive}
              onChange={e => setIsVbmappActive(e)}
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
              defaultChecked={userProfile.isPeakActive}
              onChange={e => setIsPeakActive(e)}
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
              defaultChecked={userProfile.isCogActive}
            />,
          )}
        </Form.Item>
        <Form.Item label="Research Participant" style={itemStyle}>
          {form.getFieldDecorator('researchParticipant', {
            rules: [{ required: false, message: 'Please Select parent activation if needed' }],
          })(<Checkbox style={rightCol} />)}
        </Form.Item>
        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <Button type="primary" htmlType="submit" loading={updateLoading} style={submitButton}>
            Submitt
          </Button>
          <Button
            onClick={() => closeDrawer(false)}
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

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Form.create()(ProgramInfo)))

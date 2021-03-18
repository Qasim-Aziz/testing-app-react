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
} from 'antd'
import moment from 'moment'
import { Link, withRouter } from 'react-router-dom'
import { useMutation } from 'react-apollo'
import { connect } from 'react-redux'
import axios from 'axios'
import AntdTag from '../../staffs/antdTag'
import LoadingComponent from 'components/LoadingComponent'

const MUT = gql`
  mutation UpdateStudent(
    $id: ID!
    $clientId: String!
    $email: String!
    $gender: String!
    $dob: Date!
    $firstName: String!
    $lastName: String
    $mobileNo: String
    $streetAddress: String
    $state: String
    $city: String
    $country: String
    $zipCode: String
    $tags: [String]
  ) {
    updateStudent(
      input: {
        studentData: {
          id: $id
          clientId: $clientId
          email: $email
          gender: $gender
          dob: $dob
          firstname: $firstName
          lastname: $lastName
          mobileno: $mobileNo
          streetAddress: $streetAddress
          city: $city
          state: $state
          country: $country
          zipCode: $zipCode
          tags: $tags
        }
      }
    ) {
      student {
        id
        admissionNo
        internalNo
        school {
          id
          schoolName
        }
        parent {
          id
          lastLogin
        }
        admissionDate
        firstname
        email
        dob
        image
        file
        report
        createdAt
        fatherName
        fatherPhone
        motherName
        motherPhone
        isActive
        mobileno
        lastname
        gender
        currentAddress
        streetAddress
        city
        state
        country
        zipCode
        height
        weight
        clientId
        ssnAadhar
        parentMobile
        parentName
        dateOfDiagnosis
        clinicLocation {
          id
          location
        }
        isPeakActive
        isCogActive
        researchParticipant
        diagnoses {
          edges {
            node {
              id
              name
            }
          }
        }
        category {
          id
          category
        }
        clinicLocation {
          id
          location
        }
        caseManager {
          id
          name
        }
        language {
          id
          name
        }
        family {
          id
          members {
            edges {
              node {
                id
                memberName
                relationship {
                  id
                  name
                }
              }
            }
          }
        }
        authStaff {
          edges {
            node {
              id
              name
              surname
            }
          }
        }
        tags {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    }
  }
`
const { TextArea } = Input
const { Option } = Select
const layout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 16,
  },
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

function GenDetails(props) {
  const { form, dispatch, userProfile } = props
  console.log(props, 'porpre er')
  const [tagArray, setTagArray] = useState(userProfile.tags)
  const [updateInfo] = useMutation(MUT)

  useEffect(() => {
    if (userProfile && form) {
      setTagArray(userProfile.tags)
      form.setFieldsValue({
        clientId: userProfile.clientId,
        category: userProfile.category?.id,
        email: userProfile.email,
        gender: userProfile.gender,
        dob: moment(userProfile.dob),
        firstName: userProfile.firstname,
        lastName: userProfile.lastname,
        mobileNo: userProfile.mobileno,
        tags: userProfile.tags,
        street: userProfile.streetAddress,
        city: userProfile.city,
        state: userProfile.state,
        country: userProfile.country,
        pincode: userProfile.zipCode,
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
        values = { ...values, tags: tagArray }
        console.log(err, values)
        updateInfo({
          variables: {
            id: userProfile.id,
            clientId: values.clientId,
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            mobileNo: values.mobileNo,
            dob: moment(values.dob).format('YYYY-MM-DD'),
            gender: values.gender,
            tags: tagArray,
            streetAddress: values.street,
            state: values.state,
            country: values.country,
            city: values.city,
            zipCode: values.pincode,
          },
        })
          .then(result => {
            console.log(result, 'Result')
          })
          .catch(error => {
            error.graphQLErrors.map(item => {
              return notification.error({
                message: 'Something went wrong',
                description: item.message,
              })
            })
          })
        // dispatch({
        //   type: 'learners/EDIT_GENERAL_INFO',
        //   payload: {
        //     id: userProfile.id,
        //     values: values,
        //   },
        // })
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
            rules: [{ required: true, message: 'Please provide ClientId!' }],
          })(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="First Name" style={itemStyle}>
          {form.getFieldDecorator('firstName', {
            rules: [{ required: true, message: 'Please provide firstName!' }],
          })(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="Last Name" style={itemStyle}>
          {form.getFieldDecorator('lastName', {
            rules: [{ required: false, message: 'Please provide lastName!' }],
          })(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="Email" style={itemStyle}>
          {form.getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please provide email!' }],
          })(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>

        <Form.Item label="Mobile no" style={itemStyle}>
          {form.getFieldDecorator('mobileNo', {
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
          {form.getFieldDecorator('street', { rules: [{ message: 'Please provide Street Name' }] })(
            <Input placeholder="Street Address" style={{ borderRadius: 0 }} />,
          )}
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
          {form.getFieldDecorator('pincode', { rules: [{ message: 'Please provide pincode' }] })(
            <Input placeholder="Pincode" style={{ borderRadius: 0 }} />,
          )}
        </Form.Item>
        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <Button type="primary" htmlType="submit" style={submitButton}>
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

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Form.create()(GenDetails)))

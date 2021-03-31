import React, { useEffect } from 'react'
import { Form, Input, Button, notification, DatePicker, Select } from 'antd'
import moment from 'moment'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'
import { useSelector } from 'react-redux'
import LoadingComponent from './LoadingComponent'

const { Option } = Select

const ACCOUNT_DETAILS = gql`
  query($id: ID!) {
    staffs(user: $id) {
      edges {
        node {
          id
          name
          surname
          dob
          gender
          maritalStatus
          ssnAadhar
        }
      }
    }
  }
`
const UPDATE_CLINIC = gql`
  mutation(
    $id: ID
    $firstname: String
    $surname: String
    $dob: Date
    $gender: String
    $maritalStatus: String
    $ssnAadhar: String
  ) {
    updateStaff(
      input: {
        staffData: {
          id: $id
          firstname: $firstname
          surname: $surname
          dob: $dob
          gender: $gender
          maritalStatus: $maritalStatus
          ssnAadhar: $ssnAadhar
        }
      }
    ) {
      staff {
        id
        name
        surname
        dob
        gender
        maritalStatus
        ssnAadhar
      }
    }
  }
`

const AccountDetails = ({ form }) => {
  const user = useSelector(state => state.user)
  const {
    data: schoolData,
    error: schoolDataError,
    loading: schoolDataLoading,
  } = useQuery(ACCOUNT_DETAILS, { fetchPolicy: 'network-only', variables: { id: user.id } })

  const [
    updateStaff,
    { data: updateDetailsData, loading: updateDetailsLoading, error: updateDetailsError },
  ] = useMutation(UPDATE_CLINIC)

  const handelSubmit = e => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error) {
        updateStaff({
          variables: {
            id: schoolData.staffs.edges[0]?.node.id,
            firstname: values.name,
            surname: values.surname,
            dob: moment(values.dob).format('YYYY-MM-DD'),
            gender: values.gender,
            maritalStatus: values.maritalStatus,
            ssnAadhar: values.ssnAadhar,
          },
        })
      }
    })
  }

  useEffect(() => {
    if (updateDetailsData) {
      notification.success({
        message: 'Account details updated sucessfully',
      })
    }
    if (updateDetailsError) {
      notification.error({
        message: 'Account details update Faild',
      })
    }
  })

  return (
    <div>
      <div className="profileTab-heading">
        <p>Account</p>
      </div>
      <div className="profileForm">
        <Form layout="vertical" onSubmit={handelSubmit}>
          {schoolDataLoading && <LoadingComponent />}
          {schoolDataError && 'Opps their something is wrong'}
          {schoolData && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '85%' }}>
                <Form.Item label="First Name" className="form-label" style={{ width: '46%' }}>
                  {form.getFieldDecorator('name', {
                    initialValue: schoolData.staffs.edges[0]?.node.name,
                    rules: [{ required: true, message: 'Please enter the first name!' }],
                  })(<Input placeholder="Type first name" />)}
                </Form.Item>
                <Form.Item label="Last Name" className="form-label" style={{ width: '46%' }}>
                  {form.getFieldDecorator('surname', {
                    initialValue: schoolData.staffs.edges[0]?.node.surname,
                    rules: [{ required: true, message: 'Please enter the last name!' }],
                  })(<Input placeholder="Type last name" />)}
                </Form.Item>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '85%' }}>
                <Form.Item label="Date of Birth" className="form-label">
                  {form.getFieldDecorator('dob', {
                    initialValue: moment(schoolData.staffs.edges[0]?.node.dob),
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  })(<DatePicker style={{ width: '20.5em' }} />)}
                </Form.Item>
                <Form.Item label="Gender" className="form-label" style={{ width: '46%' }}>
                  {form.getFieldDecorator('gender', {
                    initialValue: schoolData.staffs.edges[0]?.node.gender,
                    rules: [{ required: true, message: 'Please choose gender !' }],
                  })(
                    <Select>
                      <Option value="male">Male</Option>
                      <Option value="female">female</Option>
                    </Select>,
                  )}
                </Form.Item>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '85%' }}>
                <Form.Item label="Marital Status" className="form-label" style={{ width: '46%' }}>
                  {form.getFieldDecorator('maritalStatus', {
                    initialValue: schoolData.staffs.edges[0]?.node.maritalStatus,
                    rules: [{ required: true, message: 'Please marital status' }],
                  })(
                    <Select>
                      <Option value="married">Married</Option>
                      <Option value="unmarried">Single</Option>
                    </Select>,
                  )}
                </Form.Item>
                <Form.Item label="Adhar Number" className="form-label" style={{ width: '46%' }}>
                  {form.getFieldDecorator('ssnAadhar', {
                    initialValue: schoolData.staffs.edges[0]?.node.ssnAadhar,
                    rules: [{ required: true, message: 'Please enter Adhar Number!' }],
                  })(<Input placeholder="Type Adhar number" />)}
                </Form.Item>
              </div>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={updateDetailsLoading}>
                  Save
                </Button>
              </Form.Item>
            </div>
          )}
        </Form>
      </div>
    </div>
  )
}

export default Form.create()(AccountDetails)

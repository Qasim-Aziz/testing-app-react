import React, { useEffect } from 'react'
import { Form, Input, Button, notification } from 'antd'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'
import LoadingComponent from '../staffProfile/LoadingComponent'

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 10 },
}
const tailLayout = {
  wrapperCol: { offset: 5, span: 10 },
}

const CONTACT_DETAILS = gql`
  query {
    schoolDetail {
      id
      schoolName
      address
      email
      contactNo
      country {
        name
      }
    }
  }
`

const UPDATE_CLINIC = gql`
  mutation updateClinic($email: String!, $contactNo: String!, $address: String!) {
    updateClinic(input: { email: $email, contactNo: $contactNo, address: $address }) {
      school {
        id
      }
    }
  }
`

const ContactDetails = ({ form }) => {
  const {
    data: schoolData,
    error: schoolDataError,
    loading: schoolDataLoading,
  } = useQuery(CONTACT_DETAILS, { fetchPolicy: 'no-cache' })

  const [
    updateDetails,
    { data: updateDetailsData, loading: updateDetailsLoading, error: updateDetailsError },
  ] = useMutation(UPDATE_CLINIC)

  const handelSubmit = e => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error) {
        updateDetails({
          variables: {
            email: values.email,
            address: values.address,
            contactNo: values.phone,
          },
        })
      }
    })
  }

  useEffect(() => {
    if (updateDetailsData) {
      notification.success({
        message: 'Contact details updated sucessfully',
      })
    }
    if (updateDetailsError) {
      notification.error({
        message: 'Contact details update Faild',
      })
    }
  })

  return (
    <div>
      <div className="profileTab-heading">
        <p>Contact Details</p>
      </div>
      <div>
        <Form className="profileForm" onSubmit={handelSubmit} style={{ paddingTop: '2em' }}>
          {schoolDataLoading && <LoadingComponent />}
          {schoolDataError && 'Opps their something is wrong'}
          {schoolData && (
            <div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <Form.Item
                    label="Email"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    style={{ paddingRight: '24px', width: '52%' }}
                    className="form-label"
                  >
                    {form.getFieldDecorator('email', {
                      initialValue: schoolData.schoolDetail.email,
                      rules: [{ required: true, message: 'Please give the clinic email!' }],
                    })(<Input placeholder="Type clinic email" />)}
                  </Form.Item>

                  <Form.Item
                    label="Phone Number"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    className="form-label"
                    style={{ width: '48%' }}
                  >
                    {form.getFieldDecorator('phone', {
                      initialValue: schoolData.schoolDetail.contactNo,
                      rules: [{ required: true, message: 'Please give phone number!' }],
                    })(<Input placeholder="Type clinic phone number" />)}
                  </Form.Item>
                </div>
                <Form.Item
                  style={{ marginBottom: 24 }}
                  label="Address"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  className="form-label"
                >
                  {form.getFieldDecorator('address', {
                    initialValue: schoolData.schoolDetail.address,
                    rules: [
                      {
                        required: true,
                        message: 'Please give the clinic address!',
                      },
                    ],
                  })(<Input placeholder="Type clinic address" />)}
                </Form.Item>
              </div>

              <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
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

export default Form.create()(ContactDetails)

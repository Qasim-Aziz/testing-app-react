import React, { useEffect } from 'react'
import { Form, Input, Button, notification, Row, Col } from 'antd'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'
import { useSelector } from 'react-redux'
import LoadingComponent from './LoadingComponent'

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

const CONTACT_DETAILS = gql`
  query($id: ID!) {
    staffs(user: $id) {
      edges {
        node {
          email
          id
          contactNo
        }
      }
    }
  }
`

const UPDATE_CLINIC = gql`
  mutation UpdateStaff($id: ID!, $email: String, $mobile: String) {
    updateStaff(input: { staffData: { id: $id, email: $email, mobile: $mobile } }) {
      staff {
        id
        email
        contactNo
      }
    }
  }
`

const ContactDetails = ({ form }) => {
  const user = useSelector(state => state.user)
  const {
    data: schoolData,
    error: schoolDataError,
    loading: schoolDataLoading,
  } = useQuery(CONTACT_DETAILS, { fetchPolicy: 'no-cache', variables: { id: user.id } })

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
            id: schoolData.staffs.edges[0].node.id,
            email: values.email,
            mobile: values.phone,
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
    <Form {...formItemLayout} onSubmit={handelSubmit}>
      {schoolDataLoading && <LoadingComponent />}
      {schoolDataError && 'Opps their something is wrong'}
      {schoolData && (
        <div>
          <div className="profileTab-heading">
            <p>Contact Details</p>
          </div>
          <div className="profileForm">
            <Form.Item label="Email" className="form-label">
              {form.getFieldDecorator('email', {
                initialValue: schoolData.staffs.edges[0]?.node.email,
                rules: [{ required: true, message: 'Please give the clinic email!' }],
              })(<Input style={{ width: '300px' }} placeholder="Type clinic email" />)}
            </Form.Item>

            <Form.Item label="Phone Number" className="form-label">
              {form.getFieldDecorator('phone', {
                initialValue: schoolData.staffs.edges[0]?.node.contactNo,
                rules: [{ required: true, message: 'Please give phone number!' }],
              })(<Input style={{ width: '300px' }} placeholder="Type clinic phone number" />)}
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={updateDetailsLoading}>
                Save
              </Button>
            </Form.Item>
          </div>
        </div>
      )}
    </Form>
  )
}

export default Form.create()(ContactDetails)

import React, { useRef } from 'react'
import { Button, Form, Input } from 'antd'
import styles from './clinicalProfile.module.scss'

// Location
// Address
// Email
// Phone Number

const ContactDetailsForm = props => {
  const { form } = props
  const formRef = useRef(null)

  console.log('form==?', form)

  const saveContactDetails = () => {
    form.validateFields((error, values) => {
      console.log('error, values==>', error, values)
    })
  }

  return (
    <div className={styles.pageWrapper}>
      <Form ref={formRef} name="basic">
        <h1>ContactDetails</h1>

        <Form.Item
          label="Location"
          name="location"
          rules={[
            {
              required: true,
              message: 'Please input Location!',
            },
          ]}
        >
          {form.getFieldDecorator('location', {
            rules: [{ required: true, message: 'Please provide Location!' }],
          })(<Input placeholder="Location" />)}
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[
            {
              required: true,
              message: 'Please input Address!',
            },
          ]}
        >
          {form.getFieldDecorator('address', {
            rules: [{ required: true, message: 'Please provide Address!' }],
          })(<Input placeholder="Address" />)}
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: 'Please input Email!',
            },
          ]}
        >
          {form.getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please provide Email!' }],
          })(<Input placeholder="email" />)}
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[
            {
              required: true,
              message: 'Please input Phone Number!',
            },
          ]}
        >
          {form.getFieldDecorator('phoneNumber', {
            rules: [{ required: true, message: 'Please provide Phone Number!' }],
          })(<Input placeholder="Phone Number" />)}
        </Form.Item>

        <Form.Item>
          <Button onClick={saveContactDetails} type="primary" htmlType="submit">
            Save contact details
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

const ContactDetails = Form.create()(ContactDetailsForm)
export default ContactDetails

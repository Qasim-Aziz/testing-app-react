import React, { useRef } from 'react'
import { Button, Form, Input } from 'antd'
import styles from './clinicalProfile.module.scss'

const InvoiceInformationForm = props => {
  const { form } = props
  const formRef = useRef(null)

  console.log('form==?', form)

  const saveInvoiceInformation = () => {
    form.validateFields((error, values) => {
      console.log('error, values==>', error, values)
    })
  }

  return (
    <div className={styles.pageWrapper}>
      <Form ref={formRef} name="basic">
        <div className={styles.pageTitle}>
          <strong>Invoice Information</strong>
        </div>

        <Form.Item
          label="Bank Information"
          name="bankInformation"
          rules={[
            {
              required: true,
              message: 'Please input Bank Information!',
            },
          ]}
        >
          {form.getFieldDecorator('bankInformation', {
            rules: [{ required: true, message: 'Please provide Bank Information!' }],
          })(<Input placeholder="Bank Information" />)}
        </Form.Item>
        <Form.Item
          label="PhonePe"
          name="phonePe"
          rules={[
            {
              required: true,
              message: 'Please input PhonePe!',
            },
          ]}
        >
          {form.getFieldDecorator('phonePe', {
            rules: [{ required: true, message: 'Please provide PhonePe!' }],
          })(<Input placeholder="PhonePe" />)}
        </Form.Item>

        <Form.Item
          label="Paytm"
          name="paytm"
          rules={[
            {
              required: true,
              message: 'Please input Paytm!',
            },
          ]}
        >
          {form.getFieldDecorator('paytm', {
            rules: [{ required: true, message: 'Please provide Paytm!' }],
          })(<Input placeholder="Paytm" />)}
        </Form.Item>

        <Form.Item
          label="UPI ID"
          name="upiId"
          rules={[
            {
              required: true,
              message: 'Please input UPI ID!',
            },
          ]}
        >
          {form.getFieldDecorator('upiId', {
            rules: [{ required: true, message: 'Please provide UPI ID!' }],
          })(<Input placeholder="UPI ID" />)}
        </Form.Item>

        <Form.Item>
          <Button onClick={saveInvoiceInformation} type="primary" htmlType="submit">
            Save Email Notification
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

const InvoiceInformation = Form.create()(InvoiceInformationForm)
export default InvoiceInformation

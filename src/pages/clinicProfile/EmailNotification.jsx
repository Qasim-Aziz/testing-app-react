import React, { useRef } from 'react'
import { Button, Form, Input } from 'antd'
import styles from './clinicalProfile.module.scss'

const EmailNotificationForm = props => {
  const { form } = props
  const formRef = useRef(null)

  console.log('form==?', form)

  const saveEmailNotification = () => {
    form.validateFields((error, values) => {
      console.log('error, values==>', error, values)
      // isError = error
      // formValues = values
    })
  }

  return (
    <div className={styles.pageWrapper}>
      <Form ref={formRef} name="basic">
        <div className={styles.pageTitle}>
          <strong>Email Notification</strong>
        </div>

        <Form.Item
          label="Parent Id"
          name="parentId"
          rules={[
            {
              required: true,
              message: 'Please input Parent Id!',
            },
          ]}
        >
          {form.getFieldDecorator('parentId', {
            rules: [{ required: true, message: 'Please providePparent Id!' }],
          })(<Input placeholder="Parent Id" />)}
        </Form.Item>
        <Form.Item
          label="Therapist ID"
          name="therapistID"
          rules={[
            {
              required: true,
              message: 'Please input Therapist ID!',
            },
          ]}
        >
          {form.getFieldDecorator('therapistID', {
            rules: [{ required: true, message: 'Please provide Therapist ID!' }],
          })(<Input placeholder="Therapist ID" />)}
        </Form.Item>

        <Form.Item>
          <Button onClick={saveEmailNotification} type="primary" htmlType="submit">
            Save Email Notification
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

const EmailNotification = Form.create()(EmailNotificationForm)
export default EmailNotification

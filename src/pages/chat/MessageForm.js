/* eslint-disable no-shadow */
import React from 'react'
import { Form, Button, Input } from 'antd'
import { SendOutlined } from '@ant-design/icons'
import { COLORS } from 'assets/styles/globalStyles'
import './style.scss'

export default Form.create()(({ form, socket, style, loading, setLoading }) => {
  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        setLoading(true)
        socket.sendMessage(JSON.stringify({ message: values.message }))
        form.resetFields()
      }
    })
  }

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        backgroundColor: COLORS.palleteLight,
        padding: '10px 16px',
        height: 60,
        ...style,
      }}
      className="message-view"
    >
      <Form
        onSubmit={handleSubmit}
        style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Form.Item style={{ width: '90%' }}>
          {form.getFieldDecorator('message', {
            rule: [{ required: true, message: 'Type what you want to say' }],
          })(
            <Input
              placeholder="Type a message"
              autoComplete="off"
              style={{ borderRadius: '45px', height: 40, border: 'none' }}
            />,
          )}
        </Form.Item>
        <Button type="link" htmlType="submit">
          <SendOutlined style={{ fontSize: 28, color: '#919191' }} />
        </Button>
      </Form>
    </div>
  )
})

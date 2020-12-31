/* eslint-disable no-shadow */
import React from 'react'
import { Form, Button, Input } from 'antd'

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
    <Form
      style={{
        width: 'calc(100% - 38.5px)',
        display: 'flex',
        justifyContent: 'space-between',
        height: 60,
        ...style,
      }}
      onSubmit={handleSubmit}
    >
      <Form.Item style={{ width: 'calc(100% - 110px)' }}>
        {form.getFieldDecorator('message', {
          rule: [{ required: true, message: 'Type what you want to say' }],
        })(
          <Input
            placeholder="Write Something"
            style={{ height: 60, borderRadius: '4px 0px 0px 4px' }}
          />,
        )}
      </Form.Item>
      <Button
        type="primary"
        htmlType="submit"
        style={{
          width: 110,
          background: '#0B35B3',
          borderRadius: '0px 4px 4px 0px',
          fontSize: 16,
          fontWeight: 'bold',
          height: 60,
        }}
        loading={loading}
      >
        {loading ? 'Sending' : 'Send'}
      </Button>
    </Form>
  )
})

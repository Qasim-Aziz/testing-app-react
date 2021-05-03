import { Button, Card, Form, Input } from 'antd'
import React from 'react'
import DragFile from './DragFile'

const NewAuthorization = () => {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }

  const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not a valid email!',
      number: '${label} is not a valid number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  }
  return (
    <>
      <div className="authorization_container">
        <Card>
          <Form {...layout} name="nest-messages" validateMessages={validateMessages}>
            <Form.Item name={['user', 'name']} label="Contact Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name={['user', 'document']}
              label="Name of Ducument"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name={['user', 'description']} label="description">
              <Input.TextArea />
            </Form.Item>
            <hr style={{ marginTop: '30px', marginBottom: '30px' }} />
            <DragFile text="Select Files" />
            <Form.Item
              style={{ marginTop: '30px' }}
              wrapperCol={{ ...layout.wrapperCol, offset: 8 }}
            >
              <Button className="btn" type="secondari" htmlType="submit">
                Continue Without a Document
              </Button>
            </Form.Item>
          </Form>
          <p className="toMore">
            <span>!</span> Click here for a video walkthrough of entering an authorization
          </p>
        </Card>
      </div>
    </>
  )
}

export default NewAuthorization

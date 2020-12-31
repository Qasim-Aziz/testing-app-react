/* eslint-disable no-shadow */
import React, { useEffect } from 'react'
import { Form, Input, Select, Button, notification } from 'antd'
import './form.scss'
import { useMutation } from 'react-apollo'
import { UPDATE_BLOG } from './query'

const { Option } = Select
const { TextArea } = Input

const UpdateBlogForm = ({ form, setOpen, node }) => {
  const [createBlog, { data, error, loading }] = useMutation(UPDATE_BLOG)

  useEffect(() => {
    if (data) {
      notification.success({
        message: 'Blog data updated sucessfully',
      })
      form.resetFields()
      setOpen(false)
    }
    if (error) {
      notification.error({
        message: 'Opps faild to update blog',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error])

  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        createBlog({
          variables: {
            id: node.id,
            group: node.category.id, // here catergory means group
            title: values.title,
            category: values.category,
            description: values.content,
          },
        })
      }
    })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item label="Title">
        {form.getFieldDecorator('title', {
          initialValue: node.title,
          rules: [{ required: true, message: 'Title is required' }],
        })(<Input size="large" placeholder="Give the blog title" />)}
      </Form.Item>
      <Form.Item label="Catagory">
        {form.getFieldDecorator('category', {
          initialValue: node.blogCategory.edges.map(({ node }) => node.id),
          rules: [{ required: true, message: 'Blog category is required' }],
        })(
          <Select size="large" placeholder="Select a blog catagory">
            <Option key="1" value="Q29tbXVuaXR5R3JvdXBzVHlwZTox">
              Travle
            </Option>
            <Option key="2" value="Q29tbXVuaXR5QmxvZ3NDYXRlZ29yeVR5cGU6MQ==">
              Cagerory 1
            </Option>
          </Select>,
        )}
      </Form.Item>
      <Form.Item label="Content">
        {form.getFieldDecorator('content', {
          initialValue: node.description,
          rules: [{ required: true, message: 'Type blog content' }],
        })(<TextArea style={{ height: 150 }} />)}
      </Form.Item>

      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
        <Button
          type="primary"
          htmlType="submit"
          style={{
            width: '45%',
            height: 45,
            fontSize: '1.3rem',
          }}
          loading={loading}
        >
          Update
        </Button>
        <Button
          type="danger"
          style={{
            width: '45%',
            height: 45,
            fontSize: '1.3rem',
          }}
          onClick={() => {
            form.resetFields()
            setOpen(false)
          }}
        >
          Cancle
        </Button>
      </div>
    </Form>
  )
}

export default Form.create()(UpdateBlogForm)

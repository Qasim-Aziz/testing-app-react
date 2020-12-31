import React, { useEffect, useState } from 'react'
import { Form, Input, Select, Button, notification, Modal } from 'antd'
import './form.scss'
import { useMutation, useQuery } from 'react-apollo'
import { PlusOutlined } from '@ant-design/icons'
import { CREATE_BLOG, GET_BLOGS, GET_BLOG_CATAGOREYS, CREATE_BLOG_CATAGORY } from './query'

const { Option } = Select
const { TextArea } = Input

const BlogForm = ({ form, setOpen, groupId }) => {
  const [createCatagoryModel, setCreateCatagoryModel] = useState(false)

  const { data: blogCatagory, loading: blogCatagoryLoading, refetch: catagoryRefetch } = useQuery(
    GET_BLOG_CATAGOREYS,
  )

  const [createBlog, { data, error, loading }] = useMutation(CREATE_BLOG, {
    update(
      cache,
      {
        data: {
          addCommunityBlogs: { details },
        },
      },
    ) {
      const cacheData = cache.readQuery({ query: GET_BLOGS, variables: { group: groupId } })
      cache.writeQuery({
        query: GET_BLOGS,
        variables: { group: groupId },
        data: {
          communityBlogs: {
            edges: [
              {
                node: details,
                __typename: 'CommunityBlogsType',
              },
              ...cacheData.communityBlogs.edges,
            ],
            __typename: 'CommunityBlogsTypeConnection',
          },
        },
      })
    },
  })

  useEffect(() => {
    if (data) {
      notification.success({
        message: 'New blog added sucessfully',
      })
      form.resetFields()
      setOpen(false)
    }
    if (error) {
      notification.error({
        message: 'Opps faild to create blog',
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
            title: values.title,
            category: values.category,
            description: values.content,
            group: groupId,
          },
        })
      }
    })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item label="Title">
        {form.getFieldDecorator('title', {
          rules: [{ required: true, message: 'Title is required' }],
        })(<Input size="large" placeholder="Give the blog title" />)}
      </Form.Item>

      <div style={{ position: 'relative' }}>
        <Button
          onClick={() => setCreateCatagoryModel(true)}
          style={{ position: 'absolute', right: 0, top: 0, zIndex: 1000 }}
        >
          <PlusOutlined />
        </Button>
        <Form.Item label="Catagory">
          {form.getFieldDecorator('category', {
            rules: [{ required: true, message: 'Blog category is required' }],
          })(
            <Select
              loading={blogCatagoryLoading}
              size="large"
              placeholder="Select a blog catagory"
              mode="multiple"
            >
              {blogCatagory?.communityGroupsCategoryList.map(({ id, name }) => (
                <Option key={id} value={id}>
                  {name}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
      </div>

      <Form.Item label="Content">
        {form.getFieldDecorator('content', {
          rules: [{ required: true, message: 'Type blog content' }],
        })(<TextArea style={{ height: 150 }} />)}
      </Form.Item>

      <div>
        <Button
          type="primary"
          htmlType="submit"
          style={{
            width: 150,
            height: 45,
            fontSize: '1.3rem',
          }}
          loading={loading}
        >
          Create
        </Button>
      </div>

      <Modal
        visible={createCatagoryModel}
        onCancel={() => setCreateCatagoryModel(false)}
        title="Create Blog Catagory"
        footer={false}
      >
        <CreateCatagoryForm refetch={catagoryRefetch} setOpen={setCreateCatagoryModel} />
      </Modal>
    </Form>
  )
}

const CreateCatagoryForm = Form.create()(({ form, setOpen, refetch }) => {
  const [createCatagory, { data, error, loading }] = useMutation(CREATE_BLOG_CATAGORY)

  useEffect(() => {
    if (data) {
      notification.success({
        message: 'New blog catagory created sucessfully',
      })
      form.resetFields()
      setOpen(false)
      refetch()
    }

    if (error) {
      notification.error({
        message: 'New blog catagory creation failed',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error])

  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        createCatagory({
          variables: {
            name: values.name,
          },
        })
      }
    })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item label="Name">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: 'Name is required' }],
        })(<Input size="large" placeholder="Give the catagory name" />)}
      </Form.Item>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="primary"
          htmlType="submit"
          style={{
            width: 150,
            height: 40,
            fontSize: '1.3rem',
          }}
          loading={loading}
        >
          Create
        </Button>
      </div>
    </Form>
  )
})

export default Form.create()(BlogForm)

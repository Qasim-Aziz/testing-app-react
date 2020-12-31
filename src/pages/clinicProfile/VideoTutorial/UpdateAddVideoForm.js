/* eslint-disable import/extensions */
import React, { useEffect } from 'react'
import { Button, Input, Form, notification } from 'antd'
import { useMutation } from 'react-apollo'
import { EDIT_VIDEO } from '../query'

const NewVideoModuleormBasic = ({ form, setOpen, videoDetails }) => {
  const [
    editVideo,
    { data: editVideoData, error: editVideoError, loading: editVideoLoading },
  ] = useMutation(EDIT_VIDEO)

  useEffect(() => {
    if (editVideoError) {
      notification.error({
        message: 'Opps their something is wrong to update video info',
      })
    }
    if (editVideoData) {
      notification.success({
        message: 'video data updated sucessfully',
      })
      setOpen(null)
      form.resetFields()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editVideoData, editVideoError])

  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error) {
        editVideo({
          variables: {
            videoId: videoDetails.id,
            name: values.name,
            description: values.description,
            url: values.url,
          },
        })
      }
    })
  }

  return (
    <Form name="addVideoForm" onSubmit={handleSubmit}>
      <Form.Item label="Video Name" style={{ display: 'inline-block', width: '100%' }}>
        {form.getFieldDecorator('name', {
          initialValue: videoDetails?.name,
          rules: [{ required: true, message: 'Please enter video name' }],
        })(<Input placeholder="Give the video name" size="large" />)}
      </Form.Item>
      <Form.Item label="Video URL" style={{ display: 'inline-block', width: '100%' }}>
        {form.getFieldDecorator('url', {
          initialValue: videoDetails?.url,
          rules: [{ required: true, message: 'Please enter the video url' }],
        })(<Input placeholder="Give the video url" size="large" />)}
      </Form.Item>
      <Form.Item label="Video Description" style={{ display: 'inline-block', width: '100%' }}>
        {form.getFieldDecorator('description', {
          initialValue: videoDetails?.description,
        })(<Input placeholder="Give the video description" size="large" />)}
      </Form.Item>
      <Button
        type="primary"
        htmlType="submit"
        style={{ marginTop: 0, fontSize: 16, width: '100%', height: 40 }}
        loading={editVideoLoading}
      >
        Update Video
      </Button>
    </Form>
  )
}

export default Form.create()(NewVideoModuleormBasic)

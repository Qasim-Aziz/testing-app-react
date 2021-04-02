/* eslint-disable import/extensions */
import React, { useEffect } from 'react'
import { Button, Input, Form, notification } from 'antd'
import { useMutation } from 'react-apollo'
import { CLINIC_MODULES, ADD_VIDEO_LIBERARY } from '../query'
import { FORM, SUBMITT_BUTTON } from '../../../assets/styles/globalStyles'

const NewVideoModuleormBasic = ({ form, setOpen, liberaryId, clinicId }) => {
  const [
    addVideo,
    { data: addVideoData, error: addVideoError, loading: addVideoLoading },
  ] = useMutation(ADD_VIDEO_LIBERARY, {
    update(cache, { data }) {
      const clinicModulesCache = cache.readQuery({
        query: CLINIC_MODULES,
        variables: {
          clinicId,
        },
      })
      cache.writeQuery({
        query: CLINIC_MODULES,
        variables: {
          clinicId,
        },
        data: {
          getClinicLibrary: {
            edges: clinicModulesCache.getClinicLibrary.edges.map(({ node }) => {
              if (node.id === liberaryId) {
                node.videos.edges = data.addVideoToLibrary.details.videos.edges
              }
              return { node }
            }),
            __typename: 'ClinicVideoLibraryTypeConnection',
          },
        },
      })
    },
  })

  useEffect(() => {
    if (addVideoError) {
      notification.error({
        message: 'Opps their something is wrong',
      })
    }
    if (addVideoData) {
      notification.success({
        message: 'New video module created sucessfully',
      })
      setOpen(null)
      form.resetFields()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addVideoData, addVideoError])

  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error) {
        addVideo({
          variables: {
            liberaryId,
            name: values.name,
            description: values.description,
            url: values.url,
          },
        })
      }
    })
  }

  return (
    <Form {...FORM.layout} name="addVideoForm" onSubmit={handleSubmit}>
      <Form.Item label="Video Name" style={{ display: 'inline-block', width: '100%' }}>
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: 'Please enter video name' }],
        })(<Input placeholder="Give the video name" size="large" />)}
      </Form.Item>
      <Form.Item label="Video URL" style={{ display: 'inline-block', width: '100%' }}>
        {form.getFieldDecorator('url', {
          rules: [{ required: true, message: 'Please enter the video url' }],
        })(<Input placeholder="Give the video url" size="large" />)}
      </Form.Item>
      <Form.Item label="Video Description" style={{ display: 'inline-block', width: '100%' }}>
        {form.getFieldDecorator('description')(
          <Input placeholder="Give the video description" size="large" />,
        )}
      </Form.Item>
      <Form.Item {...FORM.tailLayout}>
        <Button type="primary" htmlType="submit" style={SUBMITT_BUTTON} loading={addVideoLoading}>
          Add Video
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Form.create()(NewVideoModuleormBasic)

/* eslint-disable import/extensions */
import React, { useEffect } from 'react'
import { Button, Input, Form, notification } from 'antd'
import { useMutation } from 'react-apollo'
import { UPDATE_MODULE } from '../query'

const UpdateVideoModuleormBasic = ({ form, setOpen, module }) => {
  const [
    updateModule,
    { data: updateModuleData, error: updateModuleError, loading: updateModuleLoading },
  ] = useMutation(UPDATE_MODULE)

  useEffect(() => {
    if (updateModuleError) {
      notification.error({
        message: 'Opps their something is wrong',
      })
    }
    if (updateModuleData) {
      notification.success({
        message: 'Video module data updated sucessfully',
      })
      setOpen(null)
      form.resetFields()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateModuleData, updateModuleError])

  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error) {
        updateModule({
          variables: {
            id: module.id,
            name: values.name,
            description: values.description,
          },
        })
      }
    })
  }

  return (
    <Form name="moduleForm" onSubmit={handleSubmit}>
      <Form.Item label="Video Module Name" style={{ display: 'inline-block', width: '100%' }}>
        {form.getFieldDecorator('name', {
          initialValue: module?.name,
          rules: [{ required: true, message: 'Please enter From Status' }],
        })(<Input placeholder="Give the video module name" size="large" />)}
      </Form.Item>
      <Form.Item
        label="Video Module Description"
        style={{ display: 'inline-block', width: '100%' }}
      >
        {form.getFieldDecorator('description', {
          initialValue: module?.description,
        })(<Input placeholder="Give the video module description" size="large" />)}
      </Form.Item>
      <Button
        type="primary"
        htmlType="submit"
        style={{ marginTop: 0, fontSize: 16, width: '100%', height: 40 }}
        loading={updateModuleLoading}
      >
        Update Video Module
      </Button>
    </Form>
  )
}

export default Form.create()(UpdateVideoModuleormBasic)

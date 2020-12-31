/* eslint-disable import/extensions */
import React, { useEffect } from 'react'
import { Button, Input, Form, notification } from 'antd'
import { useQuery, useMutation } from 'react-apollo'
import { CREATE_MODULE, CLINIC_MODULES, CLINIC_QUERY } from '../query'

const NewVideoModuleormBasic = ({ form, setOpen, clinicId }) => {
  const { data: clinciData, error: clinicError, loading: clinicLoading } = useQuery(CLINIC_QUERY)

  const [
    createModule,
    { data: createModuleData, error: createModuleError, loading: createModuleLoading },
  ] = useMutation(CREATE_MODULE, {
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
            edges: [
              {
                node: data.addClinicVideoLibrary.details,
                __typename: 'ClinicVideoLibraryTypeEdge',
              },
              ...clinicModulesCache.getClinicLibrary.edges,
            ],
            __typename: 'ClinicVideoLibraryTypeConnection',
          },
        },
      })
    },
  })

  useEffect(() => {
    if (createModuleError) {
      notification.error({
        message: 'Opps their something is wrong',
      })
    }
    if (createModuleData) {
      notification.success({
        message: 'New video module created sucessfully',
      })
      setOpen(null)
      form.resetFields()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createModuleData, createModuleError])

  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error) {
        if (!clinicError && !clinicLoading) {
          createModule({
            variables: {
              clinic: clinciData.schooldetail.id,
              name: values.name,
              description: values.description,
            },
          })
        } else {
          notification.error("School info can't find. Plese reload the page and try agin")
        }
      }
    })
  }

  return (
    <Form name="targetForm" onSubmit={handleSubmit}>
      <Form.Item label="Video Module Name" style={{ display: 'inline-block', width: '100%' }}>
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: 'Please enter From Status' }],
        })(<Input placeholder="Give the video module name" size="large" />)}
      </Form.Item>
      <Form.Item
        label="Video Module Description"
        style={{ display: 'inline-block', width: '100%' }}
      >
        {form.getFieldDecorator('description', {
          rules: [{ required: true, message: 'Video description is required' }],
        })(<Input placeholder="Give the video module description" size="large" />)}
      </Form.Item>
      <Button
        type="primary"
        htmlType="submit"
        style={{ marginTop: 0, fontSize: 16, width: '100%', height: 40 }}
        loading={createModuleLoading}
      >
        Create Video Module
      </Button>
    </Form>
  )
}

export default Form.create()(NewVideoModuleormBasic)

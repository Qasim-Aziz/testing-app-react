/* eslint-disable no-shadow */
import React, { useEffect } from 'react'
import { Input, Button, Form, notification } from 'antd'
import { useMutation, useQuery } from 'react-apollo'
import { useSelector } from 'react-redux'
import { UPDATE_GROUP, GROUP_DETAILS } from './query'
import './form.scss'

const { TextArea } = Input

export default Form.create()(({ form, groupId, setOpen }) => {
  const userId = useSelector(state => state.user.id)

  const { data, error, loading } = useQuery(GROUP_DETAILS, {
    variables: {
      groupId,
    },
  })

  const [
    updateGroup,
    { data: updateData, error: updateError, loading: updateLoading },
  ] = useMutation(UPDATE_GROUP, {
    variables: {
      groupId,
      user: [userId],
    },
  })

  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Failed to load group info',
      })
    }
  }, [error])

  useEffect(() => {
    if (updateData) {
      notification.success({
        message: 'Update the group sucessfully',
      })
      setOpen(false)
      form.resetFields()
    }
    if (updateError) {
      notification.error({
        message: 'Opps something is worng when try to update the group',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateData, updateError])

  const handelSubmit = e => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error) {
        updateGroup({
          variables: {
            name: values.name,
            description: values.description,
          },
        })
      }
    })
  }

  if (loading) {
    return <h4>Loading...</h4>
  }

  return (
    <Form onSubmit={handelSubmit}>
      <Form.Item label="Name">
        {form.getFieldDecorator('name', {
          initialValue: data?.communityGroupsDetails.name,
          rules: [{ required: true, message: 'Please give the group name' }],
        })(
          <Input
            placeholder="Type the group name"
            size="large"
            style={{
              border: '1.25px solid #D5D5D5',
              borderRadius: '4px 0 0 4px',
              height: 60,
            }}
          />,
        )}
      </Form.Item>
      <Form.Item label="Description">
        {form.getFieldDecorator('description', {
          initialValue: data?.communityGroupsDetails.description,
        })(
          <TextArea
            placeholder="Give a group description"
            size="large"
            style={{
              border: '1.25px solid #D5D5D5',
              borderRadius: '4px 0 0 4px',
              height: 120,
            }}
          />,
        )}
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{
            height: 50,
            width: 110,
            background: '#0B35B3',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            borderRadius: 6,
          }}
          loading={updateLoading}
        >
          Update
        </Button>
      </Form.Item>
    </Form>
  )
})

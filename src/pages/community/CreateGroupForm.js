/* eslint-disable no-shadow */
import React, { useEffect } from 'react'
import { Input, Button, Form, notification } from 'antd'
import { useMutation } from 'react-apollo'
import { CREATE_GROUP, GET_GROUPS } from './query'
import gp from '../../images/girl.jpg'

export default Form.create()(({ form }) => {
  const [createGroup, { data, error, loading }] = useMutation(CREATE_GROUP, {
    update(
      cache,
      {
        data: {
          addCommunityGroup: { details },
        },
      },
    ) {
      const data = cache.readQuery({ query: GET_GROUPS })

      cache.writeQuery({
        query: GET_GROUPS,
        data: {
          communityGroups: [details, ...data.communityGroups],
        },
      })
      console.log(details)
      console.log(data)
    },
  })

  useEffect(() => {
    if (data) {
      notification.success({
        message: 'Creata a new group sucessfully',
      })
      form.resetFields()
    }
    if (error) {
      notification.error({
        message: 'Opps something is worng when try to create a new group',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error])

  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        createGroup({
          variables: {
            name: values.name,
            description: 'description',
          },
        })
      }
    })
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <div
        style={{
          width: 60,
          minWidth: 60,
          height: 60,
          borderRadius: 6,
          overflow: 'hidden',
        }}
      >
        <img src={gp} alt="not_found" style={{ width: '100%', height: '100%' }} />
      </div>
      <Form onSubmit={handleSubmit} style={{ width: '100%', marginLeft: 37, display: 'flex' }}>
        <Form.Item style={{ width: '100%', maxWidth: 706 }}>
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: 'Please give the group name' }],
          })(
            <Input
              placeholder="Type the group name"
              size="large"
              style={{
                border: '1.25px solid #D5D5D5',
                borderRadius: '4px 0 0 4px',
                borderRight: 0,
                height: 60,
              }}
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              height: 60,
              width: 110,
              background: '#0B35B3',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              borderRadius: '0 4px 4px 0px',
            }}
            loading={loading}
          >
            Create
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
})

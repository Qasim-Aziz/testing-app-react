/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
import React, { useEffect } from 'react'
import { Input, Button, Form, notification, Select } from 'antd'
import { useMutation } from 'react-apollo'
import { ADD_DOCTOR, GET_DOCTORS } from './query'
import './form.scss'

const { Option } = Select

export default Form.create()(({ form, setDoctorDrawer }) => {
  const [createDoctor, { data, error, loading }] = useMutation(ADD_DOCTOR, {
    update(
      cache,
      {
        data: {
          addDoctor: { details },
        },
      },
    ) {
      const cacheData = cache.readQuery({ query: GET_DOCTORS })
      console.log(cacheData.getDoctors.edges)
      cache.writeQuery({
        query: GET_DOCTORS,
        data: {
          getDoctors: {
            edges: [{ node: details, __typename: 'DoctorsType' }, ...cacheData.getDoctors.edges],
            __typename: 'DoctorsTypeConnection',
          },
        },
      })
    },
  })

  useEffect(() => {
    if (data) {
      notification.success({
        message: 'New doctor created sucessfully',
      })
      setDoctorDrawer(false)
      form.resetFields()
    }
    if (error) {
      notification.error({
        message: 'New doctor creation failed',
      })
    }
  }, [data, error])

  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error) {
        createDoctor({
          variables: {
            qualification: values.qualification,
            name: values.name,
            location: values.location,
            association: values.association,
            practicingArea: values.practicingArea,
          },
        })
      }
    })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item label="Name">
        {form.getFieldDecorator('name', {
          rules: [
            {
              required: true,
              message: 'Please give the doctor name',
            },
          ],
        })(<Input placeholder="Doctor's Name" size="large" />)}
      </Form.Item>
      <Form.Item label="Qualification">
        {form.getFieldDecorator('qualification', {
          rules: [
            {
              required: true,
              message: 'Please give the doctor qualification',
            },
          ],
        })(<Input placeholder="Doctor's qualification" size="large" />)}
      </Form.Item>
      <Form.Item label="Location">
        {form.getFieldDecorator('location', {
          rules: [
            {
              required: true,
              message: 'Please give the doctor location',
            },
          ],
        })(<Input placeholder="Doctor's location" size="large" />)}
      </Form.Item>
      <Form.Item label="Association">
        {form.getFieldDecorator('association', {
          rules: [
            {
              required: true,
              message: 'Please give the doctor association',
            },
          ],
        })(<Input placeholder="Doctor's Association" size="large" />)}
      </Form.Item>
      <Form.Item label="Practicing Area">
        {form.getFieldDecorator('practicingArea', {
          rules: [
            {
              required: true,
              message: 'Please select the doctor practicing area',
            },
          ],
        })(
          <Select placeholder="Doctor's practicing area" size="large">
            <Option key="1" value="Pediatrics">
              Pediatrics
            </Option>
            <Option key="2" value="OT">
              OT
            </Option>
            <Option key="3" value="Speech">
              Speech
            </Option>
            <Option key="4" value="ABA">
              ABA
            </Option>
          </Select>,
        )}
      </Form.Item>
      <Form.Item>
        <Button
          htmlType="submit"
          type="primary"
          style={{
            width: 110,
            height: 45,
            fontSize: 14,
            fontWeight: 600,
          }}
          loading={loading}
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
})

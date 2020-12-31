/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
import React, { useEffect } from 'react'
import { Input, Button, Form, notification, Select } from 'antd'
import { useMutation, useQuery } from 'react-apollo'
import { UPDATE_DOCTOR, GET_DOCTOR } from './query'
import './form.scss'

const { Option } = Select

export default Form.create()(({ form, setUpdateDoctor, updateDoctor }) => {
  const { data, error, loading } = useQuery(GET_DOCTOR, {
    variables: {
      doctorId: updateDoctor,
    },
  })

  const [
    updateDoctorData,
    { data: updatedData, error: updateError, loading: updateLoading },
  ] = useMutation(UPDATE_DOCTOR)

  useEffect(() => {
    if (updatedData) {
      notification.success({
        message: 'Updated doctors sucessfully',
      })
      setUpdateDoctor(null)
    }
    if (updateError) {
      notification.error({
        message: "Doctor's data update failed",
      })
    }
  }, [updatedData, updateError])

  if (loading) {
    return <h4>Loading...</h4>
  }

  if (error) {
    return <h5>Opps their are something wrong</h5>
  }

  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error) {
        updateDoctorData({
          variables: {
            id: updateDoctor,
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
          initialValue: data.doctorDetail.name,
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
          initialValue: data.doctorDetail.qualification,
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
          initialValue: data.doctorDetail.location,
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
          initialValue: data.doctorDetail.association,
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
          initialValue: data.doctorDetail.practicingArea,
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
          loading={updateLoading}
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
})

import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Select, notification, TimePicker } from 'antd'

import gql from 'graphql-tag'
import { FORM, SUBMITT_BUTTON } from 'assets/styles/globalStyles'
import { useMutation, useQuery } from 'react-apollo'
import './workForm.scss'
import TextArea from 'antd/lib/input/TextArea'

const { Option } = Select
const { layout } = FORM

const ADD_TIMESHEET_DATA = gql`
  mutation CreateTimesheet(
    $title: String!
    $location: ID!
    $note: String
    $start: DateTime!
    $end: DateTime!
    $isApproved: Boolean
    $isBillable: Boolean
  ) {
    CreateTimesheet(
      input: {
        timesheet: {
          title: $title
          location: $location
          note: $note
          start: $start
          end: $end
          isApproved: $isApproved
          isBillable: $isBillable
        }
      }
    ) {
      timesheet {
        id
      }
    }
  }
`

const SCHOOL_LOCATION = gql`
  query {
    schoolLocation {
      edges {
        node {
          id
          location
        }
      }
    }
  }
`

function WorkLogForm({ form, style, setNewLogCreated }) {
  const { data: locationData, loading: locationLoading } = useQuery(SCHOOL_LOCATION)

  const [CreateLog, { loading }] = useMutation(ADD_TIMESHEET_DATA)

  const SubmitForm = e => {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        CreateLog({
          variables: {
            title: values.title,
            location: values.geoLocation,
            note: values.note,
            start: values.startTime,
            end: values.endTime,
            isApproved: true,
            isBillable: true,
          },
        })
          .then(res => {
            console.log(res)
            notification.success({
              message: 'Work Data',
              description: 'New Work Log Added Successfully',
            })
            setNewLogCreated(true)
          })
          .catch(er => {
            console.log(er)
            notification.error({
              message: 'Somthing went wrong',
              description: 'Unable to create work log',
            })
          })
      }
    })
  }

  return (
    <Form onSubmit={SubmitForm} name="control-ref" style={{ marginLeft: 0, ...style }}>
      <Form.Item label="Title">
        {form.getFieldDecorator('title', {
          rules: [{ required: true, message: 'Please provide Month!' }],
        })(<Input required size="large" placeholder="title" />)}
      </Form.Item>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Form.Item style={{ width: '47%' }} label="Start Time">
          {form.getFieldDecorator('startTime', {
            rules: [{ required: true, message: 'Please provide Month!' }],
          })(<TimePicker style={{ width: '100%' }} size="large" />)}
        </Form.Item>
        <Form.Item label="End Time" style={{ width: '47%' }}>
          {form.getFieldDecorator('endTime', {
            rules: [{ required: true, message: 'Please provide Month!' }],
          })(<TimePicker style={{ width: '100%' }} size="large" />)}
        </Form.Item>
      </div>

      <Form.Item label="Geolocation">
        {form.getFieldDecorator('geoLocation', {
          rules: [{ required: true, message: 'Please provide Month!' }],
        })(
          <Select size="large" showSearch optionFilterProp="location" loading={locationLoading}>
            {locationData &&
              locationData.schoolLocation.edges.map(({ node }) => (
                <Option value={node.id} key={node.id} location={node.location}>
                  {node.location}
                </Option>
              ))}
          </Select>,
        )}
      </Form.Item>

      <Form.Item label="Note">
        {form.getFieldDecorator('note', {
          rules: [{ required: true, message: 'Please provide Month!' }],
        })(<TextArea style={{ width: '100%', resize: 'none', height: 150 }} />)}
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          style={{ ...SUBMITT_BUTTON, width: '100%' }}
        >
          Add Data
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Form.create()(WorkLogForm)

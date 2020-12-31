/* eslint-disable react/jsx-indent */
import React, { useEffect, useState } from 'react'
import { Form, Input, Button, Select, notification, DatePicker, Checkbox, TimePicker } from 'antd'
import gql from 'graphql-tag'
import { useSelector } from 'react-redux'
import { useMutation, useQuery } from 'react-apollo'
import moment from 'moment'
import './appiorMentForm.scss'
import { dateTimeToUtc, timeToUtc, dateTimeToDate } from '../../utilities'

// const moment = require('moment-timezone');

const { TextArea } = Input
const { Option } = Select

const layout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 12,
  },
}
const tailLayout = {
  wrapperCol: {
    offset: 10,
    span: 12,
  },
}

const CREATE_APPIORMENTS = gql`
  mutation CreateAppointment(
    $therapistId: ID!
    $studentId: ID!
    $locationId: ID
    $title: String
    $purposeAssignment: String!
    $note: String
    $start: DateTime!
    $end: DateTime!
    $startDate:String!
    $endDate:String!
    $startTime:String!
    $endTime:String!
    $enableRecurring:Boolean!
    $isApproved:Boolean!
  ) {
    CreateAppointment(
      input: {
        appointment: {
          therapist: $therapistId
          student: $studentId
          location: $locationId
          title: $title
          purposeAssignment: $purposeAssignment
          note: $note
          start: $start
          end: $end
          isApproved:$isApproved
        }
        recurring:{
          enableRecurring:$enableRecurring
          startDate:$startDate
          endDate:$endDate
          startTime:$startTime
          endTime:$endTime
        }
      }
    ) {
      appointment {
        id
      }
    }
  }
`

const ALL_STUDENT = gql`
  query {
    students {
      edges {
        node {
          id
          firstname
          internalNo
        }
      }
    }
  }
`

const ALL_THERAPIST = gql`
  query {
    staffs(userRole: "Therapist") {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`

const ALL_LOCATION = gql`
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

const AppiorMentForm = ({ setNewAppiormentCreated, form }) => {
  const userRole = useSelector(state => state.user.role)
  const therapistReduxId = useSelector(state => state.user.staffId)

  const { data: allSudent, loading: allSudentLoading } = useQuery(ALL_STUDENT)

  const { data: allTherapist, loading: allTherapistLoading } = useQuery(ALL_THERAPIST)

  const { data: allLocation, loading: allLocationLoading } = useQuery(ALL_LOCATION)

  const [recurring, setRecurring] = useState(false);

  const [
    createAppiorments,
    {
      data: createAppiormentsData,
      error: createAppiormentsError,
      loading: createAppiormentLoading,
    },
  ] = useMutation(CREATE_APPIORMENTS)

  useEffect(() => {
    if (createAppiormentsData) {
      notification.success({
        message: 'Clinic Dashboard',
        description: 'Appointment created Successfully',
      })
      form.resetFields()
      if (setNewAppiormentCreated) {
        setNewAppiormentCreated(true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createAppiormentsData])

  useEffect(() => {
    if (createAppiormentsError) {
      notification.error({
        message: 'Something went wrong!',
        description: createAppiormentsError.message,
      })
    }
  }, [createAppiormentsError])

  const handleSubmit = e => {

    e.preventDefault()
    form.validateFields((error, values) => {
      console.log("test", values.enableRecurring);

      if (!error) {
        createAppiorments({
          variables: {
            therapistId: userRole === 'therapist' ? therapistReduxId : values.therapist,
            studentId: values.student,
            title: values.title,
            locationId: values.location ? values.location : '',
            purposeAssignment: values.purposeAssignment,
            note: values.note ? values.note : '',
            enableRecurring: values.enableRecurring,
            start: dateTimeToUtc(values.startDate),
            end: dateTimeToUtc(values.endDate),
            startDate: dateTimeToDate(values.startDate),
            endDate: dateTimeToDate(values.endDate),
            startTime: timeToUtc(values.startTime),
            endTime: timeToUtc(values.endTime),
            isApproved: true
          },
        })
      }
    })
  }

  return (
    <>
      <Form
        {...layout}
        name="basic"
        style={{
          marginTop: 0,
        }}
        onSubmit={handleSubmit}
        size='small'
      >
        <Form.Item label="Title *" style={{ fontSize: 12 }}>
          {form.getFieldDecorator('title', {
            rules: [{ required: true, message: 'Please give a title' }],
          })(<Input placeholder="Title" size="large" />)}
        </Form.Item>

        <Form.Item label="Select Learner *">
          {form.getFieldDecorator('student', {
            rules: [{ required: true, message: 'Please select a Learner' }],
          })(
            <Select
              placeholder="Select Learner"
              size="large"
              loading={allSudentLoading}
              showSearch
              optionFilterProp="name"
            >
              {allSudent &&
                allSudent.students.edges.map(({ node }) => (
                  <Option key={node.id} value={node.id} name={node.firstname}>
                    {node.firstname}
                  </Option>
                ))}
            </Select>,
          )}
        </Form.Item>

        <Form.Item label="Appointment Reason *">
          {form.getFieldDecorator('purposeAssignment', {
            rules: [
              {
                required: true,
                message: 'Please give the Appointment Reason',
              },
            ],
          })(<Input placeholder="Appointment Reason" size="large" />)}
        </Form.Item>

        <Form.Item
          label="Location"
          rules={[{ required: true, message: 'Please select a location!' }]}
        >
          {form.getFieldDecorator('location')(
            <Select
              placeholder="Select Location"
              size="large"
              loading={allLocationLoading}
              showSearch
              optionFilterProp="location"
            >
              {allLocation &&
                allLocation.schoolLocation.edges.map(({ node }) => (
                  <Option key={node.id} location={node.location}>
                    {node.location}
                  </Option>
                ))}
            </Select>,
          )}
        </Form.Item>

        <Form.Item label="Recurring">
          {form.getFieldDecorator('enableRecurring')(<Checkbox checked={recurring} onChange={() => setRecurring(!recurring)} size="large" />)}
        </Form.Item>

        <Form.Item
          label="Start Date *"
          rules={[{ required: true, message: 'Please select a start time!' }]}
        >
          {form.getFieldDecorator('startDate', {
            rules: [
              {
                required: true,
                message: 'Please select the start date',
              },
            ],
          })(
            <DatePicker
              style={{
                width: '100%',
              }}
              placeholder="Start Date"
              format="YYYY-MM-DD"
              picker='date'
              showTime={{ format: 'YYYY-MM-DD', defaultValue: moment() }}
              size="large"
            />,
          )}
        </Form.Item>

        <Form.Item
          label="End Date *"
          rules={[{ required: true, message: 'Please select a end time!' }]}
        >
          {form.getFieldDecorator('endDate', {
            rules: [
              {
                required: true,
                message: 'Please select a end time',
              },
            ],
          })(
            <DatePicker
              style={{
                width: '100%',
              }}
              placeholder="End Date"
              format="YYYY-MM-DD"
              picker='date'
              showTime={{ format: 'YYYY-MM-DD', defaultValue: moment() }}
              size="large"
            />,
          )}
        </Form.Item>

        <Form.Item
          label="Start Time *"
          rules={[{ required: true, message: 'Please select a start time!' }]}
        >
          {form.getFieldDecorator('startTime', {
            rules: [
              {
                required: true,
                message: 'Please select the start date',
              },
            ],
          })(
            <TimePicker
              showTime={{ format: 'HH:mm' }}
              style={{
                width: '100%',
              }}
              placeholder="Start Time"
              format="HH:mm"
              picker='time'
              size="large"
            />,
          )}
        </Form.Item>

        <Form.Item
          label="End Time *"
          rules={[{ required: true, message: 'Please select a start time!' }]}
        >
          {form.getFieldDecorator('endTime', {
            rules: [
              {
                required: true,
                message: 'Please select the start date',
              },
            ],
          })(
            <TimePicker
              showTime={{ format: 'HH:mm' }}
              style={{
                width: '100%',
              }}
              placeholder="End Time"
              format="HH:mm"
              picker='time'
              size="large"
            />,
          )}
        </Form.Item>

        {userRole === 'therapist' ? (
          ''
        ) : (
            <Form.Item label="Select Therapist *">
              {form.getFieldDecorator('therapist', {
                rules: [
                  {
                    required: true,
                    message: 'Please select a Therapist',
                  },
                ],
              })(
                <Select
                  placeholder="Select Therapist"
                  size="large"
                  loading={allTherapistLoading}
                  showSearch
                  optionFilterProp="name"
                  mode='multiple'
                >
                  {allTherapist &&
                    allTherapist.staffs.edges.map(({ node }) => (
                      <Option key={node.id} name={node.name}>
                        {node.name}
                      </Option>
                    ))}
                </Select>,
              )}
            </Form.Item>
          )}

        <Form.Item label="Note">
          {form.getFieldDecorator('note')(
            <TextArea
              placeholder="Take a note"
              style={{
                height: 150,
                resize: 'none',
              }}
            />,
          )}
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              width: 180,
              height: 40,
              background: '#0B35B3',
              marginTop: 15,
              marginBottom: 20,
            }}
            loading={createAppiormentLoading}
          >
            Create Appointment
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default Form.create()(AppiorMentForm)

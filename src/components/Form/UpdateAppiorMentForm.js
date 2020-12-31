/* eslint-disable react/jsx-indent */
import React, { useEffect } from 'react'
import { Form, Input, Button, Select, notification, DatePicker } from 'antd'
import gql from 'graphql-tag'
import { useSelector } from 'react-redux'
import { useMutation, useQuery } from 'react-apollo'
import moment from 'moment'
import './appiorMentForm.scss'
import { GET_APPOINTMENT_DETAILS, EDIT_APPOINTMENT } from './query'
import { dateTimeToUtc } from '../../utilities'

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

const EditAppiorMentForm = ({ setNewAppiormentCreated, form, id, setOpen }) => {
  const userRole = useSelector(state => state.user.role)
  const therapistReduxId = useSelector(state => state.user.staffId)

  const { data: allSudent, loading: allSudentLoading } = useQuery(ALL_STUDENT)
  const { data: allTherapist, loading: allTherapistLoading } = useQuery(ALL_THERAPIST)
  const { data: allLocation, loading: allLocationLoading } = useQuery(ALL_LOCATION)
  const {
    data: getAppiontMentData,
    error: getAppiontMentError,
    loading: getAppiontMentLoading,
  } = useQuery(GET_APPOINTMENT_DETAILS, {
    variables: {
      id,
    },
  })

  const [editAppiorment, { data: editAppiormentsData, error: editAppiormentsError }] = useMutation(
    EDIT_APPOINTMENT,
  )

  useEffect(() => {
    if (editAppiormentsData) {
      notification.success({
        message: 'Clinic Dashboard',
        description: 'Appointment Update Successfully',
      })
      form.resetFields()
      if (setNewAppiormentCreated) {
        setNewAppiormentCreated(true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editAppiormentsData])

  useEffect(() => {
    if (editAppiormentsError) {
      notification.error({
        message: 'Something went wrong!',
        description: editAppiormentsError.message,
      })
    }
  }, [editAppiormentsError])

  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error) {
        editAppiorment({
          variables: {
            therapistId: userRole === 'therapist' ? therapistReduxId : values.therapist,
            studentId: values.student,
            title: values.title,
            locationId: values.location ? values.location : '',
            purposeAssignment: values.purposeAssignment,
            note: values.note ? values.note : '',
            start: dateTimeToUtc(values.start),
            end: dateTimeToUtc(values.end),
          },
        })
      }
    })
  }

  if (getAppiontMentLoading) {
    return <h3>Loading...</h3>
  }

  if (getAppiontMentError) {
    return <h3 style={{ color: 'red' }}>Opps their something is wrong</h3>
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
        size="large"
      >
        <Form.Item label="Title">
          {form.getFieldDecorator('title', {
            initialValue: getAppiontMentData.appointment.title,
            rules: [{ required: true, message: 'Please give a title' }],
          })(<Input placeholder="Title" size="large" />)}
        </Form.Item>

        <Form.Item label="Select Learner">
          {form.getFieldDecorator('student', {
            initialValue: getAppiontMentData.appointment.student.id,
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
                  <Option value={node.id} name={node.firstname}>
                    {node.firstname}
                  </Option>
                ))}
            </Select>,
          )}
        </Form.Item>

        <Form.Item label="Appointment Reason">
          {form.getFieldDecorator('purposeAssignment', {
            initialValue: getAppiontMentData.appointment.purposeAssignment,
            rules: [
              {
                required: true,
                message: 'Please give the Appointment Reason',
              },
            ],
          })(<Input placeholder="Appointment Reason" size="large" />)}
        </Form.Item>

        <Form.Item label="Location">
          {form.getFieldDecorator('location', {
            initialValue: getAppiontMentData.appointment.location.id,
          })(
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

        <Form.Item
          label="Start Time"
          rules={[{ required: true, message: 'Please select a start time!' }]}
        >
          {form.getFieldDecorator('start', {
            initialValue: moment(getAppiontMentData.appointment.start),
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
              placeholder="Start Time"
              format="YYYY-MM-DD HH:mm:ss"
              showTime={{ defaultValue: moment() }}
              size="large"
            />,
          )}
        </Form.Item>

        <Form.Item label="End Time">
          {form.getFieldDecorator('end', {
            initialValue: moment(getAppiontMentData.appointment.end),
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
              size="large"
              format="YYYY-MM-DD HH:mm:ss"
              showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
              placeholder="End Time"
            />,
          )}
        </Form.Item>

        {userRole === 'therapist' ? (
          ''
        ) : (
            <Form.Item label="Select Therapist">
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
          {form.getFieldDecorator('note', {
            initialValue: getAppiontMentData.appointment.note,
          })(
            <TextArea
              placeholder="Take a note"
              style={{
                height: 150,
                resize: 'none',
              }}
            />,
          )}
        </Form.Item>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Form.Item style={{ width: '45%' }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: '100%',
                height: 40,
                background: '#0B35B3',
                marginTop: 15,
                marginBottom: 20,
              }}
            >
              Update
            </Button>
          </Form.Item>
          <Form.Item style={{ width: '45%' }}>
            <Button
              type="primary"
              onClick={() => {
                form.resetFields()
                setOpen(null)
              }}
              style={{
                width: '100%',
                height: 40,
                background: 'red',
                color: '#fff',
                marginTop: 15,
                marginBottom: 20,
              }}
            >
              Cancle
            </Button>
          </Form.Item>
        </div>
      </Form>
    </>
  )
}

export default Form.create()(EditAppiorMentForm)

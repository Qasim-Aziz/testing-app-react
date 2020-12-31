/* eslint-disable no-unneeded-ternary */
import React, { useEffect } from 'react'
import {
  Form,
  Input,
  Button,
  Select,
  notification,
  DatePicker,
  TimePicker,
  Row,
  Col,
  Divider,
} from 'antd'
import { useSelector } from 'react-redux'
import { useMutation, useQuery } from 'react-apollo'
import moment from 'moment'
import { combineDateAndTime } from '../../utilities'
import {
  GET_APPOINTMENT_DETAILS,
  EDIT_APPOINTMENT,
  ALL_STUDENT,
  ALL_THERAPIST,
  ALL_LOCATION,
  ALL_APPOINTMENT_STATUS,
} from './query'

import './appointmentForms.scss'

const { TextArea } = Input
const { Option } = Select

const UpdateAppointmentForm = ({
  setNeedToReloadData,
  form,
  appointmentId,
  closeUpdateAppointment,
}) => {
  const userRole = useSelector(state => state.user.role)
  const therapistReduxId = useSelector(state => state.user.staffId)

  const { data: allSudent, loading: allSudentLoading } = useQuery(ALL_STUDENT)
  const { data: allTherapist, loading: allTherapistLoading } = useQuery(ALL_THERAPIST)
  const { data: allLocation, loading: allLocationLoading } = useQuery(ALL_LOCATION)
  const { data: allAppointmentStatus, loading: allAppointmentStatusLoading } = useQuery(
    ALL_APPOINTMENT_STATUS,
  )

  const {
    data: getAppointmentData,
    error: getAppointmentError,
    loading: isGetAppointmentLoading,
  } = useQuery(GET_APPOINTMENT_DETAILS, {
    variables: {
      id: appointmentId,
    },
  })

  const [editAppiorment, { data: editAppointmentData, error: editAppointmentError }] = useMutation(
    EDIT_APPOINTMENT,
  )

  useEffect(() => {
    if (editAppointmentData) {
      notification.success({
        message: 'Clinic Dashboard',
        description: 'Appointment Update Successfully',
      })
      form.resetFields()
      if (setNeedToReloadData) {
        setNeedToReloadData(true)
      }
    }
  }, [editAppointmentData])

  useEffect(() => {
    if (editAppointmentError) {
      notification.error({
        message: 'Something went wrong!',
        description: editAppointmentError.message,
      })
    }
  }, [editAppointmentError])

  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error) {
        editAppiorment({
          variables: {
            id: appointmentId,
            therapistId: userRole === 'therapist' ? therapistReduxId : values.therapist,
            additionalStaff: values.additionalStaff,
            staffToStaff: values.student ? false : true,
            studentId: values.student,
            title: values.title,
            locationId: values.location ? values.location : '',
            purposeAssignment: values.purposeAssignment,
            note: values.note ? values.note : '',
            start: combineDateAndTime(values.date, values.startTime),
            end: combineDateAndTime(values.date, values.endTime),
            appointmentStatus: values.appointmentStatus,
          },
        })
      }
    })
  }

  if (isGetAppointmentLoading) {
    return <h3>Loading...</h3>
  }

  if (getAppointmentError) {
    return <h3 style={{ color: 'red' }}>Opps! Something went wrong.</h3>
  }

  return (
    <Form
      name="updateAppointment"
      onSubmit={handleSubmit}
      className="appointment-form"
      size="small"
      labelCol={{ span: 10 }}
      wrapperCol={{ span: 12 }}
    >
      <Divider orientation="left">Basic Details</Divider>

      {/* Title */}
      <Row>
        <Col sm={24} md={24} lg={24}>
          <Form.Item label="Title" labelCol={{ offset: 1, sm: 4 }} wrapperCol={{ sm: 18 }}>
            {form.getFieldDecorator('title', {
              initialValue: getAppointmentData.appointment.title,
              rules: [{ required: true, message: 'Please give a title' }],
            })(<Input placeholder="Title" />)}
          </Form.Item>
        </Col>
      </Row>

      {/* Select Learner */}
      <Row>
        <Col sm={24} md={24} lg={24}>
          <Form.Item label="Select Learner" labelCol={{ offset: 1, sm: 4 }} wrapperCol={{ sm: 18 }}>
            {form.getFieldDecorator('student', {
              initialValue: getAppointmentData.appointment.student?.id,
              rules: [{ required: true, message: 'Please select a Learner' }],
            })(
              <Select
                placeholder="Select Learner"
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
        </Col>
      </Row>

      {/* Therapist */}
      {userRole !== 'therapist' && (
        <Row>
          <Col sm={24} md={24} lg={24}>
            <Form.Item
              label="Select Therapist"
              labelCol={{ offset: 1, sm: 4 }}
              wrapperCol={{ sm: 18 }}
            >
              {form.getFieldDecorator('therapist', {
                initialValue: getAppointmentData.appointment.therapist.id,
                rules: [
                  {
                    required: true,
                    message: 'Please select a Therapist',
                  },
                ],
              })(
                <Select
                  placeholder="Select Therapist"
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
          </Col>
        </Row>
      )}

      {/* Additional Staff */}
      <Row>
        <Col sm={24} md={24} lg={24}>
          <Form.Item
            label="Additional Staff"
            labelCol={{ offset: 1, sm: 4 }}
            wrapperCol={{ sm: 18 }}
          >
            {form.getFieldDecorator('additionalStaff', {
              initialValue: getAppointmentData.appointment.attendee.edges.map(x => x.node.id),
            })(
              <Select
                placeholder="Select Additional Staff"
                loading={allTherapistLoading}
                showSearch
                optionFilterProp="name"
                mode="multiple"
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
        </Col>
      </Row>

      <Divider orientation="left">Date &amp; Time</Divider>

      {/* Date - Start time - End time */}
      <Row>
        <Col sm={24} md={8} lg={8}>
          <Form.Item
            label="Start Date"
            labelCol={{ offset: 2, sm: 10 }}
            wrapperCol={{ sm: 12 }}
            rules={[{ required: true, message: 'Please select a start time!' }]}
          >
            {form.getFieldDecorator('date', {
              initialValue: moment(getAppointmentData.appointment.start),
              rules: [
                {
                  required: true,
                  message: 'Please select the Date',
                },
              ],
            })(
              <DatePicker
                style={{
                  width: '100%',
                }}
                placeholder="Date"
                format="YYYY-MM-DD"
                picker="date"
                showTime={{ format: 'YYYY-MM-DD', defaultValue: moment() }}
              />,
            )}
          </Form.Item>
        </Col>
        <Col sm={24} md={8} lg={8}>
          <Form.Item
            label="Start Time"
            labelCol={{ offset: 2, sm: 10 }}
            wrapperCol={{ sm: 12 }}
            rules={[{ required: true, message: 'Please select a start time!' }]}
          >
            {form.getFieldDecorator('startTime', {
              initialValue: moment(getAppointmentData.appointment.start),
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
                picker="time"
              />,
            )}
          </Form.Item>
        </Col>
        <Col sm={24} md={8} lg={8}>
          <Form.Item
            label="End Time"
            labelCol={{ offset: 1, sm: 8 }}
            wrapperCol={{ sm: 12 }}
            rules={[{ required: true, message: 'Please select a end time!' }]}
          >
            {form.getFieldDecorator('endTime', {
              initialValue: moment(getAppointmentData.appointment.end),
              rules: [
                {
                  required: true,
                  message: 'Please select the end time',
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
                picker="time"
              />,
            )}
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left">Misc Details</Divider>
      {/* Location - Status */}
      <Row>
        <Col sm={24} md={12} lg={12}>
          <Form.Item
            label="Location"
            labelCol={{ sm: 10 }}
            wrapperCol={{ sm: 12 }}
            rules={[{ required: true, message: 'Please select a location!' }]}
          >
            {form.getFieldDecorator('location', {
              initialValue: getAppointmentData.appointment.location.id,
            })(
              <Select
                placeholder="Select Location"
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
        </Col>
        <Col sm={24} md={12} lg={12}>
          <Form.Item
            label="Status"
            labelCol={{ sm: 10 }}
            wrapperCol={{ sm: 12 }}
            rules={[{ required: true, message: 'Please select a status!' }]}
          >
            {form.getFieldDecorator('appointmentStatus', {
              initialValue: getAppointmentData.appointment.appointmentStatus?.id,
            })(
              <Select placeholder="Select Status" loading={allAppointmentStatusLoading}>
                {allAppointmentStatus &&
                  allAppointmentStatus.appointmentStatuses.map(node => (
                    <Option key={node.id} appointmentStatus={node.appointmentStatus}>
                      {node.appointmentStatus}
                    </Option>
                  ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
      </Row>

      {/* Purpose */}
      <Row>
        <Col sm={24} md={24} lg={24}>
          <Form.Item
            label="Appointment Reason"
            labelCol={{ offset: 1, sm: 4 }}
            wrapperCol={{ sm: 18 }}
          >
            {form.getFieldDecorator('purposeAssignment', {
              initialValue: getAppointmentData.appointment.purposeAssignment,
              rules: [
                {
                  required: true,
                  message: 'Please give the Appointment Purpose',
                },
              ],
            })(<Input placeholder="Appointment Purpose" />)}
          </Form.Item>
        </Col>
      </Row>

      {/* Notes */}
      <Row>
        <Col sm={24} md={24} lg={24}>
          <Form.Item label="Notes" labelCol={{ offset: 1, sm: 4 }} wrapperCol={{ sm: 18 }}>
            {form.getFieldDecorator('note', {
              initialValue: getAppointmentData.appointment.note,
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
        </Col>
      </Row>

      {/* Submit-Reset buttons */}
      <Row>
        <Col sm={24} md={24} lg={24}>
          <Form.Item wrapperCol={{ offset: 5, sm: 18 }}>
            <Button htmlType="submit" type="primary">
              Update
            </Button>
            <Button
              type="danger"
              style={{ marginLeft: '10px' }}
              onClick={() => {
                form.resetFields()
                closeUpdateAppointment()
              }}
            >
              Cancel
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

export default Form.create()(UpdateAppointmentForm)

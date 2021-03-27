/* eslint-disable no-unneeded-ternary */
import React, { useEffect, useState } from 'react'
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
  Switch,
} from 'antd'
import { useSelector } from 'react-redux'
import { useMutation, useQuery } from 'react-apollo'
import moment from 'moment'
import { COLORS } from 'assets/styles/globalStyles'
import { timeToUtc, dateTimeToDate, combineDateAndTime } from '../../utilities'
import {
  CREATE_APPOINTMENT,
  ALL_STUDENT,
  ALL_THERAPIST,
  ALL_LOCATION,
  ALL_APPOINTMENT_STATUS,
} from './query'
import DaySelectionControl from './DaySelectionControl'

import './appointmentForms.scss'

const { TextArea } = Input
const { Option } = Select

const submitButton = {
  minWidth: '180px',
  height: 40,
  background: '#0B35B3',
  boxShadow: '0px 2px 4px rgba(96, 97, 112, 0.16), 0px 0px 1px rgba(40, 41, 61, 0.04)',
  borderRadius: 0,
  fontSize: 16,
  // fontWeight: 600,
  margin: '20px 5px',
  color: 'white',
}

const CreateAppointmentForm = ({
  setNeedToReloadData,
  form,
  startDate,
  endDate,
  therapistId,
  learnerId,
  closeDrawer,
}) => {
  console.log(startDate, endDate, therapistId, 'details')
  const userRole = useSelector(state => state.user.role)
  const therapistReduxId = useSelector(state => state.user.staffId)
  const [openStatus, setOpenStatus] = useState()

  const { data: allSudent, loading: allSudentLoading } = useQuery(ALL_STUDENT)
  const { data: allTherapist, loading: allTherapistLoading } = useQuery(ALL_THERAPIST)
  const { data: allLocation, loading: allLocationLoading } = useQuery(ALL_LOCATION)
  const { data: allAppointmentStatus, loading: allAppointmentStatusLoading } = useQuery(
    ALL_APPOINTMENT_STATUS,
  )

  useEffect(() => {
    if (allAppointmentStatus) {
      const openStatusAsArray = allAppointmentStatus.appointmentStatuses.filter(
        x => x.appointmentStatus === 'Pending',
      )
      if (openStatusAsArray.length) setOpenStatus(openStatusAsArray[0])
    }
  }, [allAppointmentStatus])

  const [
    createAppointment,
    {
      data: createAppointmentData,
      error: createAppointmentError,
      loading: isCreateAppointmentLoading,
    },
  ] = useMutation(CREATE_APPOINTMENT)

  useEffect(() => {
    if (createAppointmentData) {
      notification.success({
        message: 'Clinic Dashboard',
        description: 'Appointment created Successfully',
      })
      form.resetFields()
      if (setNeedToReloadData) {
        setNeedToReloadData(createAppointmentData)
        closeDrawer()
      }
    }
  }, [createAppointmentData])

  if (!startDate) startDate = moment()
  if (!endDate) endDate = moment().add(1, 'hour')

  const [isRepeat, setIsRepeat] = useState(false)

  const [selectedDays, setSelectedDays] = useState([])

  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error) {
        createAppointment({
          variables: {
            title: values.title,
            studentId: values.student,
            therapistId: userRole === 'therapist' ? therapistReduxId : values.therapist,
            additionalStaff: values.additionalStaff,
            staffToStaff: values.student ? false : true,
            locationId: values.location ? values.location : '',
            note: values.note ? values.note : '',
            purposeAssignment: values.purposeAssignment,
            startDateAndTime: combineDateAndTime(values.startDate, values.startTime),
            endDateAndTime: combineDateAndTime(
              isRepeat ? values.endDate : values.startDate,
              values.endTime,
            ),
            enableRecurring: isRepeat,
            startDate: dateTimeToDate(values.startDate),
            endDate: dateTimeToDate(isRepeat ? values.endDate : values.startDate),
            startTime: timeToUtc(values.startTime),
            endTime: timeToUtc(values.endTime),
            selectedDays: selectedDays ? selectedDays.map(x => x.value) : [],
            isApproved: true,
            appointmentStatus: values.appointmentStatus,
          },
        }).catch(er => {
          notification.error({
            message: 'Something went wrong!',
            description: er.message,
          })
        })
      }
    })
  }

  const getDisabledStartHours = () => {
    const startDateObj = new Date(form.getFieldValue('startDate')).toISOString().split('T')[0]
    const today = new Date().toISOString().split('T')[0]
    const now = startDateObj === today ? new Date().getHours() : 6
    const result = []
    for (let i = 0; i < 24; i += 1) {
      if (i < 6 || i > 20 || i < now) result.push(i)
    }
    return result
  }

  const getDisabledEndHours = () => {
    const startHour = new Date(form.getFieldValue('startTime')).getHours()
    const result = []
    for (let i = 0; i < 24; i += 1) {
      if (i < startHour || i > 21) result.push(i)
    }
    return result
  }

  const disabledDate = date => date < moment().startOf('day')

  return (
    <Form
      name="addAppointment"
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
              initialValue: learnerId,
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
                initialValue: therapistId,
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
            {form.getFieldDecorator('additionalStaff')(
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
            {form.getFieldDecorator('startDate', {
              initialValue: moment(startDate),
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
                disabledDate={disabledDate}
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
              initialValue: moment(startDate),
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
                minuteStep={15}
                disabledHours={getDisabledStartHours}
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
              initialValue: moment(endDate),
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
                minuteStep={15}
                disabledHours={getDisabledEndHours}
              />,
            )}
          </Form.Item>
        </Col>
      </Row>

      {/* Recurring Switch */}
      <Row>
        <Col sm={12} md={12} lg={12}>
          <Form.Item label="Repeats" labelCol={{ offset: 2, sm: 6 }} wrapperCol={{ sm: 14 }}>
            <Switch checked={isRepeat} onChange={setIsRepeat} />
          </Form.Item>
        </Col>
      </Row>

      {/* End Date - Repeat on */}
      {isRepeat && (
        <Row>
          <Col sm={24} md={8} lg={8}>
            <Form.Item
              label="End Date"
              labelCol={{ offset: 2, sm: 10 }}
              wrapperCol={{ sm: 12 }}
              rules={[{ required: true, message: 'Please select a end time!' }]}
            >
              {form.getFieldDecorator('endDate', {
                initialValue: moment(endDate),
                rules: [
                  {
                    required: true,
                    message: 'Please select a end date',
                  },
                ],
              })(
                <DatePicker
                  style={{
                    width: '100%',
                  }}
                  placeholder="End Date"
                  format="YYYY-MM-DD"
                  picker="date"
                  disabledDate={disabledDate}
                  showTime={{ format: 'YYYY-MM-DD', defaultValue: moment() }}
                />,
              )}
            </Form.Item>
          </Col>
          <Col sm={24} md={16} lg={16}>
            <Form.Item label="Repeat on" labelCol={{ offset: 1, sm: 5 }} wrapperCol={{ sm: 17 }}>
              <DaySelectionControl onDaySelectionChange={setSelectedDays} />
            </Form.Item>
          </Col>
        </Row>
      )}

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
            {form.getFieldDecorator('location')(
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
              initialValue: openStatus?.id,
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
        </Col>
      </Row>

      {/* Submit button */}
      <Row>
        <Col sm={24} md={24} lg={24}>
          <Form.Item
            wrapperCol={{
              offset: 10,
              span: 12,
            }}
          >
            <Button htmlType="submit" style={submitButton} loading={isCreateAppointmentLoading}>
              Create Appointment
            </Button>
            <Button
              type="danger"
              style={{
                ...submitButton,
                color: 'white',
                background: COLORS.danger,
              }}
              onClick={() => {
                form.resetFields()
                closeDrawer()
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

export default Form.create()(CreateAppointmentForm)

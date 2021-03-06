import React, { useState, useEffect } from 'react'
import { Form, Button, Select, Row, Col, TimePicker, notification } from 'antd'
import { useQuery, useMutation } from 'react-apollo'
import { useSelector } from 'react-redux'
import moment from 'moment'
import LoadingComponent from '../LoadingComponent'
import { GET_SHIFTING, UPDATE_SHIFTING } from './queries'

const TherapistShifting = () => {
  const [selectedDays, setSelectedDays] = useState([])
  const [startTime, setStartTime] = useState(moment())
  const [endTime, setEndTime] = useState(moment().add(30, 'minutes'))

  const therapistId = useSelector(state => state.user.staffId)

  const { data: getShiftData, error: shiftErrors, loading: isShiftingDataLoading } = useQuery(
    GET_SHIFTING,
    {
      variables: {
        id: therapistId,
      },
    },
  )

  const [
    updateShifting,
    { data: updatedShiftingData, error: updateShiftingError, loading: isUpdateShiftingLoading },
  ] = useMutation(UPDATE_SHIFTING)

  useEffect(() => {
    if (getShiftData) {
      setSelectedDays(getShiftData.days)
      setStartTime(getShiftData.startTime)
      setEndTime(getShiftData.endTime)
    }
  }, [getShiftData])

  useEffect(() => {
    if (updatedShiftingData) {
      notification.success({
        message: 'Therapist shifting',
        description: 'Shifting details updated successfully.',
      })
    }
  }, [updatedShiftingData])

  useEffect(() => {
    if (updateShiftingError) {
      notification.error({
        message: 'Therapist shifting',
        description: updateShiftingError.message,
      })
    }
  }, [updateShiftingError])

  const days = [
    { value: 'Sun', displayText: 'Sunday' },
    { value: 'Mon', displayText: 'Monday' },
    { value: 'Tue', displayText: 'Tuesday' },
    { value: 'Wed', displayText: 'Wednesday' },
    { value: 'Thur', displayText: 'Thursday' },
    { value: 'Fri', displayText: 'Friday' },
    { value: 'Sat', displayText: 'Saturday' },
  ]

  const handleSubmit = e => {
    e.preventDefault()
    updateShifting({
      variables: {
        therapistId,
        startTime,
        endTime,
        workingDays: selectedDays,
      },
    })
  }

  if (isShiftingDataLoading) return <LoadingComponent />
  if (shiftErrors) return <h3>An error occurred to load shifting details.</h3>

  return (
    <Form
      onSubmit={handleSubmit}
      className="therapistShiftingTab"
      size="small"
      labelCol={{ span: 10 }}
      wrapperCol={{ span: 12 }}
    >
      <Row>
        <Col sm={12} md={12} lg={12}>
          <Form.Item label="Start Time" labelCol={{ offset: 1, sm: 9 }} wrapperCol={{ sm: 13 }}>
            <TimePicker
              placeholder="Start Time"
              format="HH:mm"
              minuteStep={30}
              value={startTime}
              onChange={setStartTime}
            />
          </Form.Item>
        </Col>
        <Col sm={12} md={12} lg={12}>
          <Form.Item label="End Time" labelCol={{ sm: 6 }} wrapperCol={{ sm: 17 }}>
            <TimePicker
              placeholder="End Time"
              format="HH:mm"
              minuteStep={30}
              value={endTime}
              onChange={setEndTime}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col sm={24} md={24} lg={24}>
          <Form.Item label="Working Days" labelCol={{ offset: 1, sm: 4 }} wrapperCol={{ sm: 18 }}>
            <Select
              placeholder="Select Working Days"
              showSearch
              optionFilterProp="displayText"
              mode="tags"
              value={selectedDays}
              onChange={setSelectedDays}
            >
              {days.map(({ displayText, value }) => (
                <Select.Option key={value} name={value}>
                  {displayText}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item style={{ textAlign: 'center' }}>
        <Button type="primary" htmlType="submit" disabled={isUpdateShiftingLoading}>
          Save
        </Button>
      </Form.Item>
    </Form>
  )
}

export default TherapistShifting

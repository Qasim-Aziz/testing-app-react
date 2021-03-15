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
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  const { data: getShiftData, error: shiftErrors, loading: isShiftingDataLoading } = useQuery(
    GET_SHIFTING,
    {
      variables: {
        therapistId,
      },
    },
  )

  const [
    updateShifting,
    { data: updatedShiftingData, error: updateShiftingError, loading: isUpdateShiftingLoading },
  ] = useMutation(UPDATE_SHIFTING)

  useEffect(() => {
    if (getShiftData?.staff?.shift) {
      const { shift } = getShiftData.staff
      setSelectedDays(shift.days.edges.map(({ node }) => node.name))
      setStartTime(moment(`2020-01-01 ${shift.startTime}`)) // Here dumped with dummy date to convert time to moment
      setEndTime(moment(`2020-01-01 ${shift.endTime}`))
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

  const handleSubmit = e => {
    e.preventDefault()
    updateShifting({
      variables: {
        therapistId,
        startTime: startTime.format('hh:mm A'),
        endTime: endTime.format('hh:mm A'),
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
              {days.map(day => (
                <Select.Option key={day} name={day}>
                  {day}
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

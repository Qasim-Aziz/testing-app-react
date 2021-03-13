import React, { useState, useEffect } from 'react'
import { Form, Button, Select, Row, Col, TimePicker, Switch, Icon, notification } from 'antd'
import { useQuery, useMutation } from 'react-apollo'
import moment from 'moment'
import LoadingComponent from '../../staffProfile/LoadingComponent'
import { ALL_THERAPIST, UPDATE_SHIFTING } from './queries'

const TherapistShifting = () => {
  const [isForAllTherapist, setIsForAllTherapist] = useState(false)
  const [selectedDays, setSelectedDays] = useState([])
  const [selectedTherapist, setSelectedTherapist] = useState()
  const [startTime, setStartTime] = useState(moment())
  const [endTime, setEndTime] = useState(moment().add(30, 'minutes'))

  const { data: allTherapist, loading: allTherapistLoading, error: therapistErrors } = useQuery(
    ALL_THERAPIST,
  )
  const [
    updateShifting,
    { data: updatedShiftingData, error: updateShiftingError, loading: isUpdateShiftingLoading },
  ] = useMutation(UPDATE_SHIFTING)

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
        isForAllTherapist,
        therapistId: selectedTherapist,
        startTime,
        endTime,
        workingDays: selectedDays,
      },
    })
  }

  if (allTherapistLoading) return <LoadingComponent />
  if (therapistErrors) return <h3>An error occurred to load Therapists.</h3>

  return (
    <Form
      onSubmit={handleSubmit}
      className="therapistShiftingTab"
      size="small"
      labelCol={{ span: 10 }}
      wrapperCol={{ span: 12 }}
    >
      <Row>
        <Col sm={24} md={24} lg={24}>
          <Form.Item
            label="For all Therapist"
            labelCol={{ offset: 1, sm: 4 }}
            wrapperCol={{ sm: 18 }}
          >
            <Switch
              checkedChildren={<Icon type="check" />}
              unCheckedChildren={<Icon type="close" />}
              checked={isForAllTherapist}
              onChange={setIsForAllTherapist}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col sm={24} md={24} lg={24}>
          <Form.Item label="Therapist" labelCol={{ offset: 1, sm: 4 }} wrapperCol={{ sm: 18 }}>
            <Select
              placeholder="Select Therapist"
              loading={allTherapistLoading}
              showSearch
              optionFilterProp="name"
              value={selectedTherapist}
              onChange={setSelectedTherapist}
              disabled={isForAllTherapist}
            >
              {allTherapist &&
                allTherapist.staffs.edges.map(({ node }) => (
                  <Select.Option key={node.id} name={node.name}>
                    {node.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

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
import React, { useState, useEffect } from 'react'
import { Form, Button, Select, Row, Col, TimePicker, Switch, Icon, notification } from 'antd'
import { useQuery, useMutation } from 'react-apollo'
import moment from 'moment'
import LoadingComponent from '../../staffProfile/LoadingComponent'
import { ALL_THERAPIST, UPDATE_SHIFTING } from './queries'

const TherapistShifting = () => {
  const [isForAllTherapist, setIsForAllTherapist] = useState(false)
  const [selectedDays, setSelectedDays] = useState([])
  const [selectedTherapists, setSelectedTherapists] = useState([])
  const [startTime, setStartTime] = useState(moment())
  const [endTime, setEndTime] = useState(moment().add(30, 'minutes'))

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

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

  const handleSubmit = e => {
    e.preventDefault()

    const allTherapistIds = []
    if (allTherapist) allTherapistIds.push(allTherapist.staffs.edges.map(({ node }) => node.id))

    updateShifting({
      variables: {
        therapistIds: isForAllTherapist ? allTherapistIds : selectedTherapists,
        startTime: startTime.format('hh:mm A'),
        endTime: endTime.format('hh:mm A'),
        workingDays: selectedDays,
      },
    })
  }

  if (allTherapistLoading) return <LoadingComponent />
  if (therapistErrors) return <h3>An error occurred to load Therapists.</h3>

  return (
    <div>
      <div className="profileTab-heading">
        <p>Therapist Shifting</p>
      </div>
      <Form onSubmit={handleSubmit} className="therapistShiftingTab" size="small">
        <Row>
          <Col>
            <Form.Item
              label="For all Therapist"
              style={{ display: 'flex', justifyContent: 'flex-end' }}
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
          <Col>
            <Form.Item
              label="Therapist"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              className="form-label"
            >
              <Select
                placeholder="Select Therapist"
                loading={allTherapistLoading}
                showSearch
                optionFilterProp="name"
                value={selectedTherapists}
                onChange={setSelectedTherapists}
                disabled={isForAllTherapist}
                mode="tags"
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

        <Row style={{ display: 'flex' }}>
          <Col>
            <Form.Item
              label="Start Time"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              className="form-label"
            >
              <TimePicker
                placeholder="Start Time"
                format="HH:mm"
                minuteStep={30}
                value={startTime}
                onChange={setStartTime}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label="End Time"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              className="form-label"
            >
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
          <Col>
            <Form.Item
              label="Working Days"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              className="form-label"
            >
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

        <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="primary" htmlType="submit" disabled={isUpdateShiftingLoading}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default TherapistShifting

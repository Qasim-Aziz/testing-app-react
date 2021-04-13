import React, { useState, useEffect } from 'react'
import { Form, Button, Select, Row, Col, TimePicker, Switch, Icon, notification } from 'antd'
import { useQuery, useMutation } from 'react-apollo'
import moment from 'moment'
import LoadingComponent from '../../staffProfile/LoadingComponent'
import { ALL_THERAPIST, UPDATE_SHIFTING } from './queries'

const TherapistShifting = ({ form }) => {
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

  const handleSubmit = e => {
    e.preventDefault()

    const allTherapistIds = []
    if (allTherapist) allTherapistIds.push(allTherapist.staffs.edges.map(({ node }) => node.id))
    form.validateFields((err, values) => {
      if (!err && allTherapistIds) {
        updateShifting({
          variables: {
            therapistIds: isForAllTherapist ? allTherapistIds : selectedTherapists,
            startTime: values.startTime.format('hh:mm A'),
            endTime: values.endTime.format('hh:mm A'),
            workingDays: values.workingDays,
          },
        })
          .then(response => {
            notification.success({
              message: 'Therapist shift time',
              description: 'Shifting details updated successfully.',
            })
          })
          .catch(error => {
            notification.error({
              message: 'Therapist shifting',
              description: updateShiftingError.message,
            })
          })
      }
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
              {form.getFieldDecorator('startTime', {
                initialValue: startTime,
                rules: [{ required: true, message: 'Please select start Time' }],
              })(<TimePicker placeholder="Start Time" format="HH:mm" minuteStep={30} />)}
            </Form.Item>
          </Col>
          <Col sm={12} md={12} lg={12}>
            <Form.Item
              label="End Time"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              className="form-label"
            >
              {form.getFieldDecorator('endTime', {
                initialValue: endTime,
                rules: [{ required: true, message: 'Please select end Time' }],
              })(<TimePicker placeholder="End Time" format="HH:mm" minuteStep={30} />)}
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
              {form.getFieldDecorator('workingDays', {
                initialValue: selectedDays,
                rules: [{ required: true, message: 'Please select atleast one day' }],
              })(
                <Select
                  placeholder="Select Working Days"
                  showSearch
                  optionFilterProp="displayText"
                  mode="tags"
                >
                  {days.map(day => (
                    <Select.Option key={day} name={day}>
                      {day}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isUpdateShiftingLoading}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Form.create()(TherapistShifting)

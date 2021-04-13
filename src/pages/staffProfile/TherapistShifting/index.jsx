import React, { useState, useEffect } from 'react'
import { Form, Button, Select, Row, Col, TimePicker, notification } from 'antd'
import { useQuery, useMutation } from 'react-apollo'
import { useSelector } from 'react-redux'
import moment from 'moment'
import LoadingComponent from '../LoadingComponent'
import { GET_SHIFTING, UPDATE_SHIFTING } from './queries'

const TherapistShifting = ({ form }) => {
  const [selectedDays, setSelectedDays] = useState([])
  const [startTime, setStartTime] = useState(moment())
  const [endTime, setEndTime] = useState(moment())
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
      if (shift.startTime && shift.endTime) {
        setStartTime(moment(`2020-01-01 ${shift.startTime}`)) // Here dumped with dummy date to convert time to moment
        setEndTime(moment(`2020-01-01 ${shift.endTime}`))
      } else {
        setStartTime(moment(`2020-01-01 09:30 AM`)) // Here dumped with dummy date to convert time to moment
        setEndTime(moment(`2020-01-01 6:30 PM`))
      }
    }
  }, [getShiftData])
  // 8588824428 gagan sharma
  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err && therapistId) {
        updateShifting({
          variables: {
            therapistId,
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

  if (isShiftingDataLoading) return <LoadingComponent />
  if (shiftErrors) return <h3>An error occurred to load shifting details.</h3>

  return (
    <div>
      <div className="profileTab-heading">
        <p>Therapist Shifting</p>
      </div>
      <Form
        onSubmit={handleSubmit}
        className="therapistShiftingTab"
        size="small"
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 12 }}
        style={{ paddingTop: '1em' }}
      >
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

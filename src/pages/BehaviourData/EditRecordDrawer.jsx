import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, DatePicker, Form, notification, Input, Select, TimePicker } from 'antd'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import { useMutation } from 'react-apollo'
import Timer from 'react-compound-timer'
import { UPDATE_RECORD, UPDATE_FREQUENCY } from './query'
import './AddBehaviorDrawer.scss'

const { Option } = Select

const EditRecordDrawer = ({
  selectTamplate,
  form,
  onRecordingData,
  refetchRecordData,
  decelDetails,
}) => {
  console.log('decelDetails', decelDetails)
  const [frequency, setFrequency] = useState(decelDetails ? decelDetails.frequency.edges.length : 0)
  const timerRef = useRef()

  const [
    updateFrequency,
    { data: updateFrequencyData, loading: updateFrequencyLoading, error: updateFrequencyError },
  ] = useMutation(UPDATE_FREQUENCY)

  const [
    updateRecord,
    { data: updateRecordData, loading: updateRecordLoading, error: updateRecordError },
  ] = useMutation(UPDATE_RECORD)

  useEffect(() => {
    if (updateRecordData) {
      const newData = updateRecordData.updateDecel.details
      newData.template.id = selectTamplate
      onRecordingData(false)
      refetchRecordData()
    }
  }, [updateRecordData])

  useEffect(() => {
    if (frequency) {
      updateFrequency({
        variables: {
          id: decelDetails.id,
          count: frequency,
          time: timerRef.current ? timerRef.current.getTime() : 0,
        },
      })
    }
  }, [frequency])

  useEffect(() => {
    if (updateRecordError) {
      notification.error({
        message: 'Opps their are some error to update the record',
      })
    }
  }, [updateRecordError])

  useEffect(() => {
    if (updateFrequencyData) {
      setFrequency(updateFrequencyData.updateDecelFrequency.details.frequency.edges.length)
    }
  }, [updateFrequencyData])

  useEffect(() => {
    if (updateFrequencyError) {
      notification.error({
        message: 'Frequency Data Update Erro',
      })
    }
  }, [updateFrequencyError])

  const handleSubmit = e => {
    e.preventDefault()
    // eslint-disable-next-line no-shadow
    form.validateFields((error, values) => {
      if (!error) {
        updateRecord({
          variables: {
            id: decelDetails.id,
            irt: null,
            frequency: frequency > 0 ? frequency : null,
            env: values.env,
            date: moment(values.date).format('YYYY-MM-DD'),
            intensity: values.intensity,
            duration: `${
              values.duration ? parseFloat(values.duration * 1000) : timerRef.current.getTime()
            }`,
          },
        })
      }
    })
  }

  return (
    <>
      <Form onSubmit={handleSubmit} className="addBehaviorDrawer">
        {decelDetails && (
          <>
            <Timer
              id={selectTamplate}
              ref={timerRef}
              startImmediately={false}
              initialTime={Math.round(decelDetails.duration)}
            >
              {({ start, resume, pause }) => (
                <div className="timer">
                  <div style={{ marginBottom: '20px' }}>
                    <span className="timeText">
                      <Timer.Minutes />
                    </span>
                    <span className="labelText">min&nbsp;:&nbsp;</span>
                    <span className="timeText">
                      <Timer.Seconds />
                    </span>
                    <span className="labelText"> sec</span>
                  </div>
                  <div>
                    <Button icon="play-circle" onClick={start}>
                      Start
                    </Button>
                    <Button icon="pause-circle" onClick={pause} style={{ marginLeft: '20px' }}>
                      Pause
                    </Button>
                  </div>
                </div>
              )}
            </Timer>

            <Form.Item label="Duration" labelCol={{ sm: 8 }} wrapperCol={{ sm: 16 }}>
              {form.getFieldDecorator('duration', {
                initialValue: decelDetails.duration ? Math.floor(decelDetails.duration / 1000) : 0,
                rules: [
                  {
                    required: false,
                    message: 'Please enter duration!',
                  },
                ],
              })(
                <Input
                  min={0}
                  placeholder="Duration (in seconds)"
                  type="number"
                  style={{ margin: 'auto', width: '100%' }}
                />,
              )}
            </Form.Item>

            <Form.Item label="Title" labelCol={{ sm: 8 }} wrapperCol={{ sm: 16 }}>
              {decelDetails.template.behavior.behaviorName}
            </Form.Item>

            <Form.Item label="Status" labelCol={{ sm: 8 }} wrapperCol={{ sm: 16 }}>
              {decelDetails.status.statusName}
            </Form.Item>

            <Form.Item label="Start Date" labelCol={{ sm: 8 }} wrapperCol={{ sm: 16 }}>
              {form.getFieldDecorator('date', {
                rules: [{ required: true, message: 'Please provide Date!' }],
                initialValue: decelDetails.date ? moment(decelDetails.date) : moment(),
              })(<DatePicker placeholder="Select Date" style={{ width: '100%' }} />)}
            </Form.Item>

            <Form.Item label="Time" labelCol={{ sm: 8 }} wrapperCol={{ sm: 16 }}>
              {form.getFieldDecorator('time', {
                rules: [{ required: true, message: 'Please select a time!' }],
                initialValue: moment(),
              })(
                <TimePicker
                  showTime={{ format: 'HH:mm' }}
                  placeholder="Select Time"
                  format="HH:mm a"
                  picker="time"
                  style={{ width: '100%' }}
                />,
              )}
            </Form.Item>

            <Form.Item label="Environments" labelCol={{ sm: 8 }} wrapperCol={{ sm: 16 }}>
              {form.getFieldDecorator('env', {
                initialValue: decelDetails.environment.id,
                rules: [{ required: true, message: 'Please Select a environment' }],
              })(
                <Select placeholder="Select a environment" style={{ width: '100%' }}>
                  {decelDetails.template.environment.edges.map(({ node }) => {
                    return (
                      <Option key={node.id} value={node.id}>
                        {node.name}
                      </Option>
                    )
                  })}
                </Select>,
              )}
            </Form.Item>

            {decelDetails.template.measurments.edges.map(({ node }) => {
              switch (node.measuringType) {
                case 'Intensity':
                  return (
                    <Form.Item
                      key={node.id}
                      label="Intensity"
                      labelCol={{ sm: 8 }}
                      wrapperCol={{ sm: 16 }}
                    >
                      {form.getFieldDecorator('intensity', {
                        initialValue: decelDetails.intensity,
                        rules: [
                          {
                            required: true,
                            message: 'Please Select a Intensity',
                          },
                        ],
                      })(
                        <Select style={{ width: '100%' }} placeholder="Select a Intensity">
                          <Option key={1} value="Severe">
                            Severe
                          </Option>
                          <Option key={2} value="Moderate">
                            Moderate
                          </Option>
                          <Option key={3} value="Mild Function">
                            Mild Function
                          </Option>
                        </Select>,
                      )}
                    </Form.Item>
                  )
                case 'Frequency':
                  return (
                    <Form.Item
                      key={node.id}
                      label="Frequency"
                      labelCol={{ sm: 8 }}
                      wrapperCol={{ sm: 16 }}
                    >
                      <Button
                        style={{
                          marginLeft: 'auto',
                          marginRight: 7,
                        }}
                        onClick={() => {
                          if (frequency > 0) {
                            setFrequency(state => Number(state) - 1)
                          }
                        }}
                        disabled={updateFrequencyLoading}
                      >
                        <MinusOutlined />
                      </Button>
                      <Input
                        style={{ fontSize: '1.5rem', width: 75 }}
                        type="number"
                        min={0}
                        onChange={e => setFrequency(e.target.value)}
                        value={frequency}
                      />
                      <Button
                        style={{ marginLeft: 7 }}
                        onClick={() => {
                          setFrequency(state => Number(state) + 1)
                        }}
                        loading={updateFrequencyLoading}
                        disabled={updateFrequencyLoading}
                      >
                        <PlusOutlined />
                      </Button>
                    </Form.Item>
                  )
                default:
                  return ''
              }
            })}

            <Form.Item style={{ textAlign: 'center' }}>
              <Button type="primary" htmlType="submit" loading={updateRecordLoading}>
                Submit
              </Button>
            </Form.Item>
          </>
        )}
      </Form>
    </>
  )
}

export default Form.create()(EditRecordDrawer)

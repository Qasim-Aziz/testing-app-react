import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, DatePicker, Form, notification, Input, Select, TimePicker, Tabs } from 'antd'
import gql from 'graphql-tag'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import { useMutation } from 'react-apollo'
import Timer from 'react-compound-timer'
import { UPDATE_RECORD, UPDATE_FREQUENCY, RECORD_DATA } from './query'
import './AddBehaviorDrawer.scss'

const { Option } = Select
const { TabPane } = Tabs

const RecordDrawer = ({ selectTamplate, form, onRecordingData, refetchRecordData }) => {
  const [frequency, setFrequency] = useState(0)
  const [irt, setIrt] = useState(0)
  const [activeTab, setActiveTab] = useState('Manual')
  const [timerRunning, setTimerRunning] = useState(false)
  const timerRef = useRef()

  const [createRecord, { data, loading, error }] = useMutation(RECORD_DATA, {
    fetchPolicy: 'no-cache',
  })

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
    createRecord({
      variables: {
        templateId: selectTamplate,
      },
    })
  }, [createRecord, selectTamplate])

  useEffect(() => {
    if (frequency) {
      updateFrequency({
        variables: {
          id: data.createDecel.details.id,
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

  console.log(updateFrequencyData, 'record')

  const handleSubmit = e => {
    e.preventDefault()
    // eslint-disable-next-line no-shadow
    form.validateFields((error, values) => {
      if (!error) {
        console.log(error, values)
        console.log(
          values.duration,
          parseFloat(values.duration),
          timerRef.current.getTime(),
          'duration',
        )
        updateRecord({
          variables: {
            id: data.createDecel.details.id,
            irt: irt > 0 ? irt : null,
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
        {loading && 'Loading...'}
        {error && 'Opps their is something wrong'}
        {data && (
          <>
            <Timer id={selectTamplate} ref={timerRef} startImmediately={false}>
              {({ start, resume, pause, stop }) => (
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
                    <Button
                      icon="play-circle"
                      onClick={() => {
                        setTimerRunning(true)
                        start()
                      }}
                    >
                      Start
                    </Button>
                    <Button
                      icon="pause-circle"
                      onClick={() => {
                        setTimerRunning(false)
                        pause()
                      }}
                      style={{ marginLeft: '20px' }}
                    >
                      Pause
                    </Button>
                  </div>
                </div>
              )}
            </Timer>
            <Form.Item label="Duration" labelCol={{ sm: 8 }} wrapperCol={{ sm: 16 }}>
              {form.getFieldDecorator('duration', {
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
              {data.createDecel.details.template.behavior.behaviorName}
            </Form.Item>

            <Form.Item label="Status" labelCol={{ sm: 8 }} wrapperCol={{ sm: 16 }}>
              {data.createDecel.details.template.status.statusName}
            </Form.Item>

            <Form.Item label="Start Date" labelCol={{ sm: 8 }} wrapperCol={{ sm: 16 }}>
              {form.getFieldDecorator('date', {
                rules: [{ required: true, message: 'Please provide Date!' }],
                initialValue: data.createDecel.details.date
                  ? moment(data.createDecel.details.date)
                  : moment(),
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
                rules: [{ required: true, message: 'Please Select a environment' }],
              })(
                <Select placeholder="Select a environment" style={{ width: '100%' }}>
                  {data.createDecel.details.template.environment.edges.map(({ node }) => {
                    return (
                      <Option key={node.id} value={node.id}>
                        {node.name}
                      </Option>
                    )
                  })}
                </Select>,
              )}
            </Form.Item>

            {data &&
              data.createDecel.details.template.measurments.edges.map(({ node }) => {
                switch (node.measuringType) {
                  case 'Intensity':
                    return (
                      <Form.Item label="Intensity" labelCol={{ sm: 8 }} wrapperCol={{ sm: 16 }}>
                        {form.getFieldDecorator('intensity', {
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
                      <Form.Item label="Frequency" labelCol={{ sm: 8 }} wrapperCol={{ sm: 16 }}>
                        <Button
                          style={{
                            marginLeft: 'auto',
                            marginRight: 14,
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
                        <span style={{ fontSize: 20, fontWeight: 600 }}>{frequency}</span>

                        <Button
                          style={{
                            marginLeft: 14,
                          }}
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

export default Form.create()(RecordDrawer)

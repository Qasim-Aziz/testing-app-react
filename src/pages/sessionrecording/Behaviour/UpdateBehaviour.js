/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-closing-tag-location */
import React, { useState, useRef, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import { Typography, Button, Select, Form, notification } from 'antd'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'
import Timer from 'react-compound-timer/build'
import { useSelector } from 'react-redux'

const { Text } = Typography
const { Option } = Select

const useStyles = createUseStyles(() => ({
  root: {
    padding: '30px 67px',
    paddingTop: '5px',
  },
  text: {
    fontSize: '16px !important',
    lineHeight: '20px !important',
    letterSpacing: '-0.3px !important',
    color: '#63686E',
  },
  horizontalView: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 25,
    alignItems: 'center',
  },
  submitButton: {
    width: '100%',
    height: 40,
    background: '#0B35B3',
    boxShadow: '0px 2px 4px rgba(96, 97, 112, 0.16), 0px 0px 1px rgba(40, 41, 61, 0.04) !importent',
    borderRadius: 8,
    fontSize: '17 !important',
    fontWeight: 'bold !important',
    marginTop: 20,
  },
}))

const RECORD_DATA = gql`
  mutation createDecel($templateId: ID!, $session: ID!) {
    createDecel(input: { template: $templateId, session: $session }) {
      details {
        id
        date
        irt
        note
        duration
        frequency {
          edges {
            node {
              id
            }
          }
        }
        template {
          id
          behaviorDescription
          behavior {
            behaviorName
          }
          status {
            statusName
          }
          environment {
            edges {
              node {
                id
                name
              }
            }
          }
          measurments {
            edges {
              node {
                id
                measuringType
              }
            }
          }
        }
      }
    }
  }
`

const UPDATE_RECORD = gql`
  mutation updateDecel($id: ID!, $env: ID!, $irt: Int, $intensity: String, $duration: String!) {
    updateDecel(
      input: { pk: $id, environment: $env, irt: $irt, intensity: $intensity, duration: $duration }
    ) {
      details {
        id
        irt
        note
        duration
        template {
          behavior {
            behaviorName
          }
        }
        status {
          id
          statusName
        }
        frequency {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  }
`

const UPDATE_FREQUENCY = gql`
  mutation updateDecelFrequency($id: ID!, $count: Int!, $time: Int!) {
    updateDecelFrequency(input: { pk: $id, count: $count, time: $time }) {
      details {
        frequency {
          edges {
            node {
              id
              count
              time
            }
          }
        }
      }
    }
  }
`

const CreateFrom = ({
  selectTamplate,
  form,
  setNewRecord,
  setSelectTamplate,
  setUpdateBehavior,
}) => {
  const classes = useStyles()
  const [frequency, setFrequency] = useState(0)
  const [irt, setIrt] = useState(0)
  const timerRef = useRef()
  const sessionId = useSelector(state => state.sessionrecording.ChildSession.id)

  const [createRecord, { data, loading, error }] = useMutation(RECORD_DATA, {
    fetchPolicy: 'no-cache',
    variables: {
      session: sessionId,
    },
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
      setSelectTamplate(null)
      setUpdateBehavior(newData)
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
          time: timerRef.current.getTime(),
        },
      })
    }
  }, [frequency])

  useEffect(() => {
    if (data) {
      setNewRecord({ node: data.createDecel.details })
    }
  }, [data])

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
        console.log(values)
        updateRecord({
          variables: {
            id: data.createDecel.details.id,
            irt: irt > 0 ? irt : null,
            frequency: frequency > 0 ? frequency : null,
            env: values.env,
            intensity: values.intensity,
            duration: timerRef.current.getTime(),
          },
        })
      }
    })
  }

  return (
    <Form className={classes.root} onSubmit={handleSubmit}>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      {loading && 'Loading...'}
      {error && 'Opps their is something wrong'}
      {data && (
        <>
          <span
            style={{
              fontSize: 22,
              display: 'block',
              textAlign: 'center',
            }}
          >
            <Timer id={selectTamplate} ref={timerRef}>
              {() => {
                return (
                  <span>
                    <Timer.Minutes /> min:&nbsp;
                    <Timer.Seconds /> sec
                  </span>
                )
              }}
            </Timer>
          </span>
          <div className={classes.horizontalView}>
            <Text className={classes.text} style={{ fontWeight: 'bold' }}>
              Titile:
            </Text>
            <Text className={classes.text}>
              {data.createDecel.details.template.behavior.behaviorName}
            </Text>
          </div>
          <div className={classes.horizontalView}>
            <Text className={classes.text} style={{ fontWeight: 'bold' }}>
              Status:
            </Text>
            <Text className={classes.text}>
              {data.createDecel.details.template.status.statusName}
            </Text>
          </div>
          <div className={classes.horizontalView}>
            <Text className={classes.text} style={{ fontWeight: 'bold' }}>
              Environments:
            </Text>
            <Text className={classes.text} style={{ maxWidth: '60%', lineBreak: 'anywhere' }}>
              <Form.Item>
                {form.getFieldDecorator('env', {
                  rules: [{ required: true, message: 'Please Select a environment' }],
                })(
                  <Select
                    placeholder="Select a environment"
                    style={{
                      width: 120,
                    }}
                  >
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
            </Text>
          </div>
          {data &&
            data.createDecel.details.template.measurments.edges.map(({ node }) => {
              switch (node.measuringType) {
                case 'Intensity':
                  return (
                    <div className={classes.horizontalView} key={node.id}>
                      <Text className={classes.text} style={{ fontWeight: 'bold' }}>
                        Intensity:
                      </Text>
                      <Form.Item>
                        {form.getFieldDecorator('intensity', {
                          rules: [
                            {
                              required: true,
                              message: 'Please Select a Intensity',
                            },
                          ],
                        })(
                          <Select style={{ width: 120 }} placeholder="Select a Intensity">
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
                    </div>
                  )
                case 'IRT':
                  if (irt === undefined) {
                    setIrt(0)
                  }

                  return (
                    <div
                      style={{
                        display: 'flex',
                        marginTop: 16,
                        alignItems: 'center',
                        fontSize: 16,
                      }}
                      key={node.id}
                    >
                      <Text className={classes.text} style={{ fontWeight: 'bold' }}>
                        IRT:
                      </Text>
                      <Button
                        style={{
                          marginLeft: 'auto',
                          marginRight: 7,
                        }}
                        onClick={() => {
                          if (irt > 0) {
                            setIrt(state => state - 1)
                          }
                        }}
                      >
                        <MinusOutlined />
                      </Button>
                      {irt}
                      <Button
                        style={{
                          marginLeft: 7,
                        }}
                        onClick={() => {
                          setIrt(state => state + 1)
                        }}
                      >
                        <PlusOutlined />
                      </Button>
                    </div>
                  )
                case 'Frequency':
                  return (
                    <div
                      style={{
                        display: 'flex',
                        marginTop: 16,
                        alignItems: 'center',
                        fontSize: 16,
                      }}
                      key={node.id}
                    >
                      <Text className={classes.text} style={{ fontWeight: 'bold' }}>
                        Frequency:
                      </Text>
                      <Button
                        style={{
                          marginLeft: 'auto',
                          marginRight: 7,
                        }}
                        onClick={() => {
                          if (frequency > 0) {
                            setFrequency(state => state - 1)
                          }
                        }}
                        disabled={updateFrequencyLoading}
                      >
                        <MinusOutlined />
                      </Button>
                      {frequency}
                      <Button
                        style={{
                          marginLeft: 7,
                        }}
                        onClick={() => {
                          setFrequency(state => state + 1)
                        }}
                        loading={updateFrequencyLoading}
                        disabled={updateFrequencyLoading}
                      >
                        <PlusOutlined />
                      </Button>
                    </div>
                  )
                default:
                  return ''
              }
            })}

          <Button
            type="primary"
            htmlType="submit"
            className={classes.submitButton}
            loading={updateRecordLoading}
          >
            Click for Submit
          </Button>

          <Button
            type="primary"
            className={classes.submitButton}
            style={{
              background: 'red',
              color: '#fff',
            }}
            onClick={() => setSelectTamplate(null)}
          >
            Cancel
          </Button>
        </>
      )}
    </Form>
  )
}

export default Form.create()(CreateFrom)

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */

import { PlusCircleOutlined } from '@ant-design/icons'
import { Button, Form, Input, Modal, notification, Select, Switch } from 'antd'
import ReminderForm from 'components/Behavior/ReminderForm'
import gql from 'graphql-tag'
import moment from 'moment'
import { CANCEL_BUTTON, FORM, SUBMITT_BUTTON } from 'assets/styles/globalStyles'
import { remove, times, update } from 'ramda'
import React, { useEffect, useReducer, useState } from 'react'
import { useMutation, useQuery } from 'react-apollo'
import './templateform.scss'
import LoadingComponent from 'components/LoadingComponent'

const { Option } = Select
const { TextArea } = Input
const { layout, tailLayout } = FORM

const DANCLE_STATUS = gql`
  query {
    getDecelStatus {
      id
      statusName
      statusCode
    }
  }
`

const DANCLE_ENVS = gql`
  query {
    getEnvironment {
      id
      name
      defination
    }
  }
`

const DANCLE_MEASURMENTS = gql`
  query {
    getBehaviourMeasurings {
      id
      measuringType
      unit
    }
  }
`

const CREATE_BEHAVIOR = gql`
  mutation createBehaviour($studentId: ID!, $name: String!) {
    createBehaviour(input: { student: $studentId, name: $name, definition: "Test Definition" }) {
      details {
        id
        behaviorName
      }
    }
  }
`

const CREATE_ENVIRONMENT = gql`
  mutation createEnvironment($name: String!, $studentId: ID!) {
    decelEnvironment(
      input: { name: $name, studentId: $studentId, description: "Env description" }
    ) {
      environment {
        id
        name
      }
    }
  }
`

const TEMPLATE_DETAILS = gql`
  query getTemplateDetails($id: ID!) {
    getTemplateDetails(id: $id) {
      id
      behavior {
        id
        behaviorName
        definition
      }
      reactiveProcedures
      antecedentManipulations
      remainders {
        edges {
          node {
            id
            time
            frequency {
              edges {
                node {
                  id
                  name
                }
              }
            }
          }
        }
      }
      status {
        id
        statusName
      }
      behaviorDescription
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
            unit
          }
        }
      }
    }
  }
`

const BEHAVIORS = gql`
  query getBehaviour($studentId: ID!) {
    getBehaviour(studentId: $studentId) {
      edges {
        node {
          id
          behaviorName
        }
      }
    }
  }
`

const UPDATE_TEMP = gql`
  mutation updateTemplate(
    $studentId: ID!
    $behaviorId: ID!
    $tempId: ID!
    $status: ID!
    $description: String!
    $measurments: [ID!]!
    $env: [ID!]!
    $remainders: [RemainderInput]
    $manipulations: String
    $procedures: String
  ) {
    updateTemplate(
      input: {
        decelData: {
          pk: $tempId
          student: $studentId
          behavior: $behaviorId
          status: $status
          behaviorDescription: $description
          measurments: $measurments
          environment: $env
          antecedentManipulations: $manipulations
          reactiveProcedures: $procedures
          remainders: $remainders
        }
      }
    ) {
      details {
        id
        behaviorDef
        behaviorDescription
        reactiveProcedures
        antecedentManipulations
        behavior {
          id
          behaviorName
          definition
        }
        status {
          id
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
      }
    }
  }
`

const remainderReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_REMAINDER':
      return [
        ...state,
        {
          time: moment(),
          frequency: moment().format('dddd'),
        },
      ]

    case 'REMOVE_REMAINDER':
      return remove(action.index, 1, state)

    case 'UPDATE_TIME':
      return update(action.index, { ...state[action.index], time: action.time }, state)
    case 'UPDATE_FREQUENCY':
      return update(action.index, { ...state[action.index], frequency: action.frequency }, state)
    case 'RESET':
      return [{ time: moment(), frequency: moment().format('dddd') }]
    case 'INIT':
      return action.data
    default:
      return state
  }
}

const UpdateTemplateForm = ({ style, tempId, form, closeUpdateDrawer }) => {
  const durationMesId = 'RGVjZWxCZWhhdmlvck1lYXN1cmluZ3NUeXBlOjQ='
  const studentId = localStorage.getItem('studentId')
  const [initialEnv, setInitialEnv] = useState()
  const [initialMeasu, setInitialMeasu] = useState()
  const [addBehNameModal, setAddBehNameModal] = useState(false)
  const [addEnvNameModal, setAddEnvNameModal] = useState(false)
  const [newBehName, setNewBahName] = useState('')
  const [behNameList, setBehNameList] = useState()
  const [newEnvName, setNewEnvName] = useState('')
  const [disableNewBehButton, setDisableNewBehButton] = useState(true)
  const [disableNewEnvButton, setDisableNewEnvButton] = useState(true)
  const [envList, setEnvList] = useState()
  const [reminder, setReminder] = useState(true)
  const [remainderCount, setRemainderCount] = useState(0)
  const [remainderState, remainderDispatch] = useReducer(remainderReducer, [])

  const {
    data: getTemDetailsData,
    loading: getTemDetailsLoading,
    error: getTemDetailsError,
  } = useQuery(TEMPLATE_DETAILS, {
    fetchPolicy: 'network-only',
    variables: {
      id: tempId,
    },
  })

  const { data: behaviorData, loading: behaviorLoading } = useQuery(BEHAVIORS, {
    variables: {
      studentId,
    },
    fetchPolicy: 'network-only',
  })

  const { data: dancleStatusData, loading: dancleStatusLoading } = useQuery(DANCLE_STATUS)

  const { data: dancleEnvData, loading: dancleEnvLoading } = useQuery(DANCLE_ENVS, {
    fetchPolicy: 'network-only',
  })

  const { data: dancleMeasurementData, loading: dancleMeasurementLoading } = useQuery(
    DANCLE_MEASURMENTS,
  )

  const [
    updateTemp,
    { data: updateTempData, loading: updateTempLoading, error: updateTempError },
  ] = useMutation(UPDATE_TEMP)

  const [
    createNewBehName,
    { data: createBehData, loading: createBehLoading, error: createBehError },
  ] = useMutation(CREATE_BEHAVIOR)

  const [
    createNewEnv,
    { data: createNewEnvData, loading: createNewEnvLoading, error: createNewEnvError },
  ] = useMutation(CREATE_ENVIRONMENT)

  useEffect(() => {
    if (getTemDetailsData) {
      console.log(getTemDetailsData.getTemplateDetails.remainders)
      const prevReminderState = getTemDetailsData.getTemplateDetails.remainders.edges.map(
        reminderData => {
          return {
            id: reminderData.node.id,
            time: moment(reminderData.node.time, 'HH:mm'),
            frequency: reminderData.node.frequency.edges.map(frequencyData => {
              return frequencyData.node.name
            }),
          }
        },
      )
      remainderDispatch({ type: 'INIT', data: prevReminderState })
      setRemainderCount(prevReminderState.length)
    }
  }, [getTemDetailsData])

  useEffect(() => {
    if (behaviorData) {
      setBehNameList(behaviorData.getBehaviour.edges)
    }
  }, [behaviorData])

  useEffect(() => {
    if (dancleEnvData) {
      setEnvList(dancleEnvData.getEnvironment)
    }
  }, [dancleEnvData])

  useEffect(() => {
    if (getTemDetailsData) {
      const env = []
      getTemDetailsData.getTemplateDetails.environment.edges.map(({ node }) => {
        env.push(node.id)
      })
      setInitialEnv(env)

      const measurement = []
      getTemDetailsData.getTemplateDetails.measurments.edges.map(({ node }) => {
        measurement.push(node.id)
      })
      setInitialMeasu(measurement)
    }
  }, [getTemDetailsData])

  useEffect(() => {
    if (updateTempData) {
      notification.success({
        message: 'Update Template Sucessfully',
      })
      closeUpdateDrawer()
    }
  }, [updateTempData])

  useEffect(() => {
    if (updateTempError) {
      notification.error({
        message: 'Opps their something wrong',
      })
    }
  }, [updateTempError])

  useEffect(() => {
    if (createBehData) {
      notification.success({
        message: 'Create New Behavior Name Successfully',
      })
      setBehNameList(state => {
        return [{ node: createBehData.createBehaviour.details }, ...state]
      })
      setNewBahName('')
      setAddBehNameModal(false)
    }
  }, [createBehData])

  useEffect(() => {
    if (createBehError) {
      notification.error({
        message: 'Opps their some thing wrong on create New Behavior Name',
      })
    }
  }, [createBehError])

  useEffect(() => {
    if (createNewEnvData) {
      notification.success({
        message: 'Create New Environment Successfully',
      })
      setEnvList(state => {
        return [createNewEnvData.decelEnvironment.environment, ...state]
      })
      setNewEnvName('')
      form.resetFields()
      setAddEnvNameModal(false)
    }
  }, [createNewEnvData])

  useEffect(() => {
    if (createNewEnvError) {
      notification.error({
        message: 'Opps their some thing wrong on create New Environment',
      })
    }
  }, [createNewEnvError])

  useEffect(() => {
    if (newBehName.length < 1) {
      setDisableNewBehButton(true)
    } else {
      setDisableNewBehButton(false)
    }
  }, [newBehName])

  useEffect(() => {
    if (newEnvName.length < 1) {
      setDisableNewEnvButton(true)
    } else {
      setDisableNewEnvButton(false)
    }
  }, [newEnvName])

  const handelCreateNewBehName = () => {
    if (newBehName.length > 0) {
      createNewBehName({
        variables: {
          name: newBehName,
          studentId,
        },
      })
    }
  }

  const handelCreateNewEnv = () => {
    if (newEnvName.length > 0) {
      createNewEnv({
        variables: {
          name: newEnvName,
          studentId,
        },
      })
    }
  }

  const SubmitForm = e => {
    e.preventDefault()
    const modefiRemainderState = []
    Array.from(remainderState).forEach(node => {
      modefiRemainderState.push({
        id: node.id,
        frequency: node.frequency,
        time: node.time
          .local()
          .utc()
          .format('HH:mm'),
      })
    })

    form.validateFields((error, value) => {
      if (!error) {
        updateTemp({
          variables: {
            tempId,
            studentId,
            behaviorId: value.name,
            status: value.status,
            description: value.description,
            measurments: value.measurements,
            env: value.envs,
            procedures: value.procedure,
            manipulations: value.manipulation,
            remainders: reminder ? modefiRemainderState : null,
          },
        })
      }
    })
  }

  if (getTemDetailsLoading) {
    return <LoadingComponent />
  }

  return (
    <Form
      className="templateForm"
      {...layout}
      onSubmit={SubmitForm}
      name="control-update"
      style={{ marginLeft: 0, position: 'relative', ...style }}
      layout="horizontal"
    >
      {getTemDetailsError && <div style={{ minHeight: '90vh' }}>Opps their something wrong</div>}
      {getTemDetailsData && (
        <div>
          <div
            style={{
              position: 'relative',
            }}
          >
            <PlusCircleOutlined
              onClick={() => setAddBehNameModal(true)}
              style={{
                position: 'absolute',
                right: '0px',
                top: '8px',
                zIndex: '100',
                fontSize: '20px',
              }}
            />
            <Form.Item label="Behavior Name">
              {form.getFieldDecorator('name', {
                initialValue:
                  getTemDetailsData &&
                  !behaviorLoading &&
                  getTemDetailsData.getTemplateDetails.behavior.id,
                rules: [
                  {
                    required: true,
                    message: 'Please select the behavior name!',
                  },
                ],
              })(
                <Select
                  placeholder="Select Behavior Name"
                  loading={behaviorLoading}
                  showSearch
                  optionFilterProp="name"
                >
                  {behNameList?.map(({ node }) => {
                    return (
                      <Option key={node.id} value={node.id} name={node.behaviorName}>
                        {node.behaviorName}
                      </Option>
                    )
                  })}
                </Select>,
              )}
            </Form.Item>
          </div>

          <Form.Item label="Status">
            {form.getFieldDecorator('status', {
              initialValue:
                !dancleStatusLoading &&
                getTemDetailsData &&
                getTemDetailsData.getTemplateDetails.status.id,
              rules: [{ required: true, message: 'Please select a status' }],
            })(
              <Select placeholder="Select Behavior Status" loading={dancleStatusLoading}>
                {dancleStatusData &&
                  dancleStatusData.getDecelStatus.map(dancleStatus => (
                    <Option value={dancleStatus.id} key={dancleStatus.id}>
                      {dancleStatus.statusName}
                    </Option>
                  ))}
              </Select>,
            )}
          </Form.Item>

          <div style={{ position: 'relative' }}>
            <PlusCircleOutlined
              style={{
                position: 'absolute',
                top: 10,
                right: 0,
                fontSize: 20,
                zIndex: 10,
              }}
              onClick={() => setAddEnvNameModal(true)}
            />
            <Form.Item label="Environments">
              {form.getFieldDecorator('envs', {
                initialValue: !dancleEnvLoading && initialEnv && initialEnv,
                rules: [{ required: true, message: 'Please select a Environments' }],
              })(
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="Please select"
                  loading={dancleEnvLoading}
                >
                  {envList?.map(envData => (
                    <Option key={envData.id} value={envData.id}>
                      {envData.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </div>

          <Form.Item label="Measurements">
            {form.getFieldDecorator('measurements', {
              initialValue: !dancleMeasurementLoading && initialMeasu && initialMeasu,
              rules: [{ required: true, message: 'Please select a Environments' }],
            })(
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Please select"
                loading={dancleMeasurementLoading}
              >
                {dancleMeasurementData &&
                  dancleMeasurementData.getBehaviourMeasurings.map(measurement => (
                    <Option
                      key={measurement.id}
                      value={measurement.id}
                      disabled={measurement.id === durationMesId}
                    >
                      {measurement.measuringType}
                    </Option>
                  ))}
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="Behavior description">
            {form.getFieldDecorator('description', {
              initialValue: getTemDetailsData.getTemplateDetails.behaviorDescription
                ? getTemDetailsData.getTemplateDetails.behaviorDescription
                : '',
            })(<TextArea className="small-textarea" placeholder="Describe the behavior" />)}
          </Form.Item>

          <Form.Item label="Reactive Procedure">
            {form.getFieldDecorator('procedure', {
              initialValue: getTemDetailsData.getTemplateDetails.reactiveProcedures
                ? getTemDetailsData.getTemplateDetails.reactiveProcedures
                : '',
            })(<TextArea className="small-textarea" placeholder="Give reactive procedure" />)}
          </Form.Item>

          <Form.Item label="Antecedent Manipulation">
            {form.getFieldDecorator('manipulation', {
              initialValue: getTemDetailsData.getTemplateDetails.antecedentManipulations
                ? getTemDetailsData.getTemplateDetails.antecedentManipulations
                : '',
            })(<TextArea className="small-textarea" placeholder="Give antecedent manipulation" />)}
          </Form.Item>
          <Form.Item label="Behavior Reminders">
            <Switch
              defaultChecked
              onChange={() => {
                setReminder(state => !state)
              }}
            />
          </Form.Item>
          <Form.Item label="Add Reminder">
            {remainderState &&
              times(n => {
                return (
                  <ReminderForm
                    key={n}
                    reminder={reminder}
                    dispatch={remainderDispatch}
                    state={remainderState}
                    index={n}
                    setRemainderCount={setRemainderCount}
                  />
                )
              }, remainderCount)}
            {(!Array.isArray(remainderState) || !remainderState.length) && (
              <PlusCircleOutlined
                style={{ fontSize: 24, marginTop: 5 }}
                onClick={() => {
                  setRemainderCount(state => state + 1)
                  remainderDispatch({ type: 'ADD_REMAINDER' })
                }}
              />
            )}
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button
              type="primary"
              htmlType="submit"
              style={SUBMITT_BUTTON}
              loading={updateTempLoading}
            >
              Update
            </Button>
            <Button
              type="danger"
              style={CANCEL_BUTTON}
              disabled={updateTempLoading}
              onClick={() => {
                form.resetFields()
                closeUpdateDrawer()
              }}
            >
              Cancel
            </Button>
          </Form.Item>
        </div>
      )}

      <Modal
        visible={addBehNameModal}
        title="Add New Behavior Name"
        onCancel={() => setAddBehNameModal(false)}
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={handelCreateNewBehName}
            loading={createBehLoading}
            disabled={disableNewBehButton}
          >
            Create
          </Button>,
        ]}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Input
            value={newBehName}
            onChange={e => setNewBahName(e.target.value)}
            placeholder="Type the new modal name"
            autoFocus
          />
        </div>
      </Modal>

      <Modal
        visible={addEnvNameModal}
        title="Add New Environment"
        onCancel={() => setAddEnvNameModal(false)}
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={handelCreateNewEnv}
            loading={createNewEnvLoading}
            disabled={disableNewEnvButton}
          >
            Create
          </Button>,
        ]}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Input
            value={newEnvName}
            onChange={e => setNewEnvName(e.target.value)}
            placeholder="Type the new environment name"
            autoFocus
          />
        </div>
      </Modal>
    </Form>
  )
}

export default Form.create()(UpdateTemplateForm)

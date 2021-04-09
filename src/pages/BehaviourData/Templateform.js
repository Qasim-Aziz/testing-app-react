/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { PlusCircleOutlined } from '@ant-design/icons'
import { Button, Form, Input, Modal, notification, Select, Switch } from 'antd'
import ReminderForm from 'components/Behavior/ReminderForm'
import moment from 'moment'
import { remove, times, update } from 'ramda'
import { CANCEL_BUTTON, FORM, SUBMITT_BUTTON } from 'assets/styles/globalStyles'
import React, { useEffect, useReducer, useState } from 'react'
import { useMutation, useQuery } from 'react-apollo'
import {
  BEHAVIORS,
  CREATE_BEHAVIOR,
  CREATE_ENVIRONMENT,
  CREATE_TAMPLET,
  DANCLE_ENVS,
  DANCLE_MEASURMENTS,
  DANCLE_STATUS,
} from './query'
import './templateform.scss'

const { Option } = Select
const { TextArea } = Input
const { layout, tailLayout } = FORM

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
    default:
      return state
  }
}

const CreateTemplateForm = ({
  style,
  onCreatingTemplate,
  isBehaviorAlreadyExist,
  cancel,
  form,
  closeDrawer,
}) => {
  const studentId = localStorage.getItem('studentId')
  const [defaultMeasurement, setDefaultMeasurement] = useState([])
  const [addBehNameModal, setAddBehNameModal] = useState(false)
  const [addEnvNameModal, setAddEnvNameModal] = useState(false)
  const [newBehName, setNewBahName] = useState('')
  const [behNameList, setBehNameList] = useState()
  const [newEnvName, setNewEnvName] = useState('')
  const [disableNewBehButton, setDisableNewBehButton] = useState(true)
  const [disableNewEnvButton, setDisableNewEnvButton] = useState(true)
  const [envList, setEnvList] = useState()
  const [reminder, setReminder] = useState(true)
  const [remainderCount, setRemainderCount] = useState(1)
  const [behaviourExists, setBehaviourExists] = useState(false)

  const [remainderState, remainderDispatch] = useReducer(remainderReducer, [
    { time: moment(), frequency: moment().format('dddd') },
  ])

  const [
    createNewBehName,
    { data: createBehData, loading: createBehLoading, error: createBehError },
  ] = useMutation(CREATE_BEHAVIOR)

  const [
    createNewEnv,
    { data: createNewEnvData, loading: createNewEnvLoading, error: createNewEnvError },
  ] = useMutation(CREATE_ENVIRONMENT)

  const { data: dancleStatusData, loading: dancleStatusLoading } = useQuery(DANCLE_STATUS)

  const { data: dancleEnvData, loading: dancleEnvLoading } = useQuery(DANCLE_ENVS)

  const { data: dancleMeasurementData, loading: dancleMeasurementLoading } = useQuery(
    DANCLE_MEASURMENTS,
  )

  const [
    createTemplate,
    { data: newTempleteData, error: newTempletError, loading: newTempleteLoading },
  ] = useMutation(CREATE_TAMPLET)

  const { data: behaviorData, loading: behaviorLoading } = useQuery(BEHAVIORS, {
    variables: {
      studentId,
    },
  })

  // set default form values
  useEffect(() => {
    form.setFieldsValue({
      status: dancleStatusData?.getDecelStatus[0].id,
      envs: dancleEnvData?.getEnvironment[1].id,
    })
  }, [dancleStatusData, dancleEnvData])

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
    if (dancleMeasurementData) {
      const defaultIds = dancleMeasurementData.getBehaviourMeasurings.map(
        measurement => measurement.id,
      )
      setDefaultMeasurement(defaultIds)
    }
  }, [dancleMeasurementData])

  useEffect(() => {
    if (createBehData?.createBehaviour) {
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
    if (createNewEnvData?.decelEnvironment) {
      notification.success({
        message: 'Create New Environment Successfully',
      })
      setEnvList(state => {
        return [createNewEnvData.decelEnvironment.environment, ...state]
      })
      setNewEnvName('')
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
        errorPolicy: 'all',
        onError(err) {
          console.log(err)
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
        errorPolicy: 'all',
        onError(err) {
          console.log(err)
        },
      })
    }
  }

  const SubmitForm = e => {
    e.preventDefault()
    const modefiRemainderState = []
    Array.from(remainderState).forEach(node => {
      modefiRemainderState.push({
        frequency: node.frequency,
        time: node.time
          .local()
          .utc()
          .format('HH:mm'),
      })
    })

    form.validateFields((error, value) => {
      console.log(error, value, 'eror, val')
      if (!error && !behaviourExists) {
        createTemplate({
          variables: {
            studentId,
            behaviorId: value.name,
            status: value.status,
            description: value.description,
            measurments: defaultMeasurement,
            envs: value.envs,
            procedures: value.procedure,
            manipulations: value.manipulation,
            remainders: reminder ? modefiRemainderState : null,
          },
        })
          .then(res => {
            console.log(res)
            notification.success({
              message: 'Behavior Data',
              description: 'New Behavior Templete Added Successfully',
            })
            onCreatingTemplate()
            if (closeDrawer) {
              closeDrawer()
            }
          })
          .catch(err => {
            console.log(err, 'ereroero')
            notification.error({
              message: 'Something went wrong',
              description: err.message,
            })
          })
      }
    })
  }

  return (
    <Form
      className="templateForm"
      colon={false}
      {...layout}
      onSubmit={SubmitForm}
      name="control-ref"
      style={{ marginLeft: 0, position: 'relative', ...style }}
    >
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

        <Form.Item
          label="Behavior Name"
          validateStatus={behaviourExists ? 'error' : 'success'}
          help={behaviourExists ? 'Behaviour already exists' : ''}
        >
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: 'Please select the behavior name!' }],
          })(
            <Select
              placeholder="Select Behavior Name"
              loading={behaviorLoading}
              showSearch
              optionFilterProp="name"
              style={{
                color: '#000',
              }}
              onChange={e => {
                setBehaviourExists(isBehaviorAlreadyExist(e))
              }}
            >
              {behNameList?.map(({ node }) => {
                return (
                  <Option key={node.id} vlaue={node.id} name={node.behaviorName}>
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
            rules: [{ required: true, message: 'Please select a Environments' }],
          })(
            <Select mode="multiple" placeholder="Please select" loading={dancleEnvLoading}>
              {envList?.map(envData => (
                <Option value={envData.id} key={envData.id}>
                  {envData.name}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
      </div>

      <Form.Item label="Behavior description">
        {form.getFieldDecorator('description')(
          <TextArea className="small-textarea" placeholder="Describe the behavior" />,
        )}
      </Form.Item>

      <Form.Item label="Reactive Procedure">
        {form.getFieldDecorator('procedure')(
          <TextArea className="small-textarea" placeholder="Give reactive procedure" />,
        )}
      </Form.Item>

      <Form.Item label="Antecedent Manipulation">
        {form.getFieldDecorator('manipulation')(
          <TextArea className="small-textarea" placeholder="Give antecedent manipulation" />,
        )}
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
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button
          type="primary"
          htmlType="submit"
          style={SUBMITT_BUTTON}
          loading={newTempleteLoading}
        >
          Save Template
        </Button>

        <Button type="ghost" onClick={() => cancel(false)} style={CANCEL_BUTTON}>
          Cancel
        </Button>
      </Form.Item>
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

export default Form.create()(CreateTemplateForm)

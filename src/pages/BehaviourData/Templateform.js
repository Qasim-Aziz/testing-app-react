/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useReducer, useState } from 'react'
import { Form, Input, Button, Select, notification, Modal, Switch, Typography } from 'antd'
import {
  PlusCircleOutlined,
  MinusCircleOutlined,
  PlusSquareOutlined,
  MinusSquareOutlined,
  MinusOutlined,
  CloseOutlined,
} from '@ant-design/icons'
import { useMutation, useQuery } from 'react-apollo'
import moment from 'moment'
import { times, remove, update } from 'ramda'
import './templateform.scss'
import ReminderForm from 'components/Behavior/ReminderForm'
import {
  CREATE_BEHAVIOR,
  CREATE_ENVIRONMENT,
  DANCLE_STATUS,
  DANCLE_ENVS,
  DANCLE_MEASURMENTS,
  CREATE_TAMPLET,
  BEHAVIORS,
} from './query'

const { Option } = Select
const { Text, Title } = Typography
const { TextArea } = Input

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

const BehaviorForm = ({ style, setNewTamplate, setNewTampletFromOpen, form }) => {
  const studentId = localStorage.getItem('studentId')
  const durationMesId = 'RGVjZWxCZWhhdmlvck1lYXN1cmluZ3NUeXBlOjQ='
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

  useEffect(() => {
    if (newTempleteData) {
      notification.success({
        message: 'Behavior Data',
        description: 'New Behavior Templete Added Successfully',
      })
      setNewTamplate({ node: newTempleteData.createTemplate.details })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newTempleteData])

  useEffect(() => {
    if (newTempletError) {
      notification.error({
        message: 'Somthing want wrong',
        description: newTempletError.message,
      })
    }
  }, [newTempletError])

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
          console.log(err);
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
          console.log(err);
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
      if (!error) {
        createTemplate({
          variables: {
            studentId,
            behaviorId: value.name,
            status: value.status,
            description: value.description,
            measurments: value.measurements,
            envs: value.envs,
            procedures: value.procedure,
            manipulations: value.manipulation,
            remainders: reminder ? modefiRemainderState : null,
          },
        })
      }
    })
  }
  const formItemLayout = {
    labelCol: {
      span: 7,
    },
    wrapperCol: {
      span: 15,
      offset: 1,
    },
  }
  const formTailLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 8, offset: 8 },
  }

  return (
    <Form
      colon={false}
      {...formItemLayout}
      onSubmit={SubmitForm}
      name="control-ref"
      style={{ marginLeft: 0, position: 'relative', ...style }}
    >
      <Button
        type="link"
        onClick={() => {
          setNewTampletFromOpen(false)
        }}
        style={{
          position: 'absolute',
          right: -12,
          top: 0,
          zIndex: 10,
        }}
      >
        <CloseOutlined style={{ fontSize: 20, color: '#D81E06' }} />
      </Button>
      <div
        style={{
          position: 'relative',
          paddingTop: 50,
        }}
      >
        <PlusCircleOutlined
          onClick={() => setAddBehNameModal(true)}
          style={{
            position: 'absolute',
            right: '0px',
            top: '60px',
            zIndex: '100',
            fontSize: '20px',
          }}
        />

        <Form.Item label={<span style={{ fontSize: '16px' }}>Behavior Name</span>}>
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: 'Please select the behavior name!' }],
          })(
            <Select
              placeholder="Select Behavior Name"
              size="large"
              loading={behaviorLoading}
              showSearch
              optionFilterProp="name"
              style={{
                color: '#000',
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

      <Form.Item label={<span style={{ fontSize: '16px' }}>Status</span>}>
        {form.getFieldDecorator('status', {
          rules: [{ required: true, message: 'Please select a status' }],
        })(
          <Select placeholder="Select Behavior Status" size="large" loading={dancleStatusLoading}>
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
        <Form.Item label={<span style={{ fontSize: '16px' }}>Environments</span>}>
          {form.getFieldDecorator('envs', {
            rules: [{ required: true, message: 'Please select a Environments' }],
          })(
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Please select"
              size="large"
              loading={dancleEnvLoading}
            >
              {envList?.map(envData => (
                <Option value={envData.id} key={envData.id}>
                  {envData.name}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
      </div>

      <Form.Item label={<span style={{ fontSize: '16px' }}>Measurements</span>}>
        {form.getFieldDecorator('measurements', {
          initialValue: dancleMeasurementData && [durationMesId],
          rules: [{ required: true, message: 'Please select a Environments' }],
        })(
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Please select"
            size="large"
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

      <Form.Item label={<span style={{ fontSize: '16px' }}>Behavior description</span>}>
        {form.getFieldDecorator('description', { initialValue: '' })(
          <TextArea
            placeholder="Describe the behavior"
            style={{
              height: 174,
              resize: 'none',
              color: '#000',
            }}
          />,
        )}
      </Form.Item>

      <Form.Item label={<span style={{ fontSize: '16px' }}>Reactive Procedure</span>}>
        {form.getFieldDecorator('procedure', { initialValue: '' })(
          <Input size="large" placeholder="Give reactive procedure" />,
        )}
      </Form.Item>

      <Form.Item label={<span style={{ fontSize: '16px' }}>Antecedent Manipulation</span>}>
        {form.getFieldDecorator('manipulation', { initialValue: '' })(
          <Input size="large" placeholder="Give antecedent manipulation" />,
        )}
      </Form.Item>
      <Form.Item label={<span style={{ fontSize: '16px' }}>Behavior Reminders</span>}>
        <Switch
          defaultChecked
          onChange={() => {
            setReminder(state => !state)
          }}
          size="large"
        />
      </Form.Item>
      <Form.Item label={<span style={{ fontSize: '16px' }}>Add Remainder</span>}>
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

      <Form.Item {...formTailLayout}>
        <Button
          type="primary"
          htmlType="submit"
          style={{
            width: '100%',
            height: 40,
            marginTop: 10,
          }}
          loading={newTempleteLoading}
        >
          Save Template
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
            size="large"
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
            size="large"
            placeholder="Type the new environment name"
            autoFocus
          />
        </div>
      </Modal>
    </Form>
  )
}

export default Form.create()(BehaviorForm)

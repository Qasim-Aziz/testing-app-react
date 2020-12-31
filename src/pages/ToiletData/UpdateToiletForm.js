import React, { useState, useEffect, useReducer } from 'react'
import {
  Form,
  Button,
  notification,
  Radio,
  InputNumber,
  TimePicker,
  Typography,
  Switch,
} from 'antd'
import { PlusOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { useMutation } from 'react-apollo'
import moment from 'moment'
import { times, remove, update } from 'ramda'
import UrinationForm from 'components/ToiletData/UrinationForm'
import ReminderForm from '../../components/ToiletData/ReminderForm'
import './toiletForm.scss'
import { UPDATE_TOILET } from './query'

const { Title, Text } = Typography

const TimeFormat = 'HH:mm'

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

const urinationReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_URINATION':
      return [
        ...state,
        {
          time: moment(),
          status: undefined,
        },
      ]

    case 'REMOVE_URINATION':
      return remove(action.index, 1, state)

    case 'UPDATE_TIME':
      return update(action.index, { ...state[action.index], time: action.time }, state)
    case 'UPDATE_STATUS':
      return update(action.index, { ...state[action.index], status: action.status }, state)
    case 'RESET':
      return [
        {
          time: moment(),
          status: undefined,
        },
      ]
    default:
      return state
  }
}

const UpdateToiletForm = ({
  style,
  selectDate,
  data: toiletData,
  setOpen,
  refetch,
  closeDrawer,
}) => {
  const [waterIntake, setWaterIntake] = useState(toiletData.lastWater)
  const [waterIntakeTime, setwaterIntakeTime] = useState(moment(toiletData.lastWaterTime, 'HH:mm'))
  const [urination, setUrination] = useState(toiletData.urination)
  const [bowel, setBowel] = useState(toiletData.bowel)
  const [prompted, setPrompted] = useState(toiletData.prompted)
  const [reminder, setReminder] = useState(true)
  const [remainderCount, setRemainderCount] = useState(toiletData.reminders.edges.length)
  const [urinationList, setUrinationList] = useState(true)
  const [urinationCount, setUrinationCount] = useState(toiletData.urinationRecords.edges.length)
  const [deleteUrination, setDeleteUrination] = useState([])

  const prevReminderState = toiletData.reminders.edges.map(reminderData => {
    return {
      time: moment(reminderData.node.time, 'HH:mm a'),
      frequency: reminderData.node.frequency.edges.map(frequencyData => {
        return frequencyData.node.name
      }),
    }
  })
  const [remainderState, remainderDispatch] = useReducer(remainderReducer, prevReminderState)

  const prevUrinationState = toiletData.urinationRecords.edges.map(urinationData => {
    return {
      id: urinationData.node.id,
      time: moment(urinationData.node.time, 'HH:mm a'),
      status: urinationData.node.status,
    }
  })
  const [urinationState, urinationDispatch] = useReducer(urinationReducer, prevUrinationState)

  const [mutate, { data, error, loading }] = useMutation(UPDATE_TOILET, {
    variables: {
      id: toiletData.id,
      date: selectDate,
      time: moment().format('HH:mm a'),
      waterIntake: waterIntake && `${waterIntake} ml`,
      waterIntakeTime: moment(waterIntakeTime).format(TimeFormat),
      urination,
      bowel,
      prompted,
    },
  })

  useEffect(() => {
    if (data) {
      notification.success({
        message: 'Toilet Data',
        description: 'Toilet Data Updated Successfully',
      })
      setWaterIntake('')
      setRemainderCount(1)
      refetch()
      setOpen(false)
    }
    if (error) {
      notification.error({
        message: 'Somthing went wrong to update toilet data',
        description: error,
      })
    }
  }, [data, error, refetch, setOpen])

  const submitForm = e => {
    e.preventDefault()
    const modefiRemainderState = []
    Array.from(remainderState).forEach(node => {
      modefiRemainderState.push({
        frequency: node.frequency,
        time: node.time
          .local()
          .utc()
          .format('HH:mm a'),
      })
    })

    const modefiUrinationState = []
    Array.from(urinationState).forEach(node => {
      if (node.status) {
        modefiUrinationState.push({
          id: node.id,
          status: node.status,
          time: node.time
            .local()
            .utc()
            .format('HH:mm a'),
        })
      }
    })

    const deleteUrinationAllList = []
    if (!urinationList) {
      toiletData.urinationRecords.edges.forEach(urinationData => {
        deleteUrinationAllList.push({ id: urinationData.node.id })
      })
    }
    mutate({
      variables: {
        remainders: reminder ? modefiRemainderState : null,
        urinationRecord: urinationList ? modefiUrinationState : null,
        deleteUrinationRecord: urinationList ? deleteUrination : deleteUrinationAllList,
      },
    })
  }
  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 17,
      offset: 1,
    },
  }
  const formTailLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 8, offset: 7 },
  }

  const btnStle = {
    height: '40px',
    width: '230px',
    fontSize: '14px',
    fontWeight: '500',
  }

  return (
    <Form
      colon={false}
      {...formItemLayout}
      onSubmit={e => submitForm(e, this)}
      name="control-ref"
      style={{ marginLeft: 0, ...style }}
      layout="horizontal"
    >
      <Form.Item label={<span style={{ fontSize: '16px' }}>Urination</span>}>
        <Radio.Group
          className="radioGroup"
          defaultValue={toiletData.urination ? 'y' : 'n'}
          onChange={e => {
            if (e.target.value === 'y') {
              setUrination(true)
            } else {
              setUrination(false)
            }
          }}
          buttonStyle="solid"
        >
          <Radio.Button className="radioButton" style={btnStle} value="y">
            Yes
          </Radio.Button>
          <Radio.Button className="radioButton" style={btnStle} value="n">
            No
          </Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item label={<span style={{ fontSize: '16px' }}>Bowel Movement</span>}>
        <Radio.Group
          className="radioGroup"
          defaultValue={toiletData.bowel ? 'y' : 'n'}
          onChange={e => {
            if (e.target.value === 'y') {
              setBowel(true)
            } else {
              setBowel(false)
            }
          }}
          buttonStyle="solid"
        >
          <Radio.Button className="radioButton" style={btnStle} value="y">
            Yes
          </Radio.Button>
          <Radio.Button className="radioButton" style={btnStle} value="n">
            No
          </Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item label={<span style={{ fontSize: '16px' }}>Prompted to Request</span>}>
        <Radio.Group
          className="radioGroup"
          defaultValue={toiletData.prompted ? 'y' : 'n'}
          onChange={e => {
            if (e.target.value === 'y') {
              setPrompted(true)
            } else {
              setPrompted(false)
            }
          }}
          buttonStyle="solid"
        >
          <Radio.Button className="radioButton" style={btnStle} value="y">
            Yes
          </Radio.Button>
          <Radio.Button className="radioButton" style={btnStle} value="n">
            No
          </Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item label={<span style={{ fontSize: '16px' }}>Water Intake (ml)</span>}>
        <InputNumber
          placeholder="Type water Intake in ml"
          style={{ width: '100%', borderRadius: '0px' }}
          value={waterIntake}
          onChange={value => setWaterIntake(value)}
        />
      </Form.Item>

      <Form.Item label={<span style={{ fontSize: '16px' }}>Water Intake Time</span>}>
        <TimePicker
          value={waterIntakeTime}
          onChange={value => setwaterIntakeTime(value)}
          name="toiletTime"
          style={{ width: '100%' }}
          size="large"
          use12Hours
          format="h:mm a"
        />
      </Form.Item>
      <Form.Item label={<span style={{ fontSize: '16px' }}>Urination</span>}>
        {urinationState &&
          times(n => {
            return (
              <UrinationForm
                key={n}
                urination={urinationList}
                dispatch={urinationDispatch}
                state={urinationState}
                index={n}
                setUrinationCount={setUrinationCount}
                onRemove={() =>
                  setDeleteUrination(state => {
                    state.push({ id: urinationState[n].id })
                    return state
                  })
                }
              />
            )
          }, urinationCount)}
        {(!Array.isArray(urinationState) || !urinationState.length) && (
          <PlusCircleOutlined
            style={{ fontSize: 24, marginTop: 5 }}
            onClick={() => {
              setUrinationCount(state => state + 1)
              urinationDispatch({ type: 'ADD_URINATION' })
            }}
          />
        )}
      </Form.Item>
      <Form.Item label={<span style={{ fontSize: '16px' }}>Toilet Reminders</span>}>
        <Switch
          defaultChecked
          onChange={() => {
            setReminder(state => !state)
          }}
          size="large"
        />
      </Form.Item>

      <Form.Item label={<span style={{ fontSize: '16px' }}>Add Remainder</span>}>
        {times(n => {
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
        <div style={{ display: 'flex' }}>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              width: 180,
              height: 40,
              borderRadius: 0,
            }}
            loading={loading}
          >
            Update Data
          </Button>
          <Button
            type="primary"
            style={{
              width: 180,
              height: 40,
              borderRadius: 0,
              background: 'red',
              color: '#fff',
              marginLeft: 10,
              border: '0px solid',
            }}
            onClick={() => {
              setOpen(null)
              closeDrawer()
            }}
          >
            Cancel
          </Button>
        </div>
      </Form.Item>
    </Form>
  )
}

export default UpdateToiletForm

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
import { PlusOutlined } from '@ant-design/icons'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'
import moment from 'moment'
import { times, remove, update } from 'ramda'
import ReminderForm from 'components/ToiletData/ReminderForm'
import './toiletForm.scss'
import UrinationForm from 'components/ToiletData/UrinationForm'

const { Title, Text } = Typography

const CREATE_TOILET_DATA = gql`
  mutation recordToiletdata(
    $date: Date!
    $time: String!
    $waterIntake: String
    $waterIntakeTime: String!
    $urination: Boolean!
    $bowel: Boolean!
    $prompted: Boolean!
    $remainders: [RemaindersInput]
    $student: ID!
    $urinationRecord: [UrinationRecordsInput]
  ) {
    recordToiletdata(
      input: {
        toiletData: {
          student: $student
          date: $date
          time: $time
          lastWater: $waterIntake
          lastWaterTime: $waterIntakeTime
          success: true
          urination: $urination
          bowel: $bowel
          prompted: $prompted
        }
        remainders: $remainders
        urinationRecord: $urinationRecord
      }
    ) {
      details {
        id
        date
        time
        lastWater
        lastWaterTime
        success
        urination
        bowel
        prompted
      }
    }
  }
`

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

const ToiletForm = ({ style, handleNewToiletDate, setNewToiletCreated, selectDate }) => {
  const [waterIntake, setWaterIntake] = useState()
  const [waterIntakeTime, setwaterIntakeTime] = useState(moment())
  const [urination, setUrination] = useState(true)
  const [bowel, setBowel] = useState(true)
  const [prompted, setPrompted] = useState(true)
  const [reminder, setReminder] = useState(true)
  const [remainderCount, setRemainderCount] = useState(1)
  const [urinationCount, setUrinationCount] = useState(1)
  const studentId = localStorage.getItem('studentId')

  const [remainderState, remainderDispatch] = useReducer(remainderReducer, [
    { time: moment(), frequency: moment().format('dddd') },
  ])
  const [urinationState, urinationDispatch] = useReducer(urinationReducer, [
    { time: moment(), status: undefined },
  ])

  const [mutate, { data, error, loading }] = useMutation(CREATE_TOILET_DATA, {
    variables: {
      student: studentId,
      date: selectDate,
      time: moment().format('HH:mm a'),
      waterIntake: waterIntake && `${waterIntake} ml`,
      waterIntakeTime: moment(waterIntakeTime).format(TimeFormat),
      urination,
      bowel,
      prompted,
    },
  })

  const SubmitForm = e => {
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
          status: node.status,
          time: node.time
            .local()
            .utc()
            .format('HH:mm a'),
        })
      }
    })
    mutate({
      variables: {
        remainders: reminder ? modefiRemainderState : null,
        urinationRecord: modefiUrinationState,
      },
    })
  }

  useEffect(() => {
    if (data) {
      notification.success({
        message: 'Toilet Data',
        description: 'Toilet Data Added Successfully',
      })
      handleNewToiletDate(data.recordToiletdata.details.date)
      setWaterIntake('')
      setRemainderCount(1)
      setNewToiletCreated(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Somthing want wrong',
        description: error,
      })
    }
  }, [error])

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>
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
      onSubmit={e => SubmitForm(e, this)}
      name="control-ref"
      style={{ marginLeft: 0, position: 'relative', ...style }}
      layout="horizontal"
    >
      <Form.Item label={<span style={{ fontSize: '16px' }}>Urination</span>}>
        <Radio.Group
          className="radioGroup"
          defaultValue="y"
          onChange={e => {
            if (e.target.value === 'y') {
              setUrination(true)
            } else {
              setUrination(false)
            }
          }}
          buttonStyle="solid"
        >
          <Radio.Button className="radioButton" style={btnStle} value="y" key="1">
            Yes
          </Radio.Button>
          <Radio.Button className="radioButton" style={btnStle} value="n" key="2">
            No
          </Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item label={<span style={{ fontSize: '16px' }}>Bowel Movement</span>}>
        <Radio.Group
          className="radioGroup"
          defaultValue="y"
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
          defaultValue="y"
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
                dispatch={urinationDispatch}
                state={urinationState}
                index={n}
                setUrinationCount={setUrinationCount}
              />
            )
          }, urinationCount)}
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
            width: 180,
            height: 40,
            borderRadius: 0,
          }}
          loading={loading}
        >
          Save Data
        </Button>
      </Form.Item>
    </Form>
  )
}

export default ToiletForm

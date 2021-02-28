import React, { useState, useEffect, useReducer } from 'react'
import {
  Form,
  Button,
  notification,
  Radio,
  InputNumber,
  TimePicker,
  Checkbox,
  Row,
  Col,
  Typography,
  Switch,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'
import moment from 'moment'
import { times, remove, update } from 'ramda'
import { useSelector } from 'react-redux'
import ReminderForm from 'components/ToiletData/ReminderForm'
import './toiletForm.scss'
import UrinationForm from 'components/ToiletData/UrinationForm'
import Scrollbars from 'react-custom-scrollbars'

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
    $session: ID!
    $urinationRecord: [UrinationRecordsInput]
  ) {
    recordToiletdata(
      input: {
        toiletData: {
          session: $session
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

const TimeFormat = 'HH:mm a'

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
  const sessionId = useSelector(state => state.sessionrecording.ChildSession.id)

  const [remainderState, remainderDispatch] = useReducer(remainderReducer, [
    { time: moment(), frequency: moment().format('dddd') },
  ])
  const [urinationState, urinationDispatch] = useReducer(urinationReducer, [
    { time: moment(), status: undefined },
  ])

  const [mutate, { data, error, loading }] = useMutation(CREATE_TOILET_DATA, {
    variables: {
      session: sessionId,
      student: studentId,
      date: selectDate,
      time: moment().format(TimeFormat),
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
      remainderDispatch({ type: 'RESET' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Somthing want wrong',
      })
    }
  }, [error])

  return (
    <Form
      onSubmit={e => SubmitForm(e, this)}
      name="control-ref"
      style={{ marginLeft: 0, ...style }}
    >
      <div
        className="toilet-data-checkbox-item"
        style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}
      >
        <Form.Item style={{ display: 'flex' }} label="Urination">
          <Checkbox
            defaultChecked
            onChange={e => {
              if (e.target.checked) {
                setUrination(true)
              } else {
                setUrination(false)
              }
            }}
            style={{ lineHeight: '32px' }}
          />
        </Form.Item>

        <Form.Item style={{ display: 'flex' }} label="Bowel Movement">
          <Checkbox
            defaultChecked
            onChange={e => {
              if (e.target.checked) {
                setBowel(true)
              } else {
                setBowel(false)
              }
            }}
            style={{ lineHeight: '32px' }}
          />
        </Form.Item>

        <Form.Item style={{ display: 'flex' }} label="Prompted to Request">
          <Checkbox
            defaultChecked
            onChange={e => {
              if (e.target.checked) {
                setPrompted(true)
              } else {
                setPrompted(false)
              }
            }}
            style={{ lineHeight: '32px' }}
          />
        </Form.Item>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Form.Item label="Water Intake (ml)">
          <InputNumber
            placeholder="Type water Intake in ml"
            style={{ width: '100%' }}
            value={waterIntake}
            size="large"
            onChange={value => setWaterIntake(value)}
          />
        </Form.Item>

        <Form.Item label="Water Intake Time">
          <TimePicker
            value={waterIntakeTime}
            onChange={value => setwaterIntakeTime(value)}
            size="large"
            name="toiletTime"
            style={{ width: '100%' }}
          />
        </Form.Item>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            margin: '15px 0',
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 'bold', color: 'black', margin: 'auto 0' }}>
            Urination
          </div>
          <Button
            style={{
              padding: '0 8px',
              height: 30,
              marginLeft: 'auto',
            }}
            onClick={() => {
              setUrinationCount(state => state + 1)
              urinationDispatch({ type: 'ADD_URINATION' })
            }}
          >
            <PlusOutlined style={{ fontSize: 22, marginTop: 3 }} />
          </Button>
        </div>

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
      </div>

      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            margin: '24px 0 15px',
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 'bold', color: 'black', margin: 'auto 0' }}>
            Total Reminder
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Switch
              defaultChecked
              onChange={() => {
                setReminder(state => !state)
              }}
            />
            <Button
              disabled={!reminder}
              style={{
                height: 30,
                marginLeft: '10px',
                padding: '0 8px',
                marginRight: '0',
              }}
              onClick={() => {
                setRemainderCount(state => state + 1)
                remainderDispatch({ type: 'ADD_REMAINDER' })
              }}
            >
              <PlusOutlined style={{ fontSize: 22, marginTop: 3 }} />
            </Button>
          </div>
        </div>
        {times(n => {
          return (
            <ReminderForm
              reminder={reminder}
              dispatch={remainderDispatch}
              state={remainderState}
              index={n}
              key={n}
              setRemainderCount={setRemainderCount}
            />
          )
        }, remainderCount)}
      </div>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{
            width: 206,
            height: 40,
            background: '#0B35B3',
            marginTop: 10,
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

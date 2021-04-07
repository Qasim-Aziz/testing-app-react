/* eslint-disable no-shadow */
import React, { useState, useEffect, useReducer } from 'react'
import { Form, Input, Button, Select, DatePicker, notification, Typography, Switch } from 'antd'
import gql from 'graphql-tag'
import { useMutation, useQuery } from 'react-apollo'
import moment from 'moment'
import { times, remove, update } from 'ramda'
import './toiletForm.scss'
import { FORM, SUBMITT_BUTTON } from 'assets/styles/globalStyles'
import { PlusOutlined } from '@ant-design/icons'
import ReminderForm from './Medicalform/ReminderForm'
import PreseptionDrugFrom from './Medicalform/PreseptionDrugForm'

const { RangePicker } = DatePicker
const { Option } = Select
const { Title, Text } = Typography
const { TextArea } = Input
const { layout, tailLayout } = FORM

const CREATE_MEDICAL_DATA = gql`
  mutation createMedical(
    $studentId: ID!
    $date: Date!
    $condition: String!
    $startDate: Date!
    $endDate: Date!
    $note: String
    $severity: ID!
    $drug: [DrugInput!]!
    $remainder: [RemainderInput!]!
  ) {
    createMedical(
      input: {
        student: $studentId
        date: $date
        condition: $condition
        startDate: $startDate
        endDate: $endDate
        note: $note
        severity: $severity
        drug: $drug
        remainders: $remainder
      }
    ) {
      details {
        id
        date
        condition
        startDate
        endDate
        note
        duration
        lastObservedDate
      }
    }
  }
`

const SEVERITY_TYPE = gql`
  query {
    getSeverity {
      id
      name
    }
  }
`

const presepReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_PRESEP_DRUG':
      return [
        ...state,
        {
          drugName: '',
          times: 1,
          dosage: 1,
        },
      ]

    case 'REMOVE_PRESEP_DRUG':
      return remove(action.index, 1, state)

    case 'UPDATE_DRUG':
      return update(action.index, { ...state[action.index], drugName: action.drugName }, state)
    case 'UPDATE_TIME':
      return update(
        action.index,
        { ...state[action.index], times: parseInt(action.time, 10) },
        state,
      )
    case 'UPDATE_DOSAGE':
      return update(
        action.index,
        { ...state[action.index], dosage: parseInt(action.dosage, 10) },
        state,
      )
    case 'RESET':
      return [{ drugName: '', times: 1, dosage: 1 }]
    default:
      return state
  }
}

const remainderReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_REMAINDER':
      return [
        ...state,
        {
          time: moment(),
          frequency: [],
        },
      ]

    case 'REMOVE_REMAINDER':
      return remove(action.index, 1, state)

    case 'UPDATE_TIME':
      return update(action.index, { ...state[action.index], time: action.time }, state)
    case 'UPDATE_FREQUENCY':
      return update(action.index, { ...state[action.index], frequency: action.frequency }, state)
    case 'RESET':
      return [{ time: moment(), frequency: [] }]
    default:
      return state
  }
}

const MedicalForm = ({ style, handleNewMediDate, closeDrawer, setNewMediCreated, form }) => {
  const [reminder, setReminder] = useState(true)
  const [preseptionDrugCount, setPreseptionDrugCount] = useState(1)
  const [remainderCount, setRemainderCount] = useState(1)

  const [presepState, presepDispatch] = useReducer(presepReducer, [
    { drugName: '', times: 1, dosage: 1 },
  ])

  const [remainderState, remainderDispatch] = useReducer(remainderReducer, [
    { time: moment(), frequency: [] },
  ])

  const studentId = localStorage.getItem('studentId')

  const { data: severityType, loading: severityTypeLoading, error: severityTypeError } = useQuery(
    SEVERITY_TYPE,
  )

  const [mutate, { data, error, loading }] = useMutation(CREATE_MEDICAL_DATA, {
    variables: {
      studentId,
      drug: presepState,
      // remainder: reminder ? remainderState : null,
    },
  })

  useEffect(() => {
    if (severityTypeError) {
      notification.error({
        message: 'Failed to load severity types',
      })
    }
  }, [severityTypeError])

  const SubmitForm = e => {
    e.preventDefault()

    const modefiRemainderState = []
    Array.from(remainderState).forEach(node => {
      modefiRemainderState.push({
        frequency: node.frequency,
        time: moment(node.time)
          .local()
          .utc()
          .format('HH:mm'),
      })
    })

    form.validateFields((error, values) => {
      if (!error) {
        mutate({
          variables: {
            date: moment(values.timeFrame[0]).format('YYYY-MM-DD'),
            startDate: moment(values.timeFrame[0]).format('YYYY-MM-DD'),
            endDate: moment(values.timeFrame[1]).format('YYYY-MM-DD'),
            condition: values.condition,
            severity: values.severity,
            note: values.note,
            remainder: reminder ? modefiRemainderState : null,
          },
        })
      }
    })
  }

  useEffect(() => {
    if (data) {
      notification.success({
        message: 'Medical Data',
        description: 'Medical Data Added Successfully',
      })
      handleNewMediDate(data.createMedical.details.date)
      form.resetFields()
      setPreseptionDrugCount(1)
      presepDispatch({ type: 'RESET' })
      setRemainderCount(1)
      remainderDispatch({ type: 'RESET' })
      setNewMediCreated(true)
      if (closeDrawer) {
        closeDrawer()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Somthing went wrong',
        description: error,
      })
    }
  }, [error])

  // set default form-field values
  useEffect(() => {
    console.log(form.getFieldValue('timeFrame'))
    const defaultTimeFrame = [moment(), moment().add(7, 'days')]
    form.setFieldsValue({
      timeFrame: defaultTimeFrame,
      severity: severityType?.getSeverity[1].id,
    })
  }, [severityType])

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>
  }

  return (
    <Form
      {...layout}
      onSubmit={e => SubmitForm(e)}
      name="control-ref"
      colon={false}
      style={{ marginLeft: 0, position: 'relative', ...style }}
    >
      <Form.Item label="Medical Condition">
        {form.getFieldDecorator('condition', {
          rules: [{ required: true, message: 'Please give the condition name' }],
        })(<Input placeholder="Type the condition" />)}
      </Form.Item>

      <Form.Item label="Start & End Date">
        {form.getFieldDecorator('timeFrame', {
          rules: [{ required: true, message: 'Please select start and end date!' }],
        })(<RangePicker />)}
      </Form.Item>

      <Form.Item label="Severity">
        {form.getFieldDecorator('severity', {
          rules: [{ required: true, message: 'Please select a severity' }],
        })(
          <Select
            placeholder="Select Severity"
            showSearch
            loading={severityTypeLoading}
            optionFilterProp="name"
          >
            {severityType &&
              severityType.getSeverity.map(node => (
                <Option value={node.id} name={node.name}>
                  {node.name}
                </Option>
              ))}
          </Select>,
        )}
      </Form.Item>

      <Form.Item label="Note">
        {form.getFieldDecorator('note')(
          <TextArea style={{ height: 120 }} placeholder="Take a note" />,
        )}
      </Form.Item>

      <Form.Item label="Prescription">
        {times(n => {
          return (
            <PreseptionDrugFrom
              index={n}
              dispatch={presepDispatch}
              state={presepState}
              setPreseptionDrugCount={setPreseptionDrugCount}
            />
          )
        }, preseptionDrugCount)}
      </Form.Item>

      <Form.Item label="Medical Reminders">
        <Switch
          defaultChecked
          onChange={() => {
            setReminder(state => !state)
          }}
        />
      </Form.Item>

      <Form.Item label="Add Reminders">
        {times(n => {
          return (
            <ReminderForm
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
        <Button type="primary" htmlType="submit" style={SUBMITT_BUTTON} loading={loading}>
          Save Data
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Form.create()(MedicalForm)

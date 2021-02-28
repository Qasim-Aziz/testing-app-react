/* eslint-disable no-shadow */
import React, { useState, useEffect, useReducer } from 'react'
import { Form, Input, Button, Select, DatePicker, notification, Typography, Switch } from 'antd'
import gql from 'graphql-tag'
import { useMutation, useQuery } from 'react-apollo'
import moment from 'moment'
import { times, remove, update } from 'ramda'
import './toiletForm.scss'
import { PlusOutlined } from '@ant-design/icons'
import ReminderForm from './Medicalform/ReminderForm'
import PreseptionDrugFrom from './Medicalform/PreseptionDrugForm'
import { MEDICAL_DETAILS, UPDATE_MEDICAL } from './query'

const { RangePicker } = DatePicker
const { Option } = Select
const { Title, Text } = Typography
const { TextArea } = Input

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
    case 'INIT':
      return action.initData

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
    case 'INIT':
      return action.initData

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

const UpdateMedicalForm = ({ style, setOpen, form, id, closeDrawer, setMedDataUpdated }) => {
  const [reminder, setReminder] = useState(true)
  const [preseptionDrugCount, setPreseptionDrugCount] = useState(0)
  const [remainderCount, setRemainderCount] = useState(0)

  const { data: medData, error: medError, loading: medLoading } = useQuery(MEDICAL_DETAILS, {
    variables: {
      id,
    },
  })

  const [presepState, presepDispatch] = useReducer(presepReducer, [])

  const [remainderState, remainderDispatch] = useReducer(remainderReducer, [])

  const { data: severityType, loading: severityTypeLoading, error: severityTypeError } = useQuery(
    SEVERITY_TYPE,
  )

  const [mutate, { data, error, loading }] = useMutation(UPDATE_MEDICAL, {
    variables: {
      id,
      drug: presepState,
      // remainder: reminder ? remainderState : null,
    },
  })

  useEffect(() => {
    if (medData) {
      setPreseptionDrugCount(medData.getMedicationDetails.drug.edges.length)
      setRemainderCount(medData.getMedicationDetails.remainders.edges.length)
      const changeDrugData = medData.getMedicationDetails.drug.edges.map(({ node }) => {
        return {
          drugName: node.drugName,
          dosage: node.dosage,
          times: node.times,
        }
      })
      const changeReminderData = medData.getMedicationDetails.remainders.edges.map(({ node }) => {
        return {
          time: moment(node.time, 'HH:mm'),
          // eslint-disable-next-line no-shadow
          frequency: node.frequency.edges.map(({ node }) => {
            return node.name
          }),
        }
      })
      presepDispatch({ type: 'INIT', initData: changeDrugData })
      remainderDispatch({ type: 'INIT', initData: changeReminderData })
    }
  }, [medData])

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
        time: node.time
          .local()
          .utc()
          .format('HH:mm'),
      })
    })

    form.validateFields((error, values) => {
      if (!error) {
        mutate({
          variables: {
            date: moment(values.timeFream[0]).format('YYYY-MM-DD'),
            startDate: moment(values.timeFream[0]).format('YYYY-MM-DD'),
            endDate: moment(values.timeFream[1]).format('YYYY-MM-DD'),
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
        message: 'Medical data update sucessfully',
      })
      form.resetFields()
      setPreseptionDrugCount(0)
      presepDispatch({ type: 'RESET' })
      setRemainderCount(0)
      remainderDispatch({ type: 'RESET' })
      setOpen(null)
      setMedDataUpdated(true)
      closeDrawer()
    }

    if (error) {
      notification.error({
        message: 'Somthing want wrong',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error])

  if (medError) {
    return <h3 style={{ color: 'red' }}>Opps their are something wrong</h3>
  }

  if (medLoading) {
    return <h4>Loading...</h4>
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

  return (
    <Form
      onSubmit={e => SubmitForm(e)}
      name="control-ref"
      style={{ marginLeft: 0, position: 'relative', ...style }}
      {...formItemLayout}
      colon={false}
      layout="horizontal"
    >
      <Form.Item label={<span style={{ fontSize: '16px' }}>Medical Condition</span>}>
        {form.getFieldDecorator('condition', {
          initialValue: medData?.getMedicationDetails.condition,
          rules: [{ required: true, message: 'Please give the condition name' }],
        })(<Input size="large" placeholder="Type the condition" />)}
      </Form.Item>

      <Form.Item label={<span style={{ fontSize: '16px' }}>Start & End Date</span>}>
        {form.getFieldDecorator('timeFream', {
          initialValue: medData && [
            moment(medData.getMedicationDetails.startDate),
            moment(medData.getMedicationDetails.endDate),
          ],
          rules: [{ required: true, message: 'Please select start and end date!' }],
        })(<RangePicker size="large" style={{ width: '100%' }} />)}
      </Form.Item>

      <Form.Item label={<span style={{ fontSize: '16px' }}>Severity</span>}>
        {form.getFieldDecorator('severity', {
          initialValue: medData.getMedicationDetails.severity.id,
          rules: [{ required: true, message: 'Please select a severity' }],
        })(
          <Select
            placeholder="Select Severity"
            size="large"
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

      <Form.Item label={<span style={{ fontSize: '16px' }}>Note</span>}>
        {form.getFieldDecorator('note', {
          initialValue: medData.getMedicationDetails.note,
        })(<TextArea style={{ height: 120 }} size="large" placeholder="Take a note" />)}
      </Form.Item>

      <Form.Item label={<span style={{ fontSize: '16px' }}>Prescription</span>}>
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
      <Form.Item label={<span style={{ fontSize: '16px' }}>Medical Reminders</span>}>
        <Switch
          defaultChecked
          onChange={() => {
            setReminder(state => !state)
          }}
          size="large"
        />
      </Form.Item>
      <Form.Item label={<span style={{ fontSize: '16px' }}>Add Reminders</span>}>
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
      <Form.Item {...formTailLayout}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Form.Item style={{ width: '45%' }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: '100%',
                height: 40,

                borderRadius: 0,
              }}
              loading={loading}
            >
              Update
            </Button>
          </Form.Item>
          <Form.Item style={{ width: '45%' }}>
            <Button
              type="primary"
              style={{
                width: '100%',
                height: 40,
                background: 'red',
                color: '#fff',
                borderRadius: 0,
                border: '0px solid',
              }}
              onClick={() => {
                form.resetFields()
                setOpen(null)
                closeDrawer()
              }}
            >
              Cancel
            </Button>
          </Form.Item>
        </div>
      </Form.Item>
    </Form>
  )
}

export default Form.create()(UpdateMedicalForm)

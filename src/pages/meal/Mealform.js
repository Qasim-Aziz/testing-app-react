/* eslint-disable no-shadow */
import React, { useState, useEffect, useReducer, useCallback } from 'react'
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  notification,
  TimePicker,
  Typography,
  Switch,
} from 'antd'
import gql from 'graphql-tag'
import { useMutation, useQuery } from 'react-apollo'
import { times, remove, update } from 'ramda'
import moment from 'moment'
import './MealForm.scss'
import ReminderForm from 'components/mealData/ReminderForm'

const { TextArea } = Input
const { Option } = Select
const { Text, Title } = Typography

const CREATE_MEAL = gql`
  mutation createFood(
    $id: ID
    $date: Date
    $mealName: String!
    $mealTime: String
    $note: String
    $mealType: String
    $waterIntake: String
    $foodType: ID
    $remainders: [RemainderInput]
  ) {
    createFood(
      input: {
        foodData: {
          student: $id
          date: $date
          mealName: $mealName
          mealTime: $mealTime
          note: $note
          mealType: $mealType
          waterIntake: $waterIntake
          foodType: $foodType
          remainders: $remainders
        }
      }
    ) {
      details {
        id
        mealType
        mealName
        waterIntake
        date
        mealTime
        note
        foodType {
          id
          name
        }
      }
    }
  }
`

const GET_FOOD_TYPE = gql`
  query {
    getFoodType {
      id
      name
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
    default:
      return state
  }
}

const dateFormat = 'YYYY-MM-DD'

const MealForm = ({ style, handleNewMealDate, setNewMeal, form, closeDrawer }) => {
  const [date] = useState(moment())
  const [mealTime] = useState(moment())
  const [note, setNote] = useState('')
  const studentId = localStorage.getItem('studentId')
  const [reminder, setReminder] = useState(true)
  const [remainderCount, setRemainderCount] = useState(1)

  const [remainderState, remainderDispatch] = useReducer(remainderReducer, [
    { time: moment(), frequency: moment().format('dddd') },
  ])

  const foodTypeQuery = useQuery(GET_FOOD_TYPE)

  const [mutate, { data, error }] = useMutation(CREATE_MEAL)

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
            id: studentId,
            date: moment(date).format(dateFormat),
            mealName: values.mealName,
            mealType: values.mealType,
            waterIntake: values.waterIntake,
            foodType: values.foodType,
            note: values.note,
            mealTime: moment(values.mealTime).format('HH:mm a'),
            remainders: reminder ? modefiRemainderState : null,
          },
        })
      }
    })
  }

  useEffect(() => {
    if (data) {
      notification.success({
        message: 'Meal Data',
        description: 'Meal Data Added Successfully',
      })
      handleNewMealDate(data.createFood.details.date)
      setNewMeal(data.createFood.details)
      form.resetFields()
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

  // update mealType based on selected time
  useEffect(() => {
    const timeHH = form.getFieldValue('mealTime')?.format('HH')
    if (timeHH) {
      let mealType = ''
      if (timeHH >= 2 && timeHH < 12) {
        mealType = 'Breakfast'
      } else if (timeHH >= 12 && timeHH < 17) {
        mealType = 'Lunch'
      } else {
        mealType = 'Dinner'
      }
      form.setFieldsValue({
        mealType,
      })
    }
  }, [form.getFieldValue('mealTime')])

  // Default values for forms
  useEffect(() => {
    form.setFieldsValue({
      mealDate: date,
      mealTime,
      waterIntake: 100,
    })
  }, [])

  useEffect(() => {
    form.setFieldsValue({ foodType: foodTypeQuery?.data?.getFoodType[1].id })
  }, [foodTypeQuery])

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>
  }

  const formItemLayout = {
    labelCol: {
      span: 5,
    },
    wrapperCol: {
      span: 17,
      offset: 1,
    },
  }
  const formTailLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 8, offset: 6 },
  }

  return (
    <Form
      colon={false}
      {...formItemLayout}
      onSubmit={e => SubmitForm(e, this)}
      name="control-ref"
      style={{ marginLeft: 0, position: 'relative', ...style }}
      layout="horizontal"
      size="small"
    >
      <div>
        <Form.Item label={<span style={{ fontSize: '16px' }}>Meal Date</span>} rule={[]}>
          {form.getFieldDecorator('mealDate', {
            rules: [{ required: true, message: 'Please Select Date!' }],
          })(<DatePicker style={{ width: '100%' }} />)}
        </Form.Item>
        <Form.Item label={<span style={{ fontSize: '16px' }}>Meal Time</span>}>
          {form.getFieldDecorator('mealTime', {
            rules: [{ required: true, message: 'Please Select a time!' }],
          })(<TimePicker use12Hours format="h:mm a" style={{ width: '100%' }} />)}
        </Form.Item>
      </div>

      <Form.Item label={<span style={{ fontSize: '16px' }}>Meal Name</span>}>
        {form.getFieldDecorator('mealName', {
          rules: [{ required: true, message: 'Please Select meal name!' }],
        })(<Input placeholder="Enter Meal Name" name="mealName" style={{ color: '#000' }} />)}
      </Form.Item>

      <Form.Item label={<span style={{ fontSize: '16px' }}>Meal Type</span>}>
        {form.getFieldDecorator('mealType', {
          rules: [{ required: true, message: 'Please Select a meal type!' }],
        })(
          <Select style={{}} placeholder="Select Meal Type" allowclear size="large" showSearch>
            <Option value="Breakfast">Breakfast</Option>
            <Option value="Lunch">Lunch</Option>
            <Option value="Dinner">Dinner</Option>
          </Select>,
        )}
      </Form.Item>

      <Form.Item label={<span style={{ fontSize: '16px' }}>Food Type</span>}>
        {form.getFieldDecorator('foodType', {
          rules: [{ required: true, message: 'Please Select a food type!' }],
        })(
          <Select
            style={{}}
            placeholder="Select Food Type"
            size="large"
            allowclear
            showSearch
            optionFilterProp="name"
          >
            {foodTypeQuery.data &&
              foodTypeQuery.data.getFoodType.map(type => {
                return (
                  <Option value={type.id} key={type.id} name={type.name}>
                    {type.name}
                  </Option>
                )
              })}
          </Select>,
        )}
      </Form.Item>

      <Form.Item label={<span style={{ fontSize: '16px' }}>Water</span>}>
        {form.getFieldDecorator('waterIntake', {
          rules: [
            {
              required: true,
              message: 'Please give the water intake number on ml!',
            },
          ],
        })(<Input placeholder="Enter water taken" type="number" addonAfter="ml" min={0} />)}
      </Form.Item>

      <Form.Item label={<span style={{ fontSize: '16px' }}>Note</span>}>
        {form.getFieldDecorator('note')(
          <TextArea
            placeholder="Meal Details"
            name="note"
            autoSize={{ minRows: 3 }}
            style={{
              color: '#000',
            }}
          />,
        )}
      </Form.Item>
      <Form.Item label={<span style={{ fontSize: '16px' }}>Meal Reminders</span>}>
        <Switch
          defaultChecked
          onChange={() => {
            setReminder(state => !state)
          }}
        />
      </Form.Item>
      <Form.Item label={<span style={{ fontSize: '16px' }}>Add Reminder</span>}>
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
        >
          Save Data
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Form.create()(MealForm)

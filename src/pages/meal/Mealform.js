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
import { FORM, COLORS, SUBMITT_BUTTON, CANCEL_BUTTON } from 'assets/styles/globalStyles'

const { TextArea } = Input
const { Option } = Select
const { Text, Title } = Typography
const { layout, tailLayout } = FORM

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

  const [mutate, { loading }] = useMutation(CREATE_MEAL)

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
          .then(res => {
            notification.success({
              message: 'Meal Data',
              description: 'Meal Data Added Successfully',
            })
            handleNewMealDate(res.data.createFood.details.date)
            setNewMeal(res.data.createFood.details)
            form.resetFields()
            closeDrawer()
          })
          .catch(err => {
            notification.error({
              message: 'Something went wrong',
              description: 'Unable to add meal data',
            })
          })
      }
    })
  }

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

  return (
    <Form
      colon={false}
      {...layout}
      onSubmit={e => SubmitForm(e, this)}
      name="control-ref"
      style={{ marginLeft: 0, position: 'relative', ...style }}
      layout="horizontal"
    >
      <div>
        <Form.Item label="Meal Date">
          {form.getFieldDecorator('mealDate', {
            rules: [{ required: true, message: 'Please Select Date!' }],
          })(<DatePicker style={{ width: '100%' }} />)}
        </Form.Item>
        <Form.Item label="Meal Time">
          {form.getFieldDecorator('mealTime', {
            rules: [{ required: true, message: 'Please Select a time!' }],
          })(<TimePicker use12Hours format="h:mm a" style={{ width: '100%' }} />)}
        </Form.Item>
      </div>

      <Form.Item label="Meal Name">
        {form.getFieldDecorator('mealName', {
          rules: [{ required: true, message: 'Please Select meal name!' }],
        })(<Input placeholder="Enter Meal Name" name="mealName" style={{ color: '#000' }} />)}
      </Form.Item>

      <Form.Item label="Meal Type">
        {form.getFieldDecorator('mealType', {
          rules: [{ required: true, message: 'Please Select a meal type!' }],
        })(
          <Select placeholder="Select Meal Type" allowclear showSearch>
            <Option value="Breakfast">Breakfast</Option>
            <Option value="Lunch">Lunch</Option>
            <Option value="Dinner">Dinner</Option>
          </Select>,
        )}
      </Form.Item>

      <Form.Item label="Food Type">
        {form.getFieldDecorator('foodType', {
          rules: [{ required: true, message: 'Please Select a food type!' }],
        })(
          <Select placeholder="Select Food Type" allowclear showSearch optionFilterProp="name">
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

      <Form.Item label="Water">
        {form.getFieldDecorator('waterIntake', {
          rules: [
            {
              required: true,
              message: 'Please give the water intake number on ml!',
            },
          ],
        })(<Input placeholder="Enter water taken" type="number" addonAfter="ml" min={0} />)}
      </Form.Item>

      <Form.Item label="Note">
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
      <Form.Item label="Meal Reminders">
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
        <Button type="primary" htmlType="submit" loading={loading} style={SUBMITT_BUTTON}>
          Save Data
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Form.create()(MealForm)

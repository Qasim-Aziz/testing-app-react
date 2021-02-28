/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useReducer } from 'react'
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
import { useMutation, useQuery, useLazyQuery } from 'react-apollo'
import { times, remove, update } from 'ramda'
import moment from 'moment'
import './MealForm.scss'
import { usePrevious } from 'react-delta'
import ReminderForm from 'components/mealData/ReminderForm'
import { PlusOutlined } from '@ant-design/icons'

const { TextArea } = Input
const { Option } = Select
const { Title, Text } = Typography

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
          note: $note
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

const UPDATE_MEAL = gql`
  mutation updateFood(
    $foodId: ID!
    $studentId: ID!
    $foodType: ID!
    $date: Date!
    $mealName: String!
    $mealType: String!
    $mealTime: String!
    $waterIntake: String!
    $remainders: [RemainderInput]
  ) {
    updateFood(
      input: {
        foodData: {
          id: $foodId
          student: $studentId
          date: $date
          mealName: $mealName
          mealTime: $mealTime
          mealType: $mealType
          foodType: $foodType
          waterIntake: $waterIntake
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
        videoUrl
        duration
        foodType {
          id
          name
        }
      }
    }
  }
`

const GET_A_MEAL = gql`
  query getFoodDetails($mealId: ID!) {
    getFoodDetails(id: $mealId) {
      id
      mealType
      mealName
      waterIntake
      date
      mealTime
      note
      videoUrl
      duration
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
      foodType {
        id
        name
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

const dateFormat = 'YYYY-MM-DD'

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
    case 'INIT':
      return action.data
    case 'RESET':
      return [{ time: moment(), frequency: moment().format('dddd') }]
    default:
      return state
  }
}

const MealForm = ({
  style,
  handleNewMealDate,
  updateMealId,
  setUpdateMealId,
  setUpdateMeal,
  form,
  closeDrawer,
}) => {
  const [date, setDate] = useState(moment())
  const [mealTime, setMealTime] = useState(moment())
  const [note, setNote] = useState('')
  const studentId = localStorage.getItem('studentId')
  const [reminder, setReminder] = useState(true)
  const [remainderCount, setRemainderCount] = useState(0)

  const [remainderState, remainderDispatch] = useReducer(remainderReducer, [])

  const foodTypeQuery = useQuery(GET_FOOD_TYPE)

  const [updateMeal, { data: updateMealData, error: updateMealError }] = useMutation(UPDATE_MEAL, {
    userId: studentId,
    mealId: updateMealId,
  })

  const [
    getAMealData,
    { error: aMealError, loading: aMealLoading, data: aMealData, refetch: aMealDataRefetch },
  ] = useLazyQuery(GET_A_MEAL, {
    fetchPolicy: 'network-only',
  })

  const pravUpdateMealId = usePrevious(updateMealId)

  useEffect(() => {
    if (aMealData) {
      console.log(aMealData)
      const prevReminderState = aMealData.getFoodDetails.remainders.edges.map(reminderData => {
        return {
          id: reminderData.node.id,
          time: moment(reminderData.node.time, 'HH:mm'),
          frequency: reminderData.node.frequency.edges.map(frequencyData => {
            return frequencyData.node.name
          }),
        }
      })
      remainderDispatch({ type: 'INIT', data: prevReminderState })
      setRemainderCount(prevReminderState.length)
    }
  }, [aMealData])

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

    form.validateFields((error, values) => {
      if (!error) {
        updateMeal({
          variables: {
            foodId: updateMealId,
            studentId,
            date: moment(values.date).format(dateFormat),
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
    if (updateMealData) {
      notification.success({
        message: 'Meal Data',
        description: 'Updated Meal Successfully',
      })
      handleNewMealDate(updateMealData.updateFood.details.date)
      setUpdateMeal(updateMealData.updateFood.details)
      form.resetFields()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateMealData])

  useEffect(() => {
    if (updateMealError) {
      notification.error({
        message: 'Somthing want wrong',
        description: 'updateMealError',
      })
    }
  }, [updateMealError])

  useEffect(() => {
    if (updateMealId) {
      if (updateMealId === pravUpdateMealId) {
        aMealDataRefetch({
          variables: {
            mealId: updateMealId,
          },
        })
      } else {
        getAMealData({
          variables: {
            mealId: updateMealId,
          },
        })
      }
    }
  }, [aMealDataRefetch, getAMealData, pravUpdateMealId, updateMealId])

  useEffect(() => {
    if (aMealData) {
      // eslint-disable-next-line no-shadow
      const newData = aMealData.getFoodDetails
      setMealTime(moment(newData.mealTime, 'HH:mm a'))
      setNote(newData.note)
      setDate(moment(newData.date))
    }
  }, [aMealData])

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
    >
      {aMealLoading && (
        <div
          style={{
            minHeight: '100vh',
          }}
        >
          Loading...
        </div>
      )}
      {aMealData && (
        <div>
          <div>
            <Form.Item label={<span style={{ fontSize: '16px' }}>Meal Date</span>}>
              {form.getFieldDecorator('mealDate', {
                initialValue: date,
                rules: [{ required: true, message: 'Please Select Name!' }],
              })(<DatePicker style={{ width: '100%' }} />)}
            </Form.Item>

            <Form.Item label={<span style={{ fontSize: '16px' }}>Meal Time</span>}>
              {form.getFieldDecorator('mealTime', {
                initialValue: mealTime,
                rules: [{ required: true, message: 'Please Select a time!' }],
              })(<TimePicker use12Hours format="h:mm a" style={{ width: '100%' }} />)}
            </Form.Item>
          </div>

          <Form.Item label={<span style={{ fontSize: '16px' }}>Meal Name</span>}>
            {form.getFieldDecorator('mealName', {
              initialValue: aMealData?.getFoodDetails.mealName,
              rules: [{ required: true, message: 'Please Select meal name!' }],
            })(<Input placeholder="Enter Meal Name" name="mealName" style={{ color: '#000' }} />)}
          </Form.Item>

          <Form.Item label={<span style={{ fontSize: '16px' }}>Meal Type</span>}>
            {form.getFieldDecorator('mealType', {
              initialValue: aMealData?.getFoodDetails.mealType,
              rules: [{ required: true, message: 'Please Select a meal type!' }],
            })(
              <Select style={{}} placeholder="Select Meal Type" allowclear showSearch>
                <Option value="Breakfast">Breakfast</Option>
                <Option value="Lunch">Lunch</Option>
                <Option value="Dinner">Dinner</Option>
              </Select>,
            )}
          </Form.Item>

          <Form.Item label={<span style={{ fontSize: '16px' }}>Food Type</span>}>
            {form.getFieldDecorator('foodType', {
              initialValue: aMealData?.getFoodDetails.foodType.id,
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

          <Form.Item label={<span style={{ fontSize: '16px' }}>Water</span>}>
            {form.getFieldDecorator('waterIntake', {
              initialValue: aMealData
                ? parseInt(aMealData.getFoodDetails.waterIntake.split(' ')[0], 10)
                : null,
              rules: [
                {
                  required: true,
                  message: 'Please give the water intake number on ml!',
                },
              ],
            })(<Input placeholder="Enter water taken" type="number" addonAfter="ml" min={0} />)}
          </Form.Item>

          <Form.Item label={<span style={{ fontSize: '16px' }}>Note</span>}>
            {form.getFieldDecorator('note', {
              initialValue: aMealData?.getFoodDetails.note,
            })(
              <TextArea
                placeholder="Meal Details"
                name="note"
                onChange={e => setNote(e.target.value)}
                value={note}
                autoSize={{ minRows: 3 }}
                style={{
                  color: '#000',
                }}
              />,
            )}
          </Form.Item>

          <div>
            <Form.Item label={<span style={{ fontSize: '16px' }}>Meal Reminders</span>}>
              <Switch
                defaultChecked
                onChange={() => {
                  setReminder(state => !state)
                }}
                size="large"
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

            {/* <Form.Item
            {...formTailLayout}
            >
              <Text style={{ color: '#000', fontSize: 16 }}>Add Another Remainder</Text>
              <Button
                style={{
                  height: 40,
                  marginLeft: 'auto',
                }}
                onClick={() => {
                  setRemainderCount(state => state + 1)
                  remainderDispatch({ type: 'ADD_REMAINDER' })
                }}
              >
                <PlusOutlined style={{ fontSize: 24, marginTop: 5 }} />
              </Button>
            </Form.Item> */}
          </div>

          <Form.Item {...formTailLayout}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  width: 180,
                  height: 40,
                  borderRadius: 0,
                }}
              >
                Save {updateMealId ? 'update' : 'Data'}
              </Button>
              {updateMealId && (
                <Button
                  onClick={() => {
                    setUpdateMealId()
                    setMealTime(moment())
                    setDate(moment())
                    setNote()
                    closeDrawer()
                  }}
                  style={{
                    width: 150,
                    marginLeft: 20,
                    height: 40,
                    background: '#ff4444',
                    color: '#fff',
                    border: '0px solid',
                    borderRadius: 0,
                  }}
                >
                  Cancel Update
                </Button>
              )}
            </div>
          </Form.Item>
        </div>
      )}
    </Form>
  )
}

export default Form.create()(MealForm)

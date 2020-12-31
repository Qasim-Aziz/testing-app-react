/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  notification,
  Radio,
  InputNumber,
  TimePicker,
} from 'antd'
import { connect, useSelector } from 'react-redux'
import gql from 'graphql-tag'
import { useMutation, useQuery } from 'react-apollo'
import moment from 'moment'
import './toiletForm.scss'

const CREATE_TOILET_DATA = gql`
  mutation recordToiletdata(
    $date: Date!
    $time: String!
    $waterIntake: String!
    $waterIntakeTime: String!
    $urination: Boolean!
    $bowel: Boolean!
    $prompted: Boolean!
  ) {
    recordToiletdata(
      input: {
        toiletData: {
          student: "U3R1ZGVudFR5cGU6MTYz"
          date: $date
          time: $time
          lastWater: $waterIntake
          lastWaterTime: $waterIntakeTime
          success: true
          urination: $urination
          bowel: $bowel
          prompted: $prompted
        }
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

const dateFormat = 'YYYY-MM-DD'

const MealForm = ({ style, handleNewMealDate, setNewMealCreated }) => {
  const [waterIntake, setWaterIntake] = useState()
  const [waterIntakeTime, setwaterIntakeTime] = useState()
  const [urination, setUrination] = useState(true)
  const [bowel, setBowel] = useState(true)
  const [prompted, setPrompted] = useState(true)

  const user = useSelector(state => state.user)
  const [mutate, { data, error }] = useMutation(CREATE_TOILET_DATA, {
    variables: {
      studentId: user.id,
      date: moment().format(dateFormat),
      time: moment().format('HH:mm'),
      waterIntake: `${waterIntake} ml`,
      waterIntakeTime: moment(waterIntakeTime).format('HH:mm'),
      urination,
      bowel,
      prompted,
    },
  })

  const SubmitForm = e => {
    e.preventDefault()
    mutate()
  }

  useEffect(() => {
    if (data) {
      notification.success({
        message: 'Meal Data',
        description: 'Meal Data Added Successfully',
      })
      handleNewMealDate(data.recordToiletdata.details.date)
      console.log(data)
      setNewMealCreated(true)
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

  return (
    <Form onSubmit={e => SubmitForm(e, this)} name="control-ref" style={{ marginLeft: 0 }}>
      <Form.Item label="Urination">
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
        >
          <Radio.Button className="radioButton" value="y">
            Yes
          </Radio.Button>
          <Radio.Button className="radioButton" value="n">
            No
          </Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item label="Bowel Movement">
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
        >
          <Radio.Button className="radioButton" value="y">
            Yes
          </Radio.Button>
          <Radio.Button className="radioButton" value="n">
            No
          </Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item label="Prompted to Request">
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
        >
          <Radio.Button className="radioButton" value="y">
            Yes
          </Radio.Button>
          <Radio.Button className="radioButton" value="n">
            No
          </Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item label="Water Intake (ml)">
        <InputNumber
          placeholder="Type water Intake in ml"
          style={{ width: '100%' }}
          value={waterIntake}
          onChange={value => setWaterIntake(value)}
        />
      </Form.Item>

      <Form.Item label="Water Intake Time">
        <TimePicker
          value={waterIntakeTime}
          onChange={value => setwaterIntakeTime(value)}
          name="mealTime"
          style={{ width: '100%' }}
          size="large"
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{
            width: 206,
            height: 40,
            background: '#0B35B3',
          }}
        >
          Save Data
        </Button>
      </Form.Item>
    </Form>
  )
}

export default MealForm

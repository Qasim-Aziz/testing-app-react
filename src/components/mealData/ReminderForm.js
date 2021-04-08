/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import React from 'react'
import { Form, Button, Select, TimePicker } from 'antd'
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons'
import moment from 'moment'

const { Option } = Select

export default ({ reminder, index, setRemainderCount, dispatch, state }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
      <Form.Item style={{ marginBottom: 0 }}>
        <TimePicker
          disabled={!reminder}
          value={state[index].time}
          onChange={value => {
            dispatch({ type: 'UPDATE_TIME', index, time: value })
          }}
          allowClear={false}
          use12Hours
          format="h:mm a"
        />
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <Select
          mode="multiple"
          disabled={!reminder}
          placeholder="Set Repeat"
          value={state[index].frequency}
          onChange={value => {
            dispatch({ type: 'UPDATE_FREQUENCY', index, frequency: value })
          }}
          style={{
            width: 320,
          }}
          optionLabelProp="label"
        >
          <Option label="Mon" value="Monday">
            Monday
          </Option>
          <Option label="Tue" value="Tuesday">
            Tuesday
          </Option>
          <Option label="Wed" value="Wednesday">
            Wednesday
          </Option>
          <Option label="Thu" value="Thursday">
            Thursday
          </Option>
          <Option label="Fri" value="Friday">
            Friday
          </Option>
          <Option label="Sat" value="Saturday">
            Saturday
          </Option>
          <Option label="Sun" value="Sunday">
            Sunday
          </Option>
        </Select>
      </Form.Item>
      {index !== 0 && (
        <MinusCircleOutlined
          style={{ fontSize: 24, marginTop: 2 }}
          onClick={() => {
            setRemainderCount(state => state - 1)
            dispatch({ type: 'REMOVE_REMAINDER', index })
          }}
        />
      )}
      {index === 0 && (
        <PlusCircleOutlined
          style={{ fontSize: 24, marginTop: 2 }}
          onClick={() => {
            setRemainderCount(state => state + 1)
            dispatch({ type: 'ADD_REMAINDER' })
          }}
        />
      )}
    </div>
  )
}

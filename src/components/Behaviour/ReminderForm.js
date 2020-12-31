/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import React from 'react'
import { Form, Button, Select, TimePicker } from 'antd'
import { MinusOutlined } from '@ant-design/icons'
import moment from 'moment'

const { Option } = Select

export default ({ reminder, index, setRemainderCount, dispatch, state }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: index !== 0 ? 52 : 0,
        position: 'relative',
      }}
    >
      {index !== 0 && (
        <Button
          style={{
            position: 'absolute',
            top: 10,
            right: 0,
            zIndex: 10,
          }}
          onClick={() => {
            setRemainderCount(state => state - 1)
            dispatch({ type: 'REMOVE_REMAINDER', index })
          }}
        >
          <MinusOutlined style={{ fontSize: 24, marginTop: 2 }} />
        </Button>
      )}

      <Form.Item style={{ marginBottom: 0 }}>
        <TimePicker
          disabled={!reminder}
          value={state[index].time}
          onChange={value => {
            dispatch({ type: 'UPDATE_TIME', index, time: value })
          }}
          size="large"
          allowClear={false}
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
            width: 150,
          }}
          size="large"
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
    </div>
  )
}

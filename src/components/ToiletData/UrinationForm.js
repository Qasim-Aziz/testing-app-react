/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import React from 'react'
import { Form, Button, Select, TimePicker } from 'antd'
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons'
import moment from 'moment'

const { Option } = Select

export default ({ index, setUrinationCount, dispatch, state, onRemove }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px',
      }}
    >
      <Form.Item style={{ marginBottom: 0 }}>
        <TimePicker
          value={state[index].time}
          onChange={value => {
            dispatch({ type: 'UPDATE_TIME', index, time: value })
          }}
          size="large"
          allowClear={false}
          use12Hours
          format="h:mm a"
        />
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <Select
          placeholder="Response"
          value={state[index].status}
          onChange={value => {
            dispatch({ type: 'UPDATE_STATUS', index, status: value })
          }}
          style={{
            width: 310,
          }}
          size="large"
        >
          <Option value={1}>Positive</Option>
          <Option value={2}>Negative</Option>
        </Select>
      </Form.Item>
      {index !== 0 && (
        <MinusCircleOutlined
          style={{ fontSize: 24, marginTop: 2 }}
          onClick={() => {
            setUrinationCount(state => state - 1)
            if (onRemove) {
              onRemove()
            }
            dispatch({ type: 'REMOVE_URINATION', index })
          }}
        />
      )}
      {index === 0 && (
        <PlusCircleOutlined
          style={{ fontSize: 24, marginTop: 2 }}
          onClick={() => {
            setUrinationCount(state => state + 1)
            dispatch({ type: 'ADD_URINATION' })
          }}
        />
      )}
    </div>
  )
}

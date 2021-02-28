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
        marginBottom: '10px',
        width: '100%',
      }}
    >
      <Form.Item style={{ marginBottom: 0, marginRight: '12px' }}>
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

      <Form.Item style={{ width: '80%', maxWidth: 250, marginRight: '12px', marginBottom: 0 }}>
        <Select
          placeholder="Response"
          value={state[index].status}
          onChange={value => {
            dispatch({ type: 'UPDATE_STATUS', index, status: value })
          }}
          size="large"
        >
          <Option value={1}>Positive</Option>
          <Option value={2}>Negative</Option>
        </Select>
      </Form.Item>
      {index !== 0 && (
        <MinusCircleOutlined
          style={{ fontSize: 22, marginTop: 6, marginLeft: 'auto' }}
          onClick={() => {
            setUrinationCount(state => state - 1)
            if (onRemove) {
              onRemove()
            }
            dispatch({ type: 'REMOVE_URINATION', index })
          }}
        />
      )}
    </div>
  )
}

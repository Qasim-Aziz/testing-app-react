/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import React from 'react'
import { Form, Button, Select, Input, TimePicker } from 'antd'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import moment from 'moment'

const { Option } = Select

export default ({ index, dispatch, setSubmodulesCount, state }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px',
      }}
    >
      <Form.Item style={{ marginBottom: 0 }}>
        <Input
          required
          style={{ width: 250 }}
          placeholder={`Submodule ${index + 1} Name`}
          onChange={e => dispatch({ type: 'UPDATE_SUBMODULE', index, name: e.target.value })}
          value={state[index]?.name}
        />
      </Form.Item>
      {index !== 0 && (
        <MinusOutlined
          style={{ fontSize: 22, marginTop: 2, marginLeft: 10 }}
          onClick={() => {
            console.log(index, 'index')
            if (state.length === 2) {
              console.log(state, 'state')
            }
            setSubmodulesCount(state => state - 1)
            dispatch({ type: 'REMOVE_SUBMODULE', index })
          }}
        />
      )}
    </div>
  )
}

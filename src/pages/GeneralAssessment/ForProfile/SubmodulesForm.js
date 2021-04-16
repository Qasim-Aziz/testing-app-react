/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import React from 'react'
import { Form, Button, Select, Input, TimePicker } from 'antd'
import { useMutation } from 'react-apollo'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import moment from 'moment'
import { REMOVE_SUBMODULE } from '../query'

const { Option } = Select

export default ({ index, dispatch, setSubmodulesCount, state, currentRow }) => {
  const [removeSubmodule] = useMutation(REMOVE_SUBMODULE)
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
            if (state[index].id && currentRow.id) {
              removeSubmodule({
                variables: {
                  pk: currentRow.id,
                  id: [state[index].id],
                },
              })
            }
            setSubmodulesCount(state => state - 1)
            dispatch({ type: 'REMOVE_SUBMODULE', index })
          }}
        />
      )}
    </div>
  )
}

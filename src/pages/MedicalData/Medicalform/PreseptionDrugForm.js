/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useReducer } from 'react'
import { Form, Input, Button, Select, DatePicker, Typography } from 'antd'
import '../toiletForm.scss'
// import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons'

const { RangePicker } = DatePicker
const { Option } = Select
const { Title, Text } = Typography

export default ({ index, setPreseptionDrugCount, state, dispatch }) => {
  return (
    <div
      style={{
        position: 'relative',
        paddingTop: index !== 0 ? 15 : 0,
      }}
    >
      <div style={{ display: 'flex', paddingTop: '2px', marginBottom: '5px' }}>
        <Form.Item colon={false} label="Drug Name" style={{ marginBottom: '0px', display: 'flex' }}>
          <Input
            value={state[index].drugName}
            onChange={e => {
              dispatch({ type: 'UPDATE_DRUG', drugName: e.target.value, index })
            }}
            style={{ color: '#000', width: '365px', marginRight: '10px' }}
          />
        </Form.Item>
        {index !== 0 && (
          <MinusCircleOutlined
            style={{ fontSize: 24, marginTop: 2 }}
            onClick={() => {
              // eslint-disable-next-line no-shadow
              setPreseptionDrugCount(state => state - 1)
              dispatch({ type: 'REMOVE_PRESEP_DRUG', index })
            }}
          />
        )}
        {index === 0 && (
          <PlusCircleOutlined
            style={{ fontSize: 24, marginTop: 2 }}
            onClick={() => {
              // eslint-disable-next-line no-shadow
              setPreseptionDrugCount(state => state + 1)
              dispatch({ type: 'ADD_PRESEP_DRUG' })
            }}
          />
        )}
      </div>

      <div
        style={{
          display: 'flex',
        }}
      >
        <Form.Item colon={false} label="Dosage" style={{ marginBottom: 0, display: 'flex' }}>
          <Input
            value={state[index].dosage}
            type="number"
            onChange={e => {
              dispatch({ type: 'UPDATE_DOSAGE', dosage: e.target.value, index })
            }}
            style={{ marginLeft: '28px', width: 178 }}
            addonAfter="mg"
            min={1}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Input
            value={state[index].times}
            type="number"
            onChange={e => {
              dispatch({ type: 'UPDATE_TIME', time: e.target.value, index })
            }}
            style={{ marginLeft: '10px', width: 178 }}
            addonAfter="Times a day"
            min={1}
          />
        </Form.Item>
      </div>
    </div>
  )
}

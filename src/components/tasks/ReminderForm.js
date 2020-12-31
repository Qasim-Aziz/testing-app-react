import React from 'react'
import { Form, Button, Select, TimePicker, Row, Col } from 'antd'
import { MinusOutlined } from '@ant-design/icons'

const { Option } = Select

export default ({
  reminder,
  index,
  setRemainderCount,
  dispatch,
  state,
  removeReducerType,
  timeReducerType,
  frequencyReducerType,
}) => (
  <Row style={{ margin: '5px 0px' }}>
    <Col offset={1} span={6}>
      <Form.Item>
        <TimePicker
          disabled={!reminder}
          value={state[index].time}
          onChange={value => {
            dispatch({ type: timeReducerType, index, time: value })
          }}
          size="large"
          allowClear={false}
        />
      </Form.Item>
    </Col>
    <Col offset={1} span={13}>
      <Form.Item>
        <Select
          mode="multiple"
          disabled={!reminder}
          placeholder="Set Repeat"
          value={state[index].frequency}
          onChange={value => {
            dispatch({ type: 'UPDATE_FREQUENCY', index, frequency: value })
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
    </Col>
    {index !== 0 && (
      <Col offset={1} span={1}>
        <Button
          style={{ marginTop: 5 }}
          onClick={() => {
            setRemainderCount(existingCount => existingCount - 1)
            dispatch({ type: removeReducerType, index })
          }}
        >
          <MinusOutlined />
        </Button>
      </Col>
    )}
  </Row>
)

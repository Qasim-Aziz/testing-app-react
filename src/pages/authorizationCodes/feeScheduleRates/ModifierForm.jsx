import React from 'react'
import { Form, Button, Select, Row, Col, Input, InputNumber } from 'antd'
import { MinusOutlined } from '@ant-design/icons'
import { modifierActions } from './modifierActions'

const ModifierForm = ({
  index,
  setModifierCount,
  allModifierCodes,
  modifierRates,
  updateModifier,
}) => (
  <Row>
    <Col offset={1} span={6}>
      <Form.Item>
        <Select
          placeholder="Select Modifiers"
          value={modifierRates[index]?.modifier ?? null}
          onChange={value => {
            updateModifier({
              type: modifierActions.UPDATE_MODIFIER,
              payload: { index, modifier: value },
            })
          }}
        >
          {allModifierCodes.map(item => (
            <Select.Option key={item.id}>{item.name}</Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Col>
    <Col offset={1} span={6}>
      <Form.Item>
        <InputNumber
          placeholder="Rate"
          value={modifierRates[index]?.rate}
          onChange={value => {
            updateModifier({
              type: modifierActions.UPDATE_RATE,
              payload: { index, rate: value },
            })
          }}
        />
      </Form.Item>
    </Col>

    <Col offset={1} span={6}>
      <Form.Item>
        <InputNumber
          placeholder="Agreed Rate"
          value={modifierRates[index]?.agreedRate}
          onChange={value => {
            updateModifier({
              type: modifierActions.UPDATE_AGREED_RATE,
              payload: { index, agreedRate: value },
            })
          }}
        />
      </Form.Item>
    </Col>

    {index !== 0 && (
      <Col offset={1} span={1}>
        <Button
          style={{ marginTop: 5 }}
          onClick={() => {
            setModifierCount(value => value - 1)
            updateModifier({ type: modifierActions.REMOVE_MODIFIER, payload: { index } })
          }}
        >
          <MinusOutlined />
        </Button>
      </Col>
    )}
  </Row>
)

export default ModifierForm

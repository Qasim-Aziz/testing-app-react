import React from 'react'

import { Form, Input, Select } from 'antd'

const { Option } = Select

const InputCelerationChart = props => {
  const { celerationCategories, chart } = props
  const { onCelerationChartChange, onRecordingParametersChange } = props

  return (
    <>
      <Form.Item label="Date">
        <Input
          id="date"
          placeholder="Date"
          size="large"
          type="date"
          onChange={e => {
            onCelerationChartChange(e, 'date')
          }}
          value={chart.date}
        />
      </Form.Item>

      <Form.Item
        id="title"
        label="Title"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input
          placeholder="Title"
          size="large"
          onChange={e => {
            onCelerationChartChange(e, 'title')
          }}
          value={chart.title}
        />
      </Form.Item>

      <Form.Item label="Category">
        <Select
          id="category"
          placeholder="Category"
          optionFilterProp="children"
          value={chart.category.id}
          onChange={e => {
            onCelerationChartChange(e, 'category')
          }}
        >
          {celerationCategories.map(category => {
            return (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            )
          })}
        </Select>
      </Form.Item>

      <Form.Item label="Notes">
        <Input
          id="notes"
          placeholder="Notes"
          size="large"
          onChange={e => {
            onCelerationChartChange(e, 'notes')
          }}
          value={chart.notes}
        />
      </Form.Item>
      <Form.Item label="Y-Axis Label">
        <Input
          id="yAxisLabel"
          placeholder="Y-Axis Label"
          size="large"
          onChange={e => {
            onCelerationChartChange(e, 'yAxisLabel')
          }}
          value={chart.yAxisLabel}
        />
      </Form.Item>

      <Form.Item label="Recording Parameters">
        <Input
          type="text"
          className="form-control"
          id="correct"
          onChange={e => {
            onRecordingParametersChange(e, 'type1')
          }}
          value={chart.pointsTypeLables.type1}
          placeholder="Correct"
          validators={['required']}
          errorMessages={['This field is required.']}
        />
      </Form.Item>
      <Form.Item required component="fieldset">
        <Input
          type="text"
          className="form-control"
          id="incorrect"
          onChange={e => {
            onRecordingParametersChange(e, 'type2')
          }}
          value={chart.pointsTypeLables.type2}
          placeholder="Incorrect"
          validators={['required']}
          errorMessages={['This field is required.']}
        />
      </Form.Item>
      <Form.Item required component="fieldset">
        <Input
          type="text"
          className="form-control"
          id="prompted"
          onChange={e => {
            onRecordingParametersChange(e, 'type3')
          }}
          value={chart.pointsTypeLables.type3}
          placeholder="prompted"
          validators={['required']}
          errorMessages={['This field is required.']}
        />
      </Form.Item>
    </>
  )
}

export default InputCelerationChart

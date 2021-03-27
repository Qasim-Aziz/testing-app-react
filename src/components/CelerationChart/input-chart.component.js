import React from 'react'
import { Form, Input, Select, DatePicker, Divider } from 'antd'
import moment from 'moment'

const { Option } = Select

const InputCelerationChart = props => {
  const { celerationCategories, chart } = props
  const { onCelerationChartChange, onRecordingParametersChange } = props

  return (
    <>
      <Divider orientation="left">Basic Details</Divider>
      <Form.Item label="Date">
        <DatePicker
          format="YYYY-MM-DD"
          placeholder="Date"
          onChange={e => onCelerationChartChange(e, 'date')}
          value={chart.date ? moment(chart.date) : null}
        />
      </Form.Item>

      <Form.Item label="Title" rules={[{ required: true, message: 'Please Title!' }]}>
        <Input
          placeholder="Title"
          onChange={e => onCelerationChartChange(e, 'title')}
          value={chart.title}
        />
      </Form.Item>

      <Form.Item label="Category">
        <Select
          placeholder="Category"
          optionFilterProp="children"
          value={chart.category.id}
          onChange={e => onCelerationChartChange(e, 'category')}
        >
          {celerationCategories.map(category => (
            <Option key={category.id} value={category.id}>
              {category.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Notes">
        <Input
          placeholder="Notes"
          onChange={e => onCelerationChartChange(e, 'notes')}
          value={chart.notes}
        />
      </Form.Item>
      {/* <Form.Item label="X-Axis Label" >
        <Input
        placeholder="X-Axis Label"
        onChange={e => onCelerationChartChange(e, 'labelX')}
        value={chart.labelX}
        />
      </Form.Item> */}

      <Form.Item label="Y-Axis Label">
        <Input
          placeholder="Y-Axis Label"
          onChange={e => onCelerationChartChange(e, 'labelY')}
          value={chart.labelY}
        />
      </Form.Item>

      <Divider orientation="left">Recording Parameters</Divider>
      <Form.Item label="Correct">
        <Input
          type="text"
          className="form-control"
          onChange={e => onRecordingParametersChange(e, 'type1')}
          value={chart.pointsTypeLables.type1}
          placeholder="Correct"
        />
      </Form.Item>

      <Form.Item label="Incorrect">
        <Input
          type="text"
          className="form-control"
          onChange={e => onRecordingParametersChange(e, 'type2')}
          value={chart.pointsTypeLables.type2}
          placeholder="Incorrect"
        />
      </Form.Item>

      <Form.Item label="Prompted">
        <Input
          type="text"
          className="form-control"
          onChange={e => onRecordingParametersChange(e, 'type3')}
          value={chart.pointsTypeLables.type3}
          placeholder="prompted"
        />
      </Form.Item>
    </>
  )
}

export default InputCelerationChart

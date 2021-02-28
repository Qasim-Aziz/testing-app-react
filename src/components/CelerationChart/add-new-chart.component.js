import React from 'react'
import { Form, Button } from 'antd'
import InputCelerationChart from './input-chart.component'

const AddCelerationChart = props => {
  const { celerationCategories, chart } = props
  const { addCelerationChart, onCelerationChartChange, onRecordingParametersChange } = props

  return (
    <Form className="addOrEditFormCelerationChart" onSubmit={e => addCelerationChart(e)}>
      <InputCelerationChart
        celerationCategories={celerationCategories}
        chart={chart}
        onCelerationChartChange={onCelerationChartChange}
        onRecordingParametersChange={onRecordingParametersChange}
      />

      <Form.Item style={{ textAlign: 'center' }}>
        <Button type="primary" htmlType="submit">
          Create New Chart
        </Button>
      </Form.Item>
    </Form>
  )
}

export default AddCelerationChart

import React from 'react'

import { Form, Button } from 'antd'

import InputCelerationChart from './input-chart.component'

const UpdateCelerationChart = props => {
  const { celerationCategories, chart } = props
  const { updateCelerationChart, onCelerationChartChange, onRecordingParametersChange } = props

  return (
    <Form className="addOrEditFormCelerationChart" onSubmit={e => updateCelerationChart(e)}>
      <InputCelerationChart
        celerationCategories={celerationCategories}
        chart={chart}
        onCelerationChartChange={onCelerationChartChange}
        onRecordingParametersChange={onRecordingParametersChange}
      />

      <Form.Item style={{ textAlign: 'center' }}>
        <Button type="primary" htmlType="submit" color="primary" variant="contained">
          Save Chart
        </Button>
      </Form.Item>
    </Form>
  )
}

export default UpdateCelerationChart

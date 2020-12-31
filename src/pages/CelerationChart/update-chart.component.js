import React from 'react'

import { Form, Button } from 'antd'

import InputCelerationChart from './input-chart.component'

const UpdateCelerationChart = props => {
  const { celerationCategories, chart } = props
  const { updateCelerationChart, onCelerationChartChange, onRecordingParametersChange } = props

  return (
    <Form
      name="basic"
      style={{
        marginTop: 0,
      }}
      size="large"
      onSubmit={e => updateCelerationChart(e)}
    >
      <InputCelerationChart
        celerationCategories={celerationCategories}
        chart={chart}
        onCelerationChartChange={onCelerationChartChange}
        onRecordingParametersChange={onRecordingParametersChange}
      />

      <Button type="primary" htmlType="submit" color="primary" variant="contained">
        Save Chart
      </Button>
    </Form>
  )
}

export default UpdateCelerationChart

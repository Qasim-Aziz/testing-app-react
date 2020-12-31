import React from 'react'
import { Form, Button } from 'antd'
import InputCelerationChart from './input-chart.component'

const AddCelerationChart = props => {
  const { celerationCategories, chart } = props
  const { addCelerationChart, onCelerationChartChange, onRecordingParametersChange } = props

  return (
    <Form name="basic" onSubmit={e => addCelerationChart(e)}>
      <InputCelerationChart
        celerationCategories={celerationCategories}
        chart={chart}
        onCelerationChartChange={onCelerationChartChange}
        onRecordingParametersChange={onRecordingParametersChange}
      />

      <Button type="primary" htmlType="submit">
        Create New Chart
      </Button>
    </Form>
  )
}

export default AddCelerationChart

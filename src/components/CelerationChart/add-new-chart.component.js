import React from 'react'
import { Form, Button } from 'antd'
import { COLORS, FORM, SUBMITT_BUTTON } from 'assets/styles/globalStyles'
import InputCelerationChart from './input-chart.component'

const { layout } = FORM

const AddCelerationChart = props => {
  const { celerationCategories, chart } = props
  const { addCelerationChart, onCelerationChartChange, onRecordingParametersChange } = props

  return (
    <Form
      {...layout}
      className="addOrEditFormCelerationChart"
      onSubmit={e => addCelerationChart(e)}
    >
      <InputCelerationChart
        celerationCategories={celerationCategories}
        chart={chart}
        onCelerationChartChange={onCelerationChartChange}
        onRecordingParametersChange={onRecordingParametersChange}
      />

      <Form.Item style={{ textAlign: 'center' }}>
        <Button type="primary" htmlType="submit" style={SUBMITT_BUTTON}>
          Create New Chart
        </Button>
      </Form.Item>
    </Form>
  )
}

export default AddCelerationChart

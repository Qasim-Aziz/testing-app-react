import React, { useState } from 'react'

import { Form, Input, Button, Radio } from 'antd'
import { chartPointType } from 'redux/celerationchart/chart.constant'

const AddUpdatePoint = props => {
  const { chart, addPointAction, updatePointAction, pointToEdit, pointToAdd, onClose } = props

  const [point, setPoint] = useState({
    date: '',
    day: 0,
    dataType: 0,
    count: 0,
    time: 1,
    ...pointToEdit, // Set default values for updating
    ...pointToAdd, // Also add data when new point is creating
  })

  const onPointChange = (event, key) => {
    setPoint({ ...point, [key]: event.target.value })
  }

  const addOrUpdatePoint = event => {
    event.preventDefault()

    if (pointToEdit) updatePointAction(pointToEdit.id, point)
    else addPointAction(point)

    setPoint({ date: '', day: 0, dataType: 0, count: 0, time: 1 })
    if (onClose) onClose()
  }

  return (
    <Form className="addOrEditFormCelerationChart" onSubmit={addOrUpdatePoint}>
      <Form.Item label="Day" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Input
          type="number"
          id="day"
          onChange={e => onPointChange(e, 'day')}
          value={point.day}
          placeholder="Day"
        />
      </Form.Item>

      <Form.Item label="Type" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Radio.Group
          name="dataType"
          value={point.dataType}
          onChange={e => onPointChange(e, 'dataType')}
        >
          <Radio value={chartPointType[0]} control={<Radio />}>
            {chart.pointsTypeLables.type1}
          </Radio>
          <Radio value={chartPointType[1]} control={<Radio />}>
            {chart.pointsTypeLables.type2}
          </Radio>
          <Radio value={chartPointType[2]} control={<Radio />}>
            {chart.pointsTypeLables.type3}
          </Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item label="Count" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Input
          type="number"
          onChange={e => onPointChange(e, 'count')}
          value={point.count}
          placeholder="Count"
        />
      </Form.Item>

      <Form.Item label="Time (Minutes)" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Input
          type="number"
          onChange={e => onPointChange(e, 'time')}
          value={point.time}
          placeholder="Time"
        />
      </Form.Item>

      <Form.Item style={{ textAlign: 'center' }}>
        <Button type="primary" htmlType="submit" color="primary" variant="contained">
          {pointToEdit ? 'Update Point' : 'Add Point'}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default AddUpdatePoint

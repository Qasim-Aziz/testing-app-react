import React, { useState } from 'react'

import { Form, Input, Button, Radio } from 'antd'
import { chartPointType } from 'redux/celerationchart/chart.constant'

const AddUpdatePoint = props => {
  const { pointInput, pointIndex, chart } = props
  const { updatePoint, addPoint, handleClose } = props

  const [point, setPoint] = useState({
    date: '',
    day: 0,
    dataType: 0,
    count: 0,
    time: 1,
    ...pointInput,
  })

  const onPointChange = (event, key) => {
    setPoint({ ...point, [key]: event.target.value })
  }

  const addUpdatePoint = event => {
    event.preventDefault()

    if (pointIndex && pointIndex !== -1) {
      updatePoint(pointIndex, point)
    } else {
      addPoint(point)
    }

    setPoint({ date: '', day: 0, dataType: 0, count: 0, time: 1 })

    if (handleClose) {
      handleClose()
    }
  }

  return (
    <>
      <Form
        name="basic"
        style={{
          marginTop: 0,
        }}
        size="large"
        onSubmit={e => addUpdatePoint(e)}
      >
        <Form.Item label="Day">
          <Input
            type="number"
            id="day"
            onChange={e => {
              onPointChange(e, 'day')
            }}
            value={point.day}
            placeholder="Day"
          />
        </Form.Item>

        <div>
          <Form.Item label="Type">
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
        </div>

        <Form.Item label="Count">
          <Input
            type="number"
            id="count"
            onChange={e => {
              onPointChange(e, 'count')
            }}
            value={point.count}
            placeholder="Count"
          />
        </Form.Item>

        <Form.Item label="Time (Minutes)">
          <Input
            type="number"
            id="time"
            onChange={e => {
              onPointChange(e, 'time')
            }}
            value={point.time}
            placeholder="Time"
          />
        </Form.Item>

        <Button type="primary" htmlType="submit" color="primary" variant="contained">
          {pointIndex && pointIndex !== -1 ? 'Update Point' : 'Add Point'}
        </Button>
      </Form>
    </>
  )
}

export default AddUpdatePoint

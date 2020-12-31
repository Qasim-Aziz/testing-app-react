import React, { useEffect, useState } from 'react'
import { Table, notification, Button, Drawer, Form, DatePicker, Select } from 'antd'
import { useQuery } from 'react-apollo'
import moment from 'moment'
import filterIcon from 'icons/filter.png'
import { MEAL_DATA, FOOD_TYPE } from './query'

const { Option } = Select
const { RangePicker } = DatePicker

export default () => {
  const [filterDrawer, setFilterDrawer] = useState(false)
  const [mealType, setMealType] = useState()
  const [foodType, setFoodType] = useState()
  const [dateRange, setDateRange] = useState([moment().startOf('week'), moment().endOf('week')])

  const { data, error, loading } = useQuery(MEAL_DATA, {
    variables: {
      type: mealType,
      start: moment(dateRange[0]).format('YYYY-MM-DD'),
      end: moment(dateRange[1]).format('YYYY-MM-DD'),
    },
  })

  const { data: foodTypes, loading: foodTypeLoading } = useQuery(FOOD_TYPE)

  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Failed to load meal data',
      })
    }
  })

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          margin: '15px 0',
        }}
      >
        <Button type="link" onClick={() => setFilterDrawer(true)}>
          <img style={{ width: 30, height: 30 }} src={filterIcon} alt="filter icon" />
        </Button>
      </div>
      <Table
        loading={loading}
        dataSource={data?.getFood.edges}
        columns={[
          {
            title: 'Meal Date',
            key: 'node.date',
            dataIndex: 'node.date',
          },
          {
            title: 'Meal Time',
            key: 'node.mealTime',
            dataIndex: 'node.mealTime',
          },
          {
            title: 'Food Type',
            key: 'node.foodType.name',
            dataIndex: 'node.foodType.name',
          },
          {
            title: 'Water Intake ',
            key: 'node.waterIntake',
            dataIndex: 'node.waterIntake',
          },
          {
            title: 'Note',
            key: 'node.note',
            dataIndex: 'node.note',
          },
        ]}
        scroll={{
          x: 'max-content',
        }}
      />

      <Drawer
        visible={filterDrawer}
        onClose={() => setFilterDrawer(false)}
        width={440}
        title="Filter Result"
      >
        <div style={{ padding: '0px 30px' }}>
          <Form>
            <Form.Item label="Select Date Range">
              <RangePicker size="large" value={dateRange} onChange={v => setDateRange(v)} />
            </Form.Item>
            <Form.Item label="Meal Type" style={{ marginTop: 10 }}>
              <Select
                value={mealType}
                onChange={v => setMealType(v)}
                size="large"
                placeholder="Filter by meal type"
              >
                <Option key="1" value="Breakfast">
                  Breakfast
                </Option>
                <Option key="2" value="Lunch">
                  Lunch
                </Option>
                <Option key="3" value="Snack">
                  Snack
                </Option>
                <Option key="4" value="Dinner">
                  Dinner
                </Option>
              </Select>
            </Form.Item>
            <Form.Item label="Food Type" style={{ marginTop: 10 }}>
              <Select
                loading={foodTypeLoading}
                value={foodType}
                onChange={v => setFoodType(v)}
                size="large"
                placeholder="Filter by food type"
              >
                {foodTypes?.getFoodType.map(({ id, name }) => (
                  <Option key={id} value={id}>
                    {name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </div>
      </Drawer>
    </div>
  )
}

import React from 'react'
import { Form, Input, DatePicker, Button, Select, Row, Col } from 'antd'
import { SendOutlined } from '@ant-design/icons'
import TextArea from 'antd/lib/input/TextArea'

// const { RangePicker } = TimePickee;
const { Option } = Select
const itemStyle = { marginBottom: '0' }
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
}

function onChange(value) {
  console.log(`selected ${value}`)
}

class AppointmentForm extends React.Component {
  state = {}

  render() {
    return (
      <Row>
        <Col>
          <h1 style={{ textAlign: 'center' }}>Book Appointment</h1>

          <div style={{ marginTop: 50 }}>
            <Form {...layout}>
              <Form.Item label=" Title">
                <Input placeholder="Title" name="title" />
              </Form.Item>

              <Form.Item label="Select Student">
                <Select showSearch style={{ itemStyle }} placeholder="student" onChange={onChange}>
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="tom">Tom</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Select Therapist">
                <Select
                  showSearch
                  style={{ itemStyle }}
                  placeholder="Therapist"
                  onChange={onChange}
                >
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="tom">Tom</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Purpose of Assignment">
                <Select style={{ itemStyle }} name="purpose">
                  <Select.Option value="demo">1</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="Date">
                <DatePicker onChange={this.setDate} style={{ itemStyle }} />
              </Form.Item>

              <Form.Item label="Clinic Location">
                <Select style={{ itemStyle }} name="clinic">
                  <Select.Option value="demo">1</Select.Option>
                  <Select.Option value="demo">2</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="Project">
                <Select style={{ itemStyle }} name="therapist">
                  <Select.Option value="demo">1</Select.Option>
                  <Select.Option value="demo">2</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="Private Notes">
                <TextArea style={{ itemStyle }} placeholder="notes" name="notes" />
              </Form.Item>
              <Button type="primary" style={{ float: 'right' }}>
                {' '}
                <SendOutlined />
                Book
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    )
  }
}

export default AppointmentForm

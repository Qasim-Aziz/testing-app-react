import React, { useState, useEffect } from 'react'
import { Form, Button, Select, Row, Col, TimePicker } from 'antd'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'
import { useSelector } from 'react-redux'
import LoadingComponent from '../staffProfile/LoadingComponent'

const { Option } = Select

const ALL_THERAPIST = gql`
  query {
    staffs(userRole: "Therapist") {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`

const TherapistShiftTab = () => {
  const [selectedDays, setSelectedDays] = useState([])
  const [selectedTherapist, setSelectedTherapist] = useState([])
  const [startTime, setStartTime] = useState()
  const [endTime, setEndTime] = useState()

  const { data: allTherapist, loading: allTherapistLoading } = useQuery(ALL_THERAPIST)
  //   const { data: getShiftData, error: shiftErrors, loading: isShiftingDataLoading } = useQuery(
  //     GET_SHIFT_DETAILS,
  //     {
  //       variables: {
  //         id: therapistId,
  //       },
  //     },
  //   )

  const days = [
    { value: 'Sun', displayText: 'Sunday' },
    { value: 'Mon', displayText: 'Monday' },
    { value: 'Tue', displayText: 'Tuesday' },
    { value: 'Wed', displayText: 'Wednesday' },
    { value: 'Thur', displayText: 'Thursday' },
    { value: 'Fri', displayText: 'Friday' },
    { value: 'Sat', displayText: 'Saturday' },
  ]

  const handleSubmit = () => {}

  if (allTherapistLoading) return <LoadingComponent />

  return (
    <Form
      onSubmit={handleSubmit}
      className="therapistShiftingTab"
      size="small"
      labelCol={{ span: 10 }}
      wrapperCol={{ span: 12 }}
    >
      <Row>
        <Col sm={24} md={24} lg={24}>
          <Form.Item label="Therapist" labelCol={{ offset: 1, sm: 4 }} wrapperCol={{ sm: 18 }}>
            <Select
              placeholder="Select Therapist"
              loading={allTherapistLoading}
              showSearch
              optionFilterProp="name"
            >
              {allTherapist &&
                allTherapist.staffs.edges.map(({ node }) => (
                  <Option key={node.id} name={node.name}>
                    {node.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col sm={12} md={12} lg={12}>
          <Form.Item label="Start Time" labelCol={{ offset: 1, sm: 9 }} wrapperCol={{ sm: 13 }}>
            <TimePicker placeholder="Start Time" format="HH:mm" minuteStep={30} />
          </Form.Item>
        </Col>
        <Col sm={12} md={12} lg={12}>
          <Form.Item label="End Time" labelCol={{ sm: 6 }} wrapperCol={{ sm: 17 }}>
            <TimePicker placeholder="End Time" format="HH:mm" minuteStep={30} />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col sm={24} md={24} lg={24}>
          <Form.Item label="Working Days" labelCol={{ offset: 1, sm: 4 }} wrapperCol={{ sm: 18 }}>
            <Select
              placeholder="Select Working Days"
              showSearch
              optionFilterProp="displayText"
              mode="tags"
            >
              {days.map(({ displayText, value }) => (
                <Option key={value} name={value}>
                  {displayText}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item style={{ textAlign: 'center' }}>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  )
}

export default TherapistShiftTab

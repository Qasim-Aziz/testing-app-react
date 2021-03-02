import React, { useState, useEffect } from 'react'
import { Row, Col, Calendar, Form, Select } from 'antd'
import { useQuery } from 'react-apollo'
import moment from 'moment'
import Authorize from 'components/LayoutComponents/Authorize'
import Timeslot from './Timeslot'
import { GET_THERAPIST } from './query'
import './styles.scss'

const BookAppointment = () => {
  const { data: therapistData, loading: isTherapistLoading } = useQuery(GET_THERAPIST)

  const [allTherapist, setAllTherapist] = useState([])
  const [selectedTherapist, setSelectedTherapist] = useState()
  const [selectedDate, setSelectedDate] = useState(moment())

  useEffect(() => {
    if (therapistData) {
      const therapists = therapistData.staffs.edges.map(({ node }) => ({
        id: node.id,
        title: `${node.name} ${node.surname ?? ''}`,
      }))
      setAllTherapist(therapists)
    }
  }, [therapistData])

  useEffect(() => {
    // If Therapist is change then rest date
    if (!selectedTherapist) setSelectedDate(moment())
  }, [selectedTherapist])

  return (
    <Authorize roles={['parents']} redirect to="/">
      <Row className="bookAppointment">
        <Col span={9} className={selectedTherapist ? 'leftPanel bordered' : 'leftPanel'}>
          <Form layout="inline">
            <Form.Item label="Select Therapist">
              <Select
                showSearch
                allowClear
                loading={isTherapistLoading}
                style={{ width: 346 }}
                placeholder="Select a Therapist"
                optionFilterProp="children"
                onChange={setSelectedTherapist}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {allTherapist.map(({ id, title }) => (
                  <Select.Option key={id} value={id}>
                    {title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
          <Form.Item label="Select Date" className={selectedTherapist ? 'visible' : 'hidden'}>
            <Calendar
              className="calander-selection"
              fullscreen={false}
              onChange={setSelectedDate}
            />
          </Form.Item>
        </Col>
        <Col
          span={15}
          className={selectedTherapist && selectedDate ? 'rightPanel visible' : 'rightPanel hidden'}
        >
          <Form.Item label="Select Timeslot" />
          <Row>
            {[...Array(15).keys()].map(item => (
              <Col sm={8} style={{ textAlign: 'center', marginBottom: '10px' }}>
                <Timeslot
                  selectedTimeSlot={item}
                  selectedDate={selectedDate}
                  selectedTherapist={selectedTherapist}
                  allTherapist={allTherapist}
                />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Authorize>
  )
}

export default BookAppointment

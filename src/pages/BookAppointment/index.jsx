import React, { useState, useEffect } from 'react'
import { Row, Col, Calendar, Form, Select } from 'antd'
import { useLazyQuery, useQuery } from 'react-apollo'
import moment from 'moment'
import Authorize from 'components/LayoutComponents/Authorize'
import LoadingComponent from 'pages/staffProfile/LoadingComponent'
import Timeslot from './Timeslot'
import { GET_THERAPIST, GET_APPOINTMENT_STATUSES, GET_AVAILABLE_SLOTS } from './query'
import './styles.scss'

const BookAppointment = () => {
  const { data: therapistData, loading: isTherapistLoading, error: therapistErrors } = useQuery(
    GET_THERAPIST,
  )

  const [
    loadAvailableSlots,
    { data: availableSlotsData, loading: isAvailableSlotsLoading, error: availableSlotsError },
  ] = useLazyQuery(GET_AVAILABLE_SLOTS)

  const { data: appointmentStatusesData, error: appointmentStatusErrors } = useQuery(
    GET_APPOINTMENT_STATUSES,
  )

  const [allTherapist, setAllTherapist] = useState([])
  const [selectedTherapist, setSelectedTherapist] = useState()
  const [selectedDate, setSelectedDate] = useState(moment())
  const [pendingStatusId, setPendingStatusId] = useState()

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
    if (appointmentStatusesData) {
      const pendingId = appointmentStatusesData.appointmentStatuses.find(
        ({ appointmentStatus }) => appointmentStatus === 'Pending',
      )?.id
      setPendingStatusId(pendingId)
    }
  }, [appointmentStatusesData])

  useEffect(() => {
    // If Therapist is change then rest date
    if (!selectedTherapist) setSelectedDate(moment())
  }, [selectedTherapist])

  useEffect(() => {
    loadAvailableSlots({
      variables: {
        therapistId: selectedTherapist,
        date: selectedDate.format('YYYY-MM-DD'),
      },
    })
  }, [selectedDate, selectedTherapist])

  if (therapistErrors || appointmentStatusErrors)
    return <h3>An error occurred to load THerapist/Appointment details</h3>

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
          <Row>
            {isAvailableSlotsLoading && <LoadingComponent />}
            {availableSlotsError && <h3>An error occurred to load slots.</h3>}
            {availableSlotsData && (
              <>
                <Form.Item label="Select Timeslot" />
                {availableSlotsData.getAppointmentSlots[0].data[0].slots.map(item => (
                  <Col sm={8} style={{ textAlign: 'center', marginBottom: '10px' }}>
                    <Timeslot
                      selectedTimeSlot={item.time}
                      selectedDate={selectedDate}
                      selectedTherapist={selectedTherapist}
                      allTherapist={allTherapist}
                      pendingStatusId={pendingStatusId}
                    />
                  </Col>
                ))}
              </>
            )}
          </Row>
        </Col>
      </Row>
    </Authorize>
  )
}

export default BookAppointment

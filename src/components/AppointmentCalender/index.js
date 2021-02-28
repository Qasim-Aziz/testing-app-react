import React, { useState, useRef, useEffect } from 'react'
import { Row, Col, Tooltip, Button, Select, Switch, Icon, Form } from 'antd'
import FullCalendar from '@fullcalendar/react'
import adaptivePlugin from '@fullcalendar/adaptive'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import interactionPlugin from '@fullcalendar/interaction'
import momentTimezonePlugin from '@fullcalendar/moment-timezone'
import { toMoment } from '@fullcalendar/moment'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import timezones from './timezones.json'

import './style.scss'

const { Option } = Select

const GET_THERAPIST = gql`
  {
    staffs(userRole: "Therapist") {
      edges {
        node {
          id
          name
          surname
        }
      }
    }
  }
`

// Full calander does not support double click so handle through this factory
const FullCalendarActions = {
  currentTime: null,
  isDblClick: () => {
    const prevTime =
      FullCalendarActions.currentTime === null
        ? new Date().getTime() - 1000000
        : FullCalendarActions.currentTime
    FullCalendarActions.currentTime = new Date().getTime()
    return FullCalendarActions.currentTime - prevTime < 8000
  },
}

const AppointmentCalender = ({
  isLoading,
  loadData,
  onDateSelect,
  onAppointmentClick,
  feedbackClick,
  createAppointment,
  dragAndDropAppointment,
}) => {
  const [timezone, setTimezone] = useState('local')
  const [selectedTherapist, setSelectedTherapist] = useState([])
  const [showAllTherapist, setShowAllTherapist] = useState(true)
  const [allTherapist, setAllTherapist] = useState([])
  const [eventResources, setEventResources] = useState([])

  const calendarComponentRef = useRef(null)
  const { data: therapistData, loading: isTherapistLoading } = useQuery(GET_THERAPIST)

  useEffect(() => {
    if (therapistData) {
      const therapists = therapistData.staffs.edges.map(({ node }) => ({
        id: node.id,
        title: `${node.name} ${node.surname ?? ''}`,
      }))
      setAllTherapist(therapists)
      setEventResources(therapists) // For first time by default show all therapists
    }
  }, [therapistData])

  const updateEventResources = (isShowAllTherapist, therapistIds) => {
    if (isShowAllTherapist || therapistIds.length === 0) setEventResources(allTherapist)
    else {
      const filteredResources = allTherapist.filter(
        therapist => therapistIds.indexOf(therapist.id) !== -1,
      )
      setEventResources(filteredResources)
    }
  }

  const renderEventContent = eventInfo => {
    const { student, location } = eventInfo.event.extendedProps
    let studentName = 'N/A'
    let locationName = 'N/A'

    if (location) locationName = eventInfo.event.extendedProps?.location?.location
    if (student) {
      if (student.firstname && student.lastname)
        studentName = `${student.firstname} ${student.lastname}`
      else if (student.firstname) studentName = student.firstname
      else if (student.lastname) studentName = student.lastname
    }

    const celanderApi = calendarComponentRef.current.getApi()
    const startTime = toMoment(eventInfo.event.start, celanderApi).format('hh:mm A')
    const endTime = toMoment(eventInfo.event.end, celanderApi).format('hh:mm A')
    const timeZoneText = toMoment(eventInfo.event.end, celanderApi).format('Z')
    const timeText = `${startTime} - ${endTime}`

    return (
      <>
        <Tooltip
          placement="top"
          title={
            <div>
              <div>
                <b>Time: </b>
                {timeText}
              </div>
              <div>
                <b>Timezone: </b>
                {timeZoneText}
              </div>
              <div>
                <b>Title: </b>
                {eventInfo.event.title}
              </div>
              <div>
                <b>Student: </b>
                {studentName}
              </div>
              <div>
                <b>Location: </b>
                {locationName}
              </div>
              <div style={{ marginTop: '4px' }}>
                <Button
                  onClick={() => onAppointmentClick(eventInfo)}
                  style={{ marginRight: '10px' }}
                  size="small"
                  type="primary"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => feedbackClick(eventInfo.event.id)}
                  size="small"
                  type="primary"
                >
                  Feedback
                </Button>
              </div>
            </div>
          }
        >
          <div style={{ display: 'block', width: '100%' }}>
            {/* <div className="fc-daygrid-event-dot" style={{ display: 'inline-block' }} /> */}
            <span className="fc-event-time" style={{ display: 'inline-block' }}>
              {timeText}
            </span>
            <span className="fc-event-title">{eventInfo.event.title}</span>
          </div>
        </Tooltip>
      </>
    )
  }

  //   return isLoading ? (
  //     <h5 style={{ margin: '30px 10px', textAlign: 'center' }}>Loading Appointments...</h5>
  //   ) : (
  return (
    <div className="appointmentCalendar">
      <Row>
        <Col style={{ float: 'right', marginBottom: '12px' }}>
          <Form layout="inline" className="filterCard">
            <Form.Item label="Show all Therapist(s)">
              <Switch
                checked={showAllTherapist}
                checkedChildren={<Icon type="check" />}
                unCheckedChildren={<Icon type="close" />}
                onChange={isChecked => {
                  setShowAllTherapist(isChecked)
                  updateEventResources(isChecked, selectedTherapist)
                }}
                disabled={selectedTherapist.length > 0}
              />
            </Form.Item>

            <Form.Item label="Therapist">
              <Select
                showSearch
                allowClear
                disabled={showAllTherapist}
                loading={isTherapistLoading}
                mode="tags"
                style={{ width: 480 }}
                placeholder="Select a Therapist"
                optionFilterProp="children"
                defaultValue={selectedTherapist}
                onChange={therapistIds => {
                  setSelectedTherapist(therapistIds)
                  updateEventResources(showAllTherapist, therapistIds)
                }}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {allTherapist.map(({ id, title }) => (
                  <Option key={id} value={id}>
                    {title}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Timezone">
              <Select
                showSearch
                style={{ width: 150, marginRight: 0 }}
                placeholder="Select a Timezone"
                optionFilterProp="children"
                onChange={setTimezone}
                defaultValue={timezone}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {timezones.map(t => (
                  <Option key={t} value={t}>
                    {t}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Col>
      </Row>
      <FullCalendar
        ref={calendarComponentRef}
        schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
        plugins={[adaptivePlugin, interactionPlugin, resourceTimelinePlugin, momentTimezonePlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'resourceTimelineMonth,resourceTimelineWeek,resourceTimelineDay',
        }}
        slotMinTime="09:00:00"
        slotMaxTime="21:00:00"
        initialView="resourceTimelineDay"
        selectable
        weekends
        dayMaxEvents={3}
        events={loadData}
        select={onDateSelect}
        eventContent={renderEventContent}
        eventClick={onAppointmentClick}
        timeZone={timezone}
        slotMinWidth="80"
        resourceAreaWidth="150px"
        resourceAreaHeaderContent="Therapist"
        resources={eventResources}
        resourceOrder="title"
        filterResourcesWithEvents={!showAllTherapist && selectedTherapist.length === 0}
        dateClick={(date, jsEvent, view) => {
          console.log("It's date cell clicked")
          if (FullCalendarActions.isDblClick()) {
            console.log("It's date cell DOUBLE clicked...!")
            createAppointment()
          }
        }}
        editable
        droppable
        eventDurationEditable={false}
        eventDrop={args => {
          dragAndDropAppointment({
            variables: {
              id: args.event.id,
              start: args.event.start,
              end: args.event.end,
              therapistId: args.newResource?.id,
            },
          })
        }}
      />
    </div>
  )
  //   )
}

export default AppointmentCalender

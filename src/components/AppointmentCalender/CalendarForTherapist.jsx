import React from 'react'
import { Tooltip, Button } from 'antd'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

import './style.scss'

const CalendarForTherapist = ({
  isLoading,
  loadData,
  onDateSelect,
  onAppointmentClick,
  feedbackClick,
}) => {
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

    return (
      <>
        <Tooltip
          placement="top"
          title={
            <div>
              <div>
                <b>Time: </b>
                {eventInfo.timeText}
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
            <div className="fc-daygrid-event-dot" style={{ display: 'inline-block' }} />
            <span className="fc-event-time">{eventInfo.timeText}</span>
            <span className="fc-event-title">{eventInfo.event.title}</span>
          </div>
        </Tooltip>
      </>
    )
  }

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      }}
      initialView="timeGridDay"
      selectable
      weekends
      dayMaxEvents={3}
      events={loadData}
      select={onDateSelect}
      eventContent={renderEventContent}
      eventClick={onAppointmentClick}
    />
  )
}

export default CalendarForTherapist

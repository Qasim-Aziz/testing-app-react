import React from 'react'
import FullCalendar from '@fullcalendar/react'
import adaptivePlugin from '@fullcalendar/adaptive'
import interactionPlugin from '@fullcalendar/interaction'
import daygridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'

import './style.scss'

const CalendarForTherapist = () => {
  return (
    <FullCalendar
      schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
      plugins={[adaptivePlugin, interactionPlugin, daygridPlugin, timeGridPlugin]}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      }}
      slotMinTime="09:00:00"
      slotMaxTime="21:00:00"
      initialView="timeGridDay"
      selectable
      weekends
      dayMaxEvents={3}
      slotMinWidth="80"
      editable
      droppable
      eventDurationEditable={false}
    />
  )
}

export default CalendarForTherapist

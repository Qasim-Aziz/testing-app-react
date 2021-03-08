import React from 'react'
import CalendarForTherapist from 'components/AppointmentCalender/CalendarForTherapist'
import Authorize from 'components/LayoutComponents/Authorize'

export default () => {
  return (
    <Authorize roles={['therapist']} redirect to="/">
      <div style={{ marginTop: 10 }}>
        <CalendarForTherapist />
      </div>
    </Authorize>
  )
}

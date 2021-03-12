import React, { useState, useEffect } from 'react'
import { Drawer } from 'antd'
import moment from 'moment'
import { useQuery } from 'react-apollo'
import CalendarForTherapist from 'components/AppointmentCalender/CalendarForTherapist'
import UpdateAppointmentForm from 'components/Form/UpdateAppointmentForm'
import Authorize from 'components/LayoutComponents/Authorize'
import { APPOINTMENTS_FOR_RANGE } from './query'
import { dateTimeToDate } from '../../utilities'

export default () => {
  let loadAppointmentCallback = null
  const [needToReloadData, setNeedToReloadData] = useState(false)
  const [updatingAppointmentId, setUpdatingAppointmentId] = useState()
  const [loadedAppointments, setLoadedAppointments] = useState([])
  const [renderedStartDate, setRenderedStartDate] = useState(moment())
  const [renderedEndDate, setRenderedEndDate] = useState(moment())
  const [visibleDraw, setVisibleDraw] = useState(false)

  const { data, loading, error, refetch } = useQuery(APPOINTMENTS_FOR_RANGE, {
    variables: {
      dateFrom: dateTimeToDate(renderedStartDate),
      dateTo: dateTimeToDate(renderedEndDate),
    },
  })

  useEffect(() => {
    let appointmentsData = []
    if (data) {
      appointmentsData = data.appointments.edges.map(({ node }) => ({
        id: node.id,
        start: node.start,
        end: node.end,
        title: node.title,
        classNames: 'event_item',
        extendedProps: {
          location: node.location,
          student: node.student,
        },
      }))
    }

    setLoadedAppointments(appointmentsData) // Save in state for reusing if render same range
    if (loadAppointmentCallback) {
      loadAppointmentCallback(appointmentsData)
      loadAppointmentCallback = undefined
    }
  }, [data])

  useEffect(() => {
    if (needToReloadData) {
      refetch()
      setVisibleDraw(false)
      setNeedToReloadData(false)
    }
  }, [needToReloadData])

  const loadAppointments = (fetchInfo, successCallback, failureCallback) => {
    const isSameStartDate = moment(renderedStartDate).isSame(moment(fetchInfo.start), 'day')
    const isSameEndDate = moment(renderedEndDate).isSame(moment(fetchInfo.end), 'day')

    if (!isSameStartDate && !isSameEndDate) {
      loadAppointmentCallback = successCallback
      setRenderedStartDate(fetchInfo.start)
      setRenderedEndDate(fetchInfo.end)
    } else {
      successCallback(loadedAppointments)
    }
  }

  const updateAppointment = id => {
    setUpdatingAppointmentId(id)
    setVisibleDraw(true)
  }

  const closeUpdateAppointment = () => {
    setUpdatingAppointmentId()
    setVisibleDraw(false)
  }

  return (
    <Authorize roles={['therapist']} redirect to="/">
      <div style={{ padding: '0px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0px 10px',
            backgroundColor: '#FFF',
            boxShadow: '0 1px 6px rgba(0,0,0,.12), 0 1px 4px rgba(0,0,0,.12)',
          }}
        >
          <div>
            <span style={{ fontSize: '25px', color: '#000' }}>Appointments</span>
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <CalendarForTherapist
            isLoading={loading}
            loadData={loadAppointments}
            onAppointmentClick={clickInfo => updateAppointment(clickInfo.event.id)}
          />
        </div>
      </div>

      <Drawer
        title="Update Appointment"
        placement="right"
        width="75%"
        closable
        onClose={() => setVisibleDraw(false)}
        visible={visibleDraw}
      >
        <UpdateAppointmentForm
          appointmentId={updatingAppointmentId}
          setNeedToReloadData={setNeedToReloadData}
          closeUpdateAppointment={closeUpdateAppointment}
        />
      </Drawer>
    </Authorize>
  )
}

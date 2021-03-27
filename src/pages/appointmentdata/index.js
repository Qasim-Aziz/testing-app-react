import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Drawer, Button, notification } from 'antd'
import moment from 'moment'
import { useQuery, useMutation } from 'react-apollo'
import { useSelector, useDispatch } from 'react-redux'
import CreateAppointmentForm from 'components/Form/CreateAppointmentForm'
import UpdateAppointmentForm from 'components/Form/UpdateAppointmentForm'
import { PlusOutlined } from '@ant-design/icons'
import SessionFeedbackForm from '../sessionFeedback'
import { APPOINTMENTS_FOR_RANGE, UPDATE_APPOINTMENT } from './query'
import AppointmentCalender from '../../components/AppointmentCalender/index'
import { dateTimeToDate } from '../../utilities'

import './calendar.scss'

export default () => {
  let loadAppointmentCallback = null
  const [needToReloadData, setNeedToReloadData] = useState(false)
  const [updatingAppointmentId, setUpdatingAppointmentId] = useState()
  const [selectedStartDate, setSelectedStartDate] = useState()
  const [selectedEndDate, setSelectedEndDate] = useState()
  const [selectedTherapist, setSelectedTherapist] = useState()

  const [loadedAppointments, setLoadedAppointments] = useState([])
  const [eventResources, setEventResources] = useState([])
  const [renderedStartDate, setRenderedStartDate] = useState(moment())
  const [renderedEndDate, setRenderedEndDate] = useState(moment())
  const { data, loading, error, refetch } = useQuery(APPOINTMENTS_FOR_RANGE, {
    variables: {
      dateFrom: dateTimeToDate(renderedStartDate),
      dateTo: dateTimeToDate(renderedEndDate),
    },
  })

  const [
    dragAndDropAppointment,
    {
      data: dragAndDropAppointmentData,
      error: dragAndDropAppointmentError,
      loading: isDragAndDropAppointmentLoading,
    },
  ] = useMutation(UPDATE_APPOINTMENT)

  useEffect(() => {
    if (isDragAndDropAppointmentLoading)
      notification.info({ message: 'Please wait while updating Appointment.', duration: 2 })
  }, [isDragAndDropAppointmentLoading])

  useEffect(() => {
    if (dragAndDropAppointmentError)
      notification.error({ message: 'An error occurred to update Appointment.' })
  }, [dragAndDropAppointmentError])

  useEffect(() => {
    if (dragAndDropAppointmentData)
      notification.success({ message: 'Appointment details updated successfully.' })
  }, [dragAndDropAppointmentData])

  useEffect(() => {
    let appointmentsData = []

    if (data) {
      appointmentsData = data.appointments.edges.map(({ node }) => ({
        id: node.id,
        start: node.start,
        end: node.end,
        title: node.title,
        classNames: 'event_item',
        resourceId: node.therapist ? node.therapist.id : null,
        extendedProps: {
          location: node.location,
          student: node.student,
          therapist: node.therapist,
        },
      }))

      setLoadedAppointments(appointmentsData) // Save in state for reusing if render same range
    }

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

  const handleSelectDates = selection => {
    let endDate = selection.end
    if (selection.allDay) {
      // If multiple dates are selected then we need to remove 1 day from endDate
      endDate = moment(selection.end).subtract(1, 'days')
    }

    if (selection.resource && selection.resource.id) setSelectedTherapist(selection.resource.id)
    else setSelectedTherapist(undefined)

    setSelectedStartDate(selection.start)
    setSelectedEndDate(endDate)
  }

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

  const createAppointment = () => {
    setUpdatingAppointmentId(null)
    setVisibleDraw(true)
  }

  const updateAppointment = id => {
    setUpdatingAppointmentId(id)
    setVisibleDraw(true)
  }

  const closeUpdateAppointment = () => {
    setUpdatingAppointmentId()
    setVisibleDraw(false)
  }

  const userRole = useSelector(state => state.user.role)

  const [feedbackDrawer, setFeedbackDrawer] = useState(false)
  const [visibleDraw, setVisibleDraw] = useState(false)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState('')
  const dispatch = useDispatch()

  const showFeedback = id => {
    setFeedbackDrawer(true)

    setSelectedAppointmentId(id)
    dispatch({
      type: 'feedback/SET_STATE',
      payload: {
        AppointmnetId: id,
      },
    })
  }

  return (
    <div>
      <Drawer
        title="Give Session Feedback"
        placement="right"
        width="500px"
        closable
        onClose={() => setFeedbackDrawer(false)}
        visible={feedbackDrawer}
      >
        <SessionFeedbackForm appointmentId={selectedAppointmentId} key={selectedAppointmentId} />
      </Drawer>
      <Drawer
        title={updatingAppointmentId ? 'Update Appointment' : 'Create Appointment'}
        placement="right"
        width="75%"
        closable
        onClose={() => setVisibleDraw(false)}
        visible={visibleDraw}
      >
        {updatingAppointmentId ? (
          <UpdateAppointmentForm
            appointmentId={updatingAppointmentId}
            setNeedToReloadData={setNeedToReloadData}
            closeUpdateAppointment={closeUpdateAppointment}
            closeDrawer={setVisibleDraw}
          />
        ) : (
          <CreateAppointmentForm
            setNeedToReloadData={setNeedToReloadData}
            startDate={selectedStartDate}
            endDate={selectedEndDate}
            therapistId={selectedTherapist}
            closeDrawer={setVisibleDraw}
          />
        )}
      </Drawer>

      <Helmet title="Dashboard Alpha" />
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
          <div style={{ padding: '5px 0px' }}>
            {userRole !== 'parents' && (
              <Button onClick={createAppointment} type="primary">
                <PlusOutlined /> ADD APPOINTMENT
              </Button>
            )}
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <AppointmentCalender
            isLoading={loading}
            loadData={loadAppointments}
            eventResources={eventResources}
            onDateSelect={handleSelectDates}
            onAppointmentClick={clickInfo => updateAppointment(clickInfo.event.id)}
            feedbackClick={showFeedback}
            createAppointment={createAppointment}
            dragAndDropAppointment={dragAndDropAppointment}
          />
        </div>
      </div>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { Drawer, Button } from 'antd'
import moment from 'moment'
import { useQuery } from 'react-apollo'
import { useSelector, useDispatch } from 'react-redux'
import { PlusOutlined } from '@ant-design/icons'
import CreateAppointmentForm from 'components/Form/CreateAppointmentForm'
import UpdateAppointmentForm from 'components/Form/UpdateAppointmentForm'
import CalendarForTherapist from 'components/AppointmentCalender/CalendarForTherapist'
import Authorize from 'components/LayoutComponents/Authorize'
import { APPOINTMENTS_FOR_RANGE } from './query'
import SessionFeedbackForm from '../sessionFeedback'
import { dateTimeToDate } from '../../utilities'
import { COLORS, DRAWER } from '../../assets/styles/globalStyles'

export default () => {
  let loadAppointmentCallback = null

  const dispatch = useDispatch()
  const therapistId = useSelector(state => state.user.staffId)

  const [needToReloadData, setNeedToReloadData] = useState(false)
  const [updatingAppointmentId, setUpdatingAppointmentId] = useState()
  const [selectedStartDate, setSelectedStartDate] = useState()
  const [selectedEndDate, setSelectedEndDate] = useState()
  const [loadedAppointments, setLoadedAppointments] = useState([])
  const [renderedStartDate, setRenderedStartDate] = useState(moment())
  const [renderedEndDate, setRenderedEndDate] = useState(moment())
  const [visibleDraw, setVisibleDraw] = useState(false)
  const [feedbackDrawer, setFeedbackDrawer] = useState(false)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState('')

  const { data, loading, error, refetch } = useQuery(APPOINTMENTS_FOR_RANGE, {
    variables: {
      dateFrom: dateTimeToDate(renderedStartDate),
      dateTo: dateTimeToDate(renderedEndDate),
      therapistId,
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

  const handleSelectDates = selection => {
    let endDate = selection.end
    if (selection.allDay) {
      // If multiple dates are selected then we need to remove 1 day from endDate
      endDate = moment(selection.end).subtract(1, 'days')
    }

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
    <Authorize roles={['therapist']} redirect to="/">
      <div style={{ padding: '0px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            // justifyContent: 'space-between',
            alignItems: 'center',
            padding: '2px 10px',
            backgroundColor: COLORS.white,
            boxShadow: '0 1px 6px rgba(0,0,0,.12), 0 1px 4px rgba(0,0,0,.12)',
          }}
        >
          <div
            style={{
              flex: 6,
              display: 'flex',
              marginLeft: '14em',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: '25px', color: COLORS.blackLighten }}>Appointments</span>
          </div>
          <div style={{ padding: '5px 0px', flex: 1 }}>
            <Button onClick={createAppointment} type="primary">
              <PlusOutlined /> ADD APPOINTMENT
            </Button>
          </div>
        </div>
        <div style={{ marginTop: 10, padding: '1em' }} className="calenderTherapist-container">
          <CalendarForTherapist
            isLoading={loading}
            loadData={loadAppointments}
            onDateSelect={handleSelectDates}
            onAppointmentClick={clickInfo => updateAppointment(clickInfo.event.id)}
            feedbackClick={showFeedback}
          />
        </div>
      </div>

      <Drawer
        title={updatingAppointmentId ? 'Update Appointment' : 'Create Appointment'}
        placement="right"
        width="80%"
        closable
        onClose={() => setVisibleDraw(false)}
        visible={visibleDraw}
      >
        {updatingAppointmentId ? (
          <UpdateAppointmentForm
            appointmentId={updatingAppointmentId}
            setNeedToReloadData={setNeedToReloadData}
            closeUpdateAppointment={closeUpdateAppointment}
          />
        ) : (
          <CreateAppointmentForm
            setNeedToReloadData={setNeedToReloadData}
            startDate={selectedStartDate}
            endDate={selectedEndDate}
          />
        )}
      </Drawer>
      <Drawer
        title="Give Session Feedback"
        placement="right"
        width={DRAWER.widthL1}
        closable
        onClose={() => setFeedbackDrawer(false)}
        visible={feedbackDrawer}
      >
        <SessionFeedbackForm appointmentId={selectedAppointmentId} key={selectedAppointmentId} />
      </Drawer>
    </Authorize>
  )
}

/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Card, Button, Drawer, Tabs } from 'antd'
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Link, withRouter } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import '../style.scss'
import Upcoming from './upcoming'
import CreateAppointmentForm from 'components/Form/CreateAppointmentForm'
import UpdateAppointmentForm from 'components/Form/UpdateAppointmentForm'
import { DRAWER } from 'assets/styles/globalStyles'

const { Meta } = Card
const { TabPane } = Tabs

function AppointmentCard(props) {
  const [appointmentDrawer, setAppointmentDrawer] = useState(false)
  const [updateAppointmentId, setUpdateAppointmentId] = useState(null)
  const [upcomingAppointmentList, setUpcomingAppointmentList] = useState(null)
  const [postAppointemntList, setPostAppointemntList] = useState(null)
  const [activeTab, setActiveTab] = useState('upcoming')
  const appt = useSelector(state => state.appointments)
  const staffProfile = useSelector(state => state.staffs.StaffProfile)

  const dispatch = useDispatch()

  useEffect(() => {
    if (appt) {
      if (!appt.appointmentsLoading && staffProfile) {
        if (appt.appointments.length > 0) {
          let temp = appt.appointments.filter(
            item => new Date(item.start) > new Date() && item.therapist?.id === staffProfile.id,
          )
          temp.reverse()
          setUpcomingAppointmentList(temp)

          let temp2 = appt.appointments.filter(
            item => new Date(item.start) < new Date() && item.therapist?.id === staffProfile.id,
          )

          setPostAppointemntList(temp2)
        } else {
          setUpcomingAppointmentList([])
          setPostAppointemntList([])
        }
      }
    }
  }, [appt, staffProfile])

  const createAppointment = () => {
    setUpdateAppointmentId(null)
    setAppointmentDrawer(true)
  }

  const updateAppointment = id => {
    setUpdateAppointmentId(id)
    setAppointmentDrawer(true)
  }

  const closeUpdateAppointment = () => {
    setUpdateAppointmentId(null)
    setAppointmentDrawer(false)
  }

  const createAppointmentRedux = data => {
    dispatch({
      type: 'appointments/CREATE_APPOINTMENT',
      payload: {
        response: data,
      },
    })
  }

  const updateAppointmentRedux = data => {
    dispatch({
      type: 'appointments/EDIT_APPOINTMENT',
      payload: {
        response: data,
      },
    })
  }

  const extraContent = (
    <Button
      onClick={createAppointment}
      disabled={!staffProfile.isActive}
      type="primary"
      size="small"
      style={{ marginRight: '16px' }}
    >
      <PlusOutlined /> Add Appointment
    </Button>
  )

  return (
    <div style={{ height: 'fit-content', marginBottom: '28px' }} className="appointment-card">
      <Drawer
        title={updateAppointmentId ? 'Update Appointment' : 'Create Appointment'}
        placement="right"
        width={DRAWER.widthL2}
        closable
        onClose={() => setAppointmentDrawer(false)}
        visible={appointmentDrawer}
      >
        {updateAppointmentId ? (
          <UpdateAppointmentForm
            appointmentId={updateAppointmentId}
            setNeedToReloadData={updateAppointmentRedux}
            closeUpdateAppointment={closeUpdateAppointment}
          />
        ) : (
          <CreateAppointmentForm
            setNeedToReloadData={createAppointmentRedux}
            therapistId={props.staffs.StaffProfile.id}
            closeDrawer={() => setAppointmentDrawer(false)}
          />
        )}
      </Drawer>
      <div
        style={{
          fontSize: '18px',
          color: 'black',
          fontWeight: 600,
          padding: 16,
          width: '100%',
          border: '1px solid #d9d9d9',
          borderBottom: 'none',
        }}
      >
        <span>Appointments</span>
      </div>
      <Tabs
        onChange={setActiveTab}
        tabBarExtraContent={extraContent}
        style={{ border: '1px solid #d9d9d9' }}
      >
        <TabPane key="upcoming" tab="Upcoming">
          <Upcoming
            updateAppointment={updateAppointment}
            staff={props.staffs.StaffProfile}
            appointmentList={upcomingAppointmentList}
            upcoming={true}
          />
        </TabPane>
        <TabPane key="post" tab="Post">
          <Upcoming
            updateAppointment={updateAppointment}
            staff={props.staffs.StaffProfile}
            appointmentList={postAppointemntList}
          />
        </TabPane>
      </Tabs>
    </div>
  )
}
const mapStateToProps = ({ staffs }) => ({
  staffs,
})

export default withRouter(connect(mapStateToProps)(AppointmentCard))

/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Card, Switch, Icon, Avatar, Tag, Tooltip, Button, Drawer, Tabs } from 'antd'
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Link, withRouter } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import gql from 'graphql-tag'
import moment from 'moment'
import '../style.scss'
import { useQuery, useLazyQuery } from 'react-apollo'
import Upcoming from './upcoming'
import Post from './post'
import CreateAppointmentForm from 'components/Form/CreateAppointmentForm'
import UpdateAppointmentForm from 'components/Form/UpdateAppointmentForm'

const { Meta } = Card
const { TabPane } = Tabs

const er = gql`
  query($id: ID, $dateFrom: Date, $dateTo: Date) {
    appointments(therapist: $id, dateFrom: $dateFrom, dateTo: $dateTo) {
      edges {
        node {
          id
          student {
            id
            firstname
            lastname
          }
          createdBy {
            id
            firstName
            lastName
          }
          appointmentStatus {
            id
            appointmentStatus
          }
          note
          title
          start
          end
          isApproved
        }
      }
    }
  }
`

function AppointmentCard(props) {
  const [appointmentDrawer, setAppointmentDrawer] = useState(false)
  const [updateAppointmentId, setUpdateAppointmentId] = useState(null)
  const dispatch = useDispatch()

  const createAppointment = () => {
    dispatch({
      type: 'appointments/GET_APPOINTMENT_LIST',
    })
    // setUpdateAppointmentId(null)
    // setAppointmentDrawer(true)
  }

  const updateAppointment = id => {
    setUpdateAppointmentId(id)
    setAppointmentDrawer(true)
  }

  const closeUpdateAppointment = () => {
    setUpdateAppointmentId(null)
    setAppointmentDrawer(false)
  }

  const extraContent = (
    <Button onClick={createAppointment} type="primary" size="small" style={{ marginRight: '16px' }}>
      <PlusOutlined /> Add Appointment{' '}
    </Button>
  )

  return (
    <div style={{ height: 'fit-content', marginBottom: '28px' }}>
      <Drawer
        title={updateAppointmentId ? 'Update Appointment' : 'Create Appointment'}
        placement="right"
        width="65%"
        closable
        onClose={() => setAppointmentDrawer(false)}
        visible={appointmentDrawer}
      >
        {updateAppointmentId ? (
          <UpdateAppointmentForm
            appointmentId={updateAppointmentId}
            // setNeedToReloadData={setNeedToReloadData}
            closeUpdateAppointment={closeUpdateAppointment}
          />
        ) : (
          <CreateAppointmentForm therapistId={props.staffs.StaffProfile.id} />
        )}
      </Drawer>
      <Tabs tabBarExtraContent={extraContent} style={{ border: '1px solid #e8e8e8' }}>
        <TabPane key="upcoming" tab="Upcoming">
          <Upcoming updateAppointment={updateAppointment} staff={props.staffs.StaffProfile} />
        </TabPane>
        <TabPane key="post" tab="Post">
          <Post updateAppointment={updateAppointment} staff={props.staffs.StaffProfile} />
        </TabPane>
      </Tabs>
    </div>
  )
}
const mapStateToProps = ({ staffs }) => ({
  staffs,
})

export default withRouter(connect(mapStateToProps)(AppointmentCard))

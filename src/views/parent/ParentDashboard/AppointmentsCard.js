/* eslint-disable no-unused-vars */
import React from 'react'
import { Typography, Badge, Icon, Button, Card } from 'antd'
import moment from 'moment'
import { WhatsAppOutlined, ClockCircleOutlined } from '@ant-design/icons'
import appointImg from './images/appointment.jpg'
import './appointmentsCard.scss'

const { Text } = Typography

const Appointment = ({ appointment }) => {
  return (
    <div className="appointment">
      <img src={appointImg} className="appointImg" alt="" />
      <div style={{ width: 'calc(100% - 70px)' }}>
        <div className="appointInfoRow">
          <Text
            style={{
              fontSize: '20px',
              display: 'block',
              fontWeight: '600',
              color: '#000',
              lineHeight: '27px',
            }}
          >
            {appointment.therapist.name}
          </Text>
          <WhatsAppOutlined style={{ fontSize: 26, color: '#00bfa5' }} />
        </div>
        <div className="appointInfoRow" style={{ marginTop: 2 }}>
          <Text style={{ fontWeight: 600, fontSize: 16, lineHeight: '22px', color: '#000' }}>
            {appointment.therapist.userRole.name}
          </Text>
          <Text
            style={{
              fontWeight: 600,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ClockCircleOutlined style={{ fontSize: '30px', marginRight: 6 }} />
            {moment(appointment.start).format('hA')}-{moment(appointment.end).format('hA')}
          </Text>
        </div>
        <div className="appointInfoRow" style={{ margin: '4px 0px 0px' }}>
          <Text
            style={{ fontSize: '12px', fontWeight: 'normal', lineHeight: '16px', color: '#000' }}
          >
            {appointment.location.location}
          </Text>
        </div>
      </div>
    </div>
  )
}

const AppointmentsCard = ({ appointments }) => {
  return (
    <div className="appointmentCardBox">
      <div style={{ display: 'relative' }}>
        {appointments.map(({ node }, index) => {
          return (
            <>
              <Appointment appointment={node} />
              {index < appointments.length - 1 && <hr />}
            </>
          )
        })}
        <Button type="link" className="allViewButton">
          View All
          <Icon type="arrow-right" />
        </Button>
      </div>
    </div>
  )
}

export default AppointmentsCard

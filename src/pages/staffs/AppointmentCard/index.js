/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Card, Switch, Icon, Avatar, Tag, Tooltip, Button, Drawer, Tabs } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { Link, withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import moment from 'moment'
import '../style.scss'
import { useQuery, useLazyQuery } from 'react-apollo'
import Upcoming from './upcoming'
import Post from './post'

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

const customSpanStyle = {
  backgroundColor: '#52c41a',
  color: 'white',
  borderRadius: '3px',
  padding: '1px 5px',
}
const inActiveSpanStyle = {
  backgroundColor: 'red',
  color: 'white',
  borderRadius: '3px',
  padding: '1px 5px',
}

const labelHead = {
  minWidth: 160,
  fontWeight: 700,
  color: 'black',
}

const th2 = {
  minWidth: 140,
  fontWeight: 700,
  color: 'black',
}

function AppointmentCard(props) {
  return (
    <div style={{ height: 240 }}>
      <Tabs>
        <TabPane key="upcoming" tab="Upcoming">
          <Upcoming staff={props.staffs.StaffProfile} />
        </TabPane>
        <TabPane key="post" tab="Post">
          <Post staff={props.staffs.StaffProfile} />
        </TabPane>
      </Tabs>
    </div>
  )
}
const mapStateToProps = ({ staffs }) => ({
  staffs,
})

export default withRouter(connect(mapStateToProps)(AppointmentCard))

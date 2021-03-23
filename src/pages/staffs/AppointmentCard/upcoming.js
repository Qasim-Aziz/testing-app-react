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

const { Meta } = Card
const { TabPane } = Tabs

const er = gql`
  query($id: ID, $dateFrom: Date) {
    appointments(therapist: $id, dateFrom: $dateFrom) {
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
          purposeAssignment
          location {
            id
            location
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

function Upcoming(props) {
  const [getApp, { data, loading, error }] = useLazyQuery(er)
  useEffect(() => {
    if (props.staff) {
      getApp({
        variables: {
          id: props.staff.id,
          dateFrom: '2021-02-17',
        },
      })
    }
  }, [props.staff])

  if (data) {
    data.appointments.edges.map(item => console.log(item.node))
  }
  console.log(data, loading, error, 'upcoming appointments')

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '270px' }}>
        <div>20 Nov 2020</div>
        <div>9:00 - 12:00</div>
      </div>
      <div style={{ width: '270px' }}>
        <div>treatment</div>
        <div>This is title</div>
      </div>
      <div style={{ width: '270px' }}>user - er</div>
    </div>
  )
}

export default Upcoming

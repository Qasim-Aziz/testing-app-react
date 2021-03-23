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

function Post(props) {
  const [getApp, { data, loading, error }] = useLazyQuery(er)

  useEffect(() => {
    if (props.staff) {
      getApp({
        variables: {
          id: props.staff.id,
          dateFrom: '2020-12-01',
        },
      })
    }
  }, [props.staff])

  return <div>post</div>
}

export default Post

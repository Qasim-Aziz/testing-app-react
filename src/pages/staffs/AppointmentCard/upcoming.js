/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { connect, useSelector, useDispatch } from 'react-redux'
import { Card, Switch, Icon, Avatar, Tag, Tooltip, Button, Drawer, Tabs } from 'antd'
import {
  EditOutlined,
  CheckCircleTwoTone,
  FileTextOutlined,
  DownCircleFilled,
  DownCircleTwoTone,
} from '@ant-design/icons'
import { Link, withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import moment from 'moment'
import '../style.scss'
import { useQuery, useLazyQuery } from 'react-apollo'
import { Scrollbars } from 'react-custom-scrollbars'
import LoadingComponent from 'components/LoadingComponent'
import SessionFeedbackForm from '../../sessionFeedback'

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
  const dispatch = useDispatch()
  const [selectedAppointmentId, setSelectedAppointmentId] = useState('')
  const [feedbackDrawer, setFeedbackDrawer] = useState(false)
  const [appointmentList, setAppointmentList] = useState(null)
  useEffect(() => {
    if (props.staff) {
      getApp({
        variables: {
          id: props.staff.id,
          dateFrom: moment().format('YYYY-MM-DD'),
        },
      })
    }
  }, [props.staff])

  useEffect(() => {
    if (data && data.appointments) {
      let temp = []
      temp = data.appointments.edges.map(item => item.node)
      temp.sort((a, b) => moment(a.start) - moment(b.start))
      setAppointmentList(temp)
      console.log(temp, 'temp')
    }
  }, [data])

  const userRole = useSelector(state => state.user.role)

  console.log(userRole, 'dsd')
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

  if (loading || !data) {
    return <LoadingComponent />
  }
  return (
    <>
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
      <Scrollbars autoHide style={{ height: appointmentList?.length == 0 ? 182 : 350 }}>
        <div style={{ display: 'flex' }}>
          {appointmentList && appointmentList.length > 0 ? (
            appointmentList.map((item, idx) => {
              return (
                <div key={item.id} style={{ display: 'flex', height: '138px' }}>
                  <div
                    style={{
                      width: '10%',
                      alignItems: 'center',
                      display: 'flex',
                      position: 'relative',
                      flexDirection: 'column',
                    }}
                  >
                    <div
                      style={{
                        width: '5px',
                        backgroundColor: '#3399ff',
                        height: '100%',
                      }}
                    />
                    <div
                      style={{
                        zIndex: 2,
                        display: 'flex',
                        position: 'absolute',
                        top: '64px',
                      }}
                    >
                      <DownCircleTwoTone twoToneColor="#3399ff" style={{ fontSize: 22 }} />
                    </div>
                  </div>
                  <div style={{ paddingTop: '16px', width: '90%' }}>
                    <div
                      style={{
                        width: '100%',
                        height: '121px',
                        padding: '20px 24px',
                        border: '1px solid #e8e8e8',
                        boxDhadow: '0 1px 1px 0 rgb(242, 242, 242)',
                        backgroundColor: 'white',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          height: '100%',
                        }}
                      >
                        <div
                          style={{
                            minWidth: 'fit-content',
                            padding: '0 24px 0 0',
                            borderRight: '1px solid #e8e8e8',
                            height: '100%',
                          }}
                        >
                          <div style={{ fontSize: '22px', fontWeight: '700', color: 'black' }}>
                            {moment(item.start).format('Do MMM YYYY')}{' '}
                            <CheckCircleTwoTone
                              twoToneColor="#52c41a"
                              style={{ fontSize: '16px' }}
                            />
                          </div>
                          <div>
                            {moment(item.start).format('hh:mm A')} -{' '}
                            {moment(item.end).format('hh:mm A')}
                          </div>
                        </div>
                        <div
                          style={{
                            width: '340px',
                            height: '100%',
                            borderRight: '1px solid #e8e8e8',
                            padding: '0 24px',
                          }}
                        >
                          <div>
                            <div
                              style={{
                                textTransform: 'capitalize',
                                marginBottom: '6px',
                              }}
                            >
                              {item.purposeAssignment}
                            </div>
                            <div
                              style={{
                                fontWeight: '600',
                                fontSize: '18px',
                                color: 'black',
                              }}
                            >
                              {item.title} with something new
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            width: 'fit-content',
                            height: '100%',
                            padding: '0 24px',
                          }}
                        >
                          <div style={{ marginBottom: '6px' }}>Learner</div>
                          <div style={{ fontSize: '18px', fontWeight: '700', color: 'black' }}>
                            {item.student &&
                              `${item.student.firstname} ${
                                item.student.lastname ? item.student.lastname : ''
                              }`}
                          </div>
                        </div>
                        <div
                          style={{
                            width: 'fit-content',
                            height: '100%',
                            padding: '0 24px',
                          }}
                        >
                          <div style={{ marginBottom: '6px' }}>Location</div>
                          <div style={{ fontSize: '18px', fontWeight: '700', color: 'black' }}>
                            {item.location?.location}
                          </div>
                        </div>
                        <div
                          style={{
                            width: 'fit-content',
                            height: '100%',
                            marginLeft: 'auto',
                            alignSelf: 'flex-end',
                            flexDirection: 'column',
                          }}
                        >
                          <div>
                            <Tooltip title={item.note ? item.note : 'None'} trigger="click">
                              <Button style={{ fontWeight: '700', padding: 0 }} type="link">
                                <FileTextOutlined /> Note
                              </Button>
                            </Tooltip>
                          </div>
                          <div>
                            <Button
                              style={{ fontWeight: '700', padding: 0 }}
                              onClick={() => showFeedback(item.id)}
                              type="link"
                            >
                              Feedback
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <span style={{ fontSize: 18, margin: '24px auto', textAlign: 'center' }}>
              No upcoming appointments
            </span>
          )}
        </div>
      </Scrollbars>
    </>
  )
}

export default Upcoming

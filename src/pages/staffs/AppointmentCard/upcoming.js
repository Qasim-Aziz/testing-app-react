/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { connect, useSelector, useDispatch } from 'react-redux'
import { Card, Switch, Icon, Avatar, Tag, Tooltip, Button, Drawer, Tabs, Popconfirm } from 'antd'
import {
  EditOutlined,
  CheckCircleTwoTone,
  FileTextOutlined,
  DownCircleFilled,
  DownCircleTwoTone,
  DeleteOutlined,
  StarOutlined,
} from '@ant-design/icons'
import { Link, withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import moment from 'moment'
import '../style.scss'
import { useQuery, useLazyQuery } from 'react-apollo'
import { Scrollbars } from 'react-custom-scrollbars'
import LoadingComponent from 'components/LoadingComponent'
import SessionFeedbackForm from '../../sessionFeedback'

function Upcoming(props) {
  const { appointmentList, updateAppointment, upcoming } = props
  const dispatch = useDispatch()
  const [selectedAppointmentId, setSelectedAppointmentId] = useState('')
  const [feedbackDrawer, setFeedbackDrawer] = useState(false)
  const staffProfile = useSelector(state => state.staffs.StaffProfile)

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

  if (!appointmentList) {
    return <LoadingComponent />
  }

  const deleteItem = item => {
    dispatch({
      type: 'appointments/DELETE_APPOINTMENT',
      payload: {
        object: item,
      },
    })
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
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {appointmentList && appointmentList.length > 0 ? (
            appointmentList.map((item, idx) => {
              return (
                <div
                  key={item.id}
                  style={{ display: 'flex', height: '138px', paddingRight: '16px' }}
                >
                  <div
                    style={{
                      width: '9%',
                      alignItems: 'center',
                      display: 'flex',
                      position: 'relative',
                      flexDirection: 'column',
                    }}
                  >
                    <div
                      style={{
                        width: '5px',
                        backgroundColor: '#3f72af',
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
                      <DownCircleTwoTone twoToneColor="#3f72af" style={{ fontSize: 22 }} />
                    </div>
                  </div>
                  <div style={{ paddingTop: '16px', width: '91%' }}>
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
                            minWidth: '201px',
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
                              {item.title}
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
                            textAlign: 'right',
                            flexDirection: 'column',
                          }}
                        >
                          <div>
                            <Tooltip title={item.note ? item.note : 'None'} trigger="hover">
                              <Button size="small" type="link">
                                <FileTextOutlined style={{ fontWeight: '700' }} />
                              </Button>
                            </Tooltip>
                            <Button
                              size="small"
                              type="link"
                              onClick={() => updateAppointment(item.id)}
                            >
                              <EditOutlined style={{ fontWeight: '700' }} />
                            </Button>
                            <Popconfirm
                              placement="topLeft"
                              trigger="click"
                              title="Sure to delete this appointment"
                              onConfirm={() => deleteItem(item)}
                            >
                              <Button size="small" type="link">
                                <DeleteOutlined style={{ color: 'red', fontWeight: '700' }} />
                              </Button>
                            </Popconfirm>
                          </div>
                          <div className="feedback-icon">
                            <Button
                              size="small"
                              style={{ fontWeight: '700', marginTop: '8px', padding: 0 }}
                              onClick={() => showFeedback(item.id)}
                              type="link"
                            >
                              <StarOutlined style={{ fontWeight: '700' }} />
                              <StarOutlined style={{ fontWeight: '700' }} />
                              <StarOutlined style={{ fontWeight: '700' }} />
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
              {upcoming ? 'No upcoming appointments' : 'No post appointments'}
            </span>
          )}
        </div>
      </Scrollbars>
    </>
  )
}

export default Upcoming

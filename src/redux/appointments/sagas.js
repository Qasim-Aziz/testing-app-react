/* eslint-disable no-plusplus */
/* eslint-disable object-shorthand */
/* eslint-disable array-callback-return */
import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification, message } from 'antd'
import { getAppointments } from 'services/appointment'
import axios from 'axios'
import actions from './actions'

export function* GET_APPOINTMENT_LIST() {
  console.log('hey i got int')
  const response = yield call(getAppointments)
  console.log(response)
  if (response) {
    console.log(response, 'got resoinse')
    response.data.appointments.edges.map(item => {
      console.log(item.node.therapist.name)
      if (item.node.student) {
        console.log(item.node.student?.firstname)
      } else {
        console.log('null')
      }
    })
  } else {
    console.log('got error')
  }
}

export default function* rootSaga() {
  yield all([
    // GET_DATA(), // run once on app load to fetch menu data
    takeEvery(actions.GET_APPOINTMENT_LIST, GET_APPOINTMENT_LIST),
    // takeEvery(actions.GET_STAFF_DROPDOWNS, GET_STAFF_DROPDOWNS),
  ])
}

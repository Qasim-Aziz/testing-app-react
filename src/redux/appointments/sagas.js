/* eslint-disable no-plusplus */
/* eslint-disable object-shorthand */
/* eslint-disable array-callback-return */
import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification, message } from 'antd'
import { getAppointments, deleteAppointment } from 'services/appointment'
import axios from 'axios'
import actions from './actions'

export function* GET_APPOINTMENT_LIST() {
  console.log('hey i got int')
  yield put({
    type: actions.SET_STATE,
    payload: {
      appointmentsLoading: true,
    },
  })

  const response = yield call(getAppointments)
  console.log(response)
  if (response && response.data) {
    const tempList = response.data.appointments.edges.map(item => item.node)

    yield put({
      type: actions.SET_STATE,
      payload: { appointments: tempList, appointmentsLoading: false },
    })
  } else {
    console.log(response, 'Getting error in feching appointments')
    notification.error({
      message: 'Something went wrong',
      description: 'Unable to fetch appointments',
    })
  }
}

export function* CREATE_APPOINTMENT({ payload }) {
  const { response } = payload
  if (response && response.CreateAppointment) {
    // generating notification
    notification.success({
      message: 'Appointment Created Successfully',
    })

    yield put({
      type: actions.APPEND_APPOINTMENT_LIST,
      payload: {
        appointment: response.CreateAppointment.appointment,
      },
    })
  } else {
    notification.error({
      message: 'Something went wrong',
      description: 'Unable to update appointment in store',
    })
  }
}

export function* DELETE_APPOINTMENT({ payload }) {
  const response = yield call(deleteAppointment, payload)
  if (response.data && response.data.DeleteAppointment?.success) {
    notification.success({
      message: 'Appointment deleted successfully',
    })

    console.log(response, 'repsonse in sagfas')
    yield put({
      type: actions.UPDATE_APPOINTMENT_LIST,
      payload: {
        object: payload.object,
        removeItem: true,
      },
    })
  }
}

export function* EDIT_APPOINTMENT({ payload }) {
  console.log(payload)
  const { response } = payload
  if (response) {
    notification.success({
      message: 'Appointment updated successfully',
    })

    console.log(response, 'repsonse in sagfas')
    yield put({
      type: actions.UPDATE_APPOINTMENT_LIST,
      payload: {
        object: response.UpdateAppointment.appointment,
        editItem: true,
      },
    })
  }
}

export default function* rootSaga() {
  yield all([
    // GET_DATA(), // run once on app load to fetch menu data
    takeEvery(actions.GET_APPOINTMENT_LIST, GET_APPOINTMENT_LIST),
    takeEvery(actions.CREATE_APPOINTMENT, CREATE_APPOINTMENT),
    takeEvery(actions.DELETE_APPOINTMENT, DELETE_APPOINTMENT),
    takeEvery(actions.EDIT_APPOINTMENT, EDIT_APPOINTMENT),
  ])
}

/* eslint-disable no-plusplus */
import { all, takeEvery, put, call, select } from 'redux-saga/effects'
import { notification, message } from 'antd'
import { getPrescriptionFunc, createPrescriptionFunc } from 'services/prescriptions'
import axios from 'axios'
import actions from './actions'

export function* GET_PRESCRIPTIONS({ payload }) {
  yield put({
    type: 'leaders/SET_STATE',
    payload: {
      loadingPrescriptions: true,
    },
  })
  const response = yield call(getPrescriptionFunc, payload)
  console.log('THE RESPONSE', response)
  if (response) {
    console.log('response data inside sagas', response.data)
    console.log('SINCE IT EXPECTS OBJs', typeof response.data)
    yield put({
      type: actions.SET_STATE,
      payload: {
        PrescriptionsList: response.data.getPrescriptions.edges,
      },
    })
  }
  yield put({
    type: actions.SET_STATE,
    payload: {
      loadingPrescriptions: false,
    },
  })
}

export function* CREATE_PRESCRIPTIONS({ payload }) {
  console.log('PAYLOAD =====>', payload)
  /* [Explaination]
   * Here we will remove all the elements inside the meds array object 
      -   

  */

  yield put({
    type: 'leaders/SET_STATE',
    payload: {
      loadingPrescription: true,
    },
  })
  const response = yield call(createPrescriptionFunc, payload)
  console.log('THE RESPONSE', response)
  if (response) {
    console.log('response data inside sagas', response.data)
    console.log('SINCE IT EXPECTS OBJs', typeof response.data)
    const prescriptions = response.data
    console.log('THE PRESCRIPTIONS', prescriptions)
  }
  yield put({
    type: 'leaders/SET_STATE',
    payload: {
      loadingPrescription: false,
    },
  })
}

export default function* rootSaga() {
  yield all([
    // takeEvery(actions.GET_DATA, GET_DATA),
    takeEvery(actions.GET_PRESCRIPTIONS, GET_PRESCRIPTIONS),
    takeEvery(actions.CREATE_PRESCRIPTION, CREATE_PRESCRIPTIONS),
    // takeEvery(actions.EDIT_LEADER, EDIT_LEADER),
  ])
}

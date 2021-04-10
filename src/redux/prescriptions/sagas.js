/* eslint-disable no-plusplus */
import { all, takeEvery, put, call, select } from 'redux-saga/effects'
import { notification, message } from 'antd'
import {
  getPrescriptionFunc,
  createPrescriptionFunc,
  getLatestPrescription,
} from 'services/prescriptions'
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

export function* GET_LASTEST_PRESCRIPTIONS({ payload }) {
  console.log('THE SAGAS FOR THE SAME RAN', payload)
  yield put({
    type: 'leaders/SET_STATE',
    payload: {
      loadingPrescriptions: true,
    },
  })
  const response = yield call(getLatestPrescription, payload)
  console.log('THE RESPONSE', response)
  if (response) {
    console.log('response data inside sagas', response.data)
    const prescriptions = response.data
    console.log('THE PRESCRIPTIONS', prescriptions)
    yield put({
      type: actions.SET_STATE,
      payload: {
        SpecificPrescription: response.data.getPrescriptions.edges[0],
        isSpecificPrescription: true,
        // complaintsList: response.data.getPrescriptionComplaints.edges,
        // diagnosisList: response.data.getPrescriptionDiagnosis.edges,
        // testsList: response.data.getPrescriptionTests.edges,
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
    takeEvery(actions.GET_LASTEST_PRESCRIPTIONS, GET_LASTEST_PRESCRIPTIONS),
    // takeEvery(actions.EDIT_LEADER, EDIT_LEADER),
  ])
}

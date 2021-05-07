/* eslint-disable no-plusplus */
import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification } from 'antd'
import {
  getPrescriptionFunc,
  createPrescriptionFunc,
  getLatestPrescription,
  getDetailPrescription,
  editAndSavePrescription,
  deletePrescription,
} from 'services/prescriptions'
import actions from './actions'

export function* SET_SELECTED_LEARNER({ learner }) {
  yield put({
    type: actions.SET_SPECIFIC_LEARNER,
    payload: {
      GlobalSpecificLearner: learner,
    },
  })
}

export function* GET_PRESCRIPTIONS({ payload }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loadingPrescriptions: true,
    },
  })
  const response = yield call(getPrescriptionFunc, payload)
  const tempList = response.data.getPrescriptions.edges
  tempList.reverse()
  if (response) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        PrescriptionsList: tempList,
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
  yield put({
    type: actions.SET_STATE,
    payload: {
      loadingPrescriptions: true,
    },
  })
  const response = yield call(getLatestPrescription, payload)
  if (response) {
    const prescriptions = response.data
    if (response.data.getPrescriptions.edges.length > 0) {
      yield put({
        type: actions.SET_STATE,
        payload: {
          SpecificPrescription: response.data.getPrescriptions.edges[0].node,
          isSpecificPrescription: true,
        },
      })
    } else {
      yield put({
        type: actions.SET_STATE,
        payload: {
          SpecificPrescription: {},
          isSpecificPrescription: false,
        },
      })
    }
  }
  yield put({
    type: actions.SET_STATE,
    payload: {
      loadingPrescriptions: false,
    },
  })
}

export function* CREATE_PRESCRIPTIONS({ payload }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loadingPrescription: true,
    },
  })
  const response = yield call(createPrescriptionFunc, payload)
  if (response && response.data) {
    notification.success({
      message: 'PRESCRIPTION Created Successfully',
    })
    const prescriptions = response.data.createPrescription.details
    yield put({
      type: actions.APPEND_PRESCRIPTIONS_LIST,
      payload: {
        prescription: { node: prescriptions },
      },
    })
    yield put({
      type: actions.SET_STATE,
      payload: {
        SpecificPrescription: prescriptions,
        isSpecificPrescription: true,
      },
    })
  }
  yield put({
    type: actions.SET_STATE,
    payload: {
      loadingPrescription: false,
    },
  })
}

export function* GET_DETAILS_PRESCRIPTIONS({ payload }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loadingPrescription: true,
    },
  })
  const response = yield call(getDetailPrescription, payload)
  if (response && response.data) {
    notification.success({
      message: 'PRESCRIPTION FETCHED',
    })
    const prescriptions = response.data.getPrescriptionDetail
    yield put({
      type: actions.SET_STATE,
      payload: {
        SpecificPrescription: prescriptions,
        isSpecificPrescription: true,
      },
    })
  }
  yield put({
    type: actions.SET_STATE,
    payload: {
      loadingPrescription: false,
    },
  })
}
export function* EDIT_PRESCRIPTION({ payload }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loadingPrescription: true,
    },
  })
  const response = yield call(editAndSavePrescription, payload)
  if (response && response.data) {
    notification.success({
      message: 'PRESCRIPTION UPDATED SUCCESSFULLY',
    })
    const prescriptions = response.data.updatePrescription.details
    yield put({
      type: actions.SET_STATE,
      payload: {
        SpecificPrescription: prescriptions,
        isSpecificPrescription: true,
      },
    })
    yield put({
      type: actions.UPDATE_PRESCRIPTIONS_LIST,
      payload: {
        prescription: prescriptions, // { node: prescriptions },
      },
    })
  }
  yield put({
    type: actions.SET_STATE,
    payload: {
      loadingPrescription: false,
    },
  })
}

export function* DELETE_PRESCRIPTION({ payload }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loadingPrescription: true,
    },
  })
  const response = yield call(deletePrescription, payload)
  if (response && response.data) {
    notification.success({
      message: 'PRESCRIPTION DELTED SUCCESSFULLY',
    })
    yield put({
      type: actions.DELETE_PRESCRIPTION_IN_LIST,
      payload: {
        item_id: payload.value,
      },
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_PRESCRIPTIONS, GET_PRESCRIPTIONS),
    takeEvery(actions.CREATE_PRESCRIPTION, CREATE_PRESCRIPTIONS),
    takeEvery(actions.GET_LASTEST_PRESCRIPTIONS, GET_LASTEST_PRESCRIPTIONS),
    takeEvery(actions.GET_DETAILS_PRESCRIPTIONS, GET_DETAILS_PRESCRIPTIONS),
    takeEvery(actions.EDIT_PRESCRIPTION, EDIT_PRESCRIPTION),
    takeEvery(actions.DELETE_PRESCRIPTION, DELETE_PRESCRIPTION),
    // takeEvery(actions.SET_SELECTED_LEARNER, SET_SELECTED_LEARNER),
  ])
}

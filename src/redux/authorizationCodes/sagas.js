/* eslint-disable no-plusplus */
import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification } from 'antd'
import {
  activeInactiveAuthenticationCode,
  createAuthorizationCode,
  updateAuthorizationCode,
  createFeeScheduleRate,
  updateFeeScheduleRate,
  updateStaffDriveRate,
} from 'services/authorizationCodes'
import actions from './actions'

export function* CREATE_AUTHORIZATION_CODE({ payload }) {
  const response = yield call(createAuthorizationCode, payload)
  if (response && response.data) {
    notification.success({
      message: 'Authorization Code Created Successfully',
    })
  }
}

export function* CREATE_FEE_SCHEDULE({ payload }) {
  const response = yield call(createFeeScheduleRate, payload)
  if (response && response.data) {
    notification.success({
      message: 'Fee Schedule Created Successfully',
    })
  }
}

export function* EDIT_AUTHORIZATION_CODE({ payload }) {
  const response = yield call(updateAuthorizationCode, payload)
  if (response && response.data) {
    notification.success({
      message: 'Authorization code Updated Successfully',
    })
  }
}

export function* EDIT_FEE_SCHEDULE({ payload }) {
  const response = yield call(updateFeeScheduleRate, payload)
  if (response && response.data) {
    notification.success({
      message: 'Fee Schedule Updated Successfully',
    })
  }
}

export function* EDIT_STAFF_DRIVE_RATE({ payload }) {
  const response = yield call(updateStaffDriveRate, payload)
  if (response && response.data) {
    notification.success({
      message: 'Staff Drive rate Updated Successfully',
    })
  }
}

export function* ACTIVE_INACTIVE_AUTHORIZATION_CODE({ payload }) {
  const response = yield call(activeInactiveAuthenticationCode, payload)
  if (response && response.data) {
    if (payload.isActive === true) {
      notification.success({
        message: 'Authorization code Activated Successfully',
      })
    } else {
      notification.success({
        message: 'Authorization code Deactivated Successfully',
      })
    }
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.CREATE_AUTHORIZATION_CODE, CREATE_AUTHORIZATION_CODE),
    takeEvery(actions.EDIT_AUTHORIZATION_CODE, EDIT_AUTHORIZATION_CODE),
    takeEvery(actions.CREATE_FEE_SCHEDULE, CREATE_FEE_SCHEDULE),
    takeEvery(actions.EDIT_FEE_SCHEDULE, EDIT_FEE_SCHEDULE),
    takeEvery(actions.AUTHORIZATION_CODES_ACTIVE_INACTIVE, ACTIVE_INACTIVE_AUTHORIZATION_CODE),
  ])
}

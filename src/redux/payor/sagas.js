/* eslint-disable no-plusplus */
import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification } from 'antd'
import { createPayor, updatePayor, activeInactivePayor } from 'services/payor'
import actions from './actions'

export function* CREATE_PAYOR({ payload }) {
  const response = yield call(createPayor, payload)
  if (response && response.data) {
    // generating notification
    notification.success({
      message: 'Payor Created Successfully',
    })
  }
}

export function* EDIT_PAYOR({ payload }) {
  const response = yield call(updatePayor, payload)

  if (response && response.data) {
    notification.success({
      message: 'Payor Updated Successfully',
    })
  }
}

export function* ACTIVE_INACTIVE_PAYOR({ payload }) {
  const response = yield call(activeInactivePayor, payload)

  if (response && response.data) {
    if (payload.isActive === true) {
      notification.success({
        message: 'Payor Activated Successfully',
      })
    } else {
      notification.success({
        message: 'Payor Deactivated Successfully',
      })
    }
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.CREATE_PAYOR, CREATE_PAYOR),
    takeEvery(actions.EDIT_PAYOR, EDIT_PAYOR),
    takeEvery(actions.PAYOR_ACTIVE_INACTIVE, ACTIVE_INACTIVE_PAYOR),
  ])
}

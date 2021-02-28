/* eslint-disable no-plusplus */
import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification } from 'antd'
import { createPayor, updatePayor, activeInactivePayor, uploadPayorDocument } from 'services/payor'
import actions from './actions'

export function* CREATE_PAYOR({ payload }) {
  const response = yield call(createPayor, payload)
  if (response && response.data) {
    notification.success({
      message: 'Payor Created Successfully',
    })

    // Upload Documents
    const docsResponse = yield call(uploadPayorDocument, {
      fileList: payload.fileList,
      payorId: response.data.createPayor.details.id,
    })

    if (docsResponse && docsResponse.message === 'OK') {
      if (docsResponse.fileUrl.length) {
        notification.success({
          message: 'Document added to Payor successfully.',
        })
      }
    } else {
      notification.error({
        message: 'An error occurred to upload Document.',
        description: docsResponse.message,
      })
    }
  }
}

export function* EDIT_PAYOR({ payload }) {
  const response = yield call(updatePayor, payload)

  if (response && response.data) {
    notification.success({
      message: 'Payor Updated Successfully',
    })

    // Upload Documents
    const docsResponse = yield call(uploadPayorDocument, {
      fileList: payload.fileList,
      payorId: payload.id,
    })

    if (docsResponse && docsResponse.message === 'OK') {
      notification.success({
        message: 'Document added to Payor successfully.',
      })
    } else {
      notification.error({
        message: 'An error occurred to upload Document.',
        description: docsResponse.message,
      })
    }
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

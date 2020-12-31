/* eslint-disable no-plusplus */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
import { all, put, takeEvery, call } from 'redux-saga/effects'
import actions from './actions'

export function* UPDATE_TARGET_STATUS_RESPONSE({ payload }) {
  yield put({
    type: 'datarecording/SET_STATE',
    payload: {
      Loading: true,
    },
  })
}

export default function* rootSaga() {
  yield all([takeEvery(actions.UPDATE_LONG_TERM_LIST, UPDATE_TARGET_STATUS_RESPONSE)])
}

/* eslint-disable no-plusplus */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
import { all, put, takeEvery, call } from 'redux-saga/effects'
import {
  getStudentDetails,
} from 'services/student'
import actions from './actions'

export function* SOME_FUNCTION({ payload }) {
  yield put({
    type: 'student/SET_STATE',
    payload: {
      Loading: true,
    },
  })
}

export function* STUDENT_DETAILS() {
  const response = yield call(getStudentDetails)
  if (response){
    yield put({
      type: 'student/SET_STATE',
      payload: {
        StudentName: response.data.student.firstname,
      },
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.SOME_FUNCTION, SOME_FUNCTION),
    takeEvery(actions.STUDENT_DETAILS, STUDENT_DETAILS)
  ])
}

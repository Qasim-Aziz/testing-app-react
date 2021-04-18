/* eslint-disable no-plusplus */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
import { all, put, takeEvery, call, select } from 'redux-saga/effects'
import { getData } from 'services/learnersprogram'
import actions from './actions'
import { notNull } from '../../utilities'

export function* LOAD_DATA() {
  yield put({
    type: 'learnersprogram/SET_STATE',
    payload: {
      Loading: true,
    },
  })

  const response = yield call(getData)
  console.log(response, 'learner resonse got called caleed')
  if (response && response.data) {
    yield put({
      type: 'learnersprogram/SET_STATE',
      payload: {
        Loading: false,
        Learners: response.data.students.edges,
        CloneLearners: response.data.students.edges,
        ProgramAreas: response.data.programArea.edges,
      },
    })

    const std = localStorage.getItem('studentId')
    if (std === null) {
      if (response.data.students.edges.length > 0) {
        localStorage.setItem('studentId', JSON.stringify(response.data.students.edges[0].node.id))
        yield put({
          type: 'learnersprogram/SET_STATE',
          payload: {
            SelectedLearnerId: response.data.students.edges[0].node.id,
          },
        })
        yield put({
          type: 'student/STUDENT_DETAILS',
        })
      }
    }
  }

  yield put({
    type: 'learnersprogram/SET_STATE',
    payload: {
      Loading: false,
    },
  })
}

export default function* rootSaga() {
  yield all([takeEvery(actions.LOAD_DATA, LOAD_DATA)])
}

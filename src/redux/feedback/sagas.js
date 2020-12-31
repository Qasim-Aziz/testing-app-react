/* eslint-disable no-plusplus */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
import { all, put, takeEvery, call, select } from 'redux-saga/effects'
import { notification } from 'antd'
import { getQuestions, feedbackSubmit, updateFeedbackSubmit } from 'services/feedback'
import actions from './actions'

export function* GET_QUESTIONS({payload}) {
  yield put({
    type: 'feedback/SET_STATE',
    payload: {
      Loading: true,
    },
  })

  const appointId = yield select(state => state.feedback.AppointmnetId)
  const response = yield call(getQuestions, {appointmentId: appointId})
  const parentQus = []
  const therapistQus = []
  if (response) {
    const edges = response.data.feedbackQuestions.edges
    if (edges.length > 0){
      for(let i=0; i< edges.length; i++){
        if(edges[i].node.group.name === 'parents'){
          parentQus.push(edges[i])
        }
        if(edges[i].node.group.name === 'therapist'){
          therapistQus.push(edges[i])
        }
      }
    }

    yield put({
      type: 'feedback/SET_STATE',
      payload: {
        ParentQuestions: parentQus,
        TherapistQuestions: therapistQus
      },
    })
  }

  yield put({
    type: 'feedback/SET_STATE',
    payload: {
      Loading: false,
    },
  })

}

export function* FEEDBACK_SUBMIT({payload}) {
  yield put({
    type: 'feedback/SET_STATE',
    payload: {
      SubmitLoading: true,
    },
  })

  const appointId = yield select(state => state.feedback.AppointmnetId)
  if (payload.update){
    const response = yield call(updateFeedbackSubmit, {appointmentId: appointId, ansList: payload.answers})
    if (response && response.data) {
      notification.success({
        message: 'Feedback',
        description: response.data.UpdateAppointmentFeedback.message,
      })
    }
  }
  else{
    const response = yield call(feedbackSubmit, {appointmentId: appointId, ansList: payload.answers})
    if (response && response.data) {
      notification.success({
        message: 'Feedback',
        description: response.data.CreateAppointmentFeedback.message,
      })
    }
  }


  yield put({
    type: 'feedback/SET_STATE',
    payload: {
      SubmitLoading: false,
    },
  })

}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_QUESTIONS, GET_QUESTIONS),
    takeEvery(actions.FEEDBACK_SUBMIT, FEEDBACK_SUBMIT),
  ])
}

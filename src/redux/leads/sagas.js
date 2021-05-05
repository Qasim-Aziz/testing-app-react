/* eslint-disable no-plusplus */
/* eslint-disable object-shorthand */
/* eslint-disable dot-notation */
/* eslint-disable prefer-const */
/* eslint-disable */

import { all, takeEvery, put, call, select } from 'redux-saga/effects'
import { notification, message } from 'antd'
import { getLeaders, createLeader, updateLeader } from 'services/leaders'
import axios from 'axios'
import actions from './actions'
import { responsePathAsArray } from 'graphql'

export function* GET_DATA() {
  yield put({
    type: 'leaders/SET_STATE',
    payload: {
      loading: true,
      LeadersList: [],
      // cateroryList: [],
      // languageList: [],
      // clinicLocationList: [],
      // staffDropdownList: [],
      UserProfile: null,
      isUserProfile: false,
      TotalLeaders: 0,
      PageInfo: null,
    },
  })

  yield put({
    type: 'leaders/GET_LEADERS',
    // payload: {
    //   isActive: true,
    //   first: 10,
    //   after: null,
    //   before: null,
    // },
  })

  yield put({
    type: 'leaders/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* GET_LEADERS({ payload }) {
  yield put({
    type: 'leaders/SET_STATE',
    payload: {
      loadingLeaders: true,
    },
  })
  const response = yield call(getLeaders, payload)

  if (response) {
    console.log('THE RESPONSE', response)
    let leaders = []
    let i = 0
    let res_array = response.data.leads
    leaders = response.data.leads

    yield put({
      type: 'leaders/SET_STATE',
      payload: {
        LeadersList: leaders,
        TotalLeaders: 6, //random value
        PageInfo: 'I dont know what this is', //random value
      },
    })
  }
  yield put({
    type: 'leaders/SET_STATE',
    payload: {
      loadingLeaders: false,
    },
  })
}

export function* CREATE_LEADER({ payload }) {
  const response = yield call(createLeader, payload)
  if (response && response.data) {
    notification.success({
      message: 'Lead Created Successfully',
    })
  }
  const resObject = yield call(getLeaders, payload)

  yield put({
    type: 'leaders/SET_STATE',
    payload: {
      LeadersList: resObject.data.leads,
      TotalLeaders: 6, //random value
      PageInfo: 'I dont know what this is', //random value
    },
  })
}

export function* EDIT_LEADER({ payload }) {
  const response = yield call(updateLeader, payload)
  if (response && response.data) {
    notification.success({
      message: 'Lead Update Successfully',
    })

    const resObject = yield call(getLeaders, payload)

    yield put({
      type: 'leaders/SET_STATE',
      payload: {
        LeadersList: resObject.data.leads,
        TotalLeaders: 6, //random value
        PageInfo: 'I dont know what this is', //random value
      },
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_DATA, GET_DATA),
    takeEvery(actions.GET_LEADERS, GET_LEADERS),
    takeEvery(actions.CREATE_LEADER, CREATE_LEADER),
    takeEvery(actions.EDIT_LEADER, EDIT_LEADER),
  ])
}

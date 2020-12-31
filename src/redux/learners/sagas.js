/* eslint-disable no-plusplus */
/* eslint-disable object-shorthand */
/* eslint-disable dot-notation */
/* eslint-disable prefer-const */
import { all, takeEvery, put, call, select } from 'redux-saga/effects'
import { notification, message } from 'antd'
import {
  getClinicLearners,
  updateLearner,
  createLearner,
  getLearnersDropdown,
  learnerActiveInactive,
  createLearnersProgram,
} from 'services/learners'
import axios from 'axios'
import actions from './actions'

export function* GET_DATA() {
  yield put({
    type: 'learners/SET_STATE',
    payload: {
      loading: true,
      LearnersList: [],
      categoryList: [],
      languageList: [],
      clinicLocationList: [],
      staffDropdownList: [],
      UserProfile: null,
      isUserProfile: false,
      TotalLearners: 0,
      PageInfo: null
    },
  })

  yield put({
    type: 'learners/GET_LEARNERS',
    payload: {
      isActive: true,
      first: 10,
      after: null,
      before: null,
    },
  })

  yield put({
    type: 'learners/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* GET_LEARNERS({ payload }) {
  yield put({
    type: 'learners/SET_STATE',
    payload: {
      loadingLearners: true,
    },
  })
  const response = yield call(getClinicLearners, payload)

  if (response) {
    const learners = []
    let i = 0
    if (response.data.students.edges.length > 0) {
      for (i = 0; i < response.data.students.edges.length; i++) {
        learners.push(response.data.students.edges[i].node)
      }
    }

    yield put({
      type: 'learners/SET_STATE',
      payload: {
        LearnersList: learners,
        TotalLearners: response.data.students.clinicTotal,
        PageInfo: response.data.students.pageInfo
      },
    })
  }
  yield put({
    type: 'learners/SET_STATE',
    payload: {
      loadingLearners: false,
    },
  })
}

export function* PAGE_CHANGED({ payload }) {
  yield put({
    type: 'learners/SET_STATE',
    payload: {
      loadingLearners: true,
    },
  })
  const pageInfo = yield select(state => state.learners.PageInfo)
  const status = yield select(state => state.learners.CurrentStatus)
  const perPage = yield select(state => state.learners.ItemPerPage)
  let active = null
  if (status === 'all') active = null
  if (status === 'active') active = true
  if (status === 'in-active') active = false

  const currentPage = yield select(state => state.learners.CurrentPage)
  let after = null
  let before = null
  let last = null
  let first = perPage

  if (payload.page === 1){
    after = null
    before = null
  }
  else if(payload.page >= payload.rows/perPage){
    after  = null
    before = null
    first = null
    last = payload.rows % perPage
  }
  else if(payload.page > currentPage){
    console.log('trriger after', payload.page, currentPage)
    after = pageInfo.endCursor
  }
  else if (payload.page < currentPage){
    console.log('trriger before', payload.page, currentPage)
    before = pageInfo.startCursor
  }
  
  // if (pageInfo){
  //   after = pageInfo.endCursor
  // }
  
  const response = yield call(getClinicLearners, {isActive: active, first, after, before, last})
  
  const oldLearners = []
  if (response) {
    let i = 0
    if (response.data.students.edges.length > 0) {
      for (i = 0; i < response.data.students.edges.length; i++) {
        oldLearners.push(response.data.students.edges[i].node)
      }
    }

    yield put({
      type: 'learners/SET_STATE',
      payload: {
        LearnersList: oldLearners,
        TotalLearners: response.data.students.clinicTotal,
        PageInfo: response.data.students.pageInfo,
        CurrentPage: payload.page
      },
    })
  }
  yield put({
    type: 'learners/SET_STATE',
    payload: {
      loadingLearners: false,
    },
  })
}

export function* ROWS_CHANGED({ payload }) {
  yield put({
    type: 'learners/SET_STATE',
    payload: {
      loadingLearners: true,
    },
  })
  const pageInfo = yield select(state => state.learners.PageInfo)
  const status = yield select(state => state.learners.CurrentStatus)
  // const perPage = yield select(state => state.learners.ItemPerPage)
  const totalLearners = yield select(state => state.learners.TotalLearners)
  let active = null
  if (status === 'all') active = null
  if (status === 'active') active = true
  if (status === 'in-active') active = false

  let after = null
  let before = null
  let last = null
  let first = payload.currentRowsPerPage

  if (payload.currentPage === 1){
    after = null
    before = null
  }
  else if(payload.currentPage >= totalLearners/payload.currentRowsPerPage){
    after  = null
    before = null
    first = null
    last = totalLearners % payload.currentRowsPerPage
  }
  
  // if (pageInfo){
  //   after = pageInfo.endCursor
  // }
  
  const response = yield call(getClinicLearners, {isActive: active, first, after, before, last})
  
  const oldLearners = []
  if (response) {
    let i = 0
    if (response.data.students.edges.length > 0) {
      for (i = 0; i < response.data.students.edges.length; i++) {
        oldLearners.push(response.data.students.edges[i].node)
      }
    }

    yield put({
      type: 'learners/SET_STATE',
      payload: {
        LearnersList: oldLearners,
        TotalLearners: response.data.students.clinicTotal,
        PageInfo: response.data.students.pageInfo,
        CurrentPage: 1,
        ItemPerPage: payload.currentRowsPerPage,
      },
    })
  }
  yield put({
    type: 'learners/SET_STATE',
    payload: {
      loadingLearners: false,
    },
  })
}

export function* GET_LEARNERS_DROPDOWNS() {
  const response = yield call(getLearnersDropdown)

  if (response && response.data) {
    yield put({
      type: 'learners/SET_STATE',
      payload: {
        categoryList: response.data.category,
        clinicLocationList: response.data.schoolLocation.edges,
        staffDropdownList: response.data.staffs.edges,
        languageList: response.data.languages,
      },
    })
  }
}

export function* EDIT_LEARNER({ payload }) {
  const response = yield call(updateLearner, payload)

  if (response && response.data) {
    notification.success({
      message: 'Learner Updated Successfully',
    })

    yield put({
      type: 'learners/UPDATE_LERNERS_LIST',
      payload: {
        object: response.data.updateStudent.student,
      },
    })

    yield put({
      type: 'learners/SET_STATE',
      payload: {
        UserProfile: response.data.updateStudent.student,
      },
    })
  }
}

export function* CREATE_LEARNER({ payload }) {
  const response = yield call(createLearner, payload)

  if (response && response.data) {
    // generating notification
    notification.success({
      message: 'Learner Created Successfully',
    })

    console.log('CREATE_LEARNER')
    console.log(response)
    console.log(payload.data.get('file'))
    console.log(response.data.createStudent)
    console.log(response.data.createStudent.student)

    let token = ''
    if (!(localStorage.getItem('token') === null) && localStorage.getItem('token')) {
      token = JSON.parse(localStorage.getItem('token'))
    }
    const headers = {
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
      database: 'india',
      Authorization: token ? `JWT ${token}` : '',
    }
    payload.data.append('pk', response.data.createStudent.student.id)
    axios
      .post('https://application.cogniable.us/apis/student-docs/', payload.data, {
        headers: headers,
      })
      .then(res => {
        // then print response status
        console.log(res.statusText)
        message.success('Upload Successfully.')
      })
      .catch(err1 => {
        console.error({ err1 })
        message.error('upload Failed.')
        return false
      })

    yield put({
      type: 'learners/APPEND_LERNERS_LIST',
      payload: {
        student: response.data.createStudent.student,
      },
    })

    if (payload.values.program !== '') {
      const programResponse = yield call(createLearnersProgram, {
        id: response.data.createStudent.student.id,
        program: payload.values.program,
      })

      if (programResponse && programResponse.data) {
        notification.success({
          message: programResponse.data.createProgramsByLevel.msg,
        })
      }
    }
  }
}

export function* LEARNER_ACTIVE_INACTIVE({ payload }) {
  const response = yield call(learnerActiveInactive, payload)

  if (response && response.data) {
    // generating notification
    console.log(response.data.updateStudent.student)
    if (payload.checked === true) {
      notification.success({
        message: 'Learner Activated Successfully',
      })
    } else {
      notification.success({
        message: 'Learner Deactivated Successfully',
      })
    }

    yield put({
      type: 'learners/UPDATE_LEARNER_ACTIVE_INACTIVE',
      payload: {
        student: response.data.updateStudent.student,
      },
    })
  }
}

export default function* rootSaga() {
  yield all([
    // GET_DATA(), // run once on app load to fetch menu data
    takeEvery(actions.GET_DATA, GET_DATA),
    takeEvery(actions.GET_LEARNERS, GET_LEARNERS),
    takeEvery(actions.GET_LEARNERS_DROPDOWNS, GET_LEARNERS_DROPDOWNS),
    takeEvery(actions.EDIT_LEARNER, EDIT_LEARNER),
    takeEvery(actions.CREATE_LEARNER, CREATE_LEARNER),
    takeEvery(actions.LEARNER_ACTIVE_INACTIVE, LEARNER_ACTIVE_INACTIVE),
    takeEvery(actions.PAGE_CHANGED, PAGE_CHANGED),
    takeEvery(actions.ROWS_CHANGED, ROWS_CHANGED),

  ])
}

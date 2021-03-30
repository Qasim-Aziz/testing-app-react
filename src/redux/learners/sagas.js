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
  getLearner,
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
      PageInfo: null,
    },
  })

  yield put({
    type: 'learners/GET_LEARNERS',
    payload: {
      isActive: null,
      first: 20,
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
    console.log(response, 'in res 11')
    if (response.data.students.edges && response.data.students.edges.length > 0) {
      console.log(response, 'in res 22')
      for (i = 0; i < response.data.students.edges.length; i++) {
        if (
          response.data.students.edges[i].node.tags.edges &&
          response.data.students.edges[i].node.tags.edges.length > 0
        ) {
          console.log(response, 'in res 33')
          const tempTagArr = response.data.students.edges[i].node.tags.edges.map(e => e.node.name)
          response.data.students.edges[i].node.tags = tempTagArr
        }

        learners.push(response.data.students.edges[i].node)
      }
    }

    yield put({
      type: 'learners/SET_STATE',
      payload: {
        LearnersList: learners,
        TotalLearners: response.data.students.clinicTotal,
        PageInfo: response.data.students.pageInfo,
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

  if (payload.page === 1) {
    after = null
    before = null
  } else if (payload.page >= payload.rows / perPage) {
    after = null
    before = null
    first = null
    last = payload.rows % perPage
  } else if (payload.page > currentPage) {
    after = pageInfo.endCursor
  } else if (payload.page < currentPage) {
    before = pageInfo.startCursor
  }

  // if (pageInfo){
  //   after = pageInfo.endCursor
  // }

  console.log(active, first, after, before, last, 'in row changes')
  const response = yield call(getClinicLearners, { isActive: active, first, after, before, last })

  const oldLearners = []
  if (response) {
    let i = 0
    if (response.data.students.edges.length > 0) {
      for (i = 0; i < response.data.students.edges.length; i++) {
        if (response.data.students.edges[i].node.tags.edges.length > 0) {
          const tempTagArr = response.data.students.edges[i].node.tags.edges.map(e => e.node.name)
          response.data.students.edges[i].node.tags = tempTagArr
        }
        oldLearners.push(response.data.students.edges[i].node)
      }
    }

    yield put({
      type: 'learners/SET_STATE',
      payload: {
        LearnersList: oldLearners,
        TotalLearners: response.data.students.clinicTotal,
        PageInfo: response.data.students.pageInfo,
        CurrentPage: payload.page,
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

  if (payload.currentPage === 1) {
    after = null
    before = null
  } else if (payload.currentPage >= totalLearners / payload.currentRowsPerPage) {
    after = null
    before = null
    first = null
    last = totalLearners % payload.currentRowsPerPage
  }

  const response = yield call(getClinicLearners, { isActive: active, first, after, before, last })

  const oldLearners = []
  if (response) {
    let i = 0
    if (response.data.students.edges.length > 0) {
      for (i = 0; i < response.data.students.edges.length; i++) {
        if (
          response.data.students.edges[i].node.tags.edges &&
          response.data.students.edges[i].node.tags.edges.length > 0
        ) {
          const tempTagArr = response.data.students.edges[i].node.tags.edges.map(e => e.node.name)
          response.data.students.edges[i].node.tags = tempTagArr
        }

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

export function* EDIT_GENERAL_INFO({ payload }) {
  const { response } = payload
  if (response && response.data) {
    notification.success({
      message: 'Learner Updated Successfully',
    })

    let updatedLearner = response.data.updateStudent.student
    if (response.data.updateStudent.student) {
      if (response.data.updateStudent.student.tags.edges.length > 0) {
        const tempTagArr = response.data.updateStudent.student.tags.edges.map(e => e.node.name)
        updatedLearner = { ...updatedLearner, tags: tempTagArr }
      } else {
        updatedLearner = { ...updatedLearner, tags: [] }
      }

      console.log(response.data.updateStudent.student.allergicTo)

      if (
        response.data.updateStudent.student.allergicTo?.edges &&
        response.data.updateStudent.student.allergicTo?.edges.length > 0
      ) {
        const tempAllergyArr = response.data.updateStudent.student.allergicTo?.edges.map(
          e => e.node.name,
        )
        updatedLearner = { ...updatedLearner, allergicTo: tempAllergyArr }
      } else {
        updatedLearner = { ...updatedLearner, allergicTo: [] }
      }
    }

    const obj = {
      id: updatedLearner.id,
      caseManager: updatedLearner.caseManager,
      category: updatedLearner.category,
      email: updatedLearner.email,
      firstname: updatedLearner.firstname,
      lastname: updatedLearner.lastname,
      gender: updatedLearner.gender,
      isActive: updatedLearner.isActive,
      mobileno: updatedLearner.mobileno,
      parentMobile: updatedLearner.parentMobile,
      tags: updatedLearner.tags,
    }

    console.log(response, 'response')
    console.log(updatedLearner, obj, 'updated kjfbsdf ksf')
    yield put({
      type: 'learners/UPDATE_LERNERS_LIST',
      payload: {
        object: obj,
      },
    })

    yield put({
      type: 'learners/SET_STATE',
      payload: {
        UserProfile: updatedLearner,
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

    let updatedLearner = response.data.updateStudent.student
    if (response.data.updateStudent.student) {
      if (response.data.updateStudent.student.tags.edges.length > 0) {
        const tempTagArr = response.data.updateStudent.student.tags.edges.map(e => e.node.name)
        updatedLearner = { ...updatedLearner, tags: tempTagArr }
      }
      if (
        response.data.updateStudent.student.allergicTo?.edges &&
        response.data.updateStudent.student.allergicTo?.edges.length > 0
      ) {
        const tempAllergyArr = response.data.updateStudent.student.allergicTo?.edges.map(
          e => e.node.name,
        )
        updatedLearner = { ...updatedLearner, allergicTo: tempAllergyArr }
      }
    }

    yield put({
      type: 'learners/UPDATE_LERNERS_LIST',
      payload: {
        object: updatedLearner,
      },
    })

    yield put({
      type: 'learners/SET_STATE',
      payload: {
        UserProfile: updatedLearner,
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

export function* GET_SINGLE_LEARNER({ payload }) {
  const response = yield call(getLearner, payload.UserProfile)

  if (response && response.data) {
    // generating notification
    const userData = {
      ...response.data.student,
      tags: response.data.student.tags
        ? response.data.student.tags.edges.map(item => item.node.name)
        : [],
      allergicTo: response.data.student.allergicTo
        ? response.data.student.allergicTo.edges.map(item => item.node.name)
        : [],
    }

    yield put({
      type: 'learners/SET_STATE',
      payload: {
        UserProfile: userData,
        isUserProfile: true,
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
    takeEvery(actions.GET_SINGLE_LEARNER, GET_SINGLE_LEARNER),
    takeEvery(actions.EDIT_GENERAL_INFO, EDIT_GENERAL_INFO),
  ])
}

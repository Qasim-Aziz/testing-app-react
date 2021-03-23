import { all, takeEvery, put, call } from 'redux-saga/effects'
// import { push } from 'react-router-redux';
// import { notification } from 'antd'
import {
  login,
  RefreshToken,
  StudentIdFromUserId,
  GetUserDetailsByUsername,
  logout,
  GetStudentNameById,
  StaffIdFromUserId,
  clinicDetails,
} from 'services/user'
// import { GraphQLClient } from 'graphql-request'
import actions from './actions'

export function* LOGIN({ payload }) {
  console.log('entered')
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const response = yield call(login, payload)

  if (response) {
    yield put({
      type: 'user/SET_STATE',
      payload: {
        id: response.tokenAuth.user.id,
        authorized: true,
        loading: false,
        role:
          response.tokenAuth.user.groups.edges.length > 0
            ? response.tokenAuth.user.groups.edges[0].node.name
            : '',
      },
    })

    if (response.tokenAuth.user.groups.edges.length > 0) {
      if (response.tokenAuth.user.groups.edges[0].node.name === 'parents') {
        console.log(response.tokenAuth.user, 'this is login bitch')
        localStorage.setItem(
          'studentId',
          JSON.stringify(response.tokenAuth.user.studentsSet.edges[0].node.id),
        )
        localStorage.setItem(
          'userId',
          JSON.stringify(response.tokenAuth.user.studentsSet.edges[0].node.parent.id),
        )
        yield put({
          type: 'user/SET_STATE',
          payload: {
            studentId: response.tokenAuth.user.studentsSet.edges[0].node.id,
            parentName: response.tokenAuth.user.studentsSet.edges[0].node.parentName,
          },
        })
      }

      if (response.tokenAuth.user.groups.edges[0].node.name === 'therapist') {
        localStorage.setItem('userId', JSON.stringify(response.tokenAuth.user.id))
        yield put({
          type: 'user/SET_STATE',
          payload: {
            staffId: response.tokenAuth.user.staffSet.edges[0].node.id,
            staffName: response.tokenAuth.user.staffSet.edges[0].node.name,
          },
        })
      }

      if (response.tokenAuth.user.groups.edges[0].node.name === 'school_admin') {
        const result4 = yield call(clinicDetails)
        if (result4) {
          localStorage.setItem('userId', JSON.stringify(result4.data.schoolDetail.id))
          yield put({
            type: 'user/SET_STATE',
            payload: {
              clinicName: result4.data.schoolDetail.schoolName,
            },
          })
        }
      }
    }

    yield put({
      type: 'menu/GET_DATA',
    })
  }

  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* LOAD_CURRENT_ACCOUNT() {
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
      // role:JSON.parse(localStorage.getItem('role')),
    },
  })

  const response = yield call(RefreshToken)

  if (response && response.refreshToken) {
    const result = yield call(GetUserDetailsByUsername, response.refreshToken.payload.username)

    if (result) {
      yield put({
        type: 'user/SET_STATE',
        payload: {
          id: result.data.getuser.edges[0].node.id,
          authorized: true,
          loading: false,
          role: result.data.getuser.edges[0].node.groups.edges[0].node.name,
          // role: result.data.getuser.edges[0].node.groups[0].node.id,
        },
      })

      if (result.data.getuser.edges[0].node.groups.edges[0].node.name === 'parents') {
        const result2 = yield call(StudentIdFromUserId, result.data.getuser.edges[0].node.id)

        if (result2) {
          yield put({
            type: 'user/SET_STATE',
            payload: {
              studentId: result2.data.students.edges[0].node.id,
              parentName: result2.data.students.edges[0].node.parentName,
            },
          })
        }
      }

      if (result.data.getuser.edges[0].node.groups.edges[0].node.name === 'therapist') {
        const result3 = yield call(StaffIdFromUserId, result.data.getuser.edges[0].node.id)

        if (result3) {
          yield put({
            type: 'user/SET_STATE',
            payload: {
              staffId: result3.data.staffs.edges[0].node.id,
              staffName: result3.data.staffs.edges[0].node.name,
            },
          })
        }
      }

      if (result.data.getuser.edges[0].node.groups.edges[0].node.name === 'school_admin') {
        const result4 = yield call(clinicDetails)

        if (result4) {
          yield put({
            type: 'user/SET_STATE',
            payload: {
              clinicName: result4.data.schoolDetail.schoolName,
            },
          })
        }
      }
    }
  } else {
    localStorage.clear()
    LOGOUT()
  }

  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* LOGOUT() {
  yield put({
    type: 'user/SET_STATE',
    payload: {
      authorized: false,
      loading: false,
      role: '',
    },
  })
  yield put({
    type: 'family/SET_STATE',
    payload: {
      familyMembers: [],
      loading: false,
    },
  })
  yield call(logout)
  window.location.reload()
  localStorage.clear()
}

export function* GET_STUDENT_NAME() {
  const response = yield call(GetStudentNameById, localStorage.getItem('studentId'))
  if (response && response.data) {
    yield put({
      type: 'user/SET_STATE',
      payload: {
        studentName: response.data.student.firstname,
      },
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOGIN, LOGIN),
    takeEvery(actions.LOAD_CURRENT_ACCOUNT, LOAD_CURRENT_ACCOUNT),
    takeEvery(actions.LOGOUT, LOGOUT),
    takeEvery(actions.GET_STUDENT_NAME, GET_STUDENT_NAME),
    LOAD_CURRENT_ACCOUNT(), // run once on app load to check user auth
  ])
}

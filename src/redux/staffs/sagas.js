/* eslint-disable no-plusplus */
/* eslint-disable object-shorthand */
/* eslint-disable array-callback-return */
import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification, message } from 'antd'
import {
  getClinicStaffs,
  getStaffDropdown,
  createStaff,
  updateStaff,
  staffActiveInactive,
  getStaffProfile,
} from 'services/staffs'
import axios from 'axios'
import actions from './actions'

export function* GET_DATA() {
  yield put({
    type: 'staffs/SET_STATE',
    payload: {
      loading: true,
    },
  })

  const response = yield call(getClinicStaffs)
  console.log('REESSSS', response)

  if (response) {
    const staffs = []
    let i = 0
    if (response.data.staffs.edges.length > 0) {
      for (i = 0; i < response.data.staffs.edges.length; i++) {
        if (response.data.staffs.edges[i].node.tags.edges.length > 0) {
          const tempTagArr = response.data.staffs.edges[i].node.tags.edges.map(e => e.node.name)
          response.data.staffs.edges[i].node.tags = tempTagArr
        }
        staffs.push(response.data.staffs.edges[i].node)
      }
    }

    yield put({
      type: 'staffs/SET_STATE',
      payload: {
        StaffList: staffs,
      },
    })
  }

  yield put({
    type: 'staffs/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* GET_STAFF_DROPDOWNS() {
  const response = yield call(getStaffDropdown)
  if (response && response.data) {
    yield put({
      type: 'staffs/SET_STATE',
      payload: {
        UserRole: response.data.userRole,
        clinicLocationList: response.data.schoolLocation.edges,
      },
    })
  }
}

export function* GET_STAFF_PROFILE({ payload }) {
  const response = yield call(getStaffProfile, payload)
  console.log(response, 'response')
  if (response && response.data) {
    const { staff } = response.data
    if (staff.tags.edges.length > 0) {
      const tempTagArr = staff.tags.edges.map(e => e.node.name)
      staff.tags = tempTagArr
    } else {
      staff.tags = []
    }

    yield put({
      type: 'staffs/SET_STATE',
      payload: {
        StaffProfile: staff,
      },
    })
  }
}

export function* CREATE_STAFF({ payload }) {
  const response = yield call(createStaff, payload)
  if (response && response.data) {
    // generating notification
    notification.success({
      message: 'Staff Created Successfully',
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
    payload.data.append('pk', response.data.createStaff.staff.id)
    axios
      .post('https://application.cogniable.us/apis/staff-docs/', payload.data, { headers: headers })
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
      type: 'staffs/APPEND_STAFFS_LIST',
      payload: {
        staff: response.data.createStaff.staff,
      },
    })
  }
}

export function* EDIT_STAFF({ payload }) {
  const response = yield call(updateStaff, payload)

  if (response && response.data) {
    notification.success({
      message: 'Staff Updated Successfully',
    })

    const { staff } = response.data.updateStaff
    if (staff.tags.edges.length > 0) {
      const tempTagArr = staff.tags.edges.map(e => e.node.name)
      staff.tags = tempTagArr
    } else {
      staff.tags = []
    }

    yield put({
      type: 'staffs/UPDATE_STAFFS_LIST',
      payload: {
        object: staff,
      },
    })

    yield put({
      type: 'staffs/SET_STATE',
      payload: {
        StaffProfile: staff,
      },
    })
  }
}

export function* UPDATE_STAFF_INFO({ payload }) {
  const result = payload.response.data.updateStaff.staff
  if (result) {
    notification.success({
      message: 'Employee data updated successfullly',
    })

    if (result.tags.edges.length > 0) {
      const tempTagArr = result.tags.edges.map(e => e.node.name)
      result.tags = tempTagArr
    } else {
      result.tags = []
    }

    yield put({
      type: 'staffs/UPDATE_STAFFS_LIST',
      payload: {
        object: result,
      },
    })

    yield put({
      type: 'staffs/SET_STATE',
      payload: {
        StaffProfile: result,
      },
    })
  }
}

export function* STAFF_ACTIVE_INACTIVE({ payload }) {
  const response = yield call(staffActiveInactive, payload)

  if (response && response.data) {
    // generating notification
    // console.log(response.data.updateStaff.staff)
    if (payload.checked === true) {
      notification.success({
        message: 'Staff Activated Successfully',
      })
    } else {
      notification.success({
        message: 'Staff Deactivated Successfully',
      })
    }

    yield put({
      type: 'staffs/UPDATE_STAFF_ACTIVE_INACTIVE',
      payload: {
        staff: response.data.updateStaff.staff,
      },
    })
  }
}

export default function* rootSaga() {
  yield all([
    // GET_DATA(), // run once on app load to fetch menu data
    takeEvery(actions.GET_STAFFS, GET_DATA),
    takeEvery(actions.GET_STAFF_DROPDOWNS, GET_STAFF_DROPDOWNS),
    takeEvery(actions.CREATE_STAFF, CREATE_STAFF),
    takeEvery(actions.EDIT_STAFF, EDIT_STAFF),
    takeEvery(actions.STAFF_ACTIVE_INACTIVE, STAFF_ACTIVE_INACTIVE),
    takeEvery(actions.GET_STAFF_PROFILE, GET_STAFF_PROFILE),
    takeEvery(actions.UPDATE_STAFF_INFO, UPDATE_STAFF_INFO),
  ])
}

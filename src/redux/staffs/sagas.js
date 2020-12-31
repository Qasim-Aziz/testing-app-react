/* eslint-disable no-plusplus */
import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification } from 'antd'
import {
  getClinicStaffs,
  getStaffDropdown,
  createStaff,
  updateStaff,
  staffActiveInactive,
} from 'services/staffs'
import actions from './actions'

export function* GET_DATA() {
  yield put({
    type: 'staffs/SET_STATE',
    payload: {
      loading: true,
    },
  })

  const response = yield call(getClinicStaffs)

  if (response) {
    const staffs = []
    let i = 0
    if (response.data.staffs.edges.length > 0) {
      for (i = 0; i < response.data.staffs.edges.length; i++) {
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
        UserRole : response.data.userRole,
        clinicLocationList: response.data.schoolLocation.edges,
      },
    })
  }
}

export function* CREATE_STAFF({payload}) {
  const response = yield call(createStaff, payload)
  if (response && response.data) {
    // generating notification
    notification.success({
      message: 'Staff Created Successfully',
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

    yield put({
      type: 'staffs/UPDATE_STAFFS_LIST',
      payload: {
        object: response.data.updateStaff.staff,
      },
    })

    yield put({
      type: 'staffs/SET_STATE',
      payload: {
        StaffProfile: response.data.updateStaff.staff,
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
  ])
}

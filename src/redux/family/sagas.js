import { all, takeEvery, put, call, select } from 'redux-saga/effects'
import { notification } from 'antd'
import {
  getSessionAndRelations,
  getFamilyDetails,
  createNewMember,
  editMember,
} from 'services/family'
import actions from './actions'

export function* GetSessionAndRelations() {
  yield put({
    type: 'family/SET_STATE',
    payload: {
      loading: true,
    },
  })

  const response = yield call(getSessionAndRelations)
  if (response) {
    yield put({
      type: 'family/SET_STATE',
      payload: {
        sessionTypes: response.data.sessionName,
        relations: response.data.relationships,
      },
    })
  }

  yield put({
    type: 'family/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* GetFamilyDetail() {
  yield put({
    type: 'family/SET_STATE',
    payload: {
      loading: true,
    },
  })

  const response = yield call(getFamilyDetails)
  console.log('response==>', response)
  if (response && response.data && response.data.student) {
    if(response.data.student.family){
      const baseResponse = response.data.student.family
      yield put({
        type: 'family/SET_STATE',
        payload: {
          familyDetailsId: baseResponse.id,
          familyMembers: baseResponse.members.edges,
        },
      })
    }
  }

  yield put({
    type: 'family/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* CreateNewMember({ payload }) {
  yield put({
    type: 'family/SET_STATE',
    payload: {
      loading: true,
    },
  })

  const response = yield call(createNewMember, payload)

  if (response && response.data) {
    const baseResponse = response.data.familyMember.familyMember
    const familyMembers = yield select(state => state.family.familyMembers)
    let newFamilyMembers = [{ node: baseResponse }]
    newFamilyMembers = newFamilyMembers.concat(familyMembers)
    yield put({
      type: 'family/SET_STATE',
      payload: {
        familyMembers: newFamilyMembers,
        updatedSuccess: true,
      },
    })
  }

  yield put({
    type: 'family/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* EditMember({ payload }) {
  yield put({
    type: 'family/SET_STATE',
    payload: {
      loading: true,
    },
  })

  const response = yield call(editMember, payload)
  if (response && response.data) {
    notification.success({
      message: 'Family Member Edited Successfully',
    })
    const baseResponse = response.data.editFamily.details
    const familyMembers = yield select(state => state.family.familyMembers)
    let newFamilyMembers = []
    newFamilyMembers = familyMembers.map(val => {
      if (val.node.id === baseResponse.id) {
        return { node: baseResponse }
      }
      return val
    })
    yield put({
      type: 'family/SET_STATE',
      payload: {
        updatedMember: { node: baseResponse },
        familyMembers: newFamilyMembers,
        updatedSuccess: true,
      },
    })
  }

  yield put({
    type: 'family/SET_STATE',
    payload: {
      loading: false,
    },
  })
}
export function* DeleteMember({ payload }) {
  yield put({
    type: 'family/SET_STATE',
    payload: {
      loading: true,
    },
  })

  const response = yield call(editMember, payload)
  if (response && response.data) {
    notification.success({
      message: 'Family Member Edited Successfully',
    })
    const baseResponse = response.data.editFamily.details
    const familyMembers = yield select(state => state.family.familyMembers)
    let newFamilyMembers = []
    newFamilyMembers = familyMembers.map(val => {
      if (val.node.id === baseResponse.id) {
        return { node: baseResponse }
      }
      return val
    })
    yield put({
      type: 'family/SET_STATE',
      payload: {
        updatedMember: { node: baseResponse },
        familyMembers: newFamilyMembers,
        updatedSuccess: true,
      },
    })
  }

  yield put({
    type: 'family/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.SESSION_RELATIONS, GetSessionAndRelations),
    takeEvery(actions.FAMILY_DETAILS, GetFamilyDetail),
    takeEvery(actions.CREATE_NEW, CreateNewMember),
    takeEvery(actions.EDIT_MEMBER, EditMember),
    takeEvery(actions.DELETE_MEMBER, DeleteMember),
  ])
}

/* eslint-disable no-plusplus */
/* eslint-disable object-shorthand */
/* eslint-disable dot-notation */
/* eslint-disable prefer-const */
/* eslint-disable */

import { all, takeEvery, put, call, select } from 'redux-saga/effects'
import { notification, message } from 'antd'
import {
  getAssets,
  createAsset,
  designateAsset,
  updateAsset,
  updateAssetVal,
} from 'services/assets'
import actions from './actions'

export function* GET_DATA() {
  yield put({
    type: 'assets/SET_STATE',
    payload: {
      loading: true,
      AssetsList: [],
      SpecificAsset: null,
      isSpecificAsset: false,
      TotalNumberOfAsset: 0, // TotalLeaders
      PageInfo: null, // Should be done with pagination
    },
  })

  yield put({
    type: 'assets/GET_ASSETS',
    payload: {
      isActive: true,
      first: 10,
      after: null,
      before: null,
    },
  })

  yield put({
    type: 'assets/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* GET_ASSETS({ payload }) {
  yield put({
    type: 'assets/SET_STATE',
    payload: {
      loadingAssets: true,
    },
  })

  const response = yield call(getAssets, payload)
  if (response) {
    // assetData, usersData
    console.log('response', response.assetData)
    console.log('USER LIST', response.usersData)
    yield put({
      type: 'assets/SET_STATE',
      payload: {
        AssetsList: response.assetData,
        UsersList: response.usersData,
        // 👇 "TotalAssets" will begive from the API right now it is an arbitary value
        TotalAssets: 6,
        // 👇 "PageInfo" will be provided with graphene django pagination
        PageInfo: 'I dont know what this is',
      },
    })
  }
  yield put({
    type: 'assets/SET_STATE',
    payload: {
      loadingAssets: false,
    },
  })
}

export function* CREATE_ASSET({ payload }) {
  console.log('THE PAYLOAD', payload)
  const response = yield call(createAsset, payload)
  console.log('THE RESPONSE ONCE THE ASSET IS CREATED', response)
  if (response && response.data) {
    notification.success({
      message: 'Asset Created Successfully',
    })
    // Destructuring the all the values from the response
    var created_asset = response.data.createAssetVal
    console.log('THE created_asset', created_asset)
    yield put({
      type: 'assets/APPEND_ASSETS_LIST',
      payload: {
        asset: created_asset.assetVal,
      },
    })
  }
}

export function* UPDATE_ASSET_VAL({ payload }) {
  console.log('THE PAYLOAD 👉👉👉', payload)
  const response = yield call(updateAssetVal, payload)
  if (response && response.data) {
    notification.success({
      message: 'Asset Created Successfully',
    })
    // Destructuring the all the values from the response
    var updated_asset = response.data.updateAssetVal
    console.log('THE updated_asset', updated_asset)
    yield put({
      type: 'UPDATE_ASSET_VALUE', // actions.UPDATE_ASSETS_LIST,
      payload: {
        object: updated_asset.assetVal,
      },
    })
  }
}

export function* DESIGNATE_ASSET({ payload }) {
  console.log('THE PAYLOAD 👉👉👉', payload)
  const response = yield call(designateAsset, payload)
  if (response && response.data) {
    notification.success({
      message: 'Asset Created Successfully',
    })
    // Destructuring the all the values from the response
    var assigned_asset = response.data.createAssetDesgVal
    console.log('THE assigned_asset', assigned_asset)
    yield put({
      type: actions.UPDATE_ASSETS_LIST,
      payload: {
        object: assigned_asset.assetDesg.asset,
      },
    })
  }
}

export function* UPDATE_DESIGNATE_ASSET({ payload }) {
  console.log('THE PAYLOAD 👉👉👉', payload)
  const response = yield call(updateAsset, payload)
  if (response && response.data) {
    notification.success({
      message: 'Asset Created Successfully',
    })
    // Destructuring the all the values from the response
    var assigned_asset = response.data.updateAssetDesgVal
    console.log('THE assigned_asset', assigned_asset)
    yield put({
      type: actions.UPDATE_ASSETS_LIST,
      payload: {
        object: assigned_asset.assetDesg.asset,
      },
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_DATA, GET_DATA),
    takeEvery(actions.GET_ASSETS, GET_ASSETS),
    takeEvery(actions.CREATE_ASSET, CREATE_ASSET),
    takeEvery(actions.DESIGNATE_ASSET, DESIGNATE_ASSET),
    takeEvery(actions.UPDATE_DESIGNATE_ASSET, UPDATE_DESIGNATE_ASSET),
    takeEvery(actions.EDIT_ASSET, UPDATE_ASSET_VAL),
  ])
}

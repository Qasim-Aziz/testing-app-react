/* eslint-disable */

import actions from './actions.js'

const initialState = {
  AssetsList: [],
  UsersList: [],
  SpecificAsset: null, // 👈Details of a particular "Asset"
  loading: false,
  isSpecificAsset: false, // 👈 if Details of a particular "Asset" then it will be true
  TotalAssets: 0, // Should be done by graphene django pagination
  PageInfo: null, // Should be done by graphene django pagination
  CurrentPage: 1, // Should be done by graphene django pagination
  ItemPerPage: 10, // Should be done by graphene django pagination
  CurrentStatus: 'active',
  loadingAssets: false,
  AssetCreated: false,
}

export default function useReduer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case 'UPDATE_ASSET_VALUE':
      console.log('THE UPDATED ASSET', action.payload.object)
      return {
        ...state,
        AssetsList: [
          ...state.AssetsList.map(item => {
            if (item.id === action.payload.object.id) {
              return action.payload.object
            }
            return item
          }),
        ],
      }
    case actions.UPDATE_ASSETS_LIST:
      console.log('THE UPDATED ASSET', action.payload.object)
      return {
        ...state,
        AssetsList: [
          ...state.AssetsList.map(item => {
            if (item.id === action.payload.object.id) {
              return action.payload.object
            }
            return item
          }),
        ],
      }
    case actions.APPEND_ASSETS_LIST:
      console.log('THE CREATED ASSET', action.payload)
      return {
        ...state,
        AssetsList: [...state.AssetsList, action.payload.asset],
        AssetCreated: 'Created',
      }
    default:
      return state
  }
}

import actions from './actions'

const initialState = {
  payorList: [],
  contactTypes: [],
  loading: true,
  payorProfile: null,
  isPayorProfile: false,
}

export default function payorReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.APPEND_PAYORS_LIST:
      return {
        ...state,
        payorList: [...state.payorList, action.payload.payor],
      }
    case actions.UPDATE_PAYORS_LIST:
      return {
        ...state,
        payorList: [
          ...state.payorList.map(item => {
            if (item.id === action.payload.object.id) {
              return action.payload.object
            }
            return item
          }),
        ],
      }
    case actions.UPDATE_PAYOR_ACTIVE_INACTIVE:
      return {
        ...state,
        payorList: [
          ...state.payorList.map(item => {
            if (item.id === action.payload.id) {
              return { ...item, isActive: action.payload.isActive }
            }
            return item
          }),
        ],
      }
    default:
      return state
  }
}

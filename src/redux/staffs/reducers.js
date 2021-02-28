import actions from './actions'

const initialState = {
  StaffList: [],
  loading: true,
  StaffProfile: null,
  isStaffProfile: false,
  UserRole: [],
  clinicLocationList: [],
  staffCreated: false,
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.APPEND_STAFFS_LIST:
      return {
        ...state,
        StaffList: [...state.StaffList, action.payload.staff],
        staffCreated: 'Created',
      }
    case actions.UPDATE_STAFFS_LIST:
      return {
        ...state,
        StaffList: [
          ...state.StaffList.map(item => {
            if (item.id === action.payload.object.id) {
              return action.payload.object
            }
            return item
          }),
        ],
      }
    case actions.UPDATE_STAFF_ACTIVE_INACTIVE:
      return {
        ...state,
        StaffList: [
          ...state.StaffList.map(item => {
            if (item.id === action.payload.staff.id) {
              return { ...item, isActive: action.payload.staff.isActive }
            }
            return item
          }),
        ],
      }
    default:
      return state
  }
}

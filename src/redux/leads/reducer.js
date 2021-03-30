import actions from './actions'

const initialState = {
  LeadersList: [],
  categoryList: [], // won't be needing this remove this afterwards
  languageList: [], // won't be needing this remove this afterwards
  clinicLocationList: [], // won't be needing this remove this afterwards
  staffDropdownList: [], // won't be needing this remove this afterwards
  UserProfile: null, // 👈Details of a particular "Leader"
  loading: false,
  isUserProfile: false,
  TotalLeaders: 0, // Should be done by graphene django pagination
  PageInfo: null, // Should be done by graphene django pagination
  CurrentPage: 1, // Should be done by graphene django pagination
  ItemPerPage: 10, // Should be done by graphene django pagination
  CurrentStatus: 'active', // won't be needing this remove this afterwards
  loadingLeaders: false,
  LeaderCreated: false,
}

export default function useReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.UPDATE_LEADERS_LIST:
      console.log('THE UPDATE LEADER', action.payload.object)
      return {
        ...state,
        LeadersList: [
          ...state.LeadersList.map(item => {
            if (item.id === action.payload.object.id) {
              return action.payload.object
            }
            return item
          }),
        ],
      }
    case actions.APPEND_LEADERS_LIST:
      return {
        ...state,
        LeadersList: [...state.LeadersList, action.payload.lead],
        LeaderCreated: 'Created',
      }
    case actions.UPDATE_LEADER_ACTIVE_INACTIVE:
      return {
        ...state,
        LeadersList: [
          ...state.LeadersList.map(item => {
            if (item.id === action.payload.lead.id) {
              return { ...item, isActive: action.payload.lead.isActive }
            }
            return item
          }),
        ],
      }
    default:
      return state
  }
}

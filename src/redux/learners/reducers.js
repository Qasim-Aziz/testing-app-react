import actions from './actions'

const initialState = {
  LearnersList: [],
  categoryList: [],
  languageList: [],
  clinicLocationList: [],
  staffDropdownList: [],
  UserProfile: null,
  loading: false,
  isUserProfile: false,
  TotalLearners: 0,
  PageInfo: null,
  CurrentPage: 1,
  ItemPerPage: 20,
  CurrentStatus: 'active',
  loadingLearners: false,
  LearnerCreated: false,
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.UPDATE_LERNERS_LIST:
      return {
        ...state,
        LearnersList: [
          ...state.LearnersList.map(item => {
            if (item.id === action.payload.object.id) {
              return action.payload.object
            }
            return item
          }),
        ],
      }
    case actions.APPEND_LERNERS_LIST:
      return {
        ...state,
        LearnersList: [action.payload.student, ...state.LearnersList],
        LearnerCreated: 'Created',
      }
    case actions.UPDATE_LEARNER_ACTIVE_INACTIVE:
      return {
        ...state,
        LearnersList: [
          ...state.LearnersList.map(item => {
            if (item.id === action.payload.student.id) {
              return { ...item, isActive: action.payload.student.isActive }
            }
            return item
          }),
        ],
      }
    default:
      return state
  }
}

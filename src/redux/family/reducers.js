import actions from './actions'

const initialState = {
  sessionTypes: [],
  relations: [],
  familyDetailsId: '',
  familyMembers: [],
  newFamilyMemberId: '',
  updatedMember: {},
  // studentId: "",
}

export default function familyReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}

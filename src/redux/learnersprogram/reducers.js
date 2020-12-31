import actions from './actions'

const initialState = {
  Loading: false,
  Learners: [],
  CloneLearners: [],
  ProgramAreas: [],
  SelectedLearnerId: '',
  TabCheck: 'Assessments'
}

export default function goalsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}

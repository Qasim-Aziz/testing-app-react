import actions from './actions'

const initialState = {
  Loading: true,
  LearnerId: '',
  LongTermGoalsList: [],
  SelectedType: '',
  LongTermObject: null,
  ShortTermObject: null,
  LongTermDisplay: 'LTG Details',
  ShortTermDisplay: 'STG Details',
  GoalStatusList: [],
  GoalProgramArea: [],
  GoalAssessmentList: [],
  GoalResponsibleList: [],
  StaffList: [],
}

export default function goalsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}

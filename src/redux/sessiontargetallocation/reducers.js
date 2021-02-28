import actions from './actions'

const initialState = {
  AllocatedTargetsList: [],
  AllocatedTargetListClone: [], 
  FamilyMemberList: [],
  AuthStaffList: [],
  MorningSession: null,
  AfternoonSession: null,
  EveningSession: null,
  DefaultSession: null,
  CurrentSession: '',
  MorningSessionId: 'U2Vzc2lvbk5hbWVUeXBlOjE=',
  AfternoonSessionId: 'U2Vzc2lvbk5hbWVUeXBlOjI=',
  EveningSessionId: 'U2Vzc2lvbk5hbWVUeXBlOjM=',
  DefaultSessionId: 'U2Vzc2lvbk5hbWVUeXBlOjQ=',
  loading: true,
  TargetStatusList : [],
  randomKey: Math.random(),
  MorningSessionRandomKey: Math.random(),
  AfternoonSessionRandomKey: Math.random(),
  EveningSessionRandomKey: Math.random(),
  DefaultSessionRandomKey: Math.random(),
  MorningSortTargetTrue: false,
  AfternoonSortTargetTrue: false,
  EveningSortTargetTrue: false,
  DefaultSortTargetTrue: false,  
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}

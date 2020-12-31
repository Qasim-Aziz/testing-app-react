import actions from './actions'

const initialState = {
  loading: false,
  createFormLoading: false,
  AssessmentLoading: false,
  responseLoading: false,
  StudentsList: [],
  AssessmentObject: null,
  AssessmentList: [],
  Question: null,
  QuestionCounter: 0,
  ResponseObject: {},
  AssessmentStatus: 'QUESTIONCOMPLETED',
  Areas: [],
  AreasResponse: {},

  isEdit: false,
  cloneQuestion: null,

  NewAssessmentForm: false,
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}

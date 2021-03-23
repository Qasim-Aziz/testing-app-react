import actions from './actions'

const initialState = {
  loading: false,
  createFormLoading: false,
  AssessmentLoading: false,
  responseLoading: false,
  SelectedAssessmentId: '',

  AssessmentObject: null,
  AssessmentList: [],
  IISADomains: [],
  IISAOptions: [],
  IISAQuestions: [],
  AssessmentStatus: '',

  SelectedQuestionIndex: 0,
  SelectedQuestionId: '',
  SelectedDomainId: '',
  IISAQuestionsListObject: {},
  
  ResponseObject: {},
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

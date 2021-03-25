import actions from './actions'

const initialState = {
  loading: false,
  createFormLoading: false,
  AssessmentLoading: false,
  responseLoading: false,
  AssessmentReportLoading: false,
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

  ReportDrawer: false,
  AssessmentReport: null,

  isEdit: false,

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

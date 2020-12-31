import actions from './actions'

const initialState = {
  Loading: false,
  ProgramId: '',
  PeakTypeList: ['Basic', 'Intermediate', 'Advanced'],
  ObjectLoaded: false,
  AssessmentObject: null,
  SelectedPeakType: '',
  PEDomainList: [],
  PEQuestionsList: [],
  ResponseObject: {},
  SelectedDomainId: null,
  SelectedQuestionId: null, 
  SelectedQuestionIndex: 0,
  PEQuestionsListObject: {},
  SelectedTestIndex: 0,
  SelectedTestId: null,
  ResponseLoading: false,
  ReportLoading: false,
  ReportScoreList: []
}

export default function goalsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}

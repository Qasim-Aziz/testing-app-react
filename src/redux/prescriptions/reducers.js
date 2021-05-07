import actions from './actions'

const initialState = {
  lp_entire_data: [],
  PrescriptionsList: [],
  SpecificPrescription: null,
  isSpecificPrescription: false,
  loadingPrescriptions: true,
  PrescriptionCreated: false,
  GlobalSpecificLearner: null,
}

export default function useReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.UPDATE_PRESCRIPTIONS_LIST:
      return {
        ...state,
        PrescriptionsList: [
          ...state.PrescriptionsList.map(item => {
            if (item.node.id === action.payload.prescription.id) {
              item.node = action.payload.prescription
              return item
            }
            return item
          }),
        ],
      }
    case actions.APPEND_PRESCRIPTIONS_LIST:
      return {
        ...state,
        PrescriptionsList: [...state.PrescriptionsList, action.payload.prescription],
        PrescriptionCreated: true,
      }
    case actions.DELETE_PRESCRIPTION_IN_LIST:
      return {
        ...state,
        PrescriptionsList: [
          ...state.PrescriptionsList.filter(item => item.node.id !== action.payload.item_id),
        ],
      }
    case actions.SET_SPECIFIC_LEARNER:
      return {
        ...state,
        GlobalSpecificLearner: action.payload,
      }
    default:
      return state
  }
}

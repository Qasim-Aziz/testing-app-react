import actions from './actions'

const initialState = {
  /* lp_entire_data 👉 This will contain entire data from the request */
  lp_entire_data: [],
  /* PrescriptionsList👉 This is a list of medicines of a particular learner */
  PrescriptionsList: [],
  /* SpecificPrescription👉 This is a particular prescription details */
  SpecificPrescription: null,
  isSpecificPrescription: false,
  loadingPrescriptions: true,
  PrescriptionCreated: false,
}

export default function useReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.UPDATE_PRESCRIPTIONS_LIST:
      return {
        ...state,
        PrescriptionsList: [
          ...state.prescriptionsList.map(item => {
            if (item.id === action.payload.object.id) {
              return action.payload.object
            }
            return item
          }),
        ],
      }
    case actions.APPEND_PRESCRIPTIONS_LIST:
      return {
        ...state,
        PrescriptionsList: [action.payload.prescription, ...state.PrescriptionsList],
        PrescriptionCreated: 'Created',
      }
    case actions.DELETE_PRESCRIPTION_IN_LIST:
      console.log('THE DELETE PRESCRIPTION LIST', action.payload)
      return {
        ...state,
        PrescriptionsList: [
          ...state.PrescriptionsList.filter(item => item.node.id !== action.payload.item_id),
        ],
      }
    default:
      return state
  }
}

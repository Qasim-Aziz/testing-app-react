import actions from './actions'

const initialState = {
  appointmentList: [],
  appointmentCreated: false,
  currentAppointment: null,
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.APPEND_APPOINTMENT_LIST:
      return {
        ...state,
        appointmentList: [...state.appointmentList, action.payload.appointment],
        appointmentCreated: true,
      }
    case actions.UPDATE_APPOINTMENT_LIST:
      return {
        ...state,
        appointmentList: [
          ...state.appointmentList.map(item => {
            if (item.id === action.payload.object.id) {
              return action.payload.object
            }
            return item
          }),
        ],
      }

    default:
      return state
  }
}

/* eslint-disable */
import actions from './actions'

const initialState = {
  appointments: [],
  appointmentsLoading: false,
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
      let idx = 0
      state.appointments.map((item, index) => {
        if (item.id === action.payload.object.id) {
          idx = index
        }
      })

      if (idx !== -1 && action.payload.removeItem) {
        state.appointments.splice(idx, 1)
      } else if (idx !== -1 && action.payload.updateItem) {
        state.appointments[idx] = action.payload.object
      }
      return { ...state }

    default:
      return state
  }
}

/* eslint-disable */
import actions from './actions'

const initialState = {
  appointments: [],
  appointmentsLoading: false,
  editLoading: false,
  deleteLoading: false,
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
      console.log(state, 'state 1')
      state.appointments.map((item, index) => {
        if (item.id === action.payload.object.id) {
          idx = index
        }
      })

      console.log(idx, action)
      if (idx !== -1 && action.payload.removeItem) {
        state.appointments.splice(idx, 1)
      } else if (idx !== -1 && action.payload.editItem) {
        state.appointments[idx] = action.payload.object
      }
      return { ...state, appointments: state.appointments }

    default:
      return state
  }
}

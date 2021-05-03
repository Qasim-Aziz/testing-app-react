import actions from './actions'

const initialState = {
  loading: true,
  uploadedFiles: [],
  error: false,
}

export default function filesReducer(state = initialState, action) {
  switch (action.type) {
    case actions.LOADING_FILES:
      return {
        ...state,
        loading: true,
      }
    case actions.GET_UPLOADED_FILES:
      return {
        ...state,
        loading: false,
        uploadedFiles: action.payload,
      }

    default:
      return state
  }
}

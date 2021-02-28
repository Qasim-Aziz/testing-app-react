import actions from './actions'

const initialState = {
  TaskList: [],
  priority: [],
  taskStatus: [],
  taskType: [],
  staffsList: [],
  learnersList: [],
  SelectedTask: null,
  loading: true,
  createTaskLoading: false,
  isSelectedTask: false,
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.APPEND_TASKS_LIST:
      if (action.payload.tasks) {
        return {
          ...state,
          TaskList: [...state.TaskList, ...action.payload.tasks],
        }
      }
      return {
        ...state,
        TaskList: [action.payload.task, ...state.TaskList],
      }

    case actions.UPDATE_TASKS_LIST:
      return {
        ...state,
        TaskList: [
          ...state.TaskList.map(item => {
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

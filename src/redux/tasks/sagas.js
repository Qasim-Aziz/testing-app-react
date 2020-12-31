/* eslint-disable no-plusplus */
import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification } from 'antd'
import {
  getTasks,
  getClosedTasks,
  editTask,
  createTask,
  getTasksDropdown,
  updateTaskStatus,
} from 'services/tasks'
import actions from './actions'

export function* GET_DATA() {
  yield put({
    type: 'tasks/SET_STATE',
    payload: {loading: true,},
  })

  const response = yield call(getTasks)
  if (response) {
    const tasks = []
    let i = 0
    if (response.data.tasks.edges.length > 0) {
      for (i = 0; i < response.data.tasks.edges.length; i++) {
        tasks.push(response.data.tasks.edges[i].node)
      }
    }

    yield put({
      type: 'tasks/SET_STATE',
      payload: {TaskList: tasks,},
    })
  }

  yield put({
    type: 'tasks/SET_STATE',
    payload: {loading: false,},
  })
}

export function* GET_CLOSED_DATA() {
  yield put({
    type: 'tasks/SET_STATE',
    payload: {loading: true,},
  })

  const response = yield call(getClosedTasks)
  if (response) {
    const tasks = []
    let i = 0
    if (response.data.tasks.edges.length > 0) {
      for (i = 0; i < response.data.tasks.edges.length; i++) {
        tasks.push(response.data.tasks.edges[i].node)
      }
    }

    yield put({
      type: 'tasks/SET_STATE',
      payload: {TaskList: tasks,},
    })
  }

  yield put({
    type: 'tasks/SET_STATE',
    payload: {loading: false,},
  })
}

export function* GET_TASKS_DROPDOWNS() {
  const response = yield call(getTasksDropdown)

  if (response && response.data) {
    yield put({
      type: 'tasks/SET_STATE',
      payload: {
        priority: response.data.priority,
        taskStatus: response.data.taskStatus,
        taskType: response.data.taskType,
        staffsList: response.data.staffs,
        learnersList: response.data.students
      },
    })
  }
}



export function* CREATE_TASK({ payload }) {
  // setting create task button loading true
  yield put({
    type: 'tasks/SET_STATE',
    payload: {
      createTaskLoading: true,
    },
  })

  const response = yield call(createTask, payload)

  if (response && response.data) {
    // generating notification
    notification.success({
      message: 'Task Created Successfully',
    })

    // adding created task in the task list 
    yield put({
      type: 'tasks/APPEND_TASKS_LIST',
      payload: {
        task: response.data.createTask.task,
      },
    })
  }

  // setting create task button loading false
  yield put({
    type: 'tasks/SET_STATE',
    payload: {
      createTaskLoading: false,
    },
  })

}

export function* EDIT_TASK({ payload }) {
  // setting create task button loading true
  yield put({
    type: 'tasks/SET_STATE',
    payload: {
      createTaskLoading: true,
    },
  })

  const response = yield call(editTask, payload)

  if (response && response.data) {
    // generating notification
    notification.success({
      message: 'Task Edited Successfully',
    })

    // adding created task in the task list 
    yield put({
      type: 'tasks/UPDATE_TASKS_LIST',
      payload: {
        object: response.data.updateTask.task,
      },
    })
  }

  // setting create task button loading false
  yield put({
    type: 'tasks/SET_STATE',
    payload: {
      createTaskLoading: false,
    },
  })

}

export function* UPDATE_TASK_STATUS({ payload }) {

  const response = yield call(updateTaskStatus, payload)

  if (response && response.data) {
    // generating notification
    notification.success({
      message: 'Task Closed Successfully',
    })

    // adding created task in the task list 
    // yield put({
    //   type: 'tasks/UPDATE_TASKS_LIST',
    //   payload: {
    //     object: response.data.updateTask.task,
    //   },
    // })
  }

}


export default function* rootSaga() {
  yield all([
    // GET_DATA(), // run once on app load to fetch menu data
    takeEvery(actions.GET_TASKS, GET_DATA),
    takeEvery(actions.GET_CLOSED_TASKS, GET_CLOSED_DATA),
    takeEvery(actions.GET_TASKS_DROPDOWNS, GET_TASKS_DROPDOWNS),
    takeEvery(actions.CREATE_TASK, CREATE_TASK),
    takeEvery(actions.EDIT_TASK, EDIT_TASK),
    takeEvery(actions.UPDATE_TASK_STATUS, UPDATE_TASK_STATUS),
    
  ])
}

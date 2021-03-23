/* eslint-disable no-plusplus */
/* eslint-disable object-shorthand */
/* eslint-disable prefer-destructuring */
import { all, takeEvery, put, call, select } from 'redux-saga/effects'
import { notification } from 'antd'
import {
  getData,
  createAssessment,
  getAssessmentObject,
  recordResponse,
  recordAreaResponse,
  endAssessment,
  endQuestionsAssessment,
  editQuestions,
  makeAssessmentInactive,
} from 'services/iisaassessment'
import actions from './actions'

export function* GET_DATA({ payload }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: true,
      createFormLoading: false,
      AssessmentLoading: false,
      responseLoading: false,
      AssessmentObject: null,
      AssessmentList: [],
      Question: null,
      QuestionCounter: 0,
      ResponseObject: {},
      Areas: [],
      AreasResponse: {},
      isEdit: false,
      cloneQuestion: null,
      NewAssessmentForm: false,
    },
  })

  const response = yield call(getData, payload)

  if (response) {

    yield put({
      type: actions.SET_STATE,
      payload: {
        AssessmentList: response.data.IISAGetAssessments.edges,
      },
    })
  }

  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: false,
    },
  })
}

export function* CREATE_ASSESSMENT({ payload }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      createFormLoading: true,
    },
  })

  const response = yield call(createAssessment, payload)

  if (response) {
    notification.success({
      message: 'Success!!',
      description: 'Assessment Created Successfully!',
    })

    const object = response.data.IISACreateAssessment.details
    // const newAssList = []
    const asslist = yield select(state => state.iisaassessment.AssessmentList)
    // newAssList = [object, ...asslist]
    // adding new created object at the top of the list
    asslist.unshift({ node: object })

    yield put({
      type: actions.SET_STATE,
      payload: {
        AssessmentObject: object,
        AssessmentStatus: object.status,
        AssessmentList: asslist,
      },
    })

    // yield put({
    //   type: 'cogniableassessment/LOAD_ASSESSMENT_OBJECT',
    //   payload: {
    //     objectId: object.id,
    //   },
    // })
  }

  yield put({
    type: actions.SET_STATE,
    payload: {
      createFormLoading: false,
      NewAssessmentForm: false,
    },
  })
}

export function* LOAD_ASSESSMENT_OBJECT({ payload }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      AssessmentLoading: true,
    },
  })

  // api call for assessment object
  const response = yield call(getAssessmentObject, payload)

  if (response) {
    const object = response.data.IISAGetAssessmentDetails
    const domains = response.data.IISAGetDomains.edges
    const questions = response.data.IISAGetQuestions.edges

    const IISAObject = {}
    for (let i=0; i<domains.length; i++){
      IISAObject[domains[i]?.node.id] = []
      for (let j=0; j<questions.length; j++){
        if(questions[j].node.domain.id === domains[i].node.id){
          IISAObject[domains[i]?.node.id].push({recorded: false, response: null, question: questions[j] })
        }
      }
    }
    

    yield put({
      type: actions.SET_STATE,
      payload: {
        AssessmentObject: object,
        AssessmentStatus: object.status,
        IISADomains: response.data.IISAGetDomains.edges,
        IISAOptions: response.data.IISAGetOptions.edges,
        IISAQuestions: response.data.IISAGetQuestions.edges,
        IISAQuestionsListObject: IISAObject,
        SelectedDomainId: response.data.IISAGetDomains.edges[0]?.node.id,
        SelectedQuestionId: response.data.IISAGetQuestions.edges[0]?.node.id,
        SelectedQuestionIndex: 0,
      },
    })
  }

  yield put({
    type: actions.SET_STATE,
    payload: {
      AssessmentLoading: false,
    },
  })
}

export function* RECORD_RESPONSE({ payload }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      responseLoading: true,
    },
  })

  const response = yield call(recordResponse, payload)

  if (response) {
    // notification.success({
    //   message: 'Success!!',
    //   description: "Response Recorded Successfully!",
    // })

    const nextQus = response.data.recordCogQuestion.nextQuestion
    const object = response.data.recordCogQuestion.details

    const resObject = yield select(state => state.cogniableassessment.ResponseObject)
    const edges = object.assessmentQuestions.edges

    if (edges.length > 0) {
      for (let i = 0; i < edges.length; i++) {
        resObject[edges[i].node.question.id] = { recorded: true, response: edges[i].node }
      }

      if (nextQus) {
        resObject[nextQus.id] = { recorded: false, response: null }
      }
    }

    yield put({
      type: actions.SET_STATE,
      payload: {
        Question: nextQus,
        cloneQuestion: nextQus,
        ResponseObject: resObject,
        QuestionCounter: edges.length,
        AssessmentObject: object,
      },
    })
  }

  yield put({
    type: actions.SET_STATE,
    payload: {
      responseLoading: false,
    },
  })
}

export function* RECORD_AREA_RESPONSE({ payload }) {
  // selecting assessment object id
  const ObjectId = yield select(state => state.cogniableassessment.AssessmentObject.id)
  // api call for area response
  const response = yield call(recordAreaResponse, {
    objectId: ObjectId,
    areaId: payload.areaId,
    response: payload.response,
  })
  if (response?.data) {
    const areaEdges = response.data.recordCogniableAssessResult.details.assessmentAreas.edges

    // selection area response object
    const areasResponse = yield select(state => state.cogniableassessment.AreasResponse)
    if (areaEdges.length > 0) {
      for (let i = 0; i < areaEdges.length; i++) {
        if (areaEdges[i].node.area.id === payload.areaId) {
          // updating recorded response to store for future edit operations
          areasResponse[payload.areaId] = { recorded: true, response: areaEdges[i].node }
        }
      }
    }

    yield put({
      type: actions.SET_STATE,
      payload: {
        AreasResponse: areasResponse,
      },
    })
  }
}

export function* END_ASSESSMENT({ payload }) {
  // api call for End assessment
  const response = yield call(endAssessment, {
    objectId: payload.objectId,
    // score: payload.score,
    status: 'Completed',
  })
  if (response?.data) {
    notification.success({
      message: 'Success!!',
      description: 'Assessment Submitted Successfully!',
    })
    const object = response.data.updateCogAssessment.details

    yield put({
      type: actions.SET_STATE,
      payload: {
        AssessmentObject: object,
        AssessmentStatus: object.status,
      },
    })
  }
}

export function* END_QUESTIONS({ payload }) {
  // api call for End Questions seagment
  const response = yield call(endQuestionsAssessment, {
    objectId: payload.objectId,
    status: payload.status,
  })
  if (response?.data) {
    const object = response.data.updateCogAssessment.details

    // updating areas responses object
    const areaResponse = yield select(state => state.cogniableassessment.AreasResponse)
    const areaEdges = object.assessmentAreas.edges
    for (let m = 0; m < areaEdges.length; m++) {
      areaResponse[areaEdges[m].node.area.id] = { recorded: true, response: areaEdges[m].node }
    }

    yield put({
      type: actions.SET_STATE,
      payload: {
        AssessmentObject: object,
        AssessmentStatus: object.status,
        AreasResponse: areaResponse
      },
    })
  }
}

export function* CHANGE_QUESTION({ payload }) {
  // api call for End Questions seagment
  // const response = yield call(endQuestionsAssessment, {objectId: payload.objectId, status: payload.status})

  const object = yield select(state => state.cogniableassessment.AssessmentObject)

  if (object) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        Question: object.assessmentQuestions.edges[payload.index - 1].node.question,
      },
    })
  }
}

export function* UPDATE_QUESTION_RESPONSE({ payload }) {
  // api call for Edit Questions response
  const response = yield call(editQuestions, payload)

  // const object = yield select(state => state.cogniableassessment.AssessmentObject)

  if (response) {
    const object = response.data.updateCogniableAssessment.details
    const nextQus = response.data.updateCogniableAssessment.nextQuestion
    const edges = object.assessmentQuestions.edges

    const resObject = {}
    let displayQuestion = null
    if (object.status) {
      console.log('phase change')
      if (edges.length > 0) {
        for (let i = 0; i < edges.length; i++) {
          resObject[edges[i].node.question.id] = { recorded: true, response: edges[i].node }

          // setting current question
          if (edges[i].node.question.id === payload.qusId) {
            displayQuestion = edges[i].node.question
          }
        }
        // adding next question to response
        if (nextQus) {
          resObject[nextQus.id] = { recorded: false, response: null }
        }
      }

      yield put({
        type: actions.SET_STATE,
        payload: {
          Question: displayQuestion,
          ResponseObject: resObject,
          // isCloneQuestion: true,
          cloneQuestion: nextQus,
        },
      })
    } else {
      console.log('not changed')
      if (edges.length > 0) {
        for (let i = 0; i < edges.length; i++) {
          resObject[edges[i].node.question.id] = { recorded: true, response: edges[i].node }

          // setting current question
          // if(edges[i].node.question.id === payload.qusId ){
          //   displayQuestion = edges[i].node.question
          // }
        }
        // adding next question to response
        if (nextQus) {
          resObject[nextQus.id] = { recorded: false, response: null }
        }
      }

      yield put({
        type: actions.SET_STATE,
        payload: {
          ResponseObject: resObject,
          // isCloneQuestion: true,
          cloneQuestion: nextQus,
        },
      })
    }

    console.log(response)
  }
}

export function* MAKE_INACTIVE({ payload }) {
  // api call for inactive assessment
  const response = yield call(makeAssessmentInactive, payload)
  const object = yield select(state => state.iisaassessment.AssessmentObject)
  const listObject = yield select(state => state.iisaassessment.AssessmentList)

  if (response) {
    notification.success({
      message: 'Success!!',
      description: 'Assessment Deactivated Successfully!',
    })
    if (object && object.id === payload.assessmentId) {
      yield put({
        type: actions.SET_STATE,
        payload: {
          AssessmentObject: null,
          AssessmentList: listObject.filter(item => item.node.id !== payload.assessmentId)
        },
      })

    }
    else {
      yield put({
        type: actions.SET_STATE,
        payload: {
          AssessmentList: listObject.filter(item => item.node.id !== payload.assessmentId)
        },
      })
    }
    // console.log('assessment deactivated')
  }
}

export default function* rootSaga() {
  yield all([
    // GET_DATA(), // run once on app load to fetch menu data
    takeEvery(actions.LOAD_DATA, GET_DATA),
    takeEvery(actions.CREATE_ASSESSMENT, CREATE_ASSESSMENT),
    takeEvery(actions.LOAD_ASSESSMENT_OBJECT, LOAD_ASSESSMENT_OBJECT),
    takeEvery(actions.RECORD_RESPONSE, RECORD_RESPONSE),
    takeEvery(actions.RECORD_AREA_RESPONSE, RECORD_AREA_RESPONSE),
    takeEvery(actions.END_ASSESSMENT, END_ASSESSMENT),
    takeEvery(actions.END_QUESTIONS, END_QUESTIONS),
    takeEvery(actions.CHANGE_QUESTION, CHANGE_QUESTION),
    takeEvery(actions.UPDATE_QUESTION_RESPONSE, UPDATE_QUESTION_RESPONSE),
    takeEvery(actions.MAKE_INACTIVE, MAKE_INACTIVE),
  ])
}

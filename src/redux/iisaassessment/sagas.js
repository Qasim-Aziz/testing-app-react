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
  makeAssessmentInactive,
  getAssessmentReport,
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
      QuestionCounter: 0,
      ResponseObject: {},
      isEdit: false,
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
    for (let i = 0; i < domains.length; i++) {
      IISAObject[domains[i]?.node.id] = []
      for (let j = 0; j < questions.length; j++) {
        if (questions[j].node.domain.id === domains[i].node.id) {
          let objectRec = {}
          let foundRec = false
          for (let k = 0; k < object.responses.edges.length; k++) {
            if (object.responses.edges[k].node.question?.id === questions[j].node.id) {
              objectRec = {
                recorded: true,
                response: object.responses.edges[k].node,
                question: questions[j],
              }
              foundRec = true
            }
          }
          if (foundRec) IISAObject[domains[i]?.node.id].push(objectRec)
          else
            IISAObject[domains[i]?.node.id].push({
              recorded: false,
              response: null,
              question: questions[j],
            })
        }
      }
    }

    const DomainID = localStorage.getItem('domainID')
    yield put({
      type: actions.SET_STATE,
      payload: {
        AssessmentObject: object,
        AssessmentStatus: object.status,
        IISADomains: response.data.IISAGetDomains.edges,
        IISAOptions: response.data.IISAGetOptions.edges,
        IISAQuestions: response.data.IISAGetQuestions.edges,
        IISAQuestionsListObject: IISAObject,
        SelectedDomainId: `${DomainID}`,
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
    //   description: 'Response Recorded Successfully!',
    // })

    const resObject = yield select(state => state.iisaassessment.IISAQuestionsListObject)
    const domianId = yield select(state => state.iisaassessment.SelectedDomainId)
    const questionIndex = yield select(state => state.iisaassessment.SelectedQuestionIndex)
    const SelectedQuestionIndex = yield select(state => state.iisaassessment.SelectedQuestionIndex)
    const IISAQuestionsListObject = yield select(
      state => state.iisaassessment.IISAQuestionsListObject,
    )

    resObject[domianId][questionIndex] = {
      ...resObject[domianId][questionIndex],
      recorded: true,
      response: response.data.IISARecording.responses[0],
    }

    yield put({
      type: actions.SET_STATE,
      payload: {
        IISAQuestionsListObject: resObject,
      },
    })

    if (IISAQuestionsListObject[domianId].length !== SelectedQuestionIndex + 1) {
      yield put({
        type: actions.SET_STATE,
        payload: {
          SelectedQuestionIndex: SelectedQuestionIndex + 1,
          SelectedQuestionId:
            IISAQuestionsListObject[domianId][SelectedQuestionIndex + 1]?.question.node.id,
        },
      })
    }
  }

  yield put({
    type: actions.SET_STATE,
    payload: {
      responseLoading: false,
    },
  })
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
          AssessmentList: listObject.filter(item => item.node.id !== payload.assessmentId),
        },
      })
    } else {
      yield put({
        type: actions.SET_STATE,
        payload: {
          AssessmentList: listObject.filter(item => item.node.id !== payload.assessmentId),
        },
      })
    }
    // console.log('assessment deactivated')
  }
}

export function* LOAD_ASSESSMENT_REPORT({ payload }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      AssessmentReportLoading: true,
    },
  })

  // api call for assessment object
  const response = yield call(getAssessmentReport, payload)

  if (response) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        AssessmentReport: response.data.IISAAssessmentSummary,
      },
    })
  }

  yield put({
    type: actions.SET_STATE,
    payload: {
      AssessmentReportLoading: false,
    },
  })
}

export default function* rootSaga() {
  yield all([
    // GET_DATA(), // run once on app load to fetch menu data
    takeEvery(actions.LOAD_DATA, GET_DATA),
    takeEvery(actions.CREATE_ASSESSMENT, CREATE_ASSESSMENT),
    takeEvery(actions.LOAD_ASSESSMENT_OBJECT, LOAD_ASSESSMENT_OBJECT),
    takeEvery(actions.RECORD_RESPONSE, RECORD_RESPONSE),
    takeEvery(actions.MAKE_INACTIVE, MAKE_INACTIVE),
    takeEvery(actions.LOAD_ASSESSMENT_REPORT, LOAD_ASSESSMENT_REPORT),
  ])
}

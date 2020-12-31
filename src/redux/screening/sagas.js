/* eslint-disable no-plusplus */
/* eslint-disable object-shorthand */
/* eslint-disable prefer-destructuring */
import { all, takeEvery, put, call, select } from 'redux-saga/effects'
import { notification } from 'antd'
import {
  getData,
  checkAssessmentObject,
  createAssessment,
  recordResponse,
  updateResponse,
  updateStatus,
  getAreas,
  recordAreaResponse,
  recordVideo,
  endAssessment,
  getScreeningLearners,
  getLearnerScreenings,
  recordAssessmentResponse,
} from 'services/screening'
import actions from './actions'

export function* GET_DATA() {
  yield put({
    type: 'screening/SET_STATE',
    payload: {
      loading: true,
      QuestionsList: [],
      StepsList: [],
      isFormLoading: false,
      showQuestions: false,
      ActiveIndex: 0,
      RecordedObject: null,
      QuestionsResponse: {},
      AreasResponse: {},
      InstructionVideos: null,
      Areas: []
    },
  })
  
  const response = yield call(getData)

  // selecting user id from store
  const userId = yield select(state => state.user.id)
  const assResponse = yield call(checkAssessmentObject, {id: userId})
  console.log( "assess object ===> ", assResponse)

  if (response) {
    const qusResponse = {}
    const areaResponse = {}
    const ques = response.data.preAssessQuestions
    const steps = response.data.autismSteps
    const areas = response.data.preAssessAreas
    let showQus = false
    // recorded object
    const object = assResponse.data.getScreeningAssessStatus
    if(ques.length > 0){
      for(let i=0; i< ques.length; i++){
        qusResponse[ques[i].id] = {recorded: false, response: null}
      }
    }

    if(areas.length > 0){
      for(let k=0; k< areas.length; k++){
        areaResponse[areas[k].id] = {recorded: false, response: null}
      }
    }

    let step = 'step1'
    // setting previous recorded response in store
    if(object.status){

      if(object.details.status === 'QUESTIONSCOMPLETED'){
        step = 'step2'
      }
      else if(object.details.status === 'VIDEOSUPLOADED' ){
        step = 'step4'
      }
      else if(object.details.status === 'COMPLETED' ){
        step = 'step4'
      }
      else if(object.details.status === 'PROGRESS' ){
        showQus = true
      }

      // updating questions responses
      const edges = object.details.assessmentQuestions.edges
      for(let j=0; j< edges.length; j++){
        qusResponse[edges[j].node.question.id] = {recorded: true, response: edges[j].node}
      }

      // updating areas responses
      const areaEdges = object.details.assessmentAreas.edges
      for(let m=0; m< areaEdges.length; m++){
        areaResponse[areaEdges[m].node.area.id] = {recorded: true, response: areaEdges[m].node}
      }

    }

    yield put({
      type: 'screening/SET_STATE',
      payload: {
        StepsList: steps,
        QuestionsList: ques,
        QuestionsResponse: qusResponse,
        AreasResponse: areaResponse,
        RecordedObject: object.status ? object.details : null,
        SelectedStep: step,
        InstructionVideos: response.data.getPreAssessVideos,
        showQuestions: showQus,
      }
    })
  }

  yield put({
    type: 'screening/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* CREATE_ASSESSMENT({payload}){
  yield put({
    type: 'screening/SET_STATE',
    payload: {
      isFormLoading: true,
    }
  })

  const response = yield call(createAssessment, payload)

  if(response){

    yield put({
      type: 'screening/SET_STATE',
      payload: {
        showQuestions: true,
        RecordedObject: response.data.startPreAssess.details,
      }
    })
  }

  yield put({
    type: 'screening/SET_STATE',
    payload: {
      isFormLoading: false,
    }
  })
}

export function* RECORD_RESPONSE({payload}){
  // seecting Questions list from redux store
  const quesList = yield select(state => state.screening.QuestionsList)
  // selecting assessment object id
  const assessmentObjectId = yield select(state => state.screening.RecordedObject.id)
  // selecting question id
  const qusId = quesList[payload.activeIndex].id
  // api call for recording response
  const response = yield call(recordResponse, {qusId: qusId, ansId: payload.resultId, objectId: assessmentObjectId})

  if(response.data){
    const edges = response.data.recordPreAssess.details.assessmentQuestions.edges
    // selection questions response object
    const qusResponse = yield select(state => state.screening.QuestionsResponse)
    if(edges.length > 0){
      for (let i=0; i< edges.length; i++){
        if(edges[i].node.question.id === qusId){
          // updating recorded response to store for future edit operations
          qusResponse[qusId] = {recorded: true, response: edges[i].node}
        }
      }
    }
    
    yield put({
      type: 'screening/SET_STATE',
      payload: {
        RecordedObject: response.data.recordPreAssess.details,
        QuestionsResponse: qusResponse,
      }
    })
  }

}

export function* UPDATE_RESPONSE({payload}){
  // api call for update response
  const response = yield call(updateResponse, payload)
  const qusResp = yield select(state => state.screening.QuestionsResponse)
  if(response.data){
    // updating response to store
    qusResp[response.data.updateScreeningResponse.details.question.id] = { recorded: true, response: response.data.updateScreeningResponse.details}
    yield put({
      type: 'screening/SET_STATE',
      payload: {
        QuestionsResponse: qusResp,
      }
    })
    // console.log(response)
  }

}

export function* UPDATE_STATUS({payload}){
  // api call for update response
  const object = yield select(state => state.screening.RecordedObject)
  const response = yield call(updateStatus, {id: object.id, status: payload.status})

  let step = ''
  if(response.data){
    if(response.data.updateAssessment.details.status === 'QUESTIONSCOMPLETED'){
      step = 'step2'
    }
    else if(response.data.updateAssessment.details.status === 'VIDEOSUPLOADED' ){
      step = 'step4'
    }
    yield put({
      type: 'screening/SET_STATE',
      payload: {
        RecordedObject: response.data.updateAssessment.details,
        SelectedStep: step,
      }
    })
    // console.log(response)
  }

}

export function* GET_AREAS(){
  // api call for areas
  const response = yield call(getAreas)
  if(response.data){
    yield put({
      type: 'screening/SET_STATE',
      payload: {
        Areas: response.data.preAssessAreas,
      }
    })
  }

}

export function* RECORD_AREA_RESPONSE({payload}){
  // selecting assessment object id
  const ObjectId = yield select(state => state.screening.RecordedObject.id)
  // api call for area response
  const response = yield call(recordAreaResponse, {objectId: ObjectId, areaId: payload.areaId, response: payload.response})
  if(response?.data){
    const areaEdges = response.data.recordPreAssessResult.details.assessmentAreas.edges

    // selection area response object
    const areasResponse = yield select(state => state.screening.AreasResponse)
    if(areaEdges.length > 0){
      for (let i=0; i< areaEdges.length; i++){
        if(areaEdges[i].node.area.id === payload.areaId){
          // updating recorded response to store for future edit operations
          areasResponse[payload.areaId] = {recorded: true, response: areaEdges[i].node}
        }
      }
    }

    yield put({
      type: 'screening/SET_STATE',
      payload: {
        AreasResponse: areasResponse,
      }
    })
  }

}

export function* RECORD_VIDEO({payload}){
  // selecting assessment object id
  const ObjectId = yield select(state => state.screening.RecordedObject.id)
  // api call for record video url
  const response = yield call(recordVideo, {objectId: ObjectId, url: payload.url})

  if(response?.data){

    yield put({
      type: 'screening/UPDATE_STATUS',
      payload: {
          status: 'VideosUploaded'
      }
    })

    console.log("recorded video url")
  }

}

export function* END_ASSESSMENT({payload}){
  // api call for End assessment
  const response = yield call(endAssessment, {objectId: payload.objectId, score: payload.score, status: 'Completed'})
  if(response?.data){
    const object = response.data.updateAssessment.details

    yield put({
      type: 'screening/SET_STATE',
      payload: {
        RecordedObject: object,
        // AssessmentStatus: object.status
      }
    })
  }

}

export function* START_NEW_ASSESSMENT(){

    const qusResponse = {}
    const areaResponse = {}
    const ques = yield select(state => state.screening.QuestionsList)
    const areas = yield select(state => state.screening.Areas)

    if(ques.length > 0){
      for(let i=0; i< ques.length; i++){
        qusResponse[ques[i].id] = {recorded: false, response: null}
      }
    }

    if(areas.length > 0){
      for(let k=0; k< areas.length; k++){
        areaResponse[areas[k].id] = {recorded: false, response: null}
      }
    }

    yield put({
      type: 'screening/SET_STATE',
      payload: {
        SelectedStep: 'step1',
        showQuestions: false,
        ActiveIndex: 0,
        RecordedObject: null,
        QuestionsResponse: qusResponse,
        AreasResponse: areaResponse,
      }
    })

}

export function* LOAD_REPORT_DATA(){

  yield put({
    type: 'screening/SET_STATE',
    payload: {
      LoadingLearners: true,
      LearnersList: []      
    }
  })

  const response = yield call(getScreeningLearners)
  if(response?.data){
    yield put({
      type: 'screening/SET_STATE',
      payload: {
        LearnersList: response.data.getScreeningStudents,
        SelectedLearner: response.data.getScreeningStudents.length > 0 ? response.data.getScreeningStudents[0] : null,
        AssessmentAreas: response.data.preAssessAreas
      }
    })

    if(response.data.getScreeningStudents.length > 0){
      yield put({
        type: 'screening/GET_LERNER_SCREENINGS',
        payload: {
          id: response.data.getScreeningStudents[0]?.id   
        }
      })

    }

  }

  yield put({
    type: 'screening/SET_STATE',
    payload: {
      LoadingLearners: false      
    }
  })

}

export function* GET_LERNER_SCREENINGS({payload}){
  yield put({
    type: 'screening/SET_STATE',
    payload: {
      LoadingLearnerAssessments: true      
    }
  })

  const response = yield call(getLearnerScreenings, {learnerId: payload.id})
  if(response?.data){
    yield put({
      type: 'screening/SET_STATE',
      payload: {
        SelectedLearnerAssessments: response.data.getPreAssess.edges
      }
    })

  }

  yield put({
    type: 'screening/SET_STATE',
    payload: {
      LoadingLearnerAssessments: false      
    }
  })

}

export function* RECORD_REPORT_AREA_RESPONSE({payload}){
  // api call for area response
  const response = yield call(recordAreaResponse, {objectId: payload.objectId, areaId: payload.areaId, response: payload.response})
  if(response?.data){
    notification.success({
      message: 'Response Save Successfully!',
    })
  }

}

export function* RECORD_ASSESSMENT_RESPONSE({payload}){
  // api call for area response
  const response = yield call(recordAssessmentResponse, {objectId: payload.objectId, action: payload.action})
  if(response?.data){
    notification.success({
      message: 'Selection Save Successfully!',
    })
  }

}


export default function* rootSaga() {
  yield all([
    // GET_DATA(), // run once on app load to fetch menu data
    takeEvery(actions.LOAD_DATA, GET_DATA),
    takeEvery(actions.CREATE_ASSESSMENT, CREATE_ASSESSMENT),
    takeEvery(actions.RECORD_RESPONSE, RECORD_RESPONSE),
    takeEvery(actions.UPDATE_RESPONSE, UPDATE_RESPONSE),
    takeEvery(actions.UPDATE_STATUS, UPDATE_STATUS),
    takeEvery(actions.GET_AREAS, GET_AREAS),
    takeEvery(actions.RECORD_AREA_RESPONSE, RECORD_AREA_RESPONSE),
    takeEvery(actions.RECORD_VIDEO, RECORD_VIDEO),
    takeEvery(actions.END_ASSESSMENT, END_ASSESSMENT),
    takeEvery(actions.START_NEW_ASSESSMENT, START_NEW_ASSESSMENT),

    // Report Start
    takeEvery(actions.LOAD_REPORT_DATA, LOAD_REPORT_DATA),
    takeEvery(actions.GET_LERNER_SCREENINGS, GET_LERNER_SCREENINGS),
    takeEvery(actions.RECORD_REPORT_AREA_RESPONSE, RECORD_REPORT_AREA_RESPONSE),
    takeEvery(actions.RECORD_ASSESSMENT_RESPONSE, RECORD_ASSESSMENT_RESPONSE),
    
  ])
}

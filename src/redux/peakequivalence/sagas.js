/* eslint-disable no-plusplus */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
import { all, put, takeEvery, call, select } from 'redux-saga/effects'
import { 
  getData, 
  startAssessment,
  getAssessmentDetails,
  recordResponse,
  getAssessmentReport
} from 'services/peakequivalence'
import actions from './actions'

export function* LOAD_DATA() {
  yield put({
    type: 'peakequivalence/SET_STATE',
    payload: {
      Loading: false,
      ObjectLoaded: false,
      AssessmentObject: null,
      SelectedPeakType: '',
      PEDomainList: [],
      PEQuestionsList: [],
      ResponseObject: {},
      SelectedDomainId: null,
      SelectedQuestionId: null, 
      SelectedQuestionIndex: 0,
      PEQuestionsListObject: {},
      SelectedTestIndex: 0,
      SelectedTestId: null,
      ResponseLoading: false,

    },
  })

  const response = yield call(getData)
  if (response) {
    yield put({
      type: 'peakequivalence/SET_STATE',
      payload: {
        PEDomainList: response.data.peakEquDomains,
        SelectedDomainId: response.data.peakEquDomains[0]?.id,

      },
    })
  }
}

export function* START_ASSESSMENT({payload}) {
  yield put({
    type: 'peakequivalence/SET_STATE',
    payload: {
      Loading: true,
    },
  })
  const AssId = yield select(state => state.peakequivalence.ProgramId)
  const response = yield call(startAssessment, {programId: AssId, assType: payload.assessmentType})
  if (response && response.data) {
    yield put({
      type: 'peakequivalence/SET_STATE',
      payload: {
        SelectedPeakType: payload.assessmentType,
        AssessmentObject: response.data.startPeakEquivalance.details,
      },
    })

    const assDetails = yield call(getAssessmentDetails, {programId: response.data.startPeakEquivalance.details.id, assType: payload.assessmentType})

    if (assDetails && assDetails.data){
      console.log(assDetails)
      const responseQuestions = assDetails.data.peakEquQuestions.edges
      const recordedResponse = assDetails.data.peakEquData
      const questionListObject = {}
      const respObject = {}
      const domainList = yield select(state => state.peakequivalence.PEDomainList)

      for (let i=0; i< domainList.length; i++){
        questionListObject[domainList[i].id] = responseQuestions.filter(item => item.node.domain.id === domainList[i].id)
      }

      for (let j=0; j< responseQuestions.length; j++){
        respObject[responseQuestions[j]?.node.id] = {}
        for (let k=0; k< responseQuestions[j]?.node.test.edges.length; k++){
          respObject[responseQuestions[j]?.node.id][responseQuestions[j]?.node.test.edges[k]?.node.id] = {recorded: false, response: null, responseObject: null}
        }
      }

      if (recordedResponse.length > 0){
        const zeroObject = recordedResponse[0]?.records.edges

        for (let l=0; l< zeroObject.length; l++){
          respObject[zeroObject[l].node.question.id][zeroObject[l].node.test.id] = {recorded: true, response: zeroObject[l].node.response, responseObject: zeroObject[l].node}
        }
      }


      yield put({
        type: 'peakequivalence/SET_STATE',
        payload: {
          PEQuestionsList: responseQuestions,
          PEQuestionsListObject: questionListObject,
          SelectedDomainId: domainList[0]?.id,
          SelectedQuestionIndex: 0,
          SelectedQuestionId: responseQuestions[0]?.node.id,
          SelectedTestId: responseQuestions[0]?.node.test.edges[0]?.node.id,
          ResponseObject: respObject,
          ObjectLoaded: true,
          
        },
      })
    }


  }
  yield put({
    type: 'peakequivalence/SET_STATE',
    payload: {
      Loading: false,
    },
  })
}

export function* RECORD_RESPONSE({payload}) {
  yield put({
    type: 'peakequivalence/SET_STATE',
    payload: {
      ResponseLoading: true
    },
  })
  const response = yield call(recordResponse, payload)
  if (response && response.data) {
    const respObject = yield select(state => state.peakequivalence.ResponseObject)

    const records = response.data.recordPeakEquivalance.details.records.edges
    if (records.length > 0){
      for (let l=0; l< records.length; l++){
        respObject[records[l].node.question.id][records[l].node.test.id] = {recorded: true, response: records[l].node.response, responseObject: records[l].node}
      }
    }
    yield put({
      type: 'peakequivalence/SET_STATE',
      payload: {
        ResponseObject: respObject,
      },
    })
  }
  yield put({
    type: 'peakequivalence/SET_STATE',
    payload: {
      ResponseLoading: false
    },
  })
}

export function* GET_REPORT({payload}) {
  yield put({
    type: 'peakequivalence/SET_STATE',
    payload: {
      ReportLoading: true
    },
  })
  // const pk = yield select(state => state.peakequivalence.AssessmentObject?.id)
  const pk = localStorage.getItem('peakId')
  const response = yield call(getAssessmentReport, {programId: pk, peakType: payload.peakType})
  if (response && response.data) {
    console.log(response)

    const rList = []
    rList.push({domain: "Reflexivity", domainScore: response.data.peakEquivalance?.scoreReflexivity})
    rList.push({domain: "Symmetry", domainScore: response.data.peakEquivalance?.scoreSymmetry})
    rList.push({domain: "Transivity", domainScore: response.data.peakEquivalance?.scoreTransivity})
    rList.push({domain: "Equivalance", domainScore: response.data.peakEquivalance?.scoreEquivalance})
    rList.push({domain: "Total", domainScore: response.data.peakEquivalance?.score})

    yield put({
      type: 'peakequivalence/SET_STATE',
      payload: {
        ReportScoreList: rList,
      },
    })
  }
  yield put({
    type: 'peakequivalence/SET_STATE',
    payload: {
      ReportLoading: false
    },
  })
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOAD_DATA, LOAD_DATA),
    takeEvery(actions.START_ASSESSMENT, START_ASSESSMENT),
    takeEvery(actions.RECORD_RESPONSE, RECORD_RESPONSE),
    takeEvery(actions.GET_REPORT, GET_REPORT),
  ])
}

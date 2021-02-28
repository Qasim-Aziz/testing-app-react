/* eslint-disable no-plusplus */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable prefer-destructuring */
/* eslint-disable dot-notation */
/* eslint-disable array-callback-return */
/* eslint-disable object-shorthand */
/* eslint-disable prefer-const */
/* eslint-disable no-lonely-if */
/* eslint-disable one-var */
/* eslint-disable yoda */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-loop-func */
import { all, takeEvery, put, call, select } from 'redux-saga/effects'
import {
  getTargets,
  getChildSessionData,
  createChildSession,
  updateChildSessionDuration,
  finishChildSession,
  createFirstTragetAndTrialInstance,
  recordTargetCorrectTrial,
  updateTargetEndTime,
  createNewTargetInstance,
  updateTargetTrial,
  recordTargetStimulusTrial,
  recordTargetStepTrial,
  // peak queries
  createTargetBlock,
  updateTargetBlock,
  recordBlockTrial,
  updateBlockTrial,
  createNewTargetPeakAutomaticInstance,
  // peak Equivalence
  getCombinationsByCode,
  recordEquivalenceTarget,
  recordEquivalenceTargetUpdate,
} from 'services/sessionrecording'
import actions from './actions'

const debug = true
const peakId = 'VGFyZ2V0RGV0YWlsVHlwZTo4'
const equivalence = 'EQUIVALENCE'

// shuffle peak stimulus block
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }
  return array
}

// create peak stimulus block
function createStimulusList(list) {
  const len = list.length
  let k = 0
  const newList = []
  if (len > 0) {
    for (let i = 0; i < 10; i++) {
      newList.push({
        sd: list[0].node,
        // sd: list[k].node,
        // sdIndex: k,
        position: i,
        recordedData: false,
        marksRecorded: false,
        response: {},
      })
    }
  }
  // return shuffle(newList)
  return newList
}

// create video url by video id
function getVideoUrl(url) {
  // const videoId = url.substring(url.lastIndexOf('/') + 1);
  let finalUrl = ''
  let splitList = []
  let videoId = ''
  splitList = url.split('/')
  if (splitList.length > 3) {
    if (url.split('/')[2] === 'www.youtube.com') {
      finalUrl = url
    } else {
      videoId = url.split('/')[3]
      finalUrl = `https://player.vimeo.com/video/${videoId}/`
    }
  }
  if (debug) console.log(videoId)
  // return videoId
  return finalUrl
}

function resetCorrectIncorrectButtons() {
  var element = document.getElementById('correctResponseButton')

  // If it isn't "undefined" and it isn't "null", then it exists.
  if (typeof element !== 'undefined' && element !== null) {
    document.getElementById('correctResponseButton').style.color = 'gray'
    document.getElementById('correctResponseButton').style.borderColor = '#e4e9f0'
    document.getElementById('incorrectResponseButton').style.color = 'gray'
    document.getElementById('incorrectResponseButton').style.borderColor = '#e4e9f0'
  } else {
    console.log('Buttons does not not exits')
  }
}

function resetStartTime() {
  document.getElementById('updateStartTrialTimeInStore').click()
}

function updateSessionClockTime() {
  // updatig current clock time to store
  document.getElementById('updateSessionCurrentTimeInStore').click()
}

function resetPeakButtons() {
  const getButton0 = document.getElementById('peakResponseButtonZero')
  const getButton2 = document.getElementById('peakResponseButtonTwo')
  const getButton4 = document.getElementById('peakResponseButtonFour')
  const getButton8 = document.getElementById('peakResponseButtonEight')
  const getButton10 = document.getElementById('peakResponseButtonTen')


  if (typeof getButton0 !== 'undefined' && getButton0 !== null) {
    document.getElementById('peakResponseButtonZero').style.backgroundColor = '#e4e9f0'
  }
  if (typeof getButton2 !== 'undefined' && getButton2 !== null) {
    document.getElementById('peakResponseButtonTwo').style.backgroundColor = '#e4e9f0'
  }
  if (typeof getButton4 !== 'undefined' && getButton4 !== null) {
    document.getElementById('peakResponseButtonFour').style.backgroundColor = '#e4e9f0'
  }
  if (typeof getButton8 !== 'undefined' && getButton8 !== null) {
    document.getElementById('peakResponseButtonEight').style.backgroundColor = '#e4e9f0'
  }
  if (typeof getButton10 !== 'undefined' && getButton10 !== null) {
    document.getElementById('peakResponseButtonTen').style.backgroundColor = '#e4e9f0'
  }

}

export function* MOVE_TO_NEXT_TARGET() {
  const MasterSession = yield select(state => state.sessionrecording.MasterSession)
  const TargetActiveId = yield select(state => state.sessionrecording.TargetActiveId)
  const TargetActiveIndex = yield select(state => state.sessionrecording.TargetActiveIndex)

  document.getElementById(MasterSession.targets.edges[TargetActiveIndex + 1].node.id).click()
  document.getElementsByClassName('targetElements')[TargetActiveIndex + 1].style.border =
    '2px solid #bae7ff'
  document.getElementsByClassName('targetElements')[TargetActiveIndex].style.border = 'none'

  // updating start trial time
  resetStartTime()
  // updatig current clock time to store
  updateSessionClockTime()
  resetCorrectIncorrectButtons()
  // updating previous target end time
  yield put({
    type: 'sessionrecording/TARGET_UPDATE',
    payload: {
      targetId: TargetActiveId,
    },
  })

  // Updating target index and target id to store
  yield put({
    type: 'sessionrecording/SET_STATE',
    payload: {
      TargetActiveIndex: TargetActiveIndex + 1,
      TargetActiveId: MasterSession.targets.edges[TargetActiveIndex + 1].node.id,
      PeakTrialCount: 1,
      PeakBlockIndex: 0,
      StepActiveIndex: 0,
      StimulusActiveIndex: 0,
      EquiTrialCount: 1
    },
  })

  // reset peak button style
  resetPeakButtons()

  // creating new target skills model instance
  yield put({
    type: 'sessionrecording/CREATE_NEW_TARGET_INSTANCE',
    payload: {
      targetId: MasterSession.targets.edges[TargetActiveIndex + 1].node.id,
      targetIndex: TargetActiveIndex + 1,
    },
  })

  // load video
  // this.getVideoUrl(TargetActiveIndex + 1)
}

export function* UpdateDuration() {
  // selecting child session id for creating child session
  const childSessionId = yield select(state => state.sessionrecording.ChildSession.id)
  const sessionDuration = yield select(state => state.sessionrecording.CurrentSessionTime)
  // updating session duration
  yield call(updateChildSessionDuration, { id: childSessionId, duration: sessionDuration })
}

export function* GET_DATA({ payload }) {
  yield put({
    type: 'sessionrecording/SET_STATE',
    payload: {
      loading: true,
      MasterSession: null,
      ChildSession: null,
      TargetResponse: {},
      RecordingType: 'Target',
      SessionStatus: 'Pending',
      StepActiveIndex: 0,
      StepActiveId: '',
      StimulusActiveIndex: 0,
      StimulusActiveId: '',
      TargetActiveIndex: 0,
      TargetActiveId: '',
      Count: 1,
      CorrectCount: 0,
      IncorrectCount: 0,

      // holding trial start time
      TrialStartTime: 0,
      // for disabled target recording block
      Disabled: true,
      // for storing session clock time for api calls
      CurrentSessionTime: 0,
    },
  })

  const response = yield call(getTargets, payload)
  let videoAvailable = false
  let videoUrl = ''

  if (response && response.data) {
    console.log('received response ===>')
    const targetResponse = {}
    let targetId = ''
    let stimulusId = ''
    let stepId = ''
    let i = 0

    if (response.data.getsession.targets.edgeCount > 0) {
      const targets = response.data.getsession.targets
      targetId = targets.edges[0].node.id

      // Load first video url
      if (targets.edges[0].node.videos.edges.length > 0) {
        if (debug) {
          console.log('====> video exists')
        }
        videoUrl = getVideoUrl(targets.edges[0].node.videos.edges[0].node.url)
        videoAvailable = true
      }
      // End video url

      if (targets.edges[0].node.sd && targets.edges[0].node.sd.edges.length > 0) {
        stimulusId = targets.edges[0].node.sd.edges[0].node.id
      } else if (targets.edges[0].node.steps && targets.edges[0].node.steps.edges.length > 0) {
        stepId = targets.edges[0].node.steps.edges[0].node.id
      }

      for (i = 0; i < targets.edgeCount; i++) {
        targetResponse[targets.edges[i].node.id] = {}
        targetResponse[targets.edges[i].node.id]['target'] = []

        if (targets.edges[i].node.sd && targets.edges[i].node.sd.edges.length > 0) {
          let j = 0
          targetResponse[targets.edges[i].node.id]['sd'] = {}
          for (j = 0; j < targets.edges[i].node.sd.edges.length; j++) {
            targetResponse[targets.edges[i].node.id]['sd'][
              targets.edges[i].node.sd.edges[j].node.id
            ] = []
          }
        }
        if (targets.edges[i].node.steps && targets.edges[i].node.steps.edges.length > 0) {
          let k = 0
          targetResponse[targets.edges[i].node.id]['step'] = {}
          for (k = 0; k < targets.edges[i].node.steps.edges.length; k++) {
            targetResponse[targets.edges[i].node.id]['step'][
              targets.edges[i].node.steps.edges[k].node.id
            ] = []
          }
        }

        // start of peak
        if (targets.edges[i].node.targetAllcatedDetails.targetType.id === peakId) {
          if (debug) console.log('found peak')

          if (targets.edges[i].node.peakType === equivalence) {
            targetResponse[targets.edges[i].node.id]['equivalence'] = { train: {}, test: {} }

            const combinationResponse = yield call(getCombinationsByCode, {
              code: targets.edges[i].node.eqCode ? targets.edges[i].node.eqCode : '1A',
            })

            if (combinationResponse && combinationResponse.data) {
              if (debug) console.log('cobinationResponse', combinationResponse)
              const combTrain = combinationResponse.data.getPeakEquCodes.edges[0]?.node.train
              const combTest = combinationResponse.data.getPeakEquCodes.edges[0]?.node.test
              if (combTrain) {
                if (debug) console.log('cobinationResponse ==> Train')
                for (let o = 0; o < combTrain.edges.length; o++) {
                  targetResponse[targets.edges[i].node.id]['equivalence']['train'][
                    combTrain.edges[o].node.id
                  ] = {}

                  for (let p = 0; p < targets.edges[i].node.classes.edges.length; p++) {
                    targetResponse[targets.edges[i].node.id]['equivalence']['train'][
                      combTrain.edges[o].node.id
                    ][targets.edges[i].node.classes.edges[p].node.id] = []
                  }
                }
              }

              if (combTest) {
                if (debug) console.log('cobinationResponse ==> Test')
                for (let o = 0; o < combTest.edges.length; o++) {
                  targetResponse[targets.edges[i].node.id]['equivalence']['test'][
                    combTest.edges[o].node.id
                  ] = {}

                  for (let p = 0; p < targets.edges[i].node.classes.edges.length; p++) {
                    targetResponse[targets.edges[i].node.id]['equivalence']['test'][
                      combTest.edges[o].node.id
                    ][targets.edges[i].node.classes.edges[p].node.id] = []
                  }
                }
              }
            }
          } else if (targets.edges[i].node.sd) {
            targetResponse[targets.edges[i].node.id]['peak'] = {}
            const peakBlocksCount = targets.edges[i].node.peakBlocks
            for (let j = 0; j < peakBlocksCount; j++) {
              targetResponse[targets.edges[i].node.id]['peak'][j] = {
                block: createStimulusList(targets.edges[i].node.sd.edges),
                blockId: null,
                blockStart: null,
                blockEnd: null,
              }
            }
          }
          // targetResponse[targets.edges[i].node.id]['peak'] = createStimulusList(targets.edges[i].node.sd.edges)
        }
        // end of peak
      }
    }

    yield put({
      type: 'sessionrecording/SET_STATE',
      payload: {
        MasterSession: response.data.getsession,
        PromptCodesList: response.data.promptCodes,
        TargetResponse: targetResponse,
        TargetActiveId: targetId,
        StimulusActiveId: stimulusId,
        StepActiveId: stepId,
        VideoAvailable: videoAvailable,
        VideoUrl: videoUrl,
      },
    })

    let sessionEditAble = true

    // if child session exist
    if (response.data.getChildSession && response.data.getChildSession.edges.length > 0) {
      let sessionStatus = 'Paused'

      if (response.data.getChildSession.edges[0].node.status === 'COMPLETED') {
        sessionStatus = 'Completed'
        sessionEditAble = false
      }
      yield put({
        type: 'sessionrecording/SET_STATE',
        payload: {
          ChildSession: response.data.getChildSession.edges[0].node,
          SessionStatus: sessionStatus,
          EditAfterSessionCompleted: sessionEditAble,
          Disabled: sessionEditAble,
          TrialStartTime: response.data.getChildSession.edges[0].node.duration,
        },
      })

      if (debug) {
        console.log('====> now checking child session recording')
      }
      // if data recording present
      const childResponse = yield call(getChildSessionData, {
        id: response.data.getChildSession.edges[0].node.id,
        date: response.data.getChildSession.edges[0].node.sessionDate,
      })

      if (childResponse && childResponse.data) {
        if (debug) {
          console.log('====> found child session recording')
          console.log(childResponse, targetResponse)
        }
        // updating targets response in store
        childResponse.data.getSessionRecordings.edges.map(item => {
          targetResponse[item.node.targets.id] = {
            ...targetResponse[item.node.targets.id],
            skillsId: item.node.id,
            startTime: item.node.durationStart,
            endTime: item.node.durationEnd,
          }

          // check for equivalence recording
          if (item.node.isPeakEquivalance) {
            item.node.peakEquivalance.edges.map((equiNode, index) => {
              if (equiNode.node.recType === 'TRAIN') {
                // console.log(targetResponse[item.node.targets.id].equivalence.train[equiNode.node.relationTrain.id], equiNode.node.relationTrain.id, equiNode.node.codeClass.id)
                targetResponse[item.node.targets.id].equivalence.train[
                  equiNode.node.relationTrain.id
                ][equiNode.node.codeClass.id] = [
                    ...targetResponse[item.node.targets.id].equivalence.train[
                    equiNode.node.relationTrain.id
                    ][equiNode.node.codeClass.id],
                    equiNode.node,
                  ]
              }

              if (equiNode.node.recType === 'TEST') {
                targetResponse[item.node.targets.id].equivalence.test[
                  equiNode.node.relationTest.id
                ][equiNode.node.codeClass.id] = [
                    ...targetResponse[item.node.targets.id].equivalence.test[
                    equiNode.node.relationTest.id
                    ][equiNode.node.codeClass.id],
                    equiNode.node,
                  ]
              }
            })
          }

          // check for peak recording
          if (item.node.peak.edges.length > 0) {
            item.node.peak.edges.map((peakBlock, index) => {
              targetResponse[item.node.targets.id].peak[index] = {
                ...targetResponse[item.node.targets.id].peak[index],
                blockId: peakBlock.node.id,
                blockStart: peakBlock.node.durationStart,
                blockEnd: peakBlock.node.durationEnd,
              }

              if (peakBlock.node.trial.edges.length > 0) {
                peakBlock.node.trial.edges.map((trialObject, trialIndex) => {
                  targetResponse[item.node.targets.id].peak[index].block[trialIndex] = {
                    ...targetResponse[item.node.targets.id].peak[index].block[trialIndex],
                    recordedData: true,
                    response: trialObject.node,
                    marksRecorded: trialObject.node.marks ? true : false,
                  }
                })
              }
            })
          }
          // end check for peak recording

          // checking for target Correct / Incorrect data recording
          if (item.node.sessionRecord.edges.length > 0) {
            item.node.sessionRecord.edges.map(recordingItem => {
              if (recordingItem.node.sd) {
                targetResponse[item.node.targets.id]['sd'][recordingItem.node.sd.id] = [
                  ...targetResponse[item.node.targets.id]['sd'][recordingItem.node.sd.id],
                  recordingItem.node,
                ]
              } else if (recordingItem.node.step) {
                targetResponse[item.node.targets.id]['step'][recordingItem.node.step.id] = [
                  ...targetResponse[item.node.targets.id]['step'][recordingItem.node.step.id],
                  recordingItem.node,
                ]
              } else {
                targetResponse[item.node.targets.id]['target'] = [
                  ...targetResponse[item.node.targets.id]['target'],
                  recordingItem.node,
                ]
              }
            })
          }
          // end of correct / incorrect data recording
        })

        // Updating other info according to recordings like Count, IncorrectCount, CorrectCount, TargetActiveIndex, TargetActiveId

        let currentCount = 1
        let currentCorrectCount = 0
        let currentIncorrectCount = 0
        let targetIndex = 0
        // let targetId = ''
        let stimulusIndex = 0
        // let stimulusId = ''
        let stepIndex = 0
        // let stepId = ''

        let peakBlockIndex = 0
        let blockTrial = 1

        const edgeLength = childResponse.data.getSessionRecordings.edges.length
        if (edgeLength > 0) {
          const lastObject = childResponse.data.getSessionRecordings.edges[edgeLength - 1].node

          // Updating TargetActiveIndex, TargetActiveId
          if (response.data.getsession.targets.edgeCount > 0) {
            // for peak block index and trial count
            if (lastObject.peak.edges.length > 0) {
              peakBlockIndex = lastObject.peak.edges.length - 1
              const lastEdge = lastObject.peak.edges[peakBlockIndex]
              // blockTrial = lastEdge.node.trial.edges.length + 1

              lastEdge.node.trial.edges.map(peakTrialNode => {
                if (peakTrialNode.node.marks) {
                  if (blockTrial < 10) blockTrial += 1
                }
              })
            }
            // end of peak block and trial

            response.data.getsession.targets.edges.map((item, index) => {
              if (item.node.id === lastObject.targets.id) {
                targetIndex = index
                targetId = lastObject.targets.id

                if (item.node.sd && item.node.sd.edges.length > 0) {
                  stimulusId = item.node.sd.edges[0].node.id
                } else {
                  stimulusId = ''
                }
                if (item.node.steps && item.node.steps.edges.length > 0) {
                  stepId = item.node.steps.edges[0].node.id
                } else {
                  stepId = ''
                }

                // Load last recorded target video url
                if (
                  response.data.getsession.targets.edges[targetIndex].node.videos.edges.length > 0
                ) {
                  if (debug) {
                    console.log('====> video exists')
                  }
                  videoUrl = getVideoUrl(
                    response.data.getsession.targets.edges[targetIndex].node.videos.edges[0].node
                      .url,
                  )
                  videoAvailable = true
                }
                // End video url

                const lastObjectEdgeCount = lastObject.sessionRecord.edges.length
                // updating stimulus or step index and id to store
                if (lastObjectEdgeCount > 0) {
                  const lastObjectLastEntry =
                    lastObject.sessionRecord.edges[lastObjectEdgeCount - 1].node
                  if (lastObjectLastEntry.sd) {
                    stimulusId = lastObjectLastEntry.sd.id
                    item.node.sd.edges.map((sdItem, sdIndex) => {
                      if (sdItem.node.id === stimulusId) {
                        stimulusIndex = sdIndex
                      }
                    })
                  } else if (lastObjectLastEntry.step) {
                    stepId = lastObjectLastEntry.step.id
                    item.node.steps.edges.map((stepsItem, stepsIndex) => {
                      if (stepsItem.node.id === stepId) {
                        stepIndex = stepsIndex
                      }
                    })
                  }
                }
              }
            })
          }

          // updating Count, CorrectCount & IncorrectCount
          if (stimulusId !== '') {
            console.log(targetId)
            if (targetResponse[targetId].sd[stimulusId].length > 0) {
              // check target daily trials here and compare with trials recorded and if recorded trials equal to daily
              // currentCount = targetResponse[targetId].sd[stimulusId].length + 1
              const recordedTrials = targetResponse[targetId].sd[stimulusId].length
              const dT = response.data.getsession.targets.edges[targetIndex].node.targetAllcatedDetails.DailyTrials
              if (recordedTrials >= dT) currentCount = recordedTrials
              else currentCount = recordedTrials + 1

              targetResponse[targetId].sd[stimulusId].map(recordingItem => {
                if (recordingItem.trial === 'CORRECT') {
                  currentCorrectCount += 1
                }
                if (
                  recordingItem.trial === 'ERROR' ||
                  recordingItem.trial === 'PROMPT' ||
                  recordingItem.trial === 'INCORRECT'
                ) {
                  currentIncorrectCount += 1
                }
              })
            }
          } else if (!(stepId === '')) {
            if (targetResponse[targetId].step[stepId].length > 0) {
              // currentCount = targetResponse[targetId].step[stepId].length + 1
              const recordedTrials = targetResponse[targetId].step[stepId].length
              const dT = response.data.getsession.targets.edges[targetIndex].node.targetAllcatedDetails.DailyTrials
              if (recordedTrials >= dT) currentCount = recordedTrials
              else currentCount = recordedTrials + 1
              // response.data.getsession.targets.edges[targetIndex].node
              targetResponse[targetId].step[stepId].map(recordingItem => {
                if (recordingItem.trial === 'CORRECT') {
                  currentCorrectCount += 1
                }
                if (
                  recordingItem.trial === 'ERROR' ||
                  recordingItem.trial === 'PROMPT' ||
                  recordingItem.trial === 'INCORRECT'
                ) {
                  currentIncorrectCount += 1
                }
              })
            }
          } else {
            if (targetResponse[targetId].target.length > 0) {
              // currentCount = targetResponse[targetId].target.length + 1
              const recordedTrials = targetResponse[targetId].target.length
              const dT = response.data.getsession.targets.edges[targetIndex].node.targetAllcatedDetails.DailyTrials
              if (recordedTrials >= dT) currentCount = recordedTrials
              else currentCount = recordedTrials + 1
              targetResponse[targetId].target.map(recordingItem => {
                if (recordingItem.trial === 'CORRECT') {
                  currentCorrectCount += 1
                }
                if (
                  recordingItem.trial === 'ERROR' ||
                  recordingItem.trial === 'PROMPT' ||
                  recordingItem.trial === 'INCORRECT'
                ) {
                  currentIncorrectCount += 1
                }
              })
            }
          }

          // if(lastObject.sessionRecord.edges.length > 0){
          //     currentCount = lastObject.sessionRecord.edges.length + 1
          //     lastObject.sessionRecord.edges.map(recordingItem => {
          //         if (recordingItem.node.trial === 'CORRECT'){
          //             currentCorrectCount += 1
          //         }
          //         if (recordingItem.node.trial === 'ERROR'){
          //             currentIncorrectCount += 1
          //         }
          //         if (recordingItem.node.trial === 'PROMPT'){
          //             currentIncorrectCount += 1
          //         }
          //     })
          // }
        }

        yield put({
          type: 'sessionrecording/SET_STATE',
          payload: {
            TargetResponse: targetResponse,
            Count: currentCount,
            CorrectCount: currentCorrectCount,
            IncorrectCount: currentIncorrectCount,
            TargetActiveIndex: targetIndex,
            TargetActiveId: targetId,
            StepActiveIndex: stepIndex,
            StepActiveId: stepId,
            StimulusActiveIndex: stimulusIndex,
            StimulusActiveId: stimulusId,
            VideoAvailable: videoAvailable,
            VideoUrl: videoUrl,
            PeakTrialCount: blockTrial,
            // PeakBlockIndex: peakBlockIndex,
            // PeakTrialCount: 1,
            PeakBlockIndex: 0,
          },
        })
      }
    }
  }

  yield put({
    type: 'sessionrecording/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

// not in use
export function* GET_CHILD_SESSION_DATA({ payload }) {
  const response = yield call(getChildSessionData, payload)
  if (response && response.data) {
    yield put({
      type: 'sessionrecording/SET_STATE',
      payload: {
        CorrectCount: 0,
      },
    })
  }
}

export function* START_SESSION({ payload }) {
  // selecting master session id for creating child session
  const masterSessionId = yield select(state => state.sessionrecording.MasterSession.id)
  const sDate = yield select(state => state.sessionrecording.SessionDate)
  const peakAutomatic = yield select(state => state.sessionrecording.PeakAutomatic)
  // creating child session object
  const response = yield call(createChildSession, {
    masterSessionId: masterSessionId,
    SessionDate: sDate,
  })
  if (response && response.data && response.data.startSession) {
    yield put({
      type: 'sessionrecording/SET_STATE',
      payload: {
        ChildSession: response.data.startSession.details,
        SessionStatus: 'InProgress',
      },
    })

    // selecting master session
    const masterSession = yield select(state => state.sessionrecording.MasterSession)
    const targetResponse = yield select(state => state.sessionrecording.TargetResponse)

    if (masterSession.targets.edgeCount > 0) {
      if (
        masterSession.targets.edges[0].node.targetAllcatedDetails.targetType.id === peakId &&
        peakAutomatic &&
        masterSession.targets.edges[0].node.peakType !== equivalence
      ) {
        const targetId = masterSession.targets.edges[0]?.node.id
        const responseTarget = yield call(createNewTargetPeakAutomaticInstance, {
          childId: response.data.startSession.details.id,
          statusId: masterSession.targets.edges[0].node.targetStatus.id,
          targetId: targetId,
          start: 0,
        })
        // updating target instance and skill id to store for future api calls
        if (responseTarget && responseTarget.data) {
          targetResponse[targetId] = {
            ...targetResponse[targetId],
            skillsId: responseTarget.data.peakBlockAutomatic.skill.id,
            startTime: responseTarget.data.peakBlockAutomatic.skill.durationStart,
            endTime: responseTarget.data.peakBlockAutomatic.skill.durationEnd,
          }

          if (responseTarget.data.peakBlockAutomatic.skill.peak.edges.length > 0) {
            // updating automatic created peak blocks id to store
            responseTarget.data.peakBlockAutomatic.skill.peak.edges.map((nodeItem, index) => {
              targetResponse[targetId].peak[index] = {
                ...targetResponse[targetId].peak[index],
                blockId: nodeItem.node.id,
                blockStart: nodeItem.node.durationStart,
              }
              // updating automatic created peak block trials to store
              if (nodeItem.node.trial.edges.length > 0) {
                nodeItem.node.trial.edges.map((trailNode, trialIndex) => {
                  targetResponse[targetId].peak[index].block[trialIndex] = {
                    ...targetResponse[targetId].peak[index].block[trialIndex],
                    recordedData: true,
                    response: trailNode.node,
                    sd: trailNode.node.sd,
                  }
                })
              }
            })
          }

          yield put({
            type: 'sessionrecording/SET_STATE',
            payload: {
              TargetResponse: targetResponse,
              PeakTrialCount: 1,
              PeakBlockIndex: 0,
            },
          })
        }
      } else {
        // create first target instance in system
        const result = yield call(createFirstTragetAndTrialInstance, {
          childId: response.data.startSession.details.id,
          targetId: masterSession.targets.edges[0].node.id,
          targetStatusId: masterSession.targets.edges[0].node.targetStatus.id,
        })
        // updating response in redux store
        if (result && result.data) {
          // yield put({
          //   type: 'sessionrecording/UPDATE_FIRST_TARGET_RESPONSE',
          //   payload: {
          //     object: result.data.sessionRecording.details,
          //   },
          // })

          targetResponse[masterSession.targets.edges[0].node.id] = {
            ...targetResponse[masterSession.targets.edges[0].node.id],
            skillsId: result.data.sessionRecording.details.id,
            startTime: result.data.sessionRecording.details.durationStart,
            endTime: result.data.sessionRecording.details.durationEnd,
          }

          yield put({
            type: 'sessionrecording/SET_STATE',
            payload: {
              TargetResponse: targetResponse,
            },
          })

          // if target type peak then create block Object
          if (
            masterSession.targets.edges[0].node.targetAllcatedDetails.targetType.id === peakId &&
            masterSession.targets.edges[0].node.peakType !== equivalence
          ) {
            const blockResponse = yield call(createTargetBlock, {
              skillsId: result.data.sessionRecording.details.id,
              startTime: result.data.sessionRecording.details.durationStart,
            })
            if (blockResponse && blockResponse.data) {
              // updating created block details on redux store
              targetResponse[masterSession.targets.edges[0].node.id].peak[0] = {
                ...targetResponse[masterSession.targets.edges[0].node.id].peak[0],
                blockId: blockResponse.data.peakBlock.block.id,
                blockStart: blockResponse.data.peakBlock.block.durationStart,
              }

              yield put({
                type: 'sessionrecording/SET_STATE',
                payload: {
                  TargetResponse: targetResponse,
                  PeakTrialCount: 1,
                  PeakBlockIndex: 0,
                },
              })
            }
          }
          // end of peak block create code
        }
      }
    }
  }
}

export function* PAUSE_SESSION({ payload }) {
  // selecting child session id for creating child session
  const childSessionId = yield select(state => state.sessionrecording.ChildSession.id)
  // updating session duration
  const response = yield call(updateChildSessionDuration, {
    id: childSessionId,
    duration: payload.duration,
  })
  if (response && response.data && response.data.changeSessionStatus) {
    yield put({
      type: 'sessionrecording/SET_STATE',
      payload: {
        ChildSession: response.data.changeSessionStatus.details,
        SessionStatus: 'Paused',
      },
    })
  }
}

export function* RESUME_SESSION({ payload }) {
  // const response = yield call(getTargets)

  // if (response && response.data) {
  yield put({
    type: 'sessionrecording/SET_STATE',
    payload: {
      SessionStatus: 'InProgress',
    },
  })
  // }
}

export function* END_SESSION({ payload }) {
  // selecting child session id for creating child session
  const childSessionId = yield select(state => state.sessionrecording.ChildSession.id)
  // updating session duration
  const response = yield call(finishChildSession, {
    id: childSessionId,
    duration: payload.duration,
  })
  console.log(response)
  if (response && response.data && response.data.changeSessionStatus) {
    yield put({
      type: 'sessionrecording/SET_STATE',
      payload: {
        ChildSession: response.data.changeSessionStatus.details,
        SessionStatus: 'Completed',
      },
    })
  }
}

export function* TARGET_CORRECT({ payload }) {
  yield put({
    type: 'sessionrecording/SET_STATE',
    payload: {
      ResponseLoading: true,
    },
  })
  // selecting child session id for creating child session
  const childSessionId = yield select(state => state.sessionrecording.ChildSession.id)
  const targetActiveId = yield select(state => state.sessionrecording.TargetActiveId)
  const trialStartTime = yield select(state => state.sessionrecording.TrialStartTime)
  const currentSessionTime = yield select(state => state.sessionrecording.CurrentSessionTime)
  const masterSession = yield select(state => state.sessionrecording.MasterSession)
  const targetActiveIndex = yield select(state => state.sessionrecording.TargetActiveIndex)
  const count = yield select(state => state.sessionrecording.Count)
  // selecting status id of the target
  const sessionStatusId = masterSession.targets.edges[targetActiveIndex].node.targetStatus.id
  // updating session duration
  const response = yield call(recordTargetCorrectTrial, {
    childId: childSessionId,
    statusId: sessionStatusId,
    targetId: targetActiveId,
    start: trialStartTime,
    end: currentSessionTime,
    promptId: payload.promptId,
    response: payload.response,
    note: payload.note,
  })
  if (response && response.data && response.data.sessionRecording) {
    const targetResponse = yield select(state => state.sessionrecording.TargetResponse)
    targetResponse[targetActiveId].target = []
    response.data.sessionRecording.details.sessionRecord.edges.map(item => {
      targetResponse[targetActiveId].target = [...targetResponse[targetActiveId].target, item.node]
    })

    yield put({
      type: 'sessionrecording/SET_STATE',
      payload: {
        TargetResponse: targetResponse,
      },
    })

    if (count < masterSession.targets.edges[targetActiveIndex].node.targetAllcatedDetails.DailyTrials) {
      yield put({
        type: 'sessionrecording/SET_STATE',
        payload: {
          Count: count + 1,
        },
      })
      resetStartTime()
      resetCorrectIncorrectButtons()
    }
    else if (count >= masterSession.targets.edges[targetActiveIndex].node.targetAllcatedDetails.DailyTrials && (targetActiveIndex + 1 < masterSession.targets.edges.length)) {
      yield put({
        type: 'sessionrecording/MOVE_TO_NEXT_TARGET',
      })
    }

    // update session duration
    yield put({
      type: 'sessionrecording/UPDATE_DURATION',
    })

    yield put({
      type: 'sessionrecording/SET_STATE',
      payload: {
        ResponseLoading: false,
      },
    })
  }
}

export function* TARGET_UPDATE({ payload }) {
  // selecting child session id for creating child session
  const currentSessionTime = yield select(state => state.sessionrecording.CurrentSessionTime)
  const targetResponse = yield select(state => state.sessionrecording.TargetResponse)
  const currentBlockIndex = yield select(state => state.sessionrecording.PeakBlockIndex)

  // getting skillsId for target
  const skillsId = targetResponse[payload.targetId].skillsId
  const previousTargetTime = targetResponse[payload.targetId].endTime

  if (previousTargetTime === 0) {
    const response = yield call(updateTargetEndTime, {
      skillsId: skillsId,
      endTime: currentSessionTime,
    })
    if (response && response.data) {
      // updating target end time in redux store
      targetResponse[payload.targetId].endTime = response.data.updateTargetRec.details.durationEnd

      yield put({
        type: 'sessionrecording/SET_STATE',
        payload: {
          TargetResponse: targetResponse,
        },
      })
    }

    // checking and updating peak block end time
    if (targetResponse[payload.targetId].peak) {
      const blockId = targetResponse[payload.targetId].peak[currentBlockIndex].blockId
      const previousBlockTime = targetResponse[payload.targetId].peak[currentBlockIndex].blockEnd
      if (previousBlockTime === 0) {
        const blockResponse = yield call(updateTargetBlock, {
          skillsId: skillsId,
          blockId: blockId,
          endTime: currentSessionTime,
        })
        if (blockResponse && blockResponse.data) {
          targetResponse[payload.targetId].peak[currentBlockIndex].blockEnd =
            blockResponse.data.peakBlock.block.durationEnd

          yield put({
            type: 'sessionrecording/SET_STATE',
            payload: {
              TargetResponse: targetResponse,
            },
          })
        }
      }
    }
    // end of check
  }
  // update session duration
  yield put({
    type: 'sessionrecording/UPDATE_DURATION',
  })
}

export function* CREATE_NEW_TARGET_INSTANCE({ payload }) {
  // selecting child session id for creating child session
  const currentSessionTime = yield select(state => state.sessionrecording.CurrentSessionTime)
  const targetResponse = yield select(state => state.sessionrecording.TargetResponse)
  const childSessionId = yield select(state => state.sessionrecording.ChildSession.id)
  const masterSession = yield select(state => state.sessionrecording.MasterSession)
  const peakAutomatic = yield select(state => state.sessionrecording.PeakAutomatic)
  // selecting status id of the target
  const sessionStatusId = masterSession.targets.edges[payload.targetIndex].node.targetStatus.id
  // console.log(childSessionId, sessionStatusId, payload.targetId, currentSessionTime)
  const targetObject = masterSession.targets.edges[payload.targetIndex].node
  let stimulusId = ''
  let stepId = ''

  if (targetObject.sd.edges.length > 0) {
    stimulusId = targetObject.sd.edges[payload.index ? payload.index : 0].node.id
  } else if (targetObject.steps.edges.length > 0) {
    stepId = targetObject.steps.edges[payload.index ? payload.index : 0].node.id
  }

  // new target class one id
  if (masterSession.targets.edges[payload.targetIndex].node.peakType === equivalence) {
    yield put({
      type: 'sessionrecording/SET_STATE',
      payload: {
        SelectedClassId:
          masterSession.targets.edges[payload.targetIndex].node.classes.edges[0]?.node.id,
      },
    })
  }

  if (!targetResponse[payload.targetId].skillsId) {
    if (
      masterSession.targets.edges[payload.targetIndex].node.targetAllcatedDetails.targetType.id ===
      peakId &&
      peakAutomatic &&
      masterSession.targets.edges[payload.targetIndex].node.peakType !== equivalence
    ) {
      const response = yield call(createNewTargetPeakAutomaticInstance, {
        childId: childSessionId,
        statusId: sessionStatusId,
        targetId: payload.targetId,
        start: currentSessionTime,
      })
      // updating target instance and skill id to store for future api calls
      if (response && response.data) {
        targetResponse[payload.targetId] = {
          ...targetResponse[payload.targetId],
          skillsId: response.data.peakBlockAutomatic.skill.id,
          startTime: response.data.peakBlockAutomatic.skill.durationStart,
          endTime: response.data.peakBlockAutomatic.skill.durationEnd,
        }

        if (response.data.peakBlockAutomatic.skill.peak.edges.length > 0) {
          // updating automatic created peak blocks id to store
          response.data.peakBlockAutomatic.skill.peak.edges.map((nodeItem, index) => {
            targetResponse[payload.targetId].peak[index] = {
              ...targetResponse[payload.targetId].peak[index],
              blockId: nodeItem.node.id,
              blockStart: nodeItem.node.durationStart,
            }
            // updating automatic created peak block trials to store
            if (nodeItem.node.trial.edges.length > 0) {
              nodeItem.node.trial.edges.map((trailNode, trialIndex) => {
                targetResponse[payload.targetId].peak[index].block[trialIndex] = {
                  ...targetResponse[payload.targetId].peak[index].block[trialIndex],
                  recordedData: true,
                  response: trailNode.node,
                  sd: trailNode.node.sd,
                  marksRecorded: false,
                }
              })
            }
          })
        }

        yield put({
          type: 'sessionrecording/SET_STATE',
          payload: {
            TargetResponse: targetResponse,
            Count: 1,
            CorrectCount: 0,
            IncorrectCount: 0,
            StepActiveIndex: payload.index ? payload.index : 0,
            StepActiveId: stepId,
            StimulusActiveIndex: payload.index ? payload.index : 0,
            StimulusActiveId: stimulusId,
          },
        })
      }
    } else {
      const response = yield call(createNewTargetInstance, {
        childId: childSessionId,
        statusId: sessionStatusId,
        targetId: payload.targetId,
        start: currentSessionTime,
      })
      if (response && response.data) {
        // updating target end time in redux store
        targetResponse[payload.targetId] = {
          ...targetResponse[payload.targetId],
          skillsId: response.data.sessionRecording.details.id,
          startTime: response.data.sessionRecording.details.durationStart,
          endTime: response.data.sessionRecording.details.durationEnd,
        }
        yield put({
          type: 'sessionrecording/SET_STATE',
          payload: {
            TargetResponse: targetResponse,
            Count: 1,
            CorrectCount: 0,
            IncorrectCount: 0,
            StepActiveIndex: payload.index ? payload.index : 0,
            StepActiveId: stepId,
            StimulusActiveIndex: payload.index ? payload.index : 0,
            StimulusActiveId: stimulusId,
          },
        })

        // if target type peak then create block Object
        if (
          masterSession.targets.edges[payload.targetIndex].node.targetAllcatedDetails.targetType
            .id === peakId &&
          masterSession.targets.edges[payload.targetIndex].node.peakType !== equivalence
        ) {
          const blockResponse = yield call(createTargetBlock, {
            skillsId: response.data.sessionRecording.details.id,
            startTime: response.data.sessionRecording.details.durationStart,
          })
          if (blockResponse && blockResponse.data) {
            // updating created block details on redux store
            targetResponse[payload.targetId].peak[0] = {
              ...targetResponse[payload.targetId].peak[0],
              blockId: blockResponse.data.peakBlock.block.id,
              blockStart: blockResponse.data.peakBlock.block.durationStart,
            }

            yield put({
              type: 'sessionrecording/SET_STATE',
              payload: {
                TargetResponse: targetResponse,
                PeakTrialCount: 1,
                PeakBlockIndex: 0,
              },
            })
          }
        }
        // end of peak block create code
      }
    }
  } else {
    let currentCount = 1
    let currentCorrectCount = 0
    let currentIncorrectCount = 0

    let peakBlockIndex = 0
    let blockTrial = 1
    // updating Count, CorrectCount & IncorrectCount

    // if(targetResponse[payload.targetId].target.length > 0){
    //     currentCount = targetResponse[payload.targetId].target.length + 1
    //     targetResponse[payload.targetId].target.map(recordingItem => {
    //         if (recordingItem.trial === 'CORRECT'){
    //             currentCorrectCount += 1
    //         }
    //         if (recordingItem.trial === 'ERROR'){
    //             currentIncorrectCount += 1
    //         }
    //         if (recordingItem.trial === 'PROMPT'){
    //             currentIncorrectCount += 1
    //         }
    //     })
    // }

    if (
      masterSession.targets.edges[payload.targetIndex].node.targetAllcatedDetails.targetType.id ===
      peakId &&
      masterSession.targets.edges[payload.targetIndex].node.peakType !== equivalence
    ) {
      // if peak first block instance not present then create one
      if (!targetResponse[payload.targetId].peak[0].blockId) {
        const blockResponse = yield call(createTargetBlock, {
          skillsId: targetResponse[payload.targetId].skillsId,
          startTime: targetResponse[payload.targetId].startTime,
        })
        if (blockResponse && blockResponse.data) {
          // updating created block details on redux store
          targetResponse[payload.targetId].peak[0] = {
            ...targetResponse[payload.targetId].peak[0],
            blockId: blockResponse.data.peakBlock.block.id,
            blockStart: blockResponse.data.peakBlock.block.durationStart,
          }

          yield put({
            type: 'sessionrecording/SET_STATE',
            payload: {
              TargetResponse: targetResponse,
            },
          })
        }
      }
      // end of check and create first peak block instance

      if (targetResponse[payload.targetId].peak) {
        targetResponse[payload.targetId].peak[0].block.map(item => {
          // if (item.recordedData === true) {
          //   blockTrial += 1
          // }
          if (item.marksRecorded === true) {
            if (blockTrial < 10) blockTrial += 1
          }
        })
      }
    }

    if (targetResponse[payload.targetId].sd) {
      if (
        targetResponse[payload.targetId].sd[
          targetObject.sd.edges[payload.index ? payload.index : 0].node.id
        ].length > 0
      ) {
        // currentCount =
        //   targetResponse[payload.targetId].sd[
        //     targetObject.sd.edges[payload.index ? payload.index : 0].node.id
        //   ].length + 1
        const recordedTrials = targetResponse[payload.targetId].sd[
          targetObject.sd.edges[payload.index ? payload.index : 0].node.id
        ].length
        const dT = masterSession.targets.edges[payload.targetIndex].node.targetAllcatedDetails.DailyTrials
        if (recordedTrials >= dT) currentCount = recordedTrials
        else currentCount = recordedTrials + 1



        targetResponse[payload.targetId].sd[
          targetObject.sd.edges[payload.index ? payload.index : 0].node.id
        ].map(recordingItem => {
          if (recordingItem.trial === 'CORRECT') {
            currentCorrectCount += 1
          }
          if (
            recordingItem.trial === 'ERROR' ||
            recordingItem.trial === 'PROMPT' ||
            recordingItem.trial === 'INCORRECT'
          ) {
            currentIncorrectCount += 1
          }
        })
      }
    } else if (targetResponse[payload.targetId].step) {
      if (
        targetResponse[payload.targetId].step[
          targetObject.steps.edges[payload.index ? payload.index : 0].node.id
        ].length > 0
      ) {
        // currentCount =
        //   targetResponse[payload.targetId].step[
        //     targetObject.steps.edges[payload.index ? payload.index : 0].node.id
        //   ].length + 1

        const recordedTrials = targetResponse[payload.targetId].step[
          targetObject.steps.edges[payload.index ? payload.index : 0].node.id
        ].length
        const dT = masterSession.targets.edges[payload.targetIndex].node.targetAllcatedDetails.DailyTrials
        if (recordedTrials >= dT) currentCount = recordedTrials
        else currentCount = recordedTrials + 1

        targetResponse[payload.targetId].step[
          targetObject.steps.edges[payload.index ? payload.index : 0].node.id
        ].map(recordingItem => {
          if (recordingItem.trial === 'CORRECT') {
            currentCorrectCount += 1
          }
          if (
            recordingItem.trial === 'ERROR' ||
            recordingItem.trial === 'PROMPT' ||
            recordingItem.trial === 'INCORRECT'
          ) {
            currentIncorrectCount += 1
          }
        })
      }
    } else {
      if (targetResponse[payload.targetId].target.length > 0) {
        // currentCount = targetResponse[payload.targetId].target.length + 1
        const recordedTrials = targetResponse[payload.targetId].target.length
        const dT = masterSession.targets.edges[payload.targetIndex].node.targetAllcatedDetails.DailyTrials
        if (recordedTrials >= dT) currentCount = recordedTrials
        else currentCount = recordedTrials + 1
        targetResponse[payload.targetId].target.map(recordingItem => {
          if (recordingItem.trial === 'CORRECT') {
            currentCorrectCount += 1
          }
          if (
            recordingItem.trial === 'ERROR' ||
            recordingItem.trial === 'PROMPT' ||
            recordingItem.trial === 'INCORRECT'
          ) {
            currentIncorrectCount += 1
          }
        })
      }
    }

    yield put({
      type: 'sessionrecording/SET_STATE',
      payload: {
        Count: currentCount,
        CorrectCount: currentCorrectCount,
        IncorrectCount: currentIncorrectCount,
        StepActiveIndex: payload.index ? payload.index : 0,
        StepActiveId: stepId,
        StimulusActiveIndex: payload.index ? payload.index : 0,
        StimulusActiveId: stimulusId,
        PeakTrialCount: blockTrial,
        PeakBlockIndex: peakBlockIndex,
      },
    })
  }
  // update session duration
  yield put({
    type: 'sessionrecording/UPDATE_DURATION',
  })
}

export function* UPDATE_TARGET_TRIAL({ payload }) {
  yield put({
    type: 'sessionrecording/SET_STATE',
    payload: {
      ResponseLoading: true,
    },
  })
  // selecting target response object from store
  const targetResponse = yield select(state => state.sessionrecording.TargetResponse)
  const targetActiveId = yield select(state => state.sessionrecording.TargetActiveId)
  const count = yield select(state => state.sessionrecording.Count)
  // update target trial query

  const response = yield call(updateTargetTrial, {
    object: payload.object,
    response: payload.response,
    promptId: payload.promptId,
    note: payload.note,
  })
  if (response && response.data) {
    // updating target end time in redux store
    if (
      targetResponse[targetActiveId].target[count - 1].id === response.data.updateTrial.details.id
    ) {
      targetResponse[targetActiveId].target[count - 1] = response.data.updateTrial.details
    }

    yield put({
      type: 'sessionrecording/SET_STATE',
      payload: {
        TargetResponse: targetResponse,
      },
    })
  }
  // update session duration
  yield put({
    type: 'sessionrecording/UPDATE_DURATION',
  })
  yield put({
    type: 'sessionrecording/SET_STATE',
    payload: {
      ResponseLoading: false,
    },
  })
}

// not in use
export function* SET_PREVIOUS_COUNTS({ payload }) {
  // selecting target response object from store
  const targetResponse = yield select(state => state.sessionrecording.TargetResponse)
  const masterSession = yield select(state => state.sessionrecording.MasterSession)
  // console.log(childSessionId, sessionStatusId, payload.targetId, currentSessionTime)
  const targetObject = masterSession.targets.edges[payload.targetIndex].node

  let stepId = ''
  let stimulusId = ''
  let currentCount = 1
  let currentCorrectCount = 0
  let currentIncorrectCount = 0

  if (targetObject.sd.edges.length > 0) {
    stimulusId = targetObject.sd.edges[0].node.id
  } else if (targetObject.steps.edges.length > 0) {
    stepId = targetObject.steps.edges[0].node.id
  }

  // updating Count, CorrectCount & IncorrectCount

  if (targetResponse[payload.targetId].sd) {
    if (targetResponse[payload.targetId].sd[targetObject.sd.edges[0].node.id].length > 0) {
      currentCount =
        targetResponse[payload.targetId].sd[targetObject.sd.edges[0].node.id].length + 1
      targetResponse[payload.targetId].sd[targetObject.sd.edges[0].node.id].map(recordingItem => {
        if (recordingItem.trial === 'CORRECT') {
          currentCorrectCount += 1
        }
        if (recordingItem.trial === 'ERROR') {
          currentIncorrectCount += 1
        }
        if (recordingItem.trial === 'PROMPT') {
          currentIncorrectCount += 1
        }
      })
    }
  } else if (targetResponse[payload.targetId].step) {
    if (targetResponse[payload.targetId].step[targetObject.steps.edges[0].node.id].length > 0) {
      currentCount =
        targetResponse[payload.targetId].step[targetObject.steps.edges[0].node.id].length + 1
      targetResponse[payload.targetId].step[targetObject.steps.edges[0].node.id].map(
        recordingItem => {
          if (recordingItem.trial === 'CORRECT') {
            currentCorrectCount += 1
          }
          if (recordingItem.trial === 'ERROR') {
            currentIncorrectCount += 1
          }
          if (recordingItem.trial === 'PROMPT') {
            currentIncorrectCount += 1
          }
        },
      )
    }
  } else {
    if (targetResponse[payload.targetId].target.length > 0) {
      currentCount = targetResponse[payload.targetId].target.length + 1
      targetResponse[payload.targetId].target.map(recordingItem => {
        if (recordingItem.trial === 'CORRECT') {
          currentCorrectCount += 1
        }
        if (recordingItem.trial === 'ERROR') {
          currentIncorrectCount += 1
        }
        if (recordingItem.trial === 'PROMPT') {
          currentIncorrectCount += 1
        }
      })
    }
  }

  yield put({
    type: 'sessionrecording/SET_STATE',
    payload: {
      Count: currentCount,
      CorrectCount: currentCorrectCount,
      IncorrectCount: currentIncorrectCount,
      StepActiveIndex: 0,
      StepActiveId: stepId,
      StimulusActiveIndex: 0,
      StimulusActiveId: stimulusId,
    },
  })
}

export function* CHANGE_STIMULUS({ payload }) {
  // selecting target response object from store
  const targetResponse = yield select(state => state.sessionrecording.TargetResponse)

  let currentCount = 1
  let currentCorrectCount = 0
  let currentIncorrectCount = 0

  // updating Count, CorrectCount & IncorrectCount

  if (targetResponse[payload.targetId].sd[payload.stimulusId].length > 0) {
    currentCount = targetResponse[payload.targetId].sd[payload.stimulusId].length + 1
    targetResponse[payload.targetId].sd[payload.stimulusId].map(recordingItem => {
      if (recordingItem.trial === 'CORRECT') {
        currentCorrectCount += 1
      }
      if (
        recordingItem.trial === 'ERROR' ||
        recordingItem.trial === 'PROMPT' ||
        recordingItem.trial === 'INCORRECT'
      ) {
        currentIncorrectCount += 1
      }
    })
  }

  yield put({
    type: 'sessionrecording/SET_STATE',
    payload: {
      Count: currentCount,
      CorrectCount: currentCorrectCount,
      IncorrectCount: currentIncorrectCount,
      StimulusActiveIndex: payload.stimulusIndex,
      StimulusActiveId: payload.stimulusId,
    },
  })
}

export function* TARGET_SD_CORRECT({ payload }) {
  yield put({
    type: 'sessionrecording/SET_STATE',
    payload: {
      ResponseLoading: true,
    },
  })
  // selecting child session id for creating child session
  const childSessionId = yield select(state => state.sessionrecording.ChildSession.id)
  const targetActiveId = yield select(state => state.sessionrecording.TargetActiveId)
  const trialStartTime = yield select(state => state.sessionrecording.TrialStartTime)
  const currentSessionTime = yield select(state => state.sessionrecording.CurrentSessionTime)
  const masterSession = yield select(state => state.sessionrecording.MasterSession)
  const targetActiveIndex = yield select(state => state.sessionrecording.TargetActiveIndex)
  const count = yield select(state => state.sessionrecording.Count)
  const stimulusActiveIndex = yield select(state => state.sessionrecording.StimulusActiveIndex)
  // selecting status id of the target
  const sessionStatusId = masterSession.targets.edges[targetActiveIndex].node.targetStatus.id
  // updating session duration
  const response = yield call(recordTargetStimulusTrial, {
    childId: childSessionId,
    statusId: sessionStatusId,
    targetId: targetActiveId,
    start: trialStartTime,
    end: currentSessionTime,
    promptId: payload.promptId,
    response: payload.response,
    sdId: payload.sdId,
    note: payload.note,
  })
  if (response && response.data && response.data.sessionRecording) {
    const targetResponse = yield select(state => state.sessionrecording.TargetResponse)
    targetResponse[targetActiveId].sd[payload.sdId] = []
    response.data.sessionRecording.details.sessionRecord.edges.map(item => {
      if (item.node.sd.id === payload.sdId) {
        targetResponse[targetActiveId].sd[payload.sdId] = [
          ...targetResponse[targetActiveId].sd[payload.sdId],
          item.node,
        ]
      }
    })

    yield put({
      type: 'sessionrecording/SET_STATE',
      payload: {
        TargetResponse: targetResponse,
      },
    })

    if (
      count < masterSession.targets.edges[targetActiveIndex].node.targetAllcatedDetails.DailyTrials
    ) {
      yield put({
        type: 'sessionrecording/SET_STATE',
        payload: {
          Count: count + 1,
        },
      })
      resetStartTime()
      resetCorrectIncorrectButtons()
    } else if (
      count ===
      masterSession.targets.edges[targetActiveIndex].node.targetAllcatedDetails.DailyTrials
    ) {
      console.log('inside else if')
      if (
        stimulusActiveIndex <
        masterSession.targets.edges[targetActiveIndex].node.sd.edges.length - 1
      ) {
        console.log('inside else if if')

        resetStartTime()
        resetCorrectIncorrectButtons()

        yield put({
          type: 'sessionrecording/CHANGE_STIMULUS',
          payload: {
            stimulusId:
              masterSession.targets.edges[targetActiveIndex].node.sd.edges[stimulusActiveIndex + 1]
                .node.id,
            stimulusIndex: stimulusActiveIndex + 1,
            targetId: targetActiveId,
          },
        })
      }
      else if (targetActiveIndex + 1 < masterSession.targets.edges.length) {
        yield put({
          type: 'sessionrecording/MOVE_TO_NEXT_TARGET',
        })
      }
    }
  }
  // update session duration
  yield put({
    type: 'sessionrecording/UPDATE_DURATION',
  })
  yield put({
    type: 'sessionrecording/SET_STATE',
    payload: {
      ResponseLoading: false,
    },
  })
}

export function* UPDATE_TARGET_SD_TRIAL({ payload }) {
  yield put({
    type: 'sessionrecording/SET_STATE',
    payload: {
      ResponseLoading: true,
    },
  })
  // selecting target response object from store
  const targetResponse = yield select(state => state.sessionrecording.TargetResponse)
  const targetActiveId = yield select(state => state.sessionrecording.TargetActiveId)
  const count = yield select(state => state.sessionrecording.Count)
  // update target trial query

  const response = yield call(updateTargetTrial, {
    object: payload.object,
    response: payload.response,
    promptId: payload.promptId,
    note: payload.note,
  })
  if (response && response.data) {
    // updating target end time in redux store
    if (
      targetResponse[targetActiveId].sd[payload.object.sd.id][count - 1].id ===
      response.data.updateTrial.details.id
    ) {
      targetResponse[targetActiveId].sd[payload.object.sd.id][count - 1] =
        response.data.updateTrial.details
    }

    yield put({
      type: 'sessionrecording/SET_STATE',
      payload: {
        TargetResponse: targetResponse,
      },
    })
  }
  // update session duration
  yield put({
    type: 'sessionrecording/UPDATE_DURATION',
  })
  yield put({
    type: 'sessionrecording/SET_STATE',
    payload: {
      ResponseLoading: false,
    },
  })
}

export function* CHANGE_STEP({ payload }) {
  // selecting target response object from store
  const targetResponse = yield select(state => state.sessionrecording.TargetResponse)

  let currentCount = 1
  let currentCorrectCount = 0
  let currentIncorrectCount = 0

  // updating Count, CorrectCount & IncorrectCount

  if (targetResponse[payload.targetId].step[payload.stepId].length > 0) {
    currentCount = targetResponse[payload.targetId].step[payload.stepId].length + 1
    targetResponse[payload.targetId].step[payload.stepId].map(recordingItem => {
      if (recordingItem.trial === 'CORRECT') {
        currentCorrectCount += 1
      }
      if (
        recordingItem.trial === 'ERROR' ||
        recordingItem.trial === 'PROMPT' ||
        recordingItem.trial === 'INCORRECT'
      ) {
        currentIncorrectCount += 1
      }
    })
  }

  yield put({
    type: 'sessionrecording/SET_STATE',
    payload: {
      Count: currentCount,
      CorrectCount: currentCorrectCount,
      IncorrectCount: currentIncorrectCount,
      StepActiveIndex: payload.stepIndex,
      StepActiveId: payload.stepId,
    },
  })
}

export function* TARGET_STEP_CORRECT({ payload }) {
  yield put({
    type: 'sessionrecording/SET_STATE',
    payload: {
      ResponseLoading: true,
    },
  })
  // selecting child session id for creating child session
  const childSessionId = yield select(state => state.sessionrecording.ChildSession.id)
  const targetActiveId = yield select(state => state.sessionrecording.TargetActiveId)
  const trialStartTime = yield select(state => state.sessionrecording.TrialStartTime)
  const currentSessionTime = yield select(state => state.sessionrecording.CurrentSessionTime)
  const masterSession = yield select(state => state.sessionrecording.MasterSession)
  const targetActiveIndex = yield select(state => state.sessionrecording.TargetActiveIndex)
  const count = yield select(state => state.sessionrecording.Count)
  const stepActiveIndex = yield select(state => state.sessionrecording.StepActiveIndex)
  // selecting status id of the target
  const sessionStatusId = masterSession.targets.edges[targetActiveIndex].node.targetStatus.id
  // updating session duration
  const response = yield call(recordTargetStepTrial, {
    childId: childSessionId,
    statusId: sessionStatusId,
    targetId: targetActiveId,
    start: trialStartTime,
    end: currentSessionTime,
    promptId: payload.promptId,
    response: payload.response,
    stepId: payload.stepId,
    note: payload.note,
  })
  if (response && response.data && response.data.sessionRecording) {
    const targetResponse = yield select(state => state.sessionrecording.TargetResponse)
    targetResponse[targetActiveId].step[payload.stepId] = []
    response.data.sessionRecording.details.sessionRecord.edges.map(item => {
      if (item.node.step.id === payload.stepId) {
        targetResponse[targetActiveId].step[payload.stepId] = [
          ...targetResponse[targetActiveId].step[payload.stepId],
          item.node,
        ]
      }
    })

    yield put({
      type: 'sessionrecording/SET_STATE',
      payload: {
        TargetResponse: targetResponse,
      },
    })

    if (
      count < masterSession.targets.edges[targetActiveIndex].node.targetAllcatedDetails.DailyTrials
    ) {
      yield put({
        type: 'sessionrecording/SET_STATE',
        payload: {
          Count: count + 1,
        },
      })
      resetStartTime()
      resetCorrectIncorrectButtons()
    } else if (
      count ===
      masterSession.targets.edges[targetActiveIndex].node.targetAllcatedDetails.DailyTrials
    ) {
      console.log('inside else if')
      if (
        stepActiveIndex <
        masterSession.targets.edges[targetActiveIndex].node.steps.edges.length - 1
      ) {
        console.log('inside else if if')

        resetStartTime()
        resetCorrectIncorrectButtons()

        yield put({
          type: 'sessionrecording/CHANGE_STEP',
          payload: {
            stepId:
              masterSession.targets.edges[targetActiveIndex].node.steps.edges[stepActiveIndex + 1]
                .node.id,
            stepIndex: stepActiveIndex + 1,
            targetId: targetActiveId,
          },
        })
      }
      else if (targetActiveIndex + 1 < masterSession.targets.edges.length) {
        yield put({
          type: 'sessionrecording/MOVE_TO_NEXT_TARGET',
        })
      }
    }
  }

  // update session duration
  yield put({
    type: 'sessionrecording/UPDATE_DURATION',
  })
  yield put({
    type: 'sessionrecording/SET_STATE',
    payload: {
      ResponseLoading: false,
    },
  })
}

export function* UPDATE_TARGET_STEP_TRIAL({ payload }) {
  yield put({
    type: 'sessionrecording/SET_STATE',
    payload: {
      ResponseLoading: true,
    },
  })
  // selecting target response object from store
  const targetResponse = yield select(state => state.sessionrecording.TargetResponse)
  const targetActiveId = yield select(state => state.sessionrecording.TargetActiveId)
  const count = yield select(state => state.sessionrecording.Count)
  // update target trial query

  const response = yield call(updateTargetTrial, {
    object: payload.object,
    response: payload.response,
    promptId: payload.promptId,
    note: payload.note,
  })
  if (response && response.data) {
    // updating target end time in redux store
    if (
      targetResponse[targetActiveId].step[payload.object.step.id][count - 1].id ===
      response.data.updateTrial.details.id
    ) {
      targetResponse[targetActiveId].step[payload.object.step.id][count - 1] =
        response.data.updateTrial.details
    }

    yield put({
      type: 'sessionrecording/SET_STATE',
      payload: {
        TargetResponse: targetResponse,
      },
    })
  }
  // update session duration
  yield put({
    type: 'sessionrecording/UPDATE_DURATION',
  })
  yield put({
    type: 'sessionrecording/SET_STATE',
    payload: {
      ResponseLoading: false,
    },
  })
}

// PEAK APIS

export function* UPDATE_BLOCK_ENDTIME({ payload }) {
  // selecting child session id for creating child session
  const currentSessionTime = yield select(state => state.sessionrecording.CurrentSessionTime)
  const targetResponse = yield select(state => state.sessionrecording.TargetResponse)
  const currentBlockIndex = yield select(state => state.sessionrecording.PeakBlockIndex)

  // getting skillsId for target
  const skillsId = targetResponse[payload.targetId].skillsId

  // checking and updating peak block end time
  if (targetResponse[payload.targetId].peak) {
    const blockId = targetResponse[payload.targetId].peak[currentBlockIndex].blockId
    const previousBlockTime = targetResponse[payload.targetId].peak[currentBlockIndex].blockEnd
    if (previousBlockTime === 0 || previousBlockTime === null) {
      if (debug) {
        console.log('updated session block time')
      }
      const blockResponse = yield call(updateTargetBlock, {
        skillsId: skillsId,
        blockId: blockId,
        endTime: currentSessionTime,
      })
      if (blockResponse && blockResponse.data) {
        targetResponse[payload.targetId].peak[currentBlockIndex].blockEnd =
          blockResponse.data.peakBlock.block.durationEnd

        yield put({
          type: 'sessionrecording/SET_STATE',
          payload: {
            TargetResponse: targetResponse,
          },
        })
      }
    }
  }
  // end of check
  // update session duration
  yield put({
    type: 'sessionrecording/UPDATE_DURATION',
  })
}

export function* CREATE_NEW_BLOCK({ payload }) {
  // selecting child session id for creating child session
  const currentSessionTime = yield select(state => state.sessionrecording.CurrentSessionTime)
  const targetResponse = yield select(state => state.sessionrecording.TargetResponse)
  // const currentBlockIndex = yield select(state => state.sessionrecording.PeakBlockIndex)

  // getting skillsId for target
  const skillsId = targetResponse[payload.targetId].skillsId

  // checking and updating peak block end time
  if (targetResponse[payload.targetId].peak) {
    const blockId = targetResponse[payload.targetId].peak[payload.blockIndex].blockId
    let trailCount = 1
    if (!blockId) {
      const blockResponse = yield call(createTargetBlock, {
        skillsId: skillsId,
        startTime: currentSessionTime,
      })
      if (blockResponse && blockResponse.data) {
        // updating created block details on redux store
        targetResponse[payload.targetId].peak[payload.blockIndex] = {
          ...targetResponse[payload.targetId].peak[payload.blockIndex],
          blockId: blockResponse.data.peakBlock.block.id,
          blockStart: blockResponse.data.peakBlock.block.durationStart,
        }

        yield put({
          type: 'sessionrecording/SET_STATE',
          payload: {
            TargetResponse: targetResponse,
            PeakTrialCount: 1,
          },
        })
      }
    } else {
      targetResponse[payload.targetId].peak[payload.blockIndex].block.map(item => {
        // if (item.recordedData === true) {
        //   trailCount += 1
        // }
        if (item.marksRecorded === true) {
          if (trailCount < 10) trailCount += 1
        }
      })
      yield put({
        type: 'sessionrecording/SET_STATE',
        payload: {
          PeakTrialCount: trailCount,
        },
      })
    }
  }
  // end of check
  // update session duration
  yield put({
    type: 'sessionrecording/UPDATE_DURATION',
  })
}

export function* RECORD_BLOCK_TRIAL({ payload }) {
  yield put({
    type: 'sessionrecording/SET_STATE',
    payload: {
      ResponseLoading: true,
    },
  })
  // selecting child session id for creating child session
  const currentSessionTime = yield select(state => state.sessionrecording.CurrentSessionTime)
  const startTime = yield select(state => state.sessionrecording.TrialStartTime)
  const targetResponse = yield select(state => state.sessionrecording.TargetResponse)
  const targetId = yield select(state => state.sessionrecording.TargetActiveId)
  const currentBlockIndex = yield select(state => state.sessionrecording.PeakBlockIndex)
  const trialCount = yield select(state => state.sessionrecording.PeakTrialCount)
  const targetActiveIndex = yield select(state => state.sessionrecording.TargetActiveIndex)
  const masterSession = yield select(state => state.sessionrecording.MasterSession)

  const blockId = targetResponse[targetId].peak[currentBlockIndex].blockId

  // checking and updating peak block end time
  if (blockId) {
    const trialResponse = yield call(recordBlockTrial, {
      blockId: blockId,
      startTime: startTime,
      endTime: currentSessionTime,
      marks: payload.marks,
      promptId: payload.promptId,
      sd: payload.sd,
    })
    if (trialResponse && trialResponse.data) {
      // updating created block details on redux store
      targetResponse[targetId].peak[currentBlockIndex].block[trialCount - 1] = {
        ...targetResponse[targetId].peak[currentBlockIndex].block[trialCount - 1],
        recordedData: true,
        response: trialResponse.data.peakBlockTrials.trial,
        marksRecorded: trialResponse.data.peakBlockTrials.trial.marks ? true : false,
      }

      yield put({
        type: 'sessionrecording/SET_STATE',
        payload: {
          TargetResponse: targetResponse,
        },
      })

      // move to next trial

      if (trialCount < 10) {
        if (
          targetResponse[targetId].peak[currentBlockIndex].block[trialCount - 1].recordedData ===
          true
        ) {
          resetStartTime()

          yield put({
            type: 'sessionrecording/SET_STATE',
            payload: {
              PeakTrialCount: trialCount + 1,
            },
          })

          if (
            targetResponse[targetId].peak[currentBlockIndex].block[trialCount].response?.marks === 0
          ) {
            document.getElementById('peakResponseButtonZero').style.backgroundColor = '#FF8080'
          }
          if (
            targetResponse[targetId].peak[currentBlockIndex].block[trialCount].response?.marks === 2
          ) {
            document.getElementById('peakResponseButtonTwo').style.backgroundColor = '#FF9C52'
          }
          if (
            targetResponse[targetId].peak[currentBlockIndex].block[trialCount].response?.marks === 4
          ) {
            document.getElementById('peakResponseButtonFour').style.backgroundColor = '#FF9C52'
          }
          if (
            targetResponse[targetId].peak[currentBlockIndex].block[trialCount].response?.marks === 8
          ) {
            document.getElementById('peakResponseButtonEight').style.backgroundColor = '#FF9C52'
          }
          if (
            targetResponse[targetId].peak[currentBlockIndex].block[trialCount].response?.marks ===
            10
          ) {
            document.getElementById('peakResponseButtonTen').style.backgroundColor = '#4BAEA0'
          }

          // if (!PeakAutomatic) {
          //   this.peakSelectedStimulusIndexReset(trialCount + 1)
          // }
        }
      } else if (trialCount === 10) {
        if (
          currentBlockIndex <
          masterSession.targets.edges[targetActiveIndex].node.peakBlocks - 1
        ) {
          updateSessionClockTime()
          yield put({
            type: 'sessionrecording/UPDATE_BLOCK_ENDTIME',
            payload: {
              blockIndex: currentBlockIndex,
              targetId: targetId,
            },
          })

          yield put({
            type: 'sessionrecording/SET_STATE',
            payload: {
              PeakBlockIndex: currentBlockIndex + 1,
            },
          })

          yield put({
            type: 'sessionrecording/CREATE_NEW_BLOCK',
            payload: {
              blockIndex: currentBlockIndex + 1,
              targetId: targetId,
            },
          })
        }
        else if (targetActiveIndex + 1 < masterSession.targets.edges.length) {
          yield put({
            type: 'sessionrecording/MOVE_TO_NEXT_TARGET',
          })
        }
      }
    }
  }
  // end of check
  // update session duration
  yield put({
    type: 'sessionrecording/UPDATE_DURATION',
  })
  yield put({
    type: 'sessionrecording/SET_STATE',
    payload: {
      ResponseLoading: false,
    },
  })
}

export function* UPDATE_BLOCK_TRIAL({ payload }) {
  yield put({
    type: 'sessionrecording/SET_STATE',
    payload: {
      ResponseLoading: true,
    },
  })
  // selecting child session id for creating child session
  const targetResponse = yield select(state => state.sessionrecording.TargetResponse)
  const targetId = yield select(state => state.sessionrecording.TargetActiveId)
  const currentBlockIndex = yield select(state => state.sessionrecording.PeakBlockIndex)
  const trialCount = yield select(state => state.sessionrecording.PeakTrialCount)
  const targetActiveIndex = yield select(state => state.sessionrecording.TargetActiveIndex)
  const masterSession = yield select(state => state.sessionrecording.MasterSession)

  const blockId = targetResponse[targetId].peak[currentBlockIndex].blockId

  // checking and updating peak block end time
  if (blockId) {
    const trialResponse = yield call(updateBlockTrial, {
      responseId: payload.responseId,
      marks: payload.marks,
      promptId: payload.promptId,
      sd: payload.sd,
    })
    if (trialResponse && trialResponse.data) {
      // updating created block details on redux store
      targetResponse[targetId].peak[currentBlockIndex].block[trialCount - 1] = {
        ...targetResponse[targetId].peak[currentBlockIndex].block[trialCount - 1],
        recordedData: true,
        response: trialResponse.data.peakBlockUpdateTrial.trial,
        sd: trialResponse.data.peakBlockUpdateTrial.trial.sd,
        marksRecorded: trialResponse.data.peakBlockUpdateTrial.trial.marks ? true : false,
      }

      yield put({
        type: 'sessionrecording/SET_STATE',
        payload: {
          TargetResponse: targetResponse,
        },
      })

      // move to next trial

      if (trialCount < 10) {
        if (
          targetResponse[targetId].peak[currentBlockIndex].block[trialCount - 1].recordedData ===
          true
        ) {
          resetStartTime()

          yield put({
            type: 'sessionrecording/SET_STATE',
            payload: {
              PeakTrialCount: trialCount + 1,
            },
          })

          if (
            targetResponse[targetId].peak[currentBlockIndex].block[trialCount].response?.marks === 0
          ) {
            document.getElementById('peakResponseButtonZero').style.backgroundColor = '#FF8080'
          }
          if (
            targetResponse[targetId].peak[currentBlockIndex].block[trialCount].response?.marks === 2
          ) {
            document.getElementById('peakResponseButtonTwo').style.backgroundColor = '#FF9C52'
          }
          if (
            targetResponse[targetId].peak[currentBlockIndex].block[trialCount].response?.marks === 4
          ) {
            document.getElementById('peakResponseButtonFour').style.backgroundColor = '#FF9C52'
          }
          if (
            targetResponse[targetId].peak[currentBlockIndex].block[trialCount].response?.marks === 8
          ) {
            document.getElementById('peakResponseButtonEight').style.backgroundColor = '#FF9C52'
          }
          if (
            targetResponse[targetId].peak[currentBlockIndex].block[trialCount].response?.marks ===
            10
          ) {
            document.getElementById('peakResponseButtonTen').style.backgroundColor = '#4BAEA0'
          }

          // if (!PeakAutomatic) {
          //   this.peakSelectedStimulusIndexReset(trialCount + 1)
          // }
        }
      } else if (trialCount === 10) {
        if (
          currentBlockIndex <
          masterSession.targets.edges[targetActiveIndex].node.peakBlocks - 1
        ) {
          updateSessionClockTime()
          yield put({
            type: 'sessionrecording/UPDATE_BLOCK_ENDTIME',
            payload: {
              blockIndex: currentBlockIndex,
              targetId: targetId,
            },
          })

          yield put({
            type: 'sessionrecording/SET_STATE',
            payload: {
              PeakBlockIndex: currentBlockIndex + 1,
            },
          })

          yield put({
            type: 'sessionrecording/CREATE_NEW_BLOCK',
            payload: {
              blockIndex: currentBlockIndex + 1,
              targetId: targetId,
            },
          })
        }
        else if (targetActiveIndex + 1 < masterSession.targets.edges.length) {
          yield put({
            type: 'sessionrecording/MOVE_TO_NEXT_TARGET',
          })
        }
      }
    }
  }
  // end of check
  // update session duration
  yield put({
    type: 'sessionrecording/UPDATE_DURATION',
  })
  yield put({
    type: 'sessionrecording/SET_STATE',
    payload: {
      ResponseLoading: false,
    },
  })
}

export function* GET_SD_COMBINATIONS({ payload }) {
  const response = yield call(getCombinationsByCode, payload)
  if (response && response.data) {
    yield put({
      type: 'sessionrecording/SET_STATE',
      payload: {
        SdCombinations: response.data.getPeakEquCodes.edges[0]?.node,
        ActiveCombination: response.data.getPeakEquCodes.edges[0]?.node.train.edges[0]?.node.id,
      },
    })
  }
}

export function* EQUIVALENCE_RESPONSE({ payload }) {
  yield put({
    type: 'sessionrecording/SET_STATE',
    payload: {
      ResponseLoading: true,
    },
  })
  // selecting child session id for creating child session
  const childSessionId = yield select(state => state.sessionrecording.ChildSession.id)
  const targetActiveId = yield select(state => state.sessionrecording.TargetActiveId)
  const trialStartTime = yield select(state => state.sessionrecording.TrialStartTime)
  const currentSessionTime = yield select(state => state.sessionrecording.CurrentSessionTime)
  const masterSession = yield select(state => state.sessionrecording.MasterSession)
  const targetActiveIndex = yield select(state => state.sessionrecording.TargetActiveIndex)
  // selecting status id of the target
  const targetStatusId = masterSession.targets.edges[targetActiveIndex].node.targetStatus.id
  // updating session duration
  const response = yield call(recordEquivalenceTarget, {
    childId: childSessionId,
    statusId: targetStatusId,
    targetId: targetActiveId,
    start: trialStartTime,
    end: currentSessionTime,
    response: payload.response,
    operation: payload.operation,
    classId: payload.classId,
    combinationTest: payload.combinationTest,
    combinationTrain: payload.combinationTrain,
  })

  const selectedOperation = yield select(state => state.sessionrecording.SelectedOperation)
  const activeCombination = yield select(state => state.sessionrecording.ActiveCombination)
  const selectedClassId = yield select(state => state.sessionrecording.SelectedClassId)
  const equiTrialCount = yield select(state => state.sessionrecording.EquiTrialCount)
  const sdCombinations = yield select(state => state.sessionrecording.SdCombinations)

  // const targetActiveIndex = yield select(state => state.sessionrecording.TargetActiveIndex)

  if (response && response.data && response.data.sessionRecording) {
    const targetResponse = yield select(state => state.sessionrecording.TargetResponse)
    // targetResponse[targetActiveId].equivalence[selectedOperation === 'Train' ? 'train': 'test'][activeCombination][selectedClassId] = []
    response.data.sessionRecording.details.peakEquivalance.edges.map(item => {
      let operation = 'train'
      if (selectedOperation === 'Test') operation = 'test'
      targetResponse[targetActiveId].equivalence[operation][activeCombination][selectedClassId] = [
        ...targetResponse[targetActiveId].equivalence[operation][activeCombination][
        selectedClassId
        ],
        item.node,
      ]
    })

    yield put({
      type: 'sessionrecording/SET_STATE',
      payload: {
        TargetResponse: targetResponse,
      },
    })
    // update session duration
    yield put({
      type: 'sessionrecording/UPDATE_DURATION',
    })

    // automatic trial, combination, class, test/train and target move code
    if (equiTrialCount < 10) {
      
      resetPeakButtons()
      resetStartTime()
      yield put({
        type: 'sessionrecording/SET_STATE',
        payload: {
          EquiTrialCount: equiTrialCount + 1,
        },
      })
    }
    else {
      if (selectedOperation === 'Train') {
        let previousCombIndex = 0

        sdCombinations.train.edges.map((nodeItem, index) => {
          if (nodeItem.node.id === activeCombination) {
            previousCombIndex = index
          }
        })

        if (previousCombIndex + 1 < sdCombinations.train.edges.length) {
          // change active combination
          const newCombId = sdCombinations.train.edges[previousCombIndex + 1]?.node.id
          const trialsLength = targetResponse[targetActiveId].equivalence.train[newCombId][selectedClassId].length
          if (trialsLength < 10) {
            yield put({
              type: 'sessionrecording/SET_STATE',
              payload: {
                EquiTrialCount: trialsLength + 1,
                ActiveCombination: newCombId,
              },
            })
          } else {
            yield put({
              type: 'sessionrecording/SET_STATE',
              payload: {
                EquiTrialCount: 10,
                ActiveCombination: newCombId,
              },
            })
          }
        }
        else {
          // check for change class
          let previosClassIndex = 0
          masterSession.targets.edges[targetActiveIndex].node.classes.edges.map((classNode, classIndex) => {
            if (classNode.node.id === selectedClassId) {
              previosClassIndex = classIndex
            }
          })

          if (previosClassIndex + 1 < masterSession.targets.edges[targetActiveIndex].node.classes.edges.length) {
            // chnage class
            const newClassId = masterSession.targets.edges[targetActiveIndex].node.classes.edges[previosClassIndex + 1]?.node.id
            const trialsLengthCheck = targetResponse[targetActiveId].equivalence.train[activeCombination][newClassId].length
            if (trialsLengthCheck < 10) {
              yield put({
                type: 'sessionrecording/SET_STATE',
                payload: {
                  SelectedClassId: newClassId,
                  EquiTrialCount: trialsLengthCheck + 1,
                },
              })
            } else {
              yield put({
                type: 'sessionrecording/SET_STATE',
                payload: {
                  SelectedClassId: newClassId,
                  EquiTrialCount: 10,
                },
              })

            }
          }
          else {
            // check for change test/train
            const comId = sdCombinations.test.edges[0]?.node.id
            const firstClassId = masterSession.targets.edges[targetActiveIndex].node.classes.edges[0]?.node.id
            const trialsLengthOper = targetResponse[targetActiveId].equivalence.test[comId][selectedClassId]?.length
            if (trialsLengthOper < 10) {
              yield put({
                type: 'sessionrecording/SET_STATE',
                payload: {
                  SelectedOperation: 'Test',
                  EquiTrialCount: trialsLengthOper + 1,
                  ActiveCombination: comId,
                  SelectedClassId: firstClassId,
                },
              })
            } else {
              yield put({
                type: 'sessionrecording/SET_STATE',
                payload: {
                  SelectedOperation: 'Test',
                  EquiTrialCount: 10,
                  ActiveCombination: comId,
                  SelectedClassId: firstClassId,
                },
              })
            }

          }




        }
      }
      else if(selectedOperation === 'Test'){
        let previousCombIndex = 0

        sdCombinations.test.edges.map((nodeItem, index) => {
          if (nodeItem.node.id === activeCombination) {
            previousCombIndex = index
          }
        })

        if (previousCombIndex + 1 < sdCombinations.test.edges.length) {
          // change active combination
          const newCombId = sdCombinations.test.edges[previousCombIndex + 1]?.node.id
          const trialsLength = targetResponse[targetActiveId].equivalence.test[newCombId][selectedClassId].length
          if (trialsLength < 10) {
            yield put({
              type: 'sessionrecording/SET_STATE',
              payload: {
                EquiTrialCount: trialsLength + 1,
                ActiveCombination: newCombId,
              },
            })
          } else {
            yield put({
              type: 'sessionrecording/SET_STATE',
              payload: {
                EquiTrialCount: 10,
                ActiveCombination: newCombId,
              },
            })
          }
        }
        else {
          // check for change class
          let previosClassIndex = 0
          masterSession.targets.edges[targetActiveIndex].node.classes.edges.map((classNode, classIndex) => {
            if (classNode.node.id === selectedClassId) {
              previosClassIndex = classIndex
            }
          })

          if (previosClassIndex + 1 < masterSession.targets.edges[targetActiveIndex].node.classes.edges.length) {
            // chnage class
            const newClassId = masterSession.targets.edges[targetActiveIndex].node.classes.edges[previosClassIndex + 1]?.node.id
            const trialsLengthCheck = targetResponse[targetActiveId].equivalence.test[activeCombination][newClassId].length
            if (trialsLengthCheck < 10) {
              yield put({
                type: 'sessionrecording/SET_STATE',
                payload: {
                  SelectedClassId: newClassId,
                  EquiTrialCount: trialsLengthCheck + 1,
                },
              })
            } else {
              yield put({
                type: 'sessionrecording/SET_STATE',
                payload: {
                  SelectedClassId: newClassId,
                  EquiTrialCount: 10,
                },
              })

            }
          }
          // move to next target
          else if (targetActiveIndex + 1 < masterSession.targets.edges.length) {
            yield put({
              type: 'sessionrecording/MOVE_TO_NEXT_TARGET',
            })
          }




        }
      }
    }


  }
  yield put({
    type: 'sessionrecording/SET_STATE',
    payload: {
      ResponseLoading: false,
    },
  })
}

export function* EQUIVALENCE_RESPONSE_UPDATE({ payload }) {
  yield put({
    type: 'sessionrecording/SET_STATE',
    payload: {
      ResponseLoading: true,
    },
  })
  // selecting child session id for creating child session
  const childSessionId = yield select(state => state.sessionrecording.ChildSession.id)
  const targetActiveId = yield select(state => state.sessionrecording.TargetActiveId)
  const trialStartTime = yield select(state => state.sessionrecording.TrialStartTime)
  const currentSessionTime = yield select(state => state.sessionrecording.CurrentSessionTime)
  const masterSession = yield select(state => state.sessionrecording.MasterSession)
  const targetActiveIndex = yield select(state => state.sessionrecording.TargetActiveIndex)
  // selecting status id of the target
  const targetStatusId = masterSession.targets.edges[targetActiveIndex].node.targetStatus.id
  // updating session duration
  const response = yield call(recordEquivalenceTargetUpdate, {
    objectId: payload.trialRecordedId,
    response: payload.response,
  })

  const selectedOperation = yield select(state => state.sessionrecording.SelectedOperation)
  const activeCombination = yield select(state => state.sessionrecording.ActiveCombination)
  const selectedClassId = yield select(state => state.sessionrecording.SelectedClassId)
  const equiTrialCount = yield select(state => state.sessionrecording.EquiTrialCount)
  // const targetActiveIndex = yield select(state => state.sessionrecording.TargetActiveIndex)

  if (response && response.data && response.data.updatePeakEquivalanceTrial) {
    const targetResponse = yield select(state => state.sessionrecording.TargetResponse)
    // targetResponse[targetActiveId].equivalence[selectedOperation === 'Train' ? 'train': 'test'][activeCombination][selectedClassId] = []
    const updatedObject = response.data.updatePeakEquivalanceTrial.details
    let operation = 'train'
    if (selectedOperation === 'Test') operation = 'test'

    targetResponse[targetActiveId].equivalence[operation][activeCombination][selectedClassId][
      equiTrialCount - 1
    ] = updatedObject

    yield put({
      type: 'sessionrecording/SET_STATE',
      payload: {
        TargetResponse: targetResponse,
      },
    })
    // update session duration
    yield put({
      type: 'sessionrecording/UPDATE_DURATION',
    })
  }
  yield put({
    type: 'sessionrecording/SET_STATE',
    payload: {
      ResponseLoading: false,
    },
  })
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOAD_SESSION, GET_DATA),
    takeEvery(actions.GET_CHILD_SESSION_DATA, GET_CHILD_SESSION_DATA),
    takeEvery(actions.START_SESSION, START_SESSION),
    takeEvery(actions.PAUSE_SESSION, PAUSE_SESSION),
    takeEvery(actions.RESUME_SESSION, RESUME_SESSION),
    takeEvery(actions.END_SESSION, END_SESSION),
    takeEvery(actions.TARGET_CORRECT, TARGET_CORRECT),
    takeEvery(actions.TARGET_UPDATE, TARGET_UPDATE),
    takeEvery(actions.CREATE_NEW_TARGET_INSTANCE, CREATE_NEW_TARGET_INSTANCE),
    takeEvery(actions.UPDATE_TARGET_TRIAL, UPDATE_TARGET_TRIAL),
    takeEvery(actions.SET_PREVIOUS_COUNTS, SET_PREVIOUS_COUNTS),
    takeEvery(actions.CHANGE_STIMULUS, CHANGE_STIMULUS),
    takeEvery(actions.TARGET_SD_CORRECT, TARGET_SD_CORRECT),
    takeEvery(actions.UPDATE_TARGET_SD_TRIAL, UPDATE_TARGET_SD_TRIAL),
    takeEvery(actions.CHANGE_STEP, CHANGE_STEP),
    takeEvery(actions.TARGET_STEP_CORRECT, TARGET_STEP_CORRECT),
    takeEvery(actions.UPDATE_TARGET_STEP_TRIAL, UPDATE_TARGET_STEP_TRIAL),
    takeEvery(actions.UPDATE_DURATION, UpdateDuration),
    // PEAK Direct
    takeEvery(actions.UPDATE_BLOCK_ENDTIME, UPDATE_BLOCK_ENDTIME),
    takeEvery(actions.CREATE_NEW_BLOCK, CREATE_NEW_BLOCK),
    takeEvery(actions.RECORD_BLOCK_TRIAL, RECORD_BLOCK_TRIAL),
    takeEvery(actions.UPDATE_BLOCK_TRIAL, UPDATE_BLOCK_TRIAL),
    // PEAK Equivalence
    takeEvery(actions.GET_SD_COMBINATIONS, GET_SD_COMBINATIONS),
    takeEvery(actions.EQUIVALENCE_RESPONSE, EQUIVALENCE_RESPONSE),
    takeEvery(actions.EQUIVALENCE_RESPONSE_UPDATE, EQUIVALENCE_RESPONSE_UPDATE),

    // automatic target move
    takeEvery(actions.MOVE_TO_NEXT_TARGET, MOVE_TO_NEXT_TARGET),
  ])
}

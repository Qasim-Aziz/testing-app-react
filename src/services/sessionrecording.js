/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
import { notification } from 'antd'
import { gql } from 'apollo-boost'
import apolloClient from '../apollo/config'

export async function getTargets(payload) {
  return apolloClient
    .query({
      query: gql`
        query($masterSessionId: ID!, $date: Date!) {
          getsession(id: $masterSessionId) {
            id
            sessionName {
              id
              name
            }
            duration
            targets {
              edgeCount
              edges {
                node {
                  id
                  targetInstr
                  peakBlocks
                  peakType
                  eqCode
                  targetStatus {
                    id
                    statusName
                  }
                  targetId {
                    id
                    domain {
                      id
                      domain
                    }
                  }
                  targetAllcatedDetails {
                    id
                    targetName
                    DailyTrials
                    targetType {
                      id
                      typeTar
                    }
                  }
                  videos {
                    edges {
                      node {
                        id
                        url
                      }
                    }
                  }
                  sd {
                    edges {
                      node {
                        id
                        sd
                      }
                    }
                  }
                  steps {
                    edges {
                      node {
                        id
                        step
                      }
                    }
                  }
                  mastery {
                    edges {
                      node {
                        id
                        sd {
                          id
                          sd
                        }
                        step {
                          id
                          step
                        }
                        mastery {
                          id
                          name
                        }
                        status {
                          id
                          statusName
                        }
                      }
                    }
                  }
                  classes {
                    edges {
                      node {
                        id
                        name
                        stimuluses {
                          edges {
                            node {
                              id
                              option
                              stimulusName
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          promptCodes {
            id
            promptName
          }
          getChildSession(sessions: $masterSessionId, date: $date) {
            edges {
              node {
                id
                sessionDate
                createdAt
                duration
                status
                sessions {
                  id
                  itemRequired
                  sessionName {
                    id
                    name
                  }
                  targets {
                    edges {
                      node {
                        id
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        masterSessionId: payload.masterSessionId,
        date: payload.date,
      },
      fetchPolicy: 'network-only',
    })
    .then(result => result)
    .catch(error => {
      console.log(error)
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing went wrong loading session',
          description: item.message,
        })
      })
    })
}

export async function getChildSessionData(payload) {
  return apolloClient
    .query({
      query: gql`{
            getSessionRecordings(ChildSession:"${payload.id}", sessiondate: "${payload.date}") {
                edges {
                    node {
                        id,
                        durationStart,
                        durationEnd,
                        ChildSession{
                            id,
                            sessionDate,
                            status,
                            sessions{
                                id,
                                sessionName{
                                    id,
                                    name
                                }
                            }
                        }
                        targets{
                            id
                        }
                        status{
                            id,
                            statusName
                        }
                        isPeakEquivalance
                        peakEquivalance{
                            edges{
                                node{
                                    id
                                    durationStart
                                    durationEnd
                                    recType
                                    score
                                    codeClass{
                                        id
                                        name
                                    }
                                    relationTrain{
                                        id
                                        stimulus1
                                        sign12
                                        stimulus2
                                    }
                                    relationTest{
                                        id
                                        stimulus1
                                        sign12
                                        stimulus2
                                    }
                                }
                            }
                        }
                        peak {
                            edges{
                                node{
                                    id
                                    durationStart
                                    durationEnd
                                    trial{
                                        edges{
                                            node{
                                                id 
                                                start
                                                end
                                                sd {
                                                    id 
                                                    sd
                                                }
                                                marks
                                                promptCode{
                                                    id
                                                    promptName 
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        sessionRecord{
                            edges{
                                node{
                                    id,
                                    entryTime,
                                    trial,
                                    durationStart,
                                    durationEnd,
                                    text,
                                    sd{
                                        id,
                                        sd
                                    },
                                    step{
                                        id,
                                        step
                                    }
                                    promptCode{
                                        id,
                                        promptName
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }`,
      fetchPolicy: 'network-only',
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing went wrong loading chlid session data',
          description: item.message,
        })
      })
    })
}

export async function createChildSession(payload) {
  return apolloClient
    .mutate({
      mutation: gql`
        mutation($id: ID!, $date: Date) {
          startSession(
            input: { parentSession: $id, date: $date, status: "progress", duration: 0 }
          ) {
            details {
              id
              sessionDate
              status
              duration
              sessions {
                id
                sessionName {
                  id
                  name
                }
              }
            }
          }
        }
      `,
      variables: {
        id: payload.masterSessionId,
        date: payload.SessionDate,
      },
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing went wrong creating child session',
          description: item.message,
        })
      })
    })
}

export async function updateChildSessionDuration(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation {
            changeSessionStatus(input:{
                pk:"${payload.id}",
                duration:${payload.duration}
            })
            { 
                details{
                    id,
                    sessionDate,
                    status,
                    duration,
                    sessions{
                        id,
                        sessionName{
                            id,
                            name
                        }
                    }
                }
            }
        }`,
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing want wrong updating child session duration',
          description: item.message,
        })
      })
    })
}

export async function finishChildSession(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation {
            changeSessionStatus(input:{
                pk:"${payload.id}",
                duration:${payload.duration},
                status:"completed"
            })
            { 
                details{
                    id,
                    sessionDate,
                    status,
                    duration,
                    sessions{
                        id,
                        sessionName{
                            id,
                            name
                        }
                    }
                }
            }
        }`,
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing went wrong submitting child session',
          description: item.message,
        })
      })
    })
}

export async function createFirstTragetAndTrialInstance(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation {
            sessionRecording(input:{
                targets:"${payload.targetId}",
                childsession:"${payload.childId}",
                durationStart:0,
                durationEnd:0,
                status:"${payload.targetStatusId}",
                sessionRecord:[],
            })
            { 
                details {
                    id,
                    durationStart,
                    durationEnd,
                    targets {
                        id,
                    },                    
                    sessionRecord {
                        edges {
                            node {
                                id,
                                trial,
                                durationStart,
                                durationEnd,
                                text,
                                sd {
                                    id,
                                    sd
                                },
                                step {
                                    id,
                                    step
                                },
                                promptCode {
                                    id,
                                    promptName
                                }
                            }
                        }
                    }
                }
            }
        }`,
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing went wrong creating first target object',
          description: item.message,
        })
      })
    })
}

export async function recordTargetCorrectTrial(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation {
            sessionRecording(input:{
                targets:"${payload.targetId}",
                childsession:"${payload.childId}",
                status:"${payload.statusId}",
                sessionRecord:[{trial:"${payload.response}", text:"${payload.note}", durationStart:${payload.start}, durationEnd:${payload.end}, prompt:"${payload.promptId}", sd:"", step:""}],
            })
            { 
                details {
                    id,
                    durationStart,
                    durationEnd,
                    targets {
                        id,
                    },                    
                    sessionRecord {
                        edges {
                            node {
                                id,
                                trial,
                                durationStart,
                                durationEnd,
                                text
                                sd {
                                    id,
                                    sd
                                },
                                step {
                                    id,
                                    step
                                },
                                promptCode {
                                    id,
                                    promptName
                                }
                            }
                        }
                    }
                }
            }
        }`,
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing went wrong creating first target trail object',
          description: item.message,
        })
      })
    })
}

export async function recordTargetStimulusTrial(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation {
            sessionRecording(input:{
                targets:"${payload.targetId}",
                childsession:"${payload.childId}",
                status:"${payload.statusId}",
                sessionRecord:[{trial:"${payload.response}", text:"${payload.note}", durationStart:${payload.start}, durationEnd:${payload.end}, prompt:"${payload.promptId}", sd:"${payload.sdId}", step:""}],
            })
            { 
                details {
                    id,
                    durationStart,
                    durationEnd,
                    targets {
                        id,
                    },                    
                    sessionRecord {
                        edges {
                            node {
                                id,
                                trial,
                                durationStart,
                                durationEnd,
                                text
                                sd {
                                    id,
                                    sd
                                },
                                step {
                                    id,
                                    step
                                },
                                promptCode {
                                    id,
                                    promptName
                                }
                            }
                        }
                    }
                }
            }
        }`,
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing went wrong recording stimulus trial',
          description: item.message,
        })
      })
    })
}

export async function recordTargetStepTrial(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation {
            sessionRecording(input:{
                targets:"${payload.targetId}",
                childsession:"${payload.childId}",
                status:"${payload.statusId}",
                sessionRecord:[{trial:"${payload.response}", text:"${payload.note}", durationStart:${payload.start}, durationEnd:${payload.end}, prompt:"${payload.promptId}", sd:"", step:"${payload.stepId}"}],
            })
            { 
                details {
                    id,
                    durationStart,
                    durationEnd,
                    targets {
                        id,
                    },                    
                    sessionRecord {
                        edges {
                            node {
                                id,
                                trial,
                                durationStart,
                                durationEnd,
                                text
                                sd {
                                    id,
                                    sd
                                },
                                step {
                                    id,
                                    step
                                },
                                promptCode {
                                    id,
                                    promptName
                                }
                            }
                        }
                    }
                }
            }
        }`,
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing went wrong recording step trial',
          description: item.message,
        })
      })
    })
}

export async function updateTargetEndTime(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation {
            updateTargetRec(input:{
                pk:"${payload.skillsId}",
                durationEnd:${payload.endTime}
            })
            { 
                details{
                    id,
                    durationStart,
                    durationEnd
                }               
            }
        }`,
      fetchPolicy: 'no-cache',
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing went wrong updating target endtime',
          description: item.message,
        })
      })
    })
}

export async function createNewTargetInstance(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation {
            sessionRecording(input:{
                targets:"${payload.targetId}",
                childsession:"${payload.childId}",
                durationStart:${payload.start},
                durationEnd:0,
                status:"${payload.statusId}",
                sessionRecord:[],
            })
            { 
                details {
                    id,
                    durationStart,
                    durationEnd,
                    targets {
                        id,
                    },
                    sessionRecord {
                        edges {
                            node {
                                id,
                                trial,
                                durationStart,
                                durationEnd,
                                text,
                                sd {
                                    id,
                                    sd
                                },
                                step {
                                    id,
                                    step
                                },
                                promptCode {
                                    id,
                                    promptName
                                }
                            }
                        }
                    }              
                }
            }
        }`,
      fetchPolicy: 'no-cache',
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing went wrong creating new target object',
          description: item.message,
        })
      })
    })
}

export async function updateTargetTrial(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation {
            updateTrial(input:{
                pk:"${payload.object.id}",
                trial:"${payload.response}",
                promptCode:"${payload.promptId}",
                text:"${payload.note}"
            })
            { 
                details {
                    id,
                    trial,
                    durationStart,
                    durationEnd,
                    text,
                    sd {
                        id,
                        sd
                    },
                    step {
                        id,
                        step
                    },
                    promptCode {
                        id,
                        promptName
                    }
                }
            }
        }`,
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing went wrong updating target trial object',
          description: item.message,
        })
      })
    })
}

export async function createTargetBlock(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation{
            peakBlock(
                input:{
                    pk:"${payload.skillsId}"
                    durationStart: ${payload.startTime}
                    durationEnd: 0
                }
            ){
                skill{
                    id
                    durationStart
                    durationEnd
                    targets{
                        id
                    }
                    peak{
                        edges{
                            node{
                                id
                                durationStart
                                durationEnd
                                entryTime
                            }
                        }
                    }
                }
                block{
                    id  
                    durationStart
                    durationEnd
                }
            }
        }`,
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing went wrong creating target block',
          description: item.message,
        })
      })
    })
}

export async function updateTargetBlock(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation{
            peakBlock(
                input:{
                    pk:"${payload.skillsId}"
                    block: "${payload.blockId}"
                    durationEnd: ${payload.endTime}
                }
            ){
                skill{
                    id
                    durationStart
                    durationEnd
                    targets{
                        id
                    }
                    peak{
                        edges{
                            node{
                                id
                                durationStart
                                durationEnd
                                entryTime
                            }
                        }
                    }
                }
                block{
                    id  
                    durationStart
                    durationEnd
                }
            }
        }`,
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing went wrong updating target block',
          description: item.message,
        })
      })
    })
}

export async function recordBlockTrial(payload) {
  return apolloClient
    .mutate({
      mutation: gql`
        mutation($blockId: ID!, $sd: ID!, $start: Int!, $end: Int!, $marks: Int!) {
          peakBlockTrials(
            input: { block: $blockId, sd: $sd, start: $start, end: $end, marks: $marks }
          ) {
            trial {
              id
              start
              end
              marks
              sd {
                id
                sd
              }
            }
          }
        }
      `,
      variables: {
        blockId: payload.blockId,
        sd: payload.sd,
        start: payload.startTime,
        end: payload.endTime,
        marks: payload.marks,
      },
    })
    .then(result => result)
    .catch(error => {
      console.log(error)
      return notification.error({
        message: 'Somthing went wrong recording block trial',
      })
    })
}

export async function updateBlockTrial(payload) {
  return apolloClient
    .mutate({
      mutation: gql`
        mutation($id: ID!, $sd: ID!, $marks: Int!) {
          peakBlockUpdateTrial(input: { pk: $id, sd: $sd, marks: $marks }) {
            trial {
              id
              start
              end
              marks
              sd {
                id
                sd
              }
            }
          }
        }
      `,
      variables: {
        id: payload.responseId,
        sd: payload.sd,
        marks: payload.marks,
      },
    })
    .then(result => result)
    .catch(error => {
      console.log(error)
      return notification.error({
        message: 'Somthing went wrong updating block trial',
      })
    })
}

export async function createNewTargetPeakAutomaticInstance(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation{
        peakBlockAutomatic(
          input:{
            target:"${payload.targetId}"
            childSession:"${payload.childId}"
            durationStart: ${payload.start}
            durationEnd:0
          }
        ){
          skill{
            id
            durationStart
            durationEnd
            ChildSession{
              id
            }
            targets{
              id
              peakBlocks
              targetAllcatedDetails{
                id
                targetName
                dateBaseline
              }
            }
            peak{
              edges{
                node{
                  id
                  durationStart
                  durationEnd
                  entryTime
                  trial{
                    edges{
                      node{
                        id
                        marks
                        sd{
                          id
                          sd
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
    }`,
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing went wrong creating new target object',
          description: item.message,
        })
      })
    })
}

export async function getCombinationsByCode(payload) {
  return apolloClient
    .query({
      query: gql`query{
        getPeakEquCodes(code:"${payload.code}"){
            edges{
                node{
                    id
                    code
    
                    train{
                        edges{
                            node{
                                id
                                stimulus1
                                sign12
                                stimulus2
                                sign23
                                stimulus3
                            }
                        }
                    }

                    test{
                        edges{
                            node{
                                id
                                stimulus1
                                sign12
                                stimulus2
                                sign23
                                stimulus3
                            }
                        }
                    }
    
                }
            }
        }
    }`,
      fetchPolicy: 'network-only',
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing went wrong getting stimulus combinations',
          description: item.message,
        })
      })
    })
}

export async function recordEquivalenceTarget(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation {
        sessionRecording(input:{
          childsession:"${payload.childId}",
          targets:"${payload.targetId}",
          status:"${payload.statusId}",
          sessionRecord:[],
          isPeakEquivalance:true,
          peakEquivalance:[
            {
              score: ${payload.response}
              recType:"${payload.operation}", 
              durationEnd: ${payload.end}, 
              durationStart: ${payload.start}, 
              codeClass:"${payload.classId}", 
              relationTest:"${payload.combinationTest}", 
              relationTrain:"${payload.combinationTrain}",
            },
          ]
        })
           { 
               details{
                   id,
                   durationStart,
                   durationEnd,
                   targets{
                       id
                   },
                   ChildSession{
                       id,
                       sessionDate,
                       status,
                       duration,
                       sessions{
                           id,
                           sessionName{
                               id,
                               name
                           }
                       }
                   }
                   peakEquivalance(last:1){
                       edges{
                           node{
                              id
                               durationStart
                               durationEnd
                               recType
                               score
                               codeClass{
                                  id
                                   name
                               }
                               relationTrain{
                                   stimulus1
                                   sign12
                                   stimulus2
                               }
                               relationTest{
                                   stimulus1
                                   sign12
                                   stimulus2
                               }
                           }
                       }
                   }
               }
           }
      }`,
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing went wrong recording equivalence trial',
          description: item.message,
        })
      })
    })
}

export async function recordEquivalenceTargetUpdate(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation{
        updatePeakEquivalanceTrial(input:{
            pk:"${payload.objectId}"
            score: ${payload.response}
        }){
            details{
                id
                durationStart
                durationEnd
                recType
                score
                codeClass{
                    id
                    name
                }
                relationTrain{
                    id
                }
                relationTest{
                    id
                }
            }
        }
    }`,
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing went wrong updating equivalence trial',
          description: item.message,
        })
      })
    })
}

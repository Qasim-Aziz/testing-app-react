// import { GraphQLClient } from 'graphql-request'
/* eslint-disable no-else-return */
/* eslint-disable import/prefer-default-export */
/* eslint-disable  array-callback-return */

import { notification } from 'antd'
import { gql } from 'apollo-boost'
import apolloClient from '../apollo/config'

// targetStatus:"U3RhdHVzVHlwZToz"

export async function getAllocatedTargets(payload) {
  return apolloClient
    .query({
      query: gql`query {
            targetAllocates(studentId:"${payload.studentId}") {
                edges {
                    node {
                        id,
                        targetStatus {
                            id,
                            statusName
                        }
                        morning,
                        afternoon,
                        evening,
                        default
                        targetAllcatedDetails{
                            id,
                            targetName,
                        }
                    }
                }
            },
            targetStatus {
                id
                statusName
            }
            student(id:"${payload.studentId}") {
                id
                authStaff {
                    edges {
                        node {
                            id,
                            name,
                        }
                    }
                }
                family{
                    id,
                    members{
                        edges {
                            node {
                                id,
                                memberName,
                                timeSpent {
                                    edges {
                                        node {
                                            id
                                            sessionName {
                                                id
                                                name
                                            }
                                            duration
                                        }
                                    }
                                }
                                relationship{
                                    id,
                                    name
                                },
                            }
                        }
                    }
                }
            }
            GetStudentSession(studentId:"${payload.studentId}") {
                edges {
                    node {
                        id
                        itemRequired,
                        duration,
                        sessionName {
                            id
                            name
                        }
                        parentView
                        instruction{
                            edges{
                                node{
                                    id,
                                    instruction
                                }
                            }
                        }
                        therapistHost{
                            edges{
                                node{
                                    id
                                    name
                                }
                            }
                        }
                        sessionHost {
                            edges{
                                node{
                                    id,
                                    memberName,
                                    timeSpent {
                                        edges {
                                            node {
                                                id
                                                sessionName {
                                                    id
                                                    name
                                                }
                                                duration
                                            }
                                        }
                                    }
                                    relationship {
                                        id
                                        name
                                    }
                                }
                            }
                        },
                        targets{
                            edges{
                                node{
                                    id,
                                    time,
                                    date,
                                    targetStatus {
                                        id,
                                        statusName
                                    }   
                                    morning
                                    afternoon
                                    evening
                                    default                             
                                    targetAllcatedDetails{
                                        id,
                                        targetName,
                                    },
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
          message: 'Somthing went wrong',
          description: item.message,
        })
      })
    })
}

export async function filterAllocatedTargets(payload) {
  return apolloClient
    .query({
      query: gql`
        query {
            targetAllocates(studentId:"${payload.studentId}" targetStatus:"${payload.statusId}") {
                edges {
                    node {
                        id,
                        targetStatus {
                            id,
                            statusName
                        }
                        morning
                        afternoon
                        evening
                        default
                        targetAllcatedDetails{
                            id,
                            targetName,
                        }
                    }
                }
            },
            
        }`,
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing went wrong',
          description: item.message,
        })
      })
    })
}

export async function updateSessionTargets(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation {
            updateSessionTargets(input:{
                sessionId:"${payload.id}",
                targetsList:[${payload.targetList}]
            })
            {
                status
                session {
                    id
                    itemRequired,
                    duration,
                    sessionName {
                        id
                        name
                    }
                    parentView
                    instruction{
                        edges{
                            node{
                                id,
                                instruction
                            }
                        }
                    }
                    therapistHost{
                        edges{
                            node{
                                id
                                name
                            }
                        }
                    }
                    sessionHost {
                        edges{
                            node{
                                id,
                                memberName,
                                timeSpent {
                                    edges {
                                        node {
                                            id
                                            sessionName {
                                                id
                                                name
                                            }
                                            duration
                                        }
                                    }
                                }
                                relationship {
                                    id
                                    name
                                }
                            }
                        }
                    },
                    targets{
                        edges{
                            node{
                                id,
                                time,
                                date,
                                targetStatus {
                                    id,
                                    statusName
                                }
                                morning
                                afternoon
                                evening
                                default
                                targetAllcatedDetails{
                                    id,
                                    targetName,
                                },
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
          message: 'Somthing want wrong',
          description: item.message,
        })
      })
    })
}

export async function updateSessionDetails(objects) {
  const { payload, sessionObject } = objects

  // const inst = []
  // const host = []
  // const therapistHost = []
  // if (payload.values.names.length > 0) {
  //     payload.values.names.map(item => {
  //         inst.push(item)
  //     })
  // }

  // if (payload.values.hosts.length > 0) {
  //     payload.values.hosts.map(item => {
  //         host.push(item)
  //     })
  // }

  // if (payload.values.hosts.length > 0) {
  //     payload.values.hosts.map(item => {
  //         host.push(item)
  //     })
  // }

  return apolloClient
    .mutate({
      mutation: gql`
        mutation UpdateSessioDetails(
          $id: ID!
          $duration: String!
          $items: String!
          $instruction: [String]
          $sessionHost: [ID]
          $therapistHost: [ID]
          $parentView: Boolean
        ) {
          updateMasterSession(
            input: {
              pk: $id
              duration: $duration
              itemRequired: $items
              instruction: $instruction
              sessionHost: $sessionHost
              therapistHost: $therapistHost
              parentView: $parentView
            }
          ) {
            details {
              id
              itemRequired
              duration
              sessionName {
                id
                name
              }
              parentView
              instruction {
                edges {
                  node {
                    id
                    instruction
                  }
                }
              }
              therapistHost {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
              sessionHost {
                edges {
                  node {
                    id
                    memberName
                    timeSpent {
                      edges {
                        node {
                          id
                          sessionName {
                            id
                            name
                          }
                          duration
                        }
                      }
                    }
                    relationship {
                      id
                      name
                    }
                  }
                }
              }
              targets {
                edges {
                  node {
                    id
                    time
                    date
                    targetStatus {
                      id
                      statusName
                    }
                    morning
                    afternoon
                    evening
                    default
                    targetAllcatedDetails {
                      id
                      targetName
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        id: sessionObject.id,
        duration: payload.values.duration,
        items: payload.values.items,
        instruction: payload.values.names,
        sessionHost: payload.values.hosts,
        therapistHost: payload.values.therapist,
        parentView: payload.values.isParentView,
      },
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing want wrong',
          description: item.message,
        })
      })
    })
}

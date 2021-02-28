// import { GraphQLClient } from 'graphql-request'
/* eslint-disable no-else-return */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-underscore-dangle */

import { notification } from 'antd'
import { gql } from 'apollo-boost'
import moment from 'moment'
import apolloClient from '../apollo/config'

export async function getTasks() {
  return apolloClient
    .query({
      query: gql`
        query {
          tasks(last: 30) {
            edges {
              node {
                id
                taskName
                description
                startDate
                dueDate
                status {
                  id
                  taskStatus
                }
                priority {
                  id
                  name
                }
                taskType {
                  id
                  taskType
                }
                assignWork {
                  edges {
                    node {
                      id
                      name
                    }
                  }
                }
                remainders {
                  edges {
                    node {
                      id
                      time
                    }
                  }
                }
                students {
                  edges {
                    node {
                      id
                      firstname
                    }
                  }
                }
                taskcounterSet {
                  edges {
                    node {
                      id
                      count
                      date
                    }
                  }
                }
              }
            }
          }
        }
      `,
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

export async function getClosedTasks() {
  return apolloClient
    .query({
      query: gql`
        query {
          tasks(status: "VGFza1N0YXR1c1R5cGU6Mg==", last: 30) {
            edges {
              node {
                id
                taskName
                description
                startDate
                dueDate
                status {
                  id
                  taskStatus
                }
                priority {
                  id
                  name
                }
                taskType {
                  id
                  taskType
                }
                assignWork {
                  edges {
                    node {
                      id
                      name
                    }
                  }
                }
                students {
                  edges {
                    node {
                      id
                      firstname
                    }
                  }
                }
                taskcounterSet {
                  edges {
                    node {
                      id
                      count
                      date
                    }
                  }
                }
              }
            }
          }
        }
      `,
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

export async function getTasksDropdown() {
  return apolloClient
    .query({
      query: gql`
        query {
          priority {
            id
            name
          }
          taskStatus {
            id
            taskStatus
          }
          taskType {
            id
            taskType
          }
          students {
            edges {
              node {
                id
                firstname
              }
            }
          }
          staffs {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      `,
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

export async function createTask(payload) {
  console.log('task create API')
  console.log(payload)

  return apolloClient
    .mutate({
      mutation: gql`
        mutation CreateTask(
          $type: ID!
          $taskName: String!
          $description: String!
          $priority: ID!
          $status: ID!
          $startDate: Date!
          $endDate: Date!
          $therapist: [ID]
          $learners: [ID]
        ) {
          createTask(
            input: {
              task: {
                taskType: $type
                taskName: $taskName
                description: $description
                priority: $priority
                status: $status
                startDate: $startDate
                dueDate: $endDate
                assignWork: $therapist
                students: $learners
              }
            }
          ) {
            task {
              id
              taskName
              description
              startDate
              dueDate
              status {
                id
                taskStatus
              }
              priority {
                id
                name
              }
              taskType {
                id
                taskType
              }
              assignWork {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
              students {
                edges {
                  node {
                    id
                    firstname
                  }
                }
              }
              taskcounterSet {
                edges {
                  node {
                    id
                    count
                    date
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        type: payload.values.taskType,
        taskName: payload.values.taskName,
        description: payload.values.description,
        priority: payload.values.priority,
        status: payload.values.status,
        startDate: moment(payload.values.startDate).format('YYYY-MM-DD'),
        endDate: moment(payload.values.dueDate).format('YYYY-MM-DD'),
        therapist: payload.values.therapists ? payload.values.therapists : [],
        learners: payload.values.learners ? payload.values.learners : [],
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

export async function editTask(payload) {
  console.log('task updated API')
  console.log(payload)

  return apolloClient
    .mutate({
      mutation: gql`
        mutation UpdateTask(
          $id: ID!
          $type: ID!
          $taskName: String!
          $description: String!
          $priority: ID!
          $status: ID!
          $startDate: Date!
          $endDate: Date!
          $therapist: [ID]
          $learners: [ID]
        ) {
          updateTask(
            input: {
              task: {
                pk: $id
                taskType: $type
                taskName: $taskName
                description: $description
                priority: $priority
                status: $status
                startDate: $startDate
                dueDate: $endDate
                assignWork: $therapist
                students: $learners
              }
            }
          ) {
            task {
              id
              taskName
              description
              startDate
              dueDate
              status {
                id
                taskStatus
              }
              priority {
                id
                name
              }
              taskType {
                id
                taskType
              }
              assignWork {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
              students {
                edges {
                  node {
                    id
                    firstname
                  }
                }
              }
              taskcounterSet {
                edges {
                  node {
                    id
                    count
                    date
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        id: payload.id,
        type: payload.values.taskType,
        taskName: payload.values.taskName,
        description: payload.values.description,
        priority: payload.values.priority,
        status: payload.values.status,
        startDate: moment(payload.values.startDate).format('YYYY-MM-DD'),
        endDate: moment(payload.values.dueDate).format('YYYY-MM-DD'),
        therapist: payload.values.therapists ? payload.values.therapists : [],
        learners: payload.values.learners ? payload.values.learners : [],
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

export async function updateTaskStatus(payload) {
  return apolloClient
    .mutate({
      mutation: gql`
        mutation UpdateTask($id: ID!, $status: ID!) {
          updateTask(input: { task: { pk: $id, status: $status } }) {
            task {
              id
              taskName
              description
              startDate
              dueDate
              status {
                id
                taskStatus
              }
              priority {
                id
                name
              }
              taskType {
                id
                taskType
              }
              assignWork {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
              students {
                edges {
                  node {
                    id
                    firstname
                  }
                }
              }
              taskcounterSet {
                edges {
                  node {
                    id
                    count
                    date
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        id: payload.id,
        status: payload.status,
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

export async function updateTaskCounter(payload) {
  return apolloClient
    .mutate({
      mutation: gql`
        mutation taskCounter($pk: ID!, $count: Int!) {
          taskCounter(input: { pk: $pk, count: $count }) {
            data
            details {
              id
              taskName
              description
              startDate
              dueDate
              status {
                id
                taskStatus
              }
              priority {
                id
                name
              }
              taskType {
                id
                taskType
              }
              assignWork {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
              students {
                edges {
                  node {
                    id
                    firstname
                  }
                }
              }
              taskcounterSet {
                edges {
                  node {
                    id
                    count
                    date
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        pk: payload.id,
        count: payload.count,
      },
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Something went wrong',
          description: item.message,
        })
      })
    })
}

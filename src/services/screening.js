/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
import { notification } from 'antd'
import { gql } from 'apollo-boost'
import apolloClient from '../apollo/config'

export async function getData() {
  return apolloClient
    .query({
      query: gql`{
        autismSteps {
          id,
          name,
          duration,
          description
        }
        preAssessQuestions {
          id,
          question,
          options {
            edges {
              node{
                id,
                name,
                description
              }
            }
          }
        }
        preAssessAreas{
          id,
          name,
          description
        }
        getPreAssessVideos{
          edges{
            node{
              id,
              language,
              videoUrl,
              videoDescription,
              audioUrl,
              audioDescription,
              scriptUrl,
              scriptDescription
            }
          }
        }
      }`,
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing went wrong loading Data',
          description: item.message,
        })
      })
    })
}

export async function checkAssessmentObject(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation CheckAssessmentObject(
        $id: ID!
      )
      {
        getScreeningAssessStatus(input:{user: $id}){
          status
          message
          details {
            id,
            date,
            name,
            score,
            age,
            sex,
            phone,
            email,
            address,
            status,
            user {
              id
              username
            }
            assessmentQuestions{
              edges{
                node{
                  id,
                  question{
                    id,
                    question
                  },
                  answer{
                    id,
                    name,
                    description
                  }
                }
              }
            }
            assessmentAreas{
              edges{
                node{
                  id,
                  response,
                  area{
                    id,
                    name,
                    description
                  }
                }
              }
            }
          }
        }
      }`,
        variables: {
          id: payload.id
        }
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



export async function createAssessment(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation CreateScreeningAssessment (
        $name: String!,
        $age: String!,
        $email: String!,
        $gender: String!,
        $mobile: String!,
        $address: String
      ) {
          startPreAssess(input:{
            name: $name,
            age: $age,
            sex: $gender,
            phone: $mobile,
            email: $email,
            address: $address
          })
          { 
            details{
              id,
              name,
              score,
              age,
              sex,
              phone,
              email,
              address,
              status,
              assessmentQuestions {
                edges {
                  node {
                    id,
                    question {
                      id,
                      question
                    },
                    answer {
                      id,
                      name,
                      description
                    }
                  }
                }
              }
            }
          }
        }`,
        variables: {
          name: payload.values.name,
          mobile: payload.values.mobileNo,
          email: payload.values.email,
          gender: payload.values.gender,
          address: payload.values.address,
          age: payload.values.age,
        }
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

export async function recordResponse(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation RecordResponse (
        $objectId: ID!,
        $qusId: ID!,
        $ansId: ID!
      ) {
        recordPreAssess(input:{
          pk: $objectId,
          questions:[
            {
              question: $qusId, 
              answer: $ansId
            }
          ]
        })
        { 
          details {
            id,
            name,
            score,
            age,
            sex,
            phone,
            email,
            address,
            status,
            assessmentQuestions {
              edges {
                node {
                  id,
                  question {
                    id,
                    question
                  },
                  answer {
                    id,
                    name,
                    description
                  }
                }
              }
            }
          }
        }
      }`,
        variables: {
          objectId: payload.objectId,
          qusId: payload.qusId,
          ansId: payload.ansId,
        }
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

export async function updateResponse(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation UpdateResponse (
        $id: ID!,
        $qusId: ID!,
        $ansId: ID!
      ) {
          updateScreeningResponse(input:{
            pk: $id
            question: $qusId
            answer: $ansId
          })
          { 
            details {
              id,
              question {
                id,
                question
              },
              answer {
                id,
                name,
                description
              }
            }
          }
        }`,
        variables: {
          id: payload.resObjectId,
          qusId: payload.qusId,
          ansId: payload.resultId,
        }
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

export async function updateStatus(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation UpdateStatus (
        $id: ID!,
        $status: String!
      ) 
      {
        updateAssessment(input:{
          pk: $id
          status: $status
        })
        { 
          details{
            id,
            score,
            status,
            name,
            age,
            sex,
            phone,
            email,
            address,
            assessmentQuestions {
              edges {
                node {
                  id,
                  question {
                    id,
                    question
                  },
                  answer {
                    id,
                    name,
                    description
                  }
                }
              }
            }
          }
        }
      }`,
      variables: {
        id: payload.id,
        status: payload.status,
      }
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

export async function getAreas() {
  return apolloClient
    .query({
      query: gql`{
        preAssessAreas{
          id,
          name,
          description
        }
      }`,
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing went wrong loading Data',
          description: item.message,
        })
      })
    })
}

export async function recordAreaResponse(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation RecordAreaResponse (
        $objectId: ID!,
        $areaId: ID!,
        $response: String!
      ) {
        recordPreAssessResult(input:{
          pk: $objectId,
          areas:[
            {area: $areaId, response: $response},
          ]
          })
          { 
            details{
              id,
              assessmentAreas{
                edges{
                  node{
                    id,
                    response,
                    area{
                      id,
                      name,
                      description
                    }
                  }
                }
              }
            }
          }
        }`,
        variables: {
          objectId: payload.objectId,
          areaId: payload.areaId,
          response: payload.response,
        }
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

export async function recordVideo(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation RecordVideo (
        $objectId: ID!,
        $url: String!
      ) {
        preliminaryVideo(input:{
          assessment: $objectId,
          videoUrl: $url
        })
        { 
          assVideo {
            id
            video
          }
        }
      }`,
        variables: {
          objectId: payload.objectId,
          url: payload.url
        }
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

export async function endAssessment(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation EndAssessment (
        $id: ID!,
        $score: Int!
        $status: String!
      ) 
      {
        updateAssessment(input:{
          pk: $id
          score: $score
          status: $status
        })
        { 
          details{
            id,
            score,
            status
            name,
            age,
            sex,
            phone,
            email,
            address,
            assessmentQuestions {
              edges {
                node {
                  id,
                  question {
                    id,
                    question
                  },
                  answer {
                    id,
                    name,
                    description
                  }
                }
              }
            }
          }
        }
      }`,
      variables: {
        id: payload.objectId,
        status: payload.status,
        score: payload.score
      }
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

export async function getScreeningLearners() {
  return apolloClient
    .query({
      query: gql`{
        getScreeningStudents{
          id
          firstname
          lastname
          email
          dob
          school{
            id
            schoolName
          }
        }
        preAssessAreas{
          id,
          name,
          description
        }
      }`,
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing went wrong learners list',
          description: item.message,
        })
      })
    })
}

export async function getLearnerScreenings(payload) {
  return apolloClient
    .query({
      query: gql`{
        getPreAssess(students:"${payload.learnerId}"){
            edges{
                node{
                    id,
                    date,
                    name,
                    age,
                    sex,
                    phone,
                    email,
                    address,
                    status,
                    user{
                        id
                        username
                    }
                    marked,
                    assessmentQuestions{
                        edges{
                            node{
                                id,
                                question{
                                    id,
                                    question
                                },
                                answer{
                                    id,
                                    name,
                                    description
                                }
                            }
                        }
                    }
                    assessmentAreas{
                        edges{
                            node{
                                id,
                                response,
                                area{
                                    id,
                                    name,
                                    description
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
          message: 'Somthing went wrong learners list',
          description: item.message,
        })
      })
    })
}

export async function recordAssessmentResponse(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation UpdateAssessment (
        $id: ID!,
        $action: String!
      ) 
      {
        updateAssessment(input:{
          pk: $id
          marked: $action
        })
        { 
          details{
            id,
            score,
            status,
            name,
            age,
            sex,
            phone,
            email,
            address,
            marked,
          }
        }
      }`,
      variables: {
        id: payload.objectId,
        action: payload.action,
      }
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
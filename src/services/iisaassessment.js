/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
import { notification } from 'antd'
import { gql } from 'apollo-boost'
import moment from 'moment'
import apolloClient from '../apollo/config'

export async function getData(payload) {
  return apolloClient
    .query({
      query: gql`query GetIISAData (
        $studentId: ID!
      )
      {
        IISAGetAssessments(student: $studentId, isActive: true){
          edges{
            node{    
              id
              title
              date
              time
              status
              isActive
              notes
              student{
                id
                firstname
              }
            }
          }
        }
      }`,
      variables: {
        studentId: payload.studentId
      }
    })
    .then(result => result)
    .catch(error => {
      console.log("ERROR ====> ", error)
      return notification.error({
        message: 'Somthing went wrong loading Data',
        description: "please check console for Error message",
      })
    })
}


export async function createAssessment(payload) {

  return apolloClient
    .mutate({
      mutation: gql`mutation CreateAssessment (
        $studentId: ID!
        $title: String!
        $note: String!
        $date: Date!
      ){
        IISACreateAssessment(input:{
          student: $studentId
          title: $title
          date: $date
          notes: $note
        })
        {
        details{
            id
            title
            date
            time
            status
            isActive
            notes
            student{
              id
              firstname
            }
            user{
              id
              username
            }
          }
        }
      }`,
      variables: {
        studentId: payload.studentId,
        title: payload.values.title,
        note: payload.values.note,
        date: moment(payload.values.date).format('YYYY-MM-DD'),
      }
    })
    .then(result => result)
    .catch(error => {
      console.log("ERROR ====> ", error)
      return notification.error({
        message: 'Somthing went wrong loading Data',
        description: "check console for Error message",
      })
    })
}

// assessment object id = Q29nbmlhYmxlQXNzZXNzbWVudFR5cGU6NTc=

export async function getAssessmentObject(payload) {
  return apolloClient
    .query({
      query: gql`{
        IISAGetDomains{
          edges{
            node{
              id
              name
            }
          }
        }
        IISAGetOptions{
          edges{
            node{
              id
              name
              score
            }
          }
        }
        IISAGetQuestions{
          edges{
            node{
              id
              question
              domain{
                id
                name
              }
            }
          }
        }
        IISAGetAssessmentDetails(id: "${payload.objectId}"){
          id
          title
          date
          time
          status
          isActive
          notes
          student{
            id
            firstname
          }
          responses{
            edges{
              node{
                id
                question{
                  id
                  question
                  domain{
                    id
                    name
                  }
                }
                answer{
                  id
                  name
                  score
                }
              }
            }
          }
        }
      }`,
    })
    .then(result => result)
    .catch(error => {
      console.log("ERROR ====> ", error)
      return notification.error({
        message: 'Somthing went wrong loading Data',
        description: "please check console for Error message",
      })
    })
}

export async function recordResponse(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation RecordResponse (
        $objectId: ID!,
        $questionId: ID!,
        $answerId: ID
      ) {
        recordCogQuestion(input:{
          pk: $objectId
          question: $questionId
          answer: $answerId
        })
        { 
          nextQuestion{
            id
            age
            question
            area {
              id 
              name
            }
            options{
              edges{
                node{
                  id
                  name
                  description
                }
              }
            }
          }
          details{
            id,
            date,
            score,
            status,
            name,
            notes,
            student{
              id,
              firstname
            } 
            assessmentQuestions{
              edges{
                node{
                  id,
                  question{
                    id,
                    age
                    question
                    area {
                      id 
                      name
                    }
                    options{
                      edges{
                        node{
                          id
                          name
                          description
                        }
                      }
                    }
                  },
                  answer{
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
        questionId: payload.questionId,
        answerId: payload.answerId ? payload.answerId : null
      }
    })
    .then(result => result)
    .catch(error => {
      if (error.graphQLErrors) {
        error.errors.map(item => {
          return notification.error({
            message: 'Somthing went wrong',
            description: item.message,
          })
        })
      }
      else {
        error.map(item => {
          return notification.error({
            message: 'Somthing went wrong',
            description: item.message,
          })
        })
      }
    })
}


export async function recordAreaResponse(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation RecordAreaResponse (
        $objectId: ID!,
        $areaId: ID!,
        $response: String!
      ){
        recordCogniableAssessResult(input:{
          pk: $objectId,
          areas:[
            {area: $areaId, response: $response},
          ]
        })
        { 
          details{
            id,
            date,
            score,
            status,
            name,
            notes,
            student{
              id,
              firstname
            } 
            assessmentAreas{
              edges{
                node{
                  id,
                  response,
                  age
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

export async function endAssessment(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation EndAssessment (
        $objectId: ID!,
        $status: String!,
      ){
        updateCogAssessment(input:{
          pk: $objectId
          status: $status
        })
        { 
          details{
            id,
            date,
            score,
            status,
            name,
            notes,
            student{
              id,
              firstname
            }
            assessmentQuestions{
              edges{
                node{
                  id,
                  question{
                    id,
                    age
                    question
                    area {
                      id 
                      name
                    }
                    options{
                      edges{
                        node{
                          id
                          name
                          description
                        }
                      }
                    }
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
                  age
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
        score: payload.score,
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


export async function endQuestionsAssessment(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation EndQuestionsAssessment (
        $objectId: ID!,
        $status: String!,
      ){
        updateCogAssessment(input:{
          pk: $objectId
          status: $status
        })
        { 
          details{
            id,
            date,
            score,
            status,
            name,
            notes,
            student{
              id,
              firstname
            }
            assessmentQuestions{
              edges{
                node{
                  id,
                  question{
                    id,
                    age
                    question
                    area {
                      id 
                      name
                    }
                    options{
                      edges{
                        node{
                          id
                          name
                          description
                        }
                      }
                    }
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
                  age
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

export async function editQuestions(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation EditQuestions (
        $objectId: ID!,
        $qusId: ID!,
        $ansId: ID!
      )
      {
        updateCogniableAssessment(input:{
          pk: $objectId
          question: $qusId
          answer: $ansId
        })
        { 
          status          
          nextQuestion{
            id
            age
            question
            area {
              id 
              name
            }
            options{
              edges{
                node{
                  id
                  name
                  description
                }
              }
            }
          }
          details{
            id,
            date,
            score,
            assessmentQuestions{
              edges{
                node{
                  id,
                  question{
                    id,
                    age
                    question
                    area {
                      id 
                      name
                    }
                    options{
                      edges{
                        node{
                          id
                          name
                          description
                        }
                      }
                    }
                  },
                  answer{
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
        objectId: payload.resObjectId,
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

export async function makeAssessmentInactive(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation EndAssessment (
        $objectId: ID!,
      ){
        IISAUpdateAssessment(input:{
          pk: $objectId
          isActive: false
      }){
          details{
            id
            title
            date
            time
            status
            isActive
            notes
            student{
                id
                firstname
            }
            user{
                id
                username
            }
          }
        }
      }`,
      variables: {
        objectId: payload.assessmentId,
      }
    })
    .then(result => result)
    .catch(error => {
      console.log("ERROR ====> ", error)
      return notification.error({
        message: 'Somthing went wrong loading Data',
        description: "please check console for Error message",
      })
    })
}
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
        $note: String
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
        $assessmentId: ID!,
        $questionId: ID!,
        $optionId: ID!
      ) {
        IISARecording(input:{
          pk: $assessmentId
          record:[{question: $questionId, option: $optionId}]
        }){
          responses{
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
      }`,
      variables: {
        assessmentId: payload.assessmentId,
        questionId: payload.questionId,
        optionId: payload.optionId,
      }
    })
    .then(result => result)
    .catch(error => {
      console.log("ERROR ====> ", error)
      return notification.error({
        message: 'Somthing went wrong recording response',
        description: "please check console for Error message",
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

export async function getAssessmentReport(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation AssessmentSummary (
      $objectId: ID!,
    ){
      IISAAssessmentSummary(input:{
        pk: $objectId
      }){
        score
        classification
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
        }
      }
    }`,
      variables: {
        objectId: payload.objectId,
      }
    })
    .then(result => result)
    .catch(error => {
      console.log("ERROR ====> ", error)
      return notification.error({
        message: 'Somthing went wrong loading Summary',
        description: "please check console for Error message",
      })
    })
}
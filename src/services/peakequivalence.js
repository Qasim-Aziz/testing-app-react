// import { GraphQLClient } from 'graphql-request'
/* eslint-disable no-else-return */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-underscore-dangle */

import { notification } from 'antd'
import { gql } from 'apollo-boost'
import moment from 'moment'
import apolloClient from '../apollo/config'

export async function getData() {
  return apolloClient
    .query({
      query: gql`query{ 
        peakEquDomains {
          id
          name
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

export async function startAssessment(payload) {
  return apolloClient
    .mutate({
      mutation: gql`mutation StartPeakEquivalenceAssessment(
        $programId: ID!
        $peakType: String!
      ){
        startPeakEquivalance(
            input:{
                program: $programId
                peakType: $peakType
            }
        ){
            details{
                id
                score
                peakType
                program{
                    id
                    date
                    title
                }
            }
        }
      }`,
      variables: {
        programId: payload.programId,
        peakType: payload.assType
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

export async function getAssessmentDetails(payload) {
  return apolloClient
    .query({
      query: gql`query GetAssessmentDetails(
        $peakType: String!
        $programId: ID!
      ){ 
        peakEquQuestions(questionType: $peakType){
          edges{
            node{
              id
              questionNum
              questionText
              questionType
              domain{
                id
                name
              }
              test{
                edges{
                  node{
                    id
                    no
                    name
                  }
                }
              }
            }
          }
        }

        peakEquData(
          pk: $programId
          peakType: $peakType
        ){
          id
          score
          peakType
          program{
            id
            date
            title
          }
          records{
            edges{
              node{
                id
                response
                question{
                  id
                  questionText
                  domain{
                    id
                    name
                  }
                }
                test{
                  id
                  no
                  name
                }
              }
            }
          }
        }

      }`,
      variables: {
        peakType: payload.assType,
        programId: payload.programId

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
      mutation: gql`mutation recordResponse(
        $pk: ID!
        $questionId: ID!
        $testId: ID!
        $response: Boolean!
      ){
        recordPeakEquivalance(
          input:{
            pk: $pk
            question: $questionId
            test: $testId
            response: $response
          }
        ){
          details{
            id
            score
            peakType
            program{
              id
              date
              title
            }
            records{
              edges{
                node{
                  id
                  response
                  question{
                    id
                    questionText
                  }
                  test{
                    id
                    no
                    name
                  }
                }
              }
            }
          }
        }
      }`,
      variables: {
        pk: payload.assessmentId,
        questionId: payload.questionId,
        testId: payload.testId,
        response: payload.response
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

export async function getAssessmentReport(payload) {
  return apolloClient
    .query({
      query: gql`query GetAssessmentReport(
        $peakType: String!
        $programId: ID!
      ){
        peakEquivalance(
          program: $programId
          peakType: $peakType
        ){
          scoreReflexivity
          scoreSymmetry
          scoreTransivity
          scoreEquivalance
          score
          edges{
            node{
              id
              score
              peakType
              program{
                id
                date
                title
              }
            }
          }
        }
      }`,
      variables: {
        peakType: payload.peakType,
        programId: payload.programId

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
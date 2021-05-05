// import { GraphQLClient } from 'graphql-request'
/* eslint-disable no-else-return */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-underscore-dangle */
/* eslint-disable */

import { notification } from 'antd'
import { gql } from 'apollo-boost'
import moment from 'moment'
import apolloClient from '../apollo/config'

export async function getLeaders(payload) {
  console.log('PAYLOAD', payload)
  return apolloClient
    .query({
      query: gql`
        {
          leads {
            id
            name
            surname
            email
            projectName
            leadStatus
            leadType
            phone
            createdAt
            therapist {
              edges {
                node {
                  id
                  name
                }
              }
            }
            user {
              id
              email
              firstName
              lastName
            }
          }
        }
      `,
      fetchPolicy: 'network-only',
    })
    .then(result => {
      console.log('THE RESULT in services', result)
      return result
    })
    .catch(error => {
      console.log('THE ERORR ', JSON.stringify(error))
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Something went wrong',
          description: item.message,
        })
      })
    })
}
/*
In the createLeader the user_id is static because the
django-user-model is the foriegn key attribute which is not
associated to the logged in model
*/

export async function createLeader(payload) {
  console.log('THE PAYLOAD IN SERVICE', payload)
  //
  return apolloClient
    .mutate({
      mutation: gql`
        mutation Create_New_Leader(
          $name: String!
          $leadStatus: String!
          $projectName: String!
          $phone: String!
          $surname: String!
          $email: String
          $leadType: String!
        ) {
          createLead(
            name: $name
            leadStatus: $leadStatus
            projectName: $projectName
            email: $email
            leadType: $leadType
            phone: $phone
            surname: $surname
          ) {
            details {
              id
              name
              projectName
              leadStatus
              phone
              createdAt
              user {
                id
                email
                firstName
                lastName
              }
            }
          }
        }
      `,
      variables: {
        name: payload.values.firstName,
        leadStatus: payload.values.leadStatus,
        projectName: payload.values.projectName,
        email: payload.values.email,
        leadType: payload.values.leadType,
        phone: payload.values.mobileNo,
        surname: payload.values.lastName,
      },
    })
    .then(result => {
      console.log('THE RESULT', result)
      return result
    })
    .catch(error => {
      console.log('THE ERORR', JSON.stringify(error))
      return error
    })
}

export async function updateLeader(payload) {
  let lead_id = parseInt(payload.id)
  let user_id = parseInt(payload.user_id)
  return apolloClient
    .mutate({
      mutation: gql`
        mutation(
          $id: ID!
          $leadStatus: String
          $leadType: String
          $phone: String
          $name: String
          $surname: String
          $email: String
          $therapist: [ID]
        ) {
          updateLead(
            pk: $id
            leadStatus: $leadStatus
            leadType: $leadType
            phone: $phone
            name: $name
            surname: $surname
            email: $email
            therapist: $therapist
          ) {
            details {
              id
              name
              projectName
              leadStatus
              phone
              createdAt
              user {
                id
                email
                firstName
                lastName
              }
            }
          }
        }
      `,
      variables: {
        id: payload.id, // id of Lead
        therapist: payload.values.therapist,
        leadStatus: payload.values.leadStatus,
        leadType: payload.values.leadType,
        phone: payload.values.mobileNo,
        name: payload.values.firstName,
        surname: payload.values.lastName,
        email: payload.values.email,
      },
    })
    .then(result => result)
    .catch(error => {
      return error
    })
}

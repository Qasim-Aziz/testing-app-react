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
      `,
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
        mutation Create_New_Leader($name: String, $leadStatus: String, $projectName: String) {
          createLead(
            input: { id: 14, name: $name, leadStatus: $leadStatus, projectName: $projectName }
          ) {
            ok
            lead {
              id
              name
              leadStatus
              projectName
              phone
              createdAt
              user {
                id
                firstName
                lastName
                email
              }
            }
          }
        }
      `,
      variables: {
        name: payload.values.firstName,
        leadStatus: payload.values.leadStatus,
        projectName: payload.values.projectName,
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
  console.log('THE UPDATE LEADER', payload)
  let lead_id = parseInt(payload.id)
  let user_id = parseInt(payload.user_id)
  console.log('PAYLOAD', lead_id, typeof lead_id, payload.values)
  // let user_id = payload.values.
  return (
    apolloClient
      // Update_The_Leader()
      .mutate({
        mutation: gql`
          mutation Update_The_Leader(
            $id: Int!
            $user_id: ID
            $projectName: String
            $leadStatus: String
            $name: String
            $mobile: String
            $firstName: String
            $lastName: String
            $email: String
          ) {
            updateLead(
              id: $id #leadId
              input: {
                id: $user_id
                projectName: $projectName #"Project_1"
                leadStatus: $leadStatus #"Contact_Later"
                name: $name #"Tielmans22222222222"
                mobile: $mobile #"4862159753"
              }
              userVal: {
                firstName: $firstName # "Roshan"
                lastName: $lastName # "Kewat"
                name: $name # user-Name # "roShaKeWat"
                email: $email # "roshan@gmail.com"
              }
            ) {
              ok
              lead {
                id
                name
                projectName
                leadStatus
                phone #same attribute mobile
                createdAt
                user {
                  id
                  email
                  isActive
                  firstName
                  lastName
                }
              }
            }
          }
        `,
        variables: {
          id: lead_id, // id of Lead
          user_id: user_id,
          projectName: payload.values.projectName,
          leadStatus: payload.values.leadStatus,
          name: payload.values.firstName,
          mobile: payload.values.mobileNo,
          firstName: payload.values.firstName,
          lastName: payload.values.lastName,
          email: payload.values.email,
        },
      })
      .then(result => {
        console.log('THE RESULT OF UPDATE', result)
        return result
      })
      .catch(error => {
        console.log('THE ERORR', JSON.stringify(error))
        return error
      })
  )
}

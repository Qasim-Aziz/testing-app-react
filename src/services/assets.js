// import { GraphQLClient } from 'graphql-request'
/* eslint-disable no-else-return */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-underscore-dangle */
/* eslint-disable */

import { notification } from 'antd'
import { gql } from 'apollo-boost'
import moment from 'moment'
import apolloClient from '../apollo/config'

export async function getAssets(payload) {
  console.log('PAYLOAD', payload)
  return apolloClient
    .query({
      query: gql`
        {
          assets {
            id
            assetName
            assetStatus
            description

            createdBy {
              id
              firstName
              lastName
            }
            assetdesignationmodelSet {
              assignedBy {
                id
                firstName
                lastName
              }
              assignedTo {
                id
                firstName
                lastName
              }
            }
            createdAt
            updatedAt
            finalDate
          }
          users {
            id
            username
            firstName
            lastName
            isSuperuser
          }
        }
      `,
    })
    .then(result => {
      console.log('THE RESULT', result)
      let assetData = result.data.assets
      let usersData = result.data.users
      return { assetData, usersData }
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

export async function createAsset(payload) {
  console.log('THE PAYLOAD', payload)
  var userId = parseInt(payload.values.userId)
  if (userId === '' || userId === undefined || userId === null) {
    userId = null
  }
  console.log('THE FINAL PAYLOAD', payload, userId)
  return apolloClient
    .mutate({
      mutation: gql`
        mutation Create_New_Asset(
          $assetName: String!
          $assetDescription: String
          $assetStatus: String!
          $createdBy: Int!
        ) {
          createAssetVal(
            input: {
              assetName: $assetName
              description: $assetDescription
              assetStatus: $assetStatus
              idCreatedBy: $createdBy
            }
          ) {
            ok
            assetVal {
              id
              assetName

              description
              assetStatus
              #currently sending this via sending the userId
              #but it should be the authenticated user
              createdBy {
                id
                firstName
                lastName
              }
              assetdesignationmodelSet {
                assignedBy {
                  id
                  firstName
                  lastName
                }
                assignedTo {
                  id
                  firstName
                  lastName
                }
              }
              createdAt
              updatedAt
              finalDate
            }
          }
        }
      `,
      variables: {
        assetName: payload.values.assetName,
        assetDescription: payload.values.description,
        assetStatus: payload.values.assetStatus,
        createdBy: userId,
      },
    })
    .then(result => {
      console.log('THE RESULT OF UPDATE', result)
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

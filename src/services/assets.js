// import { GraphQLClient } from 'graphql-request'
/* eslint-disable no-else-return */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-underscore-dangle */
/* eslint-disable */

import { notification } from 'antd'
import { gql } from 'apollo-boost'
import apolloClient from '../apollo/config'
import moment from 'moment'

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
              edges {
                node {
                  id
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
              }
            }
            createdAt
            updatedAt
            finalDate
          }
          # users {
          #   id
          #   username
          #   firstName
          #   lastName
          #   isSuperuser
          # }
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
  var date_val
  if (payload.values.date) {
    date_val = moment(payload.values.date).format('YYYY-MM-DD')
  }
  console.log('THE DATE VALUES', date_val)
  return apolloClient
    .mutate({
      mutation: gql`
        mutation Create_New_Asset(
          $assetName: String!
          $assetDescription: String
          $assetStatus: String!
          $createdBy: ID!
          $finalDate: String
        ) {
          createAssetVal(
            input: {
              assetName: $assetName
              description: $assetDescription
              assetStatus: $assetStatus
              idCreatedBy: $createdBy
              finalDate: $finalDate
            }
          ) {
            ok
            assetVal {
              id # ID OF ASSET
              assetName
              assetStatus
              description

              createdBy {
                id
                firstName
                lastName
              }
              assetdesignationmodelSet {
                edges {
                  node {
                    id # ID OF THE ASSET DESIGNATION MODEL
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
        createdBy: payload.createdBy,
        finalDate: payload.values.date ? date_val : '',
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

export async function updateAssetVal(payload) {
  console.log('THE PAYLOAD', payload)
  var date_val
  if (payload.values.date) {
    date_val = moment(payload.values.date).format('YYYY-MM-DD')
  }
  console.log('THE DATE VALUES', date_val)
  return apolloClient
    .mutate({
      mutation: gql`
        mutation updateAssetValMethod(
          $assetName: String!
          $assetDescription: String
          $assetStatus: String!
          $id: ID!
          $finalDate: String
        ) {
          updateAssetVal(
            id: $id
            input: {
              assetName: $assetName
              description: $assetDescription
              assetStatus: $assetStatus
              finalDate: $finalDate
            }
          ) {
            ok
            assetVal {
              id # ID OF ASSET
              assetName
              assetStatus
              description

              createdBy {
                id
                firstName
                lastName
              }
              assetdesignationmodelSet {
                edges {
                  node {
                    id # ID OF THE ASSET DESIGNATION MODEL
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
        id: payload.id,
        assetName: payload.values.assetName,
        assetDescription: payload.values.description,
        assetStatus: payload.values.assetStatus,
        finalDate: payload.values.date ? date_val : '',
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

export async function designateAsset(payload) {
  console.log('THE PAYLOAD', payload)
  return apolloClient
    .mutate({
      mutation: gql`
        mutation designateAsset($idForAssignedBy: ID!, $idForAssignedTo: ID!, $idForAsset: ID!) {
          createAssetDesgVal(
            input: {
              idForAssignedBy: $idForAssignedBy # "VXNlclR5cGU6MjAyMg=="
              idForAssignedTo: $idForAssignedTo # "VXNlclR5cGU6MTk5"
              idForAsset: $idForAsset # "QXNzZXRNb2RlbFR5cGU6Mg=="
            }
          ) {
            ok
            assetDesg {
              id
              asset {
                id
                assetName
                description
                assetStatus
                finalDate
                createdBy {
                  id
                  firstName
                  lastName
                }
                assetdesignationmodelSet {
                  edges {
                    node {
                      id
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
                  }
                }
                createdAt
                updatedAt
              }
            }
          }
        }
      `,
      variables: {
        idForAssignedBy: payload.values.idForAssignedBy,
        idForAssignedTo: payload.values.idForAssignedTo,
        idForAsset: payload.values.idForAsset,
      },
    })
    .then(result => {
      console.log('THE RESULT OF UPDATE', result)
      return result
    })
    .catch(error => {
      console.log('THE ERORR', JSON.stringify(error))
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Something went wrong',
          description: item.message,
        })
      })
    })
}
// update asset designation
export async function updateAsset(payload) {
  console.log('THE PAYLOAD', payload)
  var date_val
  if (payload.values.date) {
    date_val = moment(payload.values.date).format('YYYY-MM-DD')
  }
  return apolloClient
    .mutate({
      mutation: gql`
        mutation designateAsset(
          $id: ID!
          $idForAssignedBy: ID!
          $idForAssignedTo: ID!
          $idForAsset: ID!
        ) {
          updateAssetDesgVal(
            id: $id # id Of Asset Designation Model
            input: {
              idForAssignedBy: $idForAssignedBy # "VXNlclR5cGU6MjAyMg=="
              idForAssignedTo: $idForAssignedTo # "VXNlclR5cGU6MTk5"
              idForAsset: $idForAsset # "QXNzZXRNb2RlbFR5cGU6Mg=="
            }
          ) {
            ok
            assetDesg {
              id
              asset {
                id
                assetName
                description
                assetStatus
                finalDate
                createdBy {
                  id
                  firstName
                  lastName
                }
                assetdesignationmodelSet {
                  edges {
                    node {
                      id
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
                  }
                }
                createdAt
                updatedAt
              }
            }
          }
        }
      `,
      variables: {
        id: payload.values.id,
        idForAssignedBy: payload.values.idForAssignedBy,
        idForAssignedTo: payload.values.idForAssignedTo,
        idForAsset: payload.values.idForAsset,
        finalDate: payload.values.date ? date_val : '',
      },
    })
    .then(result => {
      console.log('THE RESULT OF UPDATE', result)
      return result
    })
    .catch(error => {
      console.log('THE ERORR', JSON.stringify(error))
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Something went wrong',
          description: item.message,
        })
      })
    })
}

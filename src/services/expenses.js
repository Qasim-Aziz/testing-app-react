// import { GraphQLClient } from 'graphql-request'
/* eslint-disable no-else-return */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-underscore-dangle */
/* eslint-disable */

import { notification } from 'antd'
import { gql } from 'apollo-boost'
import moment from 'moment'
import apolloClient from '../apollo/config'

export async function getExpenses(payload) {
  console.log('PAYLOAD', payload)
  return apolloClient
    .query({
      query: gql`
        {
          expenses {
            id
            itemName
            purchaseFrom
            amount
            paidBy
            status
            comments {
              edges {
                node {
                  id
                  comment
                  time
                  user {
                    id
                    username
                  }
                }
              }
            }
          }
        }
      `,
    })
    .then(result => {
      console.log('THE RESULT OF QUERY', result)
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

export async function createExpense(payload) {
  console.log('THE PAYLOAD in EXPENSE SERVICE', payload)
  return apolloClient
    .mutate({
      mutation: gql`
        mutation Create_New_Expense(
          $itemName: String!
          $purchaseFrom: String!
          $amount: Int!
          $paidBy: String!
          $status: String!
        ) {
          createExpense(
            input: {
              itemName: $itemName
              purchaseFrom: $purchaseFrom
              amount: $amount
              paidBy: $paidBy
              status: $status
            }
          ) {
            ok
            expense {
              id
              itemName
              paidBy
              amount
              status
              purchaseFrom
              comments {
                edges {
                  node {
                    id
                    comment
                    time
                    user {
                      id
                      username
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        itemName: payload.values.itemName,
        purchaseFrom: payload.values.purchaseFrom,
        amount: payload.values.amount,
        paidBy: payload.values.paidBy,
        status: payload.values.status,
      },
    })
    .then(result => {
      console.log('THE RESULT', result)
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

export async function updateExpense(payload) {
  console.log('THE PAYLOAD', payload)
  // Check if comment exists
  let comment_list = []
  if (payload.values.comment) {
    comment_list.push(payload.values.comment)
  }
  console.log('🚄🚄🚄🚄🚄🚄🚄🚄', comment_list, payload)
  return apolloClient
    .mutate({
      mutation: gql`
        mutation Update_Expense(
          $id: ID!
          $itemName: String!
          $purchaseFrom: String!
          $amount: Int!
          $paidBy: String!
          $status: String!
          $comments: [String]
        ) {
          updateExpense(
            id: $id
            input: {
              itemName: $itemName
              purchaseFrom: $purchaseFrom
              amount: $amount
              paidBy: $paidBy
              status: $status
              comments: $comments
            }
          ) {
            ok
            expense {
              id
              itemName
              paidBy
              amount
              status
              purchaseFrom
              comments {
                edges {
                  node {
                    id
                    comment
                    time
                    user {
                      id
                      username
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        id: payload.id,
        itemName: payload.values.itemName,
        purchaseFrom: payload.values.purchaseFrom,
        amount: payload.values.amount,
        paidBy: payload.values.paidBy,
        status: payload.values.status,
        comments: comment_list,
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

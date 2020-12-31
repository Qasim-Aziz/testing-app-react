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
        students (isActive: true) {
          edges {
            node {
              id
              firstname
              internalNo
              mobileno
              email
              lastname
              caseManager {
                id
                name
                email
                contactNo
              }
              category {
                id
                category
              }
            }
          }
        }
        programArea (isActive: true) {
          edges {
            node {
              id
              name
              description
              percentageLong
            }
          }
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


// import { GraphQLClient } from 'graphql-request'
/* eslint-disable no-else-return */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-underscore-dangle */

import { notification } from 'antd'
import { gql } from 'apollo-boost'
import moment from 'moment'
import apolloClient from '../apollo/config'

export async function getStudentDetails() {
  return apolloClient
    .query({
      query: gql`query student($studentId: ID!) {
        student(id: $studentId) {
          firstname
        }
      }
    `,
    variables:{
        studentId: localStorage.getItem('studentId')
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
// import { GraphQLClient } from 'graphql-request'
/* eslint-disable no-else-return */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-underscore-dangle */

import { notification } from 'antd'
import { gql } from 'apollo-boost'
import moment from 'moment'
import apolloClient from '../apollo/config'

export async function getStudentDetails() {
  const std = localStorage.getItem('studentId')
  if (std) {
    return apolloClient
      .query({
        query: gql`
          query student($studentId: ID!) {
            student(id: $studentId) {
              id
              firstname
            }
          }
        `,
        variables: {
          studentId: std,
        },
      })
      .then(result => result)
      .catch(error => {
        error.graphQLErrors.map(item => {
          return notification.error({
            message: 'Something went wrong',
            description: item.message,
          })
        })
      })
  } else {
    return null
  }
}

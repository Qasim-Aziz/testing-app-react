/* eslint-disable no-else-return */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-underscore-dangle */
/* eslint-disable */

import { gql } from 'apollo-boost'

export const FETCH_USERS_QUERY = gql`
  query getUserDef($val: String) {
    getuser(username: $val, first: 5) {
      edges {
        node {
          id
          firstName
          username
          email
        }
      }
    }
  }
`

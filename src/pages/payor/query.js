/* eslint-disable import/prefer-default-export */

import gql from 'graphql-tag'

export const GET_PAYORS = gql`
  query {
    getPayors {
      edges {
        node {
          id
          isActive
          firstname
          lastname
          email
          description
          city
          state
          homePhone
          workPhone
          primaryLocation
          contactType {
            id
            name
          }
        }
      }
    }
  }
`
export const GET_ACTIVE_INACTIVE_PAYORS = gql`
  query($isActive: Boolean) {
    getPayors(isActive: $isActive) {
      edges {
        node {
          id
          isActive
          firstname
          lastname
          email
          description
          city
          state
          homePhone
          workPhone
          primaryLocation
          contactType {
            id
            name
          }
        }
      }
    }
  }
`

export const GET_CONTACT_TYPES = gql`
  query {
    getPayorContactType {
      id
      name
    }
  }
`

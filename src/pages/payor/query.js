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
          responsibility
          contactType {
            id
            name
          }
          docs {
            edges {
              node {
                file
              }
            }
          }
          plan {
            id
            plan
            company {
              id
              name
            }
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

export const GET_PAYOR_PLANS = gql`
  query {
    payorPlan {
      edges {
        node {
          id
          plan
          company {
            id
            name
          }
        }
      }
    }
  }
`

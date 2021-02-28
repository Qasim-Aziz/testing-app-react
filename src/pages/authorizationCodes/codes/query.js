/* eslint-disable import/prefer-default-export */

import gql from 'graphql-tag'

export const GET_CODES = gql`
  query {
    getAuthorizationCodes {
      edges {
        node {
          id
          code
          billable
          description
          isActive
          school {
            id
            schoolName
          }
          payor {
            id
            firstname
            lastname
          }
          codeType {
            id
            name
          }
          calculationType {
            id
            name
          }
          defaultUnits {
            id
            unit
            minutes
          }
          codePermission {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`
export const GET_ACTIVE_INACTIVE_CODES = gql`
  query($isActive: Boolean, $billable: Boolean) {
    getAuthorizationCodes(
      school: "Q2xpbmljRGV0YWlsc1R5cGU6NDM3"
      payor: "UGF5b3JUeXBlOjE="
      isActive: $isActive
      billable: $billable
    ) {
      edges {
        node {
          id
          code
          billable
          description
          isActive
          school {
            id
            schoolName
          }
          payor {
            id
            firstname
          }
          codeType {
            id
            name
          }
          calculationType {
            id
            name
          }
          defaultUnits {
            id
            unit
            minutes
          }
          codePermission {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`

export const GET_CODE_TYPES = gql`
  query {
    getAuthorizationCodeTypes {
      id
      name
    }
  }
`

export const GET_CALCULATION_TYPES = gql`
  query {
    getAuthorizationCalculationTypes {
      id
      name
    }
  }
`

export const GET_DEFAULT_UNITS = gql`
  query {
    getAuthorizationCodeUnits {
      id
      unit
      minutes
    }
  }
`
export const GET_USER_ROLE = gql`
  query {
    userRole {
      id
      name
    }
  }
`

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

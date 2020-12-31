/* eslint-disable import/prefer-default-export */

import gql from 'graphql-tag'

export const GET_FEE_SCHEDULE_RATES = gql`
  query {
    getFeeScheduleRates {
      edges {
        node {
          id
          rate
          agreedRate
          payor {
            id
            firstname
          }
          code {
            id
            code
          }
          modifierRates {
            edges {
              node {
                id
                modifier {
                  id
                  name
                }
                rate
                agreedRate
              }
            }
          }
        }
      }
    }
  }
`

export const GET_MODIFIER_GROUPS = gql`
  query {
    getModifierGroups {
      id
      name
    }
  }
`

export const GET_STAFF_RATES = gql`
  query {
    staff(id: "U3RhZmZUeXBlOjQxNQ==") {
      id
      clientHourly
      clientMileage
      providerHourly
      providerMileage
    }
  }
`
export const CREATE_STAFF_RATE = gql`
  mutation(
    $id: ID!
    $clientHourly: Float!
    $clientMileage: Float!
    $providerHourly: Float!
    $providerMileage: Float!
  ) {
    staffDriveRates(
      input: {
        pk: $id
        clientHourly: $clientHourly
        clientMileage: $clientMileage
        providerHourly: $providerHourly
        providerMileage: $providerMileage
      }
    ) {
      details {
        id
        clientHourly
        clientMileage
        providerHourly
        providerMileage
      }
    }
  }
`
export const CREATE_FEE_SCHEDULE_RATE = gql`
  mutation(
    $payor: ID!
    $code: ID!
    $rate: Float!
    $agreedRate: Float!
    $modifierRates: [Modifier!]
  ) {
    createFeeScheduleRates(
      input: {
        payor: $payor
        code: $code
        rate: $rate
        agreedRate: $agreedRate
        modifierRates: [
          { modifier: "QXV0aG9yaXphdGlvbk1vZGlmaWVyR3JvdXBUeXBlOjE=", rate: 2.0, agreedRate: 1.0 }
          { modifier: "QXV0aG9yaXphdGlvbk1vZGlmaWVyR3JvdXBUeXBlOjI=", rate: 3.0, agreedRate: 2.0 }
        ]
      }
    ) {
      details {
        id
        rate
        agreedRate
        payor {
          id
          firstname
        }
        code {
          id
          code
        }
        modifierRates {
          edges {
            node {
              id
              modifier {
                id
                name
              }
              rate
              agreedRate
            }
          }
        }
      }
    }
  }
`
export const GET_CODES = gql`
  query {
    getAuthorizationCodes(school: "Q2xpbmljRGV0YWlsc1R5cGU6NDM3", payor: "UGF5b3JUeXBlOjE=") {
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

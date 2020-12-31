import { notification } from 'antd'
import { gql } from 'apollo-boost'
import apolloClient from '../apollo/config'

export async function createAuthorizationCode(payload) {
  console.log('createAuthorizationCode', payload)
  return apolloClient
    .mutate({
      mutation: gql`
        mutation createAuthorizationCode(
          $codeSchool: ID!
          $payor: ID!
          $billable: Boolean!
          $code: String!
          $description: String
          $isActive: Boolean!
          $codeType: ID!
          $calculationType: ID!
          $defaultUnits: ID!
          $codePermission: [ID]
        ) {
          createAuthorizationCode(
            input: {
              codeSchool: $codeSchool
              payor: $payor
              billable: $billable
              code: $code
              description: $description
              isActive: $isActive
              codeType: $codeType
              calculationType: $calculationType
              defaultUnits: $defaultUnits
              codePermission: $codePermission
            }
          ) {
            details {
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
      `,
      variables: {
        codeSchool: payload.values.codeSchool,
        description: payload.values.description,
        payor: payload.values.payor,
        billable: payload.values.billable,
        code: payload.values.code,
        isActive: true,
        codeType: payload.values.codeType,
        calculationType: payload.values.calculationType,
        defaultUnits: payload.values.defaultUnits,
        codePermission: payload.values.codePermission,
      },
    })
    .then(result => result)
    .catch(err => {
      err.graphQLErrors.map(item => {
        return notification.error({
          message: 'Something went wrong while Creating Authentication Code',
          description: item.message,
        })
      })
    })
}

export async function createFeeScheduleRate(payload) {
  console.log('createFeeScheduleRate', payload)
  return apolloClient
    .mutate({
      mutation: gql`
        mutation createFeeScheduleRates(
          $payor: ID!
          $code: ID!
          $rate: Float!
          $agreedRate: Float!
          $modifierRates: [ModifierRatesInput]
        ) {
          createFeeScheduleRates(
            input: {
              payor: $payor
              code: $code
              rate: $rate
              agreedRate: $agreedRate
              modifierRates: $modifierRates
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
      `,
      variables: {
        payor: payload.values.payor,
        code: payload.values.code,
        rate: parseFloat(payload.values.rate),
        agreedRate: parseFloat(payload.values.agreedRate),
        modifierRates: payload.values.modifierRates,
      },
    })
    .then(result => result)
    .catch(err => {
      err.graphQLErrors.map(item => {
        return notification.error({
          message: 'Something went wrong while Creating Fee Schedule',
          description: item.message,
        })
      })
    })
}

export async function updateStaffDriveRate(payload) {
  // console.log('createAuthorizationCode', payload)
  return apolloClient
    .mutate({
      mutation: gql`
        mutation staffDriveRates(
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
      `,
      variables: {
        id: payload.id,
        clientHourly: payload.values.clientHourly,
        clientMileage: payload.values.clientMileage,
        providerHourly: payload.values.providerHourly,
        providerMileage: payload.values.providerMileage,
      },
    })
    .then(result => result)
    .catch(err => {
      err.graphQLErrors.map(item => {
        return notification.error({
          message: 'Something went wrong while Creating Fee Schedule',
          description: item.message,
        })
      })
    })
}

export async function updateFeeScheduleRate(payload) {
  console.log('updateFeeScheduleRate', payload)
  return apolloClient
    .mutate({
      mutation: gql`
        mutation updateFeeScheduleRates(
          $id: ID!
          $payor: ID!
          $code: ID!
          $rate: Float!
          $agreedRate: Float!
          $modifierRates: [ModifierRatesInput]
        ) {
          updateFeeScheduleRates(
            input: {
              pk: $id
              payor: $payor
              code: $code
              rate: $rate
              agreedRate: $agreedRate
              modifierRates: $modifierRates
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
      `,
      variables: {
        id: payload.id,
        payor: payload.values.payor,
        code: payload.values.code,
        rate: parseFloat(payload.values.rate),
        agreedRate: parseFloat(payload.values.agreedRate),
        modifierRates: payload.values.modifierRates,
      },
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Something went wrong while updating Authentication Code',
          description: item.message,
        })
      })
    })
}

export async function updateAuthorizationCode(payload) {
  console.log('updateAuthorizationCode', payload)
  return apolloClient
    .mutate({
      mutation: gql`
        mutation updateAuthorizationCode(
          $id: ID!
          $codeSchool: ID!
          $payor: ID!
          $billable: Boolean!
          $code: String!
          $description: String
          $isActive: Boolean!
          $codeType: ID!
          $calculationType: ID!
          $defaultUnits: ID!
          $codePermission: [ID]
        ) {
          updateAuthorizationCode(
            input: {
              pk: $id
              codeSchool: $codeSchool
              payor: $payor
              billable: $billable
              code: $code
              description: $description
              isActive: $isActive
              codeType: $codeType
              calculationType: $calculationType
              defaultUnits: $defaultUnits
              codePermission: $codePermission
            }
          ) {
            details {
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
      `,
      variables: {
        id: payload.id,
        codeSchool: payload.values.codeSchool,
        description: payload.values.description,
        payor: payload.values.payor,
        billable: payload.values.billable,
        code: payload.values.code,
        isActive: true,
        codeType: payload.values.codeType,
        calculationType: payload.values.calculationType,
        defaultUnits: payload.values.defaultUnits,
        codePermission: payload.values.codePermission,
      },
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Something went wrong while updating Authentication Code',
          description: item.message,
        })
      })
    })
}

export async function activeInactiveAuthenticationCode(payload) {
  return apolloClient
    .mutate({
      mutation: gql`
        mutation activeInactiveAuthorizationCode($id: ID!, $isActive: Boolean!) {
          activeInactiveAuthorizationCode(input: { pk: $id, isActive: $isActive }) {
            details {
              id
              code
              isActive
            }
          }
        }
      `,
      variables: {
        id: payload.id,
        isActive: payload.isActive,
      },
    })
    .then(result => result)
    .catch(error => {
      console.log('error', error)
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Something went wrong while changing state of Authentication Code',
          description: item.message,
        })
      })
    })
}

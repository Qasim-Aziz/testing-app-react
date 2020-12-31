import { notification } from 'antd'
import { gql } from 'apollo-boost'
import apolloClient from '../apollo/config'

export async function createPayor(payload) {
  return apolloClient
    .mutate({
      mutation: gql`
        mutation createPayor(
          $firstname: String!
          $lastname: String
          $email: String!
          $description: String
          $contactType: ID!
          $city: String
          $state: String
          $homePhone: String
          $workPhone: String
          $primaryLocation: String
        ) {
          createPayor(
            input: {
              firstname: $firstname
              lastname: $lastname
              email: $email
              description: $description
              contactType: $contactType
              city: $city
              state: $state
              homePhone: $homePhone
              workPhone: $workPhone
              primaryLocation: $primaryLocation
            }
          ) {
            details {
              id
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
      `,
      variables: {
        firstname: payload.values.firstname,
        lastname: payload.values.lastname,
        email: payload.values.email,
        description: payload.values.description,
        contactType: payload.values.contactType,
        city: payload.values.city,
        state: payload.values.state,
        homePhone: payload.values.homePhone,
        workPhone: payload.values.workPhone,
        primaryLocation: payload.values.primaryLocation,
      },
    })
    .then(result => result)
    .catch(err => {
      console.log('errrors', err.graphQLErrors)
      err.graphQLErrors.map(item => {
        console.log('errrors', item)
        return notification.error({
          message: 'Something went wrong while Creating Payor',
          description: item.message,
        })
      })
    })
}

export async function updatePayor(payload) {
  return apolloClient
    .mutate({
      mutation: gql`
        mutation updatePayor(
          $id: ID!
          $firstname: String!
          $lastname: String
          $email: String!
          $description: String
          $contactType: ID!
          $city: String
          $state: String
          $homePhone: String
          $workPhone: String
          $primaryLocation: String
        ) {
          updatePayor(
            input: {
              pk: $id
              firstname: $firstname
              lastname: $lastname
              email: $email
              description: $description
              contactType: $contactType
              city: $city
              state: $state
              homePhone: $homePhone
              workPhone: $workPhone
              primaryLocation: $primaryLocation
            }
          ) {
            details {
              id
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
      `,
      variables: {
        id: payload.id,
        firstname: payload.values.firstname,
        lastname: payload.values.lastname,
        email: payload.values.email,
        description: payload.values.description,
        contactType: payload.values.contactType,
        city: payload.values.city,
        state: payload.values.state,
        homePhone: payload.values.homePhone,
        workPhone: payload.values.workPhone,
        primaryLocation: payload.values.primaryLocation,
      },
    })
    .then(result => result)
    .catch(error => {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Something went wrong while updating Payor',
          description: item.message,
        })
      })
    })
}

export async function activeInactivePayor(payload) {
  console.log('ppayload', payload)
  return apolloClient
    .mutate({
      mutation: gql`
        mutation activeInactivePayor($id: ID!, $isActive: Boolean!) {
          activeInactivePayor(input: { pk: $id, isActive: $isActive }) {
            details {
              id
              firstname
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
          message: 'Something went wrong while changing state of Payor',
          description: item.message,
        })
      })
    })
}
